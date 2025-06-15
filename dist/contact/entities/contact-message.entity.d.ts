import { User } from '../../users/entities/user.entity';
export declare enum MessageStatus {
    UNREAD = "unread",
    READ = "read",
    REPLIED = "replied",
    ARCHIVED = "archived"
}
export declare class ContactMessage {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    status: MessageStatus;
    reply?: string;
    repliedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    userId?: string;
    get fullName(): string;
}
