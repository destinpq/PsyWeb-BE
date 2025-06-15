import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private readonly appointmentRepository;
    private readonly userRepository;
    private readonly serviceRepository;
    constructor(appointmentRepository: Repository<Appointment>, userRepository: Repository<User>, serviceRepository: Repository<Service>);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    findOne(id: string): Promise<Appointment>;
    findByPatient(patientId: string): Promise<Appointment[]>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    remove(id: string): Promise<void>;
    getAvailableTimeSlots(date: string): Promise<string[]>;
}
