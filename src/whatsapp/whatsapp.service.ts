import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'template';
}

export interface AppointmentReminderData {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  clinicAddress?: string;
}

export interface AnalysisReportData {
  patientName: string;
  reportType: string;
  summary: string;
  recommendations: string[];
  nextSteps: string;
}

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: Client;
  private isReady = false;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  async onModuleInit() {
    this.setupWhatsAppClient();
  }

  private setupWhatsAppClient() {
    this.client.on('qr', (qr) => {
      this.logger.log('QR Code received, scan it with your phone:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp client authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('WhatsApp authentication failed:', msg);
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('WhatsApp client disconnected:', reason);
      this.isReady = false;
    });

    this.client.initialize();
  }

  async sendMessage(whatsappMessage: WhatsAppMessage): Promise<boolean> {
    try {
      if (!this.isReady) {
        this.logger.warn('WhatsApp client not ready, message not sent');
        return false;
      }

      // Format phone number (remove non-digits and add country code if needed)
      let phoneNumber = whatsappMessage.to.replace(/\D/g, '');
      if (!phoneNumber.startsWith('91')) {
        phoneNumber = '91' + phoneNumber; // Add India country code
      }
      phoneNumber += '@c.us';

      await this.client.sendMessage(phoneNumber, whatsappMessage.message);
      this.logger.log(`WhatsApp message sent successfully to ${whatsappMessage.to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      return false;
    }
  }

  async sendAppointmentReminder(
    phoneNumber: string,
    reminderData: AppointmentReminderData,
  ): Promise<boolean> {
    const message = this.formatAppointmentReminder(reminderData);
    return this.sendMessage({
      to: phoneNumber,
      message,
      type: 'text',
    });
  }

  async sendAnalysisReport(
    phoneNumber: string,
    reportData: AnalysisReportData,
  ): Promise<boolean> {
    const message = this.formatAnalysisReport(reportData);
    return this.sendMessage({
      to: phoneNumber,
      message,
      type: 'text',
    });
  }

  private formatAppointmentReminder(data: AppointmentReminderData): string {
    return `🏥 *Appointment Reminder*

Hello ${data.patientName},

This is a friendly reminder about your upcoming appointment:

📅 *Date:* ${data.appointmentDate}
🕐 *Time:* ${data.appointmentTime}
👩‍⚕️ *Doctor:* ${data.doctorName}
${data.clinicAddress ? `📍 *Location:* ${data.clinicAddress}` : ''}

*Important Notes:*
• Please arrive 15 minutes early
• Bring your ID and insurance card
• If you need to reschedule, please call us at least 24 hours in advance

We look forward to seeing you!

*Dr. Akanksha Agarwal's Mental Healthcare Clinic*
💙 Your mental wellness is our priority`;
  }

  private formatAnalysisReport(data: AnalysisReportData): string {
    const recommendationsList = data.recommendations
      .map((rec, index) => `${index + 1}. ${rec}`)
      .join('\n');

    return `📊 *${data.reportType} Report*

Hello ${data.patientName},

Your analysis report is ready:

*Summary:*
${data.summary}

*Recommendations:*
${recommendationsList}

*Next Steps:*
${data.nextSteps}

*Please Note:*
• This report is confidential and for your reference only
• If you have any questions, please don't hesitate to contact us
• Your next appointment will be scheduled soon

*Dr. Akanksha Agarwal's Mental Healthcare Clinic*
💙 Taking care of your mental health journey`;
  }

  async sendCustomMessage(phoneNumber: string, message: string): Promise<boolean> {
    return this.sendMessage({
      to: phoneNumber,
      message,
      type: 'text',
    });
  }

  // Bulk messaging for appointment reminders
  async sendBulkAppointmentReminders(
    appointments: Array<{
      phoneNumber: string;
      reminderData: AppointmentReminderData;
    }>,
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const appointment of appointments) {
      const success = await this.sendAppointmentReminder(
        appointment.phoneNumber,
        appointment.reminderData,
      );
      
      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.logger.log(`Bulk reminders sent: ${sent} successful, ${failed} failed`);
    return { sent, failed };
  }
} 