import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { SkipTransform } from '../common/decorators/skip-transform.decorator';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.documents.findAll(userId);
  }

  @Get('stats')
  stats(@CurrentUser('userId') userId: string) {
    return this.documents.stats(userId);
  }

  // Public share link: resolves a token to the file (redirect or raw bytes).
  @Public()
  @SkipTransform()
  @Get('shared/:token')
  async shared(@Param('token') token: string, @Res() res: Response) {
    const shared = await this.documents.resolveShare(token);
    if (shared.redirectUrl) {
      res.redirect(shared.redirectUrl);
      return;
    }
    if (shared.buffer) {
      res.setHeader(
        'Content-Type',
        shared.contentType ?? 'application/octet-stream',
      );
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${shared.name.replace(/"/g, '')}"`,
      );
      res.send(shared.buffer);
      return;
    }
    res.status(404).send('Not found');
  }

  @Get(':id/content')
  async content(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return { content: await this.documents.content(userId, id) };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documents.create(userId, dto);
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  async share(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    const token = await this.documents.ensureShareToken(userId, id);
    return { token };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    await this.documents.remove(userId, id);
    return { message: 'Document deleted' };
  }
}
