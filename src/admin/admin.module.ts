import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { BlogPost } from '../blog/entities/blog-post.entity';
import { ContactMessage } from '../contact/entities/contact-message.entity';
import { Service } from '../services/entities/service.entity';
import { DiagnosisModule } from '../diagnosis/diagnosis.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Appointment,
      BlogPost,
      ContactMessage,
      Service,
    ]),
    DiagnosisModule,
    WhatsAppModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {} 