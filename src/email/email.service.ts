import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendContactReply(
    recipientEmail: string,
    recipientName: string,
    originalMessage: string,
    replyMessage: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: 'Reply to Your Contact Message - Psychology Practice',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">Thank you for contacting us!</h2>
              
              <p style="color: #666; margin-bottom: 15px;">Dear ${recipientName},</p>
              
              <p style="color: #666; margin-bottom: 20px;">
                We have received your message and here is our response:
              </p>
              
              <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h4 style="color: #495057; margin-bottom: 10px;">Your Original Message:</h4>
                <p style="color: #6c757d; font-style: italic;">${originalMessage}</p>
              </div>
              
              <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h4 style="color: #155724; margin-bottom: 10px;">Our Response:</h4>
                <p style="color: #155724;">${replyMessage}</p>
              </div>
              
              <p style="color: #666; margin-bottom: 15px;">
                If you have any further questions, please don't hesitate to contact us.
              </p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
              
              <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
                Best regards,<br>
                Psychology Practice Team<br>
                Email: dr.akanksha@example.com<br>
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send contact reply email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async sendAppointmentConfirmation(
    recipientEmail: string,
    recipientName: string,
    appointmentDate: string,
    appointmentTime: string,
    serviceName: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: 'Appointment Confirmation - Psychology Practice',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #28a745; margin-bottom: 20px;">🎉 Your Appointment is Confirmed!</h2>
              
              <p style="color: #666; margin-bottom: 15px;">Dear ${recipientName},</p>
              
              <p style="color: #666; margin-bottom: 20px;">
                Your appointment has been successfully scheduled. Here are the details:
              </p>
              
              <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h4 style="color: #155724; margin-bottom: 15px;">Appointment Details:</h4>
                <p style="color: #155724; margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
                <p style="color: #155724; margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
                <p style="color: #155724; margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h4 style="color: #856404; margin-bottom: 10px;">Important Reminders:</h4>
                <ul style="color: #856404; margin: 0; padding-left: 20px;">
                  <li>Please arrive 10 minutes early for your appointment</li>
                  <li>Bring any relevant documentation or insurance cards</li>
                  <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                </ul>
              </div>
              
              <p style="color: #666; margin-bottom: 15px;">
                We look forward to seeing you at your appointment.
              </p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
              
              <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
                Best regards,<br>
                Psychology Practice Team<br>
                Email: dr.akanksha@example.com<br>
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send appointment confirmation email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async sendAppointmentStatusUpdate(
    recipientEmail: string,
    recipientName: string,
    appointmentDate: string,
    appointmentTime: string,
    serviceName: string,
    status: string,
  ): Promise<void> {
    const statusColors = {
      confirmed: { bg: '#d4edda', text: '#155724' },
      cancelled: { bg: '#f8d7da', text: '#721c24' },
      completed: { bg: '#cce5ff', text: '#004085' },
      no_show: { bg: '#e2e3e5', text: '#383d41' },
    };

    const statusColor = statusColors[status] || statusColors.confirmed;

    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: `Appointment Status Update - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">Appointment Status Update</h2>
              
              <p style="color: #666; margin-bottom: 15px;">Dear ${recipientName},</p>
              
              <p style="color: #666; margin-bottom: 20px;">
                Your appointment status has been updated:
              </p>
              
              <div style="background-color: ${statusColor.bg}; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h4 style="color: ${statusColor.text}; margin-bottom: 15px;">Appointment Details:</h4>
                <p style="color: ${statusColor.text}; margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
                <p style="color: ${statusColor.text}; margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
                <p style="color: ${statusColor.text}; margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
                <p style="color: ${statusColor.text}; margin: 5px 0;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
              </div>
              
              <p style="color: #666; margin-bottom: 15px;">
                If you have any questions or concerns, please don't hesitate to contact us.
              </p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
              
              <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
                Best regards,<br>
                Psychology Practice Team<br>
                Email: dr.akanksha@example.com<br>
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send appointment status update email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async sendWelcomeEmail(
    recipientEmail: string,
    recipientName: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: 'Welcome to Psychology Practice!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #007bff; margin-bottom: 20px;">Welcome to Psychology Practice!</h2>
              
              <p style="color: #666; margin-bottom: 15px;">Dear ${recipientName},</p>
              
              <p style="color: #666; margin-bottom: 20px;">
                Welcome to our psychology practice! We're delighted to have you as part of our community.
              </p>
              
              <div style="background-color: #cce5ff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h4 style="color: #004085; margin-bottom: 15px;">What's Next?</h4>
                <ul style="color: #004085; margin: 0; padding-left: 20px;">
                  <li>Explore our range of therapy services</li>
                  <li>Schedule your first appointment</li>
                  <li>Read our blog for mental health tips and insights</li>
                  <li>Contact us with any questions</li>
                </ul>
              </div>
              
              <p style="color: #666; margin-bottom: 15px;">
                We're here to support you on your mental health journey.
              </p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
              
              <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
                Best regards,<br>
                Psychology Practice Team<br>
                Email: dr.akanksha@example.com<br>
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send email notification');
    }
  }
} 