import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendContactReply(recipientEmail: string, recipientName: string, originalMessage: string, replyMessage: string): Promise<void>;
    sendAppointmentConfirmation(recipientEmail: string, recipientName: string, appointmentDate: string, appointmentTime: string, serviceName: string): Promise<void>;
    sendAppointmentStatusUpdate(recipientEmail: string, recipientName: string, appointmentDate: string, appointmentTime: string, serviceName: string, status: string): Promise<void>;
    sendWelcomeEmail(recipientEmail: string, recipientName: string): Promise<void>;
}
