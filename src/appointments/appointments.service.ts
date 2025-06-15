import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Validate patient exists
    const patient = await this.userRepository.findOne({
      where: { id: createAppointmentDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Validate service exists
    const service = await this.serviceRepository.findOne({
      where: { id: createAppointmentDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check for conflicting appointments
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        appointmentTime: createAppointmentDto.appointmentTime,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Time slot already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'service'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'service'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patientId },
      relations: ['service'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // If updating date/time, check for conflicts
    if (updateAppointmentDto.appointmentDate || updateAppointmentDto.appointmentTime) {
      const appointmentDate = updateAppointmentDto.appointmentDate
        ? new Date(updateAppointmentDto.appointmentDate)
        : appointment.appointmentDate;
      const appointmentTime = updateAppointmentDto.appointmentTime || appointment.appointmentTime;

      const conflictingAppointment = await this.appointmentRepository.findOne({
        where: {
          appointmentDate,
          appointmentTime,
          status: AppointmentStatus.CONFIRMED,
        },
      });

      if (conflictingAppointment && conflictingAppointment.id !== id) {
        throw new BadRequestException('Time slot already booked');
      }
    }

    Object.assign(appointment, updateAppointmentDto);

    if (updateAppointmentDto.appointmentDate) {
      appointment.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }

    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  async getAvailableTimeSlots(date: string): Promise<string[]> {
    const allTimeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];

    const bookedSlots = await this.appointmentRepository.find({
      where: {
        appointmentDate: new Date(date),
        status: AppointmentStatus.CONFIRMED,
      },
      select: ['appointmentTime'],
    });

    const bookedTimes = bookedSlots.map(slot => slot.appointmentTime);
    return allTimeSlots.filter(time => !bookedTimes.includes(time));
  }
}
