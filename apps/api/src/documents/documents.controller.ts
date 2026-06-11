import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    await this.documents.remove(userId, id);
    return { message: 'Document deleted' };
  }
}
