import { Appointment } from '../../appointments/entities/appointment.entity';
import { ContactMessage } from '../../contact/entities/contact-message.entity';
export declare enum UserRole {
    ADMIN = "admin",
    PATIENT = "patient",
    THERAPIST = "therapist",
    STAFF = "staff",
    MANAGER = "manager"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    age?: number;
    password?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    dateOfBirth?: Date;
    gender?: string;
    occupation?: string;
    profilePicture?: string;
    notes?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    appointments: Appointment[];
    contactMessages: ContactMessage[];
    get fullName(): string;
}
