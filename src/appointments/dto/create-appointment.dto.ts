import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  serviceId: string;

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 