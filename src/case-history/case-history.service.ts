import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { CaseHistory, CaseStatus, SessionType, ProgressLevel } from './entities/case-history.entity';
import { CreateCaseHistoryDto } from './dto/create-case-history.dto';
import { UpdateCaseHistoryDto } from './dto/update-case-history.dto';
import { User, UserRole } from '../users/entities/user.entity';

export interface CaseHistorySearchParams {
  patientId?: string;
  sessionType?: SessionType;
  caseStatus?: CaseStatus;
  progressLevel?: ProgressLevel;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CaseHistoryStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  onHoldCases: number;
  discontinuedCases: number;
  sessionTypeBreakdown: Record<SessionType, number>;
  progressBreakdown: Record<ProgressLevel, number>;
  averageSessionDuration: number;
  mostRecentSession: Date | null;
}

@Injectable()
export class CaseHistoryService {
  constructor(
    @InjectRepository(CaseHistory)
    private caseHistoryRepository: Repository<CaseHistory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCaseHistoryDto: CreateCaseHistoryDto): Promise<CaseHistory> {
    // Validate patient exists
    const patient = await this.userRepository.findOne({
      where: { id: createCaseHistoryDto.patientId, role: UserRole.PATIENT },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const caseHistory = this.caseHistoryRepository.create({
      ...createCaseHistoryDto,
      sessionDate: new Date(createCaseHistoryDto.sessionDate),
      nextAppointment: createCaseHistoryDto.nextAppointment 
        ? new Date(createCaseHistoryDto.nextAppointment) 
        : undefined,
    });

    return this.caseHistoryRepository.save(caseHistory);
  }

  async findAll(params: CaseHistorySearchParams = {}): Promise<{
    cases: CaseHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      patientId,
      sessionType,
      caseStatus,
      progressLevel,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      search,
    } = params;

    const queryBuilder = this.caseHistoryRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.patient', 'patient')
      .where('case.isActive = :isActive', { isActive: true });

    if (patientId) {
      queryBuilder.andWhere('case.patientId = :patientId', { patientId });
    }

    if (sessionType) {
      queryBuilder.andWhere('case.sessionType = :sessionType', { sessionType });
    }

    if (caseStatus) {
      queryBuilder.andWhere('case.caseStatus = :caseStatus', { caseStatus });
    }

    if (progressLevel) {
      queryBuilder.andWhere('case.progressLevel = :progressLevel', { progressLevel });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('case.sessionDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(case.chiefComplaint) LIKE LOWER(:search) OR ' +
        'LOWER(case.presentingProblems) LIKE LOWER(:search) OR ' +
        'LOWER(case.progressNotes) LIKE LOWER(:search) OR ' +
        'LOWER(case.diagnosticImpression) LIKE LOWER(:search) OR ' +
        'LOWER(patient.firstName) LIKE LOWER(:search) OR ' +
        'LOWER(patient.lastName) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy('case.sessionDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [cases, total] = await queryBuilder.getManyAndCount();

    return {
      cases,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CaseHistory> {
    const caseHistory = await this.caseHistoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['patient'],
    });

    if (!caseHistory) {
      throw new NotFoundException('Case history not found');
    }

    return caseHistory;
  }

  async findByPatient(patientId: string): Promise<CaseHistory[]> {
    const patient = await this.userRepository.findOne({
      where: { id: patientId, role: UserRole.PATIENT },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.caseHistoryRepository.find({
      where: { patientId, isActive: true },
      order: { sessionDate: 'DESC' },
    });
  }

  async update(id: string, updateCaseHistoryDto: UpdateCaseHistoryDto): Promise<CaseHistory> {
    const caseHistory = await this.findOne(id);

    const updateData = {
      ...updateCaseHistoryDto,
      sessionDate: updateCaseHistoryDto.sessionDate 
        ? new Date(updateCaseHistoryDto.sessionDate) 
        : undefined,
      nextAppointment: updateCaseHistoryDto.nextAppointment 
        ? new Date(updateCaseHistoryDto.nextAppointment) 
        : undefined,
    };

    await this.caseHistoryRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const caseHistory = await this.findOne(id);
    await this.caseHistoryRepository.update(id, { isActive: false });
  }

  async getPatientCaseStats(patientId: string): Promise<CaseHistoryStats> {
    const patient = await this.userRepository.findOne({
      where: { id: patientId, role: UserRole.PATIENT },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const cases = await this.caseHistoryRepository.find({
      where: { patientId, isActive: true },
    });

    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.caseStatus === CaseStatus.ACTIVE).length;
    const completedCases = cases.filter(c => c.caseStatus === CaseStatus.COMPLETED).length;
    const onHoldCases = cases.filter(c => c.caseStatus === CaseStatus.ON_HOLD).length;
    const discontinuedCases = cases.filter(c => c.caseStatus === CaseStatus.DISCONTINUED).length;

    const sessionTypeBreakdown = {} as Record<SessionType, number>;
    const progressBreakdown = {} as Record<ProgressLevel, number>;

    Object.values(SessionType).forEach(type => {
      sessionTypeBreakdown[type] = cases.filter(c => c.sessionType === type).length;
    });

    Object.values(ProgressLevel).forEach(level => {
      progressBreakdown[level] = cases.filter(c => c.progressLevel === level).length;
    });

    const sessionsWithDuration = cases.filter(c => c.sessionDuration);
    const averageSessionDuration = sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((sum, c) => sum + c.sessionDuration!, 0) / sessionsWithDuration.length
      : 0;

    const mostRecentSession = cases.length > 0
      ? cases.reduce((latest, current) => 
          current.sessionDate > latest.sessionDate ? current : latest
        ).sessionDate
      : null;

    return {
      totalCases,
      activeCases,
      completedCases,
      onHoldCases,
      discontinuedCases,
      sessionTypeBreakdown,
      progressBreakdown,
      averageSessionDuration: Math.round(averageSessionDuration),
      mostRecentSession,
    };
  }

  async getRecentCases(limit: number = 10): Promise<CaseHistory[]> {
    return this.caseHistoryRepository.find({
      where: { isActive: true },
      order: { sessionDate: 'DESC' },
      take: limit,
      relations: ['patient'],
    });
  }

  async getCasesByDateRange(
    startDate: string,
    endDate: string,
    patientId?: string
  ): Promise<CaseHistory[]> {
    const queryBuilder = this.caseHistoryRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.patient', 'patient')
      .where('case.isActive = :isActive', { isActive: true })
      .andWhere('case.sessionDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

    if (patientId) {
      queryBuilder.andWhere('case.patientId = :patientId', { patientId });
    }

    return queryBuilder
      .orderBy('case.sessionDate', 'DESC')
      .getMany();
  }

  async duplicateCase(id: string, newSessionDate: string): Promise<CaseHistory> {
    const originalCase = await this.findOne(id);
    
    const { id: _, createdAt, updatedAt, ...caseData } = originalCase;
    
    const newCase = this.caseHistoryRepository.create({
      ...caseData,
      sessionDate: new Date(newSessionDate),
      progressNotes: '', // Clear progress notes for new session
      patientResponse: '', // Clear patient response
      homework: '', // Clear homework
      clinicianNotes: '', // Clear clinician notes
    });

    return this.caseHistoryRepository.save(newCase);
  }
} 