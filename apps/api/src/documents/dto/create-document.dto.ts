import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  // base64 data URL (capped client-side); used when uploading a file.
  @IsOptional()
  @IsString()
  dataUrl?: string;

  // external URL (used by "upload from URL").
  @IsOptional()
  @IsString()
  sourceUrl?: string;
}
