import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateCaseHistoryDto } from './create-case-history.dto';

export class UpdateCaseHistoryDto extends PartialType(CreateCaseHistoryDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 