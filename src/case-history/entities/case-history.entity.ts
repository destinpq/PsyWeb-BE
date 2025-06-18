import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CaseStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  DISCONTINUED = 'discontinued',
}

export enum SessionType {
  INITIAL_ASSESSMENT = 'initial_assessment',
  INDIVIDUAL_THERAPY = 'individual_therapy',
  GROUP_THERAPY = 'group_therapy',
  FAMILY_THERAPY = 'family_therapy',
  COUPLES_THERAPY = 'couples_therapy',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  MEDICATION_REVIEW = 'medication_review',
}

export enum ProgressLevel {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent',
}

@Entity('case_histories')
export class CaseHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  sessionDate: Date;

  @Column({
    type: 'enum',
    enum: SessionType,
    default: SessionType.INDIVIDUAL_THERAPY,
  })
  sessionType: SessionType;

  @Column({ nullable: true })
  sessionDuration: number; // Duration in minutes

  @Column({ type: 'text' })
  chiefComplaint: string;

  @Column({ type: 'text', nullable: true })
  presentingProblems: string;

  @Column({ type: 'text', nullable: true })
  mentalStatusExam: string;

  @Column({ type: 'text', nullable: true })
  behavioralObservations: string;

  @Column({ type: 'text', nullable: true })
  mood: string;

  @Column({ type: 'text', nullable: true })
  affect: string;

  @Column({ type: 'text', nullable: true })
  thoughtProcess: string;

  @Column({ type: 'text', nullable: true })
  thoughtContent: string;

  @Column({ type: 'text', nullable: true })
  perceptionAbnormalities: string;

  @Column({ type: 'text', nullable: true })
  cognitiveFunction: string;

  @Column({ type: 'text', nullable: true })
  insight: string;

  @Column({ type: 'text', nullable: true })
  judgment: string;

  @Column({ type: 'text', nullable: true })
  riskAssessment: string;

  @Column({ type: 'text', nullable: true })
  interventionsUsed: string;

  @Column({ type: 'text', nullable: true })
  patientResponse: string;

  @Column({ type: 'text', nullable: true })
  homework: string;

  @Column({ type: 'text', nullable: true })
  treatmentGoals: string;

  @Column({ type: 'text', nullable: true })
  progressNotes: string;

  @Column({
    type: 'enum',
    enum: ProgressLevel,
    nullable: true,
  })
  progressLevel: ProgressLevel;

  @Column({ type: 'text', nullable: true })
  medications: string;

  @Column({ type: 'text', nullable: true })
  sideEffects: string;

  @Column({ type: 'text', nullable: true })
  socialHistory: string;

  @Column({ type: 'text', nullable: true })
  familyHistory: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'text', nullable: true })
  substanceUse: string;

  @Column({ type: 'text', nullable: true })
  diagnosticImpression: string;

  @Column({ type: 'text', nullable: true })
  treatmentPlan: string;

  @Column({ type: 'text', nullable: true })
  nextSessionPlan: string;

  @Column({ type: 'date', nullable: true })
  nextAppointment?: Date;

  @Column({
    type: 'enum',
    enum: CaseStatus,
    default: CaseStatus.ACTIVE,
  })
  caseStatus: CaseStatus;

  @Column({ type: 'text', nullable: true })
  clinicianNotes: string;

  @Column({ type: 'text', nullable: true })
  attachments: string; // JSON string of file paths

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdBy: string; // Therapist/Admin ID

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual getters
  get sessionDurationFormatted(): string {
    if (!this.sessionDuration) return 'Not specified';
    const hours = Math.floor(this.sessionDuration / 60);
    const minutes = this.sessionDuration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  get sessionDateFormatted(): string {
    return this.sessionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
} 