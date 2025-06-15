import { Appointment } from '../../appointments/entities/appointment.entity';
export declare class Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price?: number;
    isActive: boolean;
    features?: string;
    createdAt: Date;
    updatedAt: Date;
    appointments: Appointment[];
}
