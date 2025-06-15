import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ServicesModule } from './services/services.module';
import { ContactModule } from './contact/contact.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    UsersModule,
    AppointmentsModule,
    ContactModule,
    ServicesModule,
    BlogModule,
    AuthModule,
    EmailModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
