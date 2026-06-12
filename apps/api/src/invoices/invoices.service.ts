import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ClientsService } from '../clients/clients.service';
import { MailService } from '../mail/mail.service';
import { CreateInvoiceDto, LineItemDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { QueryInvoicesDto } from './dto/query-invoices.dto';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly clientsService: ClientsService,
    private readonly mailService: MailService,
  ) {}

  // ─── Totals ─────────────────────────────────────────────────────────────────
  private computeTotals(
    items: LineItemDto[],
    taxRate = 0,
    discount = 0,
  ): { subtotal: number; taxAmount: number; total: number } {
    const subtotal = round2(
      items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0),
    );
    const taxAmount = round2((subtotal * taxRate) / 100);
    const total = round2(Math.max(0, subtotal + taxAmount - discount));
    return { subtotal, taxAmount, total };
  }

  // ─── Invoice number ───────────────────────────────────────────────────────
  private async nextInvoiceNumber(owner: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoiceModel
      .countDocuments({ owner: new Types.ObjectId(owner) })
      .exec();
    return `INV-${year}${String(count + 1).padStart(4, '0')}`;
  }

  // ─── Create ─────────────────────────────────────────────────────────────────
  async create(owner: string, dto: CreateInvoiceDto): Promise<InvoiceDocument> {
    // If a saved client is referenced, verify ownership and backfill snapshot.
    if (dto.client.clientId) {
      const client = await this.clientsService.findOne(
        owner,
        dto.client.clientId,
      );
      dto.client.name ||= client.name;
      dto.client.email ||= client.email;
      dto.client.address ||= client.address;
    }

    const totals = this.computeTotals(dto.items, dto.taxRate, dto.discount);

    // Retry once on the rare invoice-number collision.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.invoiceModel.create({
          owner: new Types.ObjectId(owner),
          invoiceNumber: await this.nextInvoiceNumber(owner),
          client: dto.client,
          projectName: dto.projectName,
          notes: dto.notes,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          items: dto.items,
          taxRate: dto.taxRate ?? 0,
          discount: dto.discount ?? 0,
          ...totals,
          amountPaid: 0,
          status: 'draft',
          payments: [],
        });
      } catch (err: unknown) {
        if (
          attempt < 2 &&
          typeof err === 'object' &&
          err !== null &&
          (err as { code?: number }).code === 11000
        ) {
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Could not allocate an invoice number');
  }

  // ─── Read ─────────────────────────────────────────────────────────────────
  async findAll(owner: string, query: QueryInvoicesDto) {
    const filter: FilterQuery<InvoiceDocument> = {
      owner: new Types.ObjectId(owner),
    };
    if (query.status) filter.status = query.status;
    if (query.search) {
      const rx = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { invoiceNumber: rx },
        { projectName: rx },
        { 'client.name': rx },
        { 'client.email': rx },
      ];
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const [items, total] = await Promise.all([
      this.invoiceModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.invoiceModel.countDocuments(filter).exec(),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(owner: string, id: string): Promise<InvoiceDocument> {
    const invoice = await this.invoiceModel
      .findOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  // ─── Update (drafts/sent only) ───────────────────────────────────────────────
  async update(
    owner: string,
    id: string,
    dto: UpdateInvoiceDto,
  ): Promise<InvoiceDocument> {
    const invoice = await this.findOne(owner, id);
    if (invoice.status === 'paid' || invoice.status === 'cancelled') {
      throw new BadRequestException(
        `A ${invoice.status} invoice cannot be edited`,
      );
    }

    if (dto.client) Object.assign(invoice.client, dto.client);
    if (dto.projectName !== undefined) invoice.projectName = dto.projectName;
    if (dto.notes !== undefined) invoice.notes = dto.notes;
    if (dto.issueDate !== undefined)
      invoice.issueDate = dto.issueDate ? new Date(dto.issueDate) : undefined;
    if (dto.dueDate !== undefined)
      invoice.dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    if (dto.items) invoice.items = dto.items;
    if (dto.taxRate !== undefined) invoice.taxRate = dto.taxRate;
    if (dto.discount !== undefined) invoice.discount = dto.discount;

    const totals = this.computeTotals(
      invoice.items,
      invoice.taxRate,
      invoice.discount,
    );
    invoice.subtotal = totals.subtotal;
    invoice.taxAmount = totals.taxAmount;
    invoice.total = totals.total;
    this.reconcileStatus(invoice);

    return invoice.save();
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────
  async send(owner: string, id: string): Promise<InvoiceDocument> {
    const invoice = await this.findOne(owner, id);
    if (invoice.status !== 'draft') {
      throw new BadRequestException('Only draft invoices can be sent');
    }
    invoice.status = 'sent';
    if (!invoice.issueDate) invoice.issueDate = new Date();
    const saved = await invoice.save();

    // Email the invoice via Resend (best effort — don't fail the send).
    if (saved.client?.email) {
      try {
        await this.mailService.sendInvoiceEmail(saved.client.email, {
          invoiceNumber: saved.invoiceNumber,
          clientName: saved.client.name,
          total: saved.total,
          dueDate: saved.dueDate,
        });
      } catch (e) {
        this.logger.warn(
          `Invoice email failed: ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    }
    return saved;
  }

  async cancel(owner: string, id: string): Promise<InvoiceDocument> {
    const invoice = await this.findOne(owner, id);
    if (invoice.status === 'paid') {
      throw new BadRequestException('A paid invoice cannot be cancelled');
    }
    invoice.status = 'cancelled';
    return invoice.save();
  }

  // ─── Payments ─────────────────────────────────────────────────────────────
  async recordPayment(
    owner: string,
    id: string,
    dto: RecordPaymentDto,
  ): Promise<InvoiceDocument> {
    const invoice = await this.findOne(owner, id);
    if (invoice.status === 'cancelled') {
      throw new BadRequestException(
        'Cannot record payment on a cancelled invoice',
      );
    }

    const due = round2(invoice.total - invoice.amountPaid);
    if (dto.amount > due) {
      throw new BadRequestException(
        `Payment exceeds the outstanding balance of ${due}`,
      );
    }

    invoice.payments.push({
      amount: dto.amount,
      method: dto.method ?? 'bank_transfer',
      reference: dto.reference,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
      note: dto.note,
    });
    invoice.amountPaid = round2(invoice.amountPaid + dto.amount);
    this.reconcileStatus(invoice);

    return invoice.save();
  }

  async markPaid(owner: string, id: string): Promise<InvoiceDocument> {
    const invoice = await this.findOne(owner, id);
    if (invoice.status === 'cancelled') {
      throw new BadRequestException('Cannot mark a cancelled invoice as paid');
    }
    const remaining = round2(invoice.total - invoice.amountPaid);
    if (remaining > 0) {
      invoice.payments.push({
        amount: remaining,
        method: 'other',
        paidAt: new Date(),
        note: 'Marked as paid',
      });
      invoice.amountPaid = invoice.total;
    }
    invoice.status = 'paid';
    return invoice.save();
  }

  // Keeps the lifecycle status consistent with how much has been paid.
  private reconcileStatus(invoice: InvoiceDocument): void {
    if (invoice.status === 'cancelled') return;
    if (invoice.amountPaid <= 0) {
      if (invoice.status === 'paid' || invoice.status === 'partially_paid') {
        invoice.status = 'sent';
      }
      return;
    }
    invoice.status =
      invoice.amountPaid >= invoice.total ? 'paid' : 'partially_paid';
  }

  async remove(owner: string, id: string): Promise<void> {
    const res = await this.invoiceModel
      .deleteOne({ _id: id, owner: new Types.ObjectId(owner) })
      .exec();
    if (res.deletedCount === 0)
      throw new NotFoundException('Invoice not found');
  }

  // ─── Summary (for dashboards) ───────────────────────────────────────────────
  async summary(owner: string) {
    const ownerId = new Types.ObjectId(owner);
    const invoices = await this.invoiceModel.find({ owner: ownerId }).exec();
    const now = Date.now();

    let totalBilled = 0;
    let totalPaid = 0;
    let outstanding = 0;
    let overdueAmount = 0;
    let overdueCount = 0;

    for (const inv of invoices) {
      totalBilled = round2(totalBilled + inv.total);
      totalPaid = round2(totalPaid + inv.amountPaid);
      const due = round2(inv.total - inv.amountPaid);
      if (inv.status !== 'cancelled') outstanding = round2(outstanding + due);
      if (
        due > 0 &&
        inv.dueDate &&
        inv.dueDate.getTime() < now &&
        inv.status !== 'paid' &&
        inv.status !== 'cancelled' &&
        inv.status !== 'draft'
      ) {
        overdueAmount = round2(overdueAmount + due);
        overdueCount += 1;
      }
    }

    return {
      count: invoices.length,
      totalBilled,
      totalPaid,
      outstanding,
      overdueAmount,
      overdueCount,
    };
  }

  /** Invoices past their due date with an outstanding balance. */
  async overdueInvoices(owner: string) {
    const now = Date.now();
    const invoices = await this.invoiceModel
      .find({ owner: new Types.ObjectId(owner) })
      .exec();
    return invoices
      .filter((inv) => {
        const due = round2(inv.total - inv.amountPaid);
        return (
          due > 0 &&
          inv.dueDate &&
          inv.dueDate.getTime() < now &&
          inv.status !== 'paid' &&
          inv.status !== 'cancelled' &&
          inv.status !== 'draft'
        );
      })
      .map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        client: inv.client?.name ?? 'Unknown',
        amountDue: round2(inv.total - inv.amountPaid),
        dueDate: inv.dueDate,
      }));
  }
}
