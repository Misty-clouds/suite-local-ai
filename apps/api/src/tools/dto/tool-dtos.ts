import {
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReportToolDto {
  @IsObject()
  period!: { start: string; end: string };

  @IsOptional() @IsNumber() revenue?: number;
  @IsOptional() @IsNumber() expenses?: number;
  @IsOptional() @IsNumber() net?: number;
  @IsOptional() @IsNumber() cashFlow?: number;
  @IsOptional() @IsNumber() taxEstimate?: number;

  @IsOptional() @IsArray() budgetVariance?: Record<string, unknown>[];
  @IsOptional() @IsArray() anomalies?: Record<string, unknown>[];

  @IsOptional() @IsString() summaryText?: string;
  @IsOptional() @IsObject() kpis?: Record<string, unknown>;
  @IsOptional() @IsString() agentRunId?: string;

  @IsOptional() @IsIn(['draft', 'complete']) status?: 'draft' | 'complete';
}

export class CreateRecommendationToolDto {
  @IsOptional() @IsString() reportId?: string;
  @IsString() title!: string;
  @IsString() rationale!: string;
  @IsOptional() @IsString() impact?: string;
  @IsOptional()
  @IsIn(['info', 'warning', 'critical'])
  severity?: 'info' | 'warning' | 'critical';
}

export class CreateTaskToolDto {
  @IsString() title!: string;
  @IsOptional() @IsString() detail?: string;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() reportId?: string;
}

export class TaxEstimateDto {
  @IsNumber() revenue!: number;
  @IsNumber() expenses!: number;
  @IsOptional() @IsNumber() citRate?: number;
}
