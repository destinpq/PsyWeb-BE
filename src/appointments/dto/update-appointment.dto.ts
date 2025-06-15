import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
} 