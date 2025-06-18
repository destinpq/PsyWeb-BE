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

export enum DiagnosisStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  UNDER_REVIEW = 'under_review',
  ARCHIVED = 'archived',
}

export enum SeverityLevel {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical',
}

@Entity('diagnoses')
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  diagnosisCode: string; // ICD-10 or DSM-5 code

  @Column()
  diagnosisName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  treatmentPlan: string;

  @Column({ type: 'text', nullable: true })
  medications: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: SeverityLevel,
    default: SeverityLevel.MILD,
  })
  severity: SeverityLevel;

  @Column({
    type: 'enum',
    enum: DiagnosisStatus,
    default: DiagnosisStatus.DRAFT,
  })
  status: DiagnosisStatus;

  @Column({ type: 'date', nullable: true })
  diagnosisDate: Date;

  @Column({ type: 'date', nullable: true })
  followUpDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 