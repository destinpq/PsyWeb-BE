import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
export declare enum AppointmentStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    NO_SHOW = "no_show"
}
export declare class Appointment {
    id: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: AppointmentStatus;
    reasonForVisit?: string;
    insuranceProvider?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    patient: User;
    patientId: string;
    service: Service;
    serviceId: string;
}
