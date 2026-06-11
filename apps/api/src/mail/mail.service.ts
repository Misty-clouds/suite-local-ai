import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  total: number;
  dueDate?: Date | string | null;
  fromName?: string;
}

/**
 * Transactional email via Resend. When RESEND_API_KEY is unset, emails are
 * logged to the console (so flows stay testable without a provider).
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend?: Resend;

  constructor(private readonly config: ConfigService) {}

  private get from(): string {
    return (
      this.config.get<string>('RESEND_FROM') ?? 'Suite <onboarding@resend.dev>'
    );
  }

  private client(): Resend | null {
    const key = this.config.get<string>('RESEND_API_KEY');
    if (!key) return null;
    if (!this.resend) this.resend = new Resend(key);
    return this.resend;
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.send(
      email,
      'Your password reset code',
      `Your Suite password reset code is ${code}. It expires in 10 minutes.`,
      `<p>Your Suite password reset code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
    );
    // Highly visible in dev logs so the flow is testable without a mailbox.
    this.logger.log(`[DEV] Password reset code for ${email}: ${code}`);
  }

  async sendInvoiceEmail(to: string, inv: InvoiceEmailData): Promise<void> {
    const fromName = inv.fromName ?? 'Suite';
    const due = inv.dueDate
      ? new Date(inv.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null;
    const amount = `$${inv.total.toLocaleString()}`;
    const html = `
      <div style="font-family:sans-serif;max-width:480px">
        <h2>Invoice ${inv.invoiceNumber}</h2>
        <p>Hi ${inv.clientName}, you have a new invoice from ${fromName}.</p>
        <p><strong>Amount due:</strong> ${amount}${due ? ` &middot; <strong>Due:</strong> ${due}` : ''}</p>
        <p>Thank you for your business.</p>
      </div>`;
    await this.send(
      to,
      `Invoice ${inv.invoiceNumber} from ${fromName}`,
      `Invoice ${inv.invoiceNumber}: ${amount} due${due ? ` by ${due}` : ''}.`,
      html,
    );
  }

  private async send(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const client = this.client();
    if (!client) {
      this.logger.debug(`[mail:log] -> ${to} | ${subject} | ${text}`);
      return;
    }
    const { error } = await client.emails.send({
      from: this.from,
      to,
      subject,
      text,
      html: html ?? text,
    });
    if (error) {
      this.logger.warn(
        `Resend error sending to ${to}: ${JSON.stringify(error)}`,
      );
    } else {
      this.logger.log(`Email sent to ${to}: ${subject}`);
    }
  }
}
