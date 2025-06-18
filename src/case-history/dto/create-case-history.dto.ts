import { IsString, IsDateString, IsOptional, IsUUID, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { SessionType, ProgressLevel, CaseStatus } from '../entities/case-history.entity';

export class CreateCaseHistoryDto {
  @IsUUID()
  patientId: string;

  @IsDateString()
  sessionDate: string;

  @IsEnum(SessionType)
  sessionType: SessionType;

  @IsOptional()
  @IsNumber()
  sessionDuration?: number;

  @IsString()
  chiefComplaint: string;

  @IsOptional()
  @IsString()
  presentingProblems?: string;

  @IsOptional()
  @IsString()
  mentalStatusExam?: string;

  @IsOptional()
  @IsString()
  behavioralObservations?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsString()
  affect?: string;

  @IsOptional()
  @IsString()
  thoughtProcess?: string;

  @IsOptional()
  @IsString()
  thoughtContent?: string;

  @IsOptional()
  @IsString()
  perceptionAbnormalities?: string;

  @IsOptional()
  @IsString()
  cognitiveFunction?: string;

  @IsOptional()
  @IsString()
  insight?: string;

  @IsOptional()
  @IsString()
  judgment?: string;

  @IsOptional()
  @IsString()
  riskAssessment?: string;

  @IsOptional()
  @IsString()
  interventionsUsed?: string;

  @IsOptional()
  @IsString()
  patientResponse?: string;

  @IsOptional()
  @IsString()
  homework?: string;

  @IsOptional()
  @IsString()
  treatmentGoals?: string;

  @IsOptional()
  @IsString()
  progressNotes?: string;

  @IsOptional()
  @IsEnum(ProgressLevel)
  progressLevel?: ProgressLevel;

  @IsOptional()
  @IsString()
  medications?: string;

  @IsOptional()
  @IsString()
  sideEffects?: string;

  @IsOptional()
  @IsString()
  socialHistory?: string;

  @IsOptional()
  @IsString()
  familyHistory?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  substanceUse?: string;

  @IsOptional()
  @IsString()
  diagnosticImpression?: string;

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @IsString()
  nextSessionPlan?: string;

  @IsOptional()
  @IsDateString()
  nextAppointment?: string;

  @IsOptional()
  @IsEnum(CaseStatus)
  caseStatus?: CaseStatus;

  @IsOptional()
  @IsString()
  clinicianNotes?: string;

  @IsOptional()
  @IsString()
  attachments?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
} 