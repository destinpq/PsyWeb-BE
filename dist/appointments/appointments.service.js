"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const service_entity_1 = require("../services/entities/service.entity");
let AppointmentsService = class AppointmentsService {
    appointmentRepository;
    userRepository;
    serviceRepository;
    constructor(appointmentRepository, userRepository, serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }
    async create(createAppointmentDto) {
        const patient = await this.userRepository.findOne({
            where: { id: createAppointmentDto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const service = await this.serviceRepository.findOne({
            where: { id: createAppointmentDto.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        const conflictingAppointment = await this.appointmentRepository.findOne({
            where: {
                appointmentDate: new Date(createAppointmentDto.appointmentDate),
                appointmentTime: createAppointmentDto.appointmentTime,
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
            },
        });
        if (conflictingAppointment) {
            throw new common_1.BadRequestException('Time slot already booked');
        }
        const appointment = this.appointmentRepository.create({
            ...createAppointmentDto,
            appointmentDate: new Date(createAppointmentDto.appointmentDate),
        });
        return this.appointmentRepository.save(appointment);
    }
    async findAll() {
        return this.appointmentRepository.find({
            relations: ['patient', 'service'],
            order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
        });
    }
    async findOne(id) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['patient', 'service'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async findByPatient(patientId) {
        return this.appointmentRepository.find({
            where: { patientId },
            relations: ['service'],
            order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
        });
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.findOne(id);
        if (updateAppointmentDto.appointmentDate || updateAppointmentDto.appointmentTime) {
            const appointmentDate = updateAppointmentDto.appointmentDate
                ? new Date(updateAppointmentDto.appointmentDate)
                : appointment.appointmentDate;
            const appointmentTime = updateAppointmentDto.appointmentTime || appointment.appointmentTime;
            const conflictingAppointment = await this.appointmentRepository.findOne({
                where: {
                    appointmentDate,
                    appointmentTime,
                    status: appointment_entity_1.AppointmentStatus.CONFIRMED,
                },
            });
            if (conflictingAppointment && conflictingAppointment.id !== id) {
                throw new common_1.BadRequestException('Time slot already booked');
            }
        }
        Object.assign(appointment, updateAppointmentDto);
        if (updateAppointmentDto.appointmentDate) {
            appointment.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
        }
        return this.appointmentRepository.save(appointment);
    }
    async remove(id) {
        const appointment = await this.findOne(id);
        await this.appointmentRepository.remove(appointment);
    }
    async getAvailableTimeSlots(date) {
        const allTimeSlots = [
            '9:00 AM', '10:00 AM', '11:00 AM',
            '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
        ];
        const bookedSlots = await this.appointmentRepository.find({
            where: {
                appointmentDate: new Date(date),
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
            },
            select: ['appointmentTime'],
        });
        const bookedTimes = bookedSlots.map(slot => slot.appointmentTime);
        return allTimeSlots.filter(time => !bookedTimes.includes(time));
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map