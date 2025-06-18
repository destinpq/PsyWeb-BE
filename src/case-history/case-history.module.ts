import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseHistoryService } from './case-history.service';
import { CaseHistoryController } from './case-history.controller';
import { CaseHistory } from './entities/case-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaseHistory, User])],
  controllers: [CaseHistoryController],
  providers: [CaseHistoryService],
  exports: [CaseHistoryService],
})
export class CaseHistoryModule {} 