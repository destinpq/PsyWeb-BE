import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis, DiagnosisStatus, SeverityLevel } from './entities/diagnosis.entity';

export class CreateDiagnosisDto {
  patientId: string;
  diagnosisCode: string;
  diagnosisName: string;
  description: string;
  symptoms?: string;
  treatmentPlan?: string;
  medications?: string;
  notes?: string;
  severity?: SeverityLevel;
  diagnosisDate?: Date;
  followUpDate?: Date;
}

export class UpdateDiagnosisDto {
  diagnosisCode?: string;
  diagnosisName?: string;
  description?: string;
  symptoms?: string;
  treatmentPlan?: string;
  medications?: string;
  notes?: string;
  severity?: SeverityLevel;
  status?: DiagnosisStatus;
  diagnosisDate?: Date;
  followUpDate?: Date;
  isActive?: boolean;
}

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) {}

  async create(createDiagnosisDto: CreateDiagnosisDto): Promise<Diagnosis> {
    const diagnosis = this.diagnosisRepository.create(createDiagnosisDto);
    return this.diagnosisRepository.save(diagnosis);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    diagnoses: Diagnosis[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [diagnoses, total] = await this.diagnosisRepository.findAndCount({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      diagnoses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByPatient(patientId: string): Promise<Diagnosis[]> {
    return this.diagnosisRepository.find({
      where: { patientId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Diagnosis> {
    const diagnosis = await this.diagnosisRepository.findOne({
      where: { id, isActive: true },
    });

    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    return diagnosis;
  }

  async update(id: string, updateDiagnosisDto: UpdateDiagnosisDto): Promise<Diagnosis> {
    const diagnosis = await this.findOne(id);
    Object.assign(diagnosis, updateDiagnosisDto);
    return this.diagnosisRepository.save(diagnosis);
  }

  async remove(id: string): Promise<void> {
    const diagnosis = await this.findOne(id);
    diagnosis.isActive = false;
    await this.diagnosisRepository.save(diagnosis);
  }

  async updateStatus(id: string, status: DiagnosisStatus): Promise<Diagnosis> {
    const diagnosis = await this.findOne(id);
    diagnosis.status = status;
    return this.diagnosisRepository.save(diagnosis);
  }

  async getDiagnosisStats(): Promise<{
    total: number;
    byStatus: Record<DiagnosisStatus, number>;
    bySeverity: Record<SeverityLevel, number>;
  }> {
    const total = await this.diagnosisRepository.count({ where: { isActive: true } });
    
    const byStatus = {} as Record<DiagnosisStatus, number>;
    const bySeverity = {} as Record<SeverityLevel, number>;

    for (const status of Object.values(DiagnosisStatus)) {
      byStatus[status] = await this.diagnosisRepository.count({
        where: { status, isActive: true },
      });
    }

    for (const severity of Object.values(SeverityLevel)) {
      bySeverity[severity] = await this.diagnosisRepository.count({
        where: { severity, isActive: true },
      });
    }

    return { total, byStatus, bySeverity };
  }
} 