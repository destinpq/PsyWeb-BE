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

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived',
}

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.UNREAD,
  })
  status: MessageStatus;

  @Column({ type: 'text', nullable: true })
  reply?: string;

  @Column({ nullable: true })
  repliedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations (optional - for registered users)
  @ManyToOne(() => User, (user) => user.contactMessages, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  userId?: string;

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 