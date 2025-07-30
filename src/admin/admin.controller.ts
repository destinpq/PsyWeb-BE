import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService, CreateBlogPostDto, UpdateBlogPostDto } from './admin.service';
import { AppointmentStatus } from '../appointments/entities/appointment.entity';
import { MessageStatus } from '../contact/entities/contact-message.entity';
import { DiagnosisService, CreateDiagnosisDto, UpdateDiagnosisDto } from '../diagnosis/diagnosis.service';
import { DiagnosisStatus } from '../diagnosis/entities/diagnosis.entity';

import { CaseHistoryService } from '../case-history/case-history.service';
import { CreateCaseHistoryDto } from '../case-history/dto/create-case-history.dto';
import { UpdateCaseHistoryDto } from '../case-history/dto/update-case-history.dto';

// TODO: Add authentication guard for admin routes
// @UseGuards(AdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly diagnosisService: DiagnosisService,

    private readonly caseHistoryService: CaseHistoryService,
  ) {}

  // Dashboard
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics/appointments')
  async getAppointmentAnalytics(@Query('months') months?: number) {
    return this.adminService.getAppointmentAnalytics(months ? parseInt(months.toString()) : 6);
  }

  @Get('analytics/patients')
  async getPatientAnalytics(@Query('months') months?: number) {
    return this.adminService.getPatientAnalytics(months ? parseInt(months.toString()) : 6);
  }

  // Appointments
  @Get('appointments')
  async getAllAppointments(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllAppointments(page ? parseInt(page.toString()) : 1, limit ? parseInt(limit.toString()) : 10);
  }

  @Put('appointments/:id/status')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Body('notes') notes?: string,
  ) {
    return this.adminService.updateAppointmentStatus(id, status, notes);
  }

  @Put('appointments/:id/meet-link')
  async addGoogleMeetLink(
    @Param('id') id: string,
    @Body('meetLink') meetLink: string,
  ) {
    return this.adminService.addGoogleMeetLink(id, meetLink);
  }

  // Blog Posts
  @Get('blog')
  async getAllBlogPosts(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllBlogPosts(page ? parseInt(page.toString()) : 1, limit ? parseInt(limit.toString()) : 10);
  }

  @Post('blog')
  async createBlogPost(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.adminService.createBlogPost(createBlogPostDto);
  }

  @Put('blog/:id')
  async updateBlogPost(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.adminService.updateBlogPost(id, updateBlogPostDto);
  }

  @Delete('blog/:id')
  async deleteBlogPost(@Param('id') id: string) {
    return this.adminService.deleteBlogPost(id);
  }

  @Put('blog/:id/publish')
  async publishBlogPost(@Param('id') id: string) {
    return this.adminService.publishBlogPost(id);
  }

  // Patients
  @Get('patients')
  async getAllPatients(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllPatients(page ? parseInt(page.toString()) : 1, limit ? parseInt(limit.toString()) : 10);
  }

  @Get('patients/:id')
  async getPatientDetails(@Param('id') id: string) {
    return this.adminService.getPatientDetails(id);
  }

  // Case History Management
  @Get('case-history')
  async getAllCaseHistories(@Query() query: any) {
    return this.caseHistoryService.findAll(query);
  }

  @Post('case-history')
  async createCaseHistory(@Body() createCaseHistoryDto: CreateCaseHistoryDto) {
    return this.caseHistoryService.create(createCaseHistoryDto);
  }

  @Get('case-history/patient/:patientId')
  async getPatientCaseHistory(@Param('patientId') patientId: string) {
    return this.caseHistoryService.findByPatient(patientId);
  }

  @Get('case-history/patient/:patientId/stats')
  async getPatientCaseStats(@Param('patientId') patientId: string) {
    return this.caseHistoryService.getPatientCaseStats(patientId);
  }

  @Get('case-history/:id')
  async getCaseHistory(@Param('id') id: string) {
    return this.caseHistoryService.findOne(id);
  }

  @Put('case-history/:id')
  async updateCaseHistory(
    @Param('id') id: string,
    @Body() updateCaseHistoryDto: UpdateCaseHistoryDto,
  ) {
    return this.caseHistoryService.update(id, updateCaseHistoryDto);
  }

  @Delete('case-history/:id')
  async deleteCaseHistory(@Param('id') id: string) {
    return this.caseHistoryService.remove(id);
  }

  // Messages
  @Get('messages')
  async getAllMessages(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllMessages(page ? parseInt(page.toString()) : 1, limit ? parseInt(limit.toString()) : 10);
  }

  @Put('messages/:id/read')
  async markMessageAsRead(@Param('id') id: string) {
    return this.adminService.markMessageAsRead(id);
  }

  @Put('messages/:id/reply')
  async replyToMessage(
    @Param('id') id: string,
    @Body('reply') reply: string,
  ) {
    return this.adminService.replyToMessage(id, reply);
  }

  // Diagnosis Management
  @Get('diagnosis')
  async getAllDiagnoses(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.diagnosisService.findAll(page ? parseInt(page.toString()) : 1, limit ? parseInt(limit.toString()) : 10);
  }

  @Post('diagnosis')
  async createDiagnosis(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return this.diagnosisService.create(createDiagnosisDto);
  }

  @Get('diagnosis/patient/:patientId')
  async getPatientDiagnoses(@Param('patientId') patientId: string) {
    return this.diagnosisService.findByPatient(patientId);
  }

  @Get('diagnosis/:id')
  async getDiagnosis(@Param('id') id: string) {
    return this.diagnosisService.findOne(id);
  }

  @Put('diagnosis/:id')
  async updateDiagnosis(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
  ) {
    return this.diagnosisService.update(id, updateDiagnosisDto);
  }

  @Put('diagnosis/:id/status')
  async updateDiagnosisStatus(
    @Param('id') id: string,
    @Body('status') status: DiagnosisStatus,
  ) {
    return this.diagnosisService.updateStatus(id, status);
  }

  @Delete('diagnosis/:id')
  async deleteDiagnosis(@Param('id') id: string) {
    return this.diagnosisService.remove(id);
  }

  @Get('diagnosis-stats')
  async getDiagnosisStats() {
    return this.diagnosisService.getDiagnosisStats();
  }


} 