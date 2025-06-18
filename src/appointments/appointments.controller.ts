import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentsService.findByPatient(patientId);
  }

  @Get('available-slots')
  async getAvailableTimeSlots(@Query('date') date: string) {
    return this.appointmentsService.getAvailableTimeSlots(date);
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
