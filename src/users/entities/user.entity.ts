import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { ContactMessage } from '../../contact/entities/contact-message.entity';

export enum UserRole {
  ADMIN = 'admin',
  PATIENT = 'patient',
  THERAPIST = 'therapist',
  STAFF = 'staff',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  password?: string; // Only for admin users

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  emergencyContact?: string;

  @Column({ nullable: true })
  emergencyPhone?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => ContactMessage, (message) => message.user, { nullable: true })
  contactMessages: ContactMessage[];

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 