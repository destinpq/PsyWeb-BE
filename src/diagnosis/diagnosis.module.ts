import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisService } from './diagnosis.service';
import { Diagnosis } from './entities/diagnosis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnosis])],
  providers: [DiagnosisService],
  exports: [DiagnosisService],
})
export class DiagnosisModule {} 