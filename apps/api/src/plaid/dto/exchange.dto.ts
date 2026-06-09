import { IsOptional, IsString } from 'class-validator';

export class ExchangePublicTokenDto {
  @IsString()
  publicToken!: string;

  @IsOptional()
  @IsString()
  institutionName?: string;
}
