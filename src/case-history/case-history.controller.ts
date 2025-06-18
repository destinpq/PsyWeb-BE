import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CaseHistoryService, CaseHistorySearchParams } from './case-history.service';
import { CreateCaseHistoryDto } from './dto/create-case-history.dto';
import { UpdateCaseHistoryDto } from './dto/update-case-history.dto';

@Controller('case-history')
export class CaseHistoryController {
  constructor(private readonly caseHistoryService: CaseHistoryService) {}

  @Post()
  create(@Body() createCaseHistoryDto: CreateCaseHistoryDto) {
    return this.caseHistoryService.create(createCaseHistoryDto);
  }

  @Get()
  findAll(@Query() query: CaseHistorySearchParams) {
    return this.caseHistoryService.findAll(query);
  }

  @Get('recent')
  getRecentCases(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.caseHistoryService.getRecentCases(limitNumber);
  }

  @Get('date-range')
  getCasesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.caseHistoryService.getCasesByDateRange(startDate, endDate, patientId);
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.caseHistoryService.findByPatient(patientId);
  }

  @Get('patient/:patientId/stats')
  getPatientStats(@Param('patientId') patientId: string) {
    return this.caseHistoryService.getPatientCaseStats(patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseHistoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaseHistoryDto: UpdateCaseHistoryDto) {
    return this.caseHistoryService.update(id, updateCaseHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseHistoryService.remove(id);
  }

  @Post(':id/duplicate')
  duplicateCase(
    @Param('id') id: string,
    @Body('sessionDate') sessionDate: string,
  ) {
    return this.caseHistoryService.duplicateCase(id, sessionDate);
  }
} 