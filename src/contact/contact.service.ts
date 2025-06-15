import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage, MessageStatus } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessageRepository: Repository<ContactMessage>,
    private readonly emailService: EmailService,
  ) {}

  async create(createContactMessageDto: CreateContactMessageDto): Promise<ContactMessage> {
    const message = this.contactMessageRepository.create(createContactMessageDto);
    return this.contactMessageRepository.save(message);
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactMessageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContactMessage> {
    const message = await this.contactMessageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    const message = await this.findOne(id);
    message.status = MessageStatus.READ;
    return this.contactMessageRepository.save(message);
  }

  async reply(id: string, replyText: string): Promise<ContactMessage> {
    const message = await this.findOne(id);
    message.reply = replyText;
    message.status = MessageStatus.REPLIED;
    message.repliedAt = new Date();
    
    // Send email notification
    try {
      await this.emailService.sendContactReply(
        message.email,
        `${message.firstName} ${message.lastName}`,
        message.message,
        replyText,
      );
    } catch (error) {
      console.error('Failed to send reply email:', error);
      // Don't fail the reply operation if email fails
    }
    
    return this.contactMessageRepository.save(message);
  }

  async archive(id: string): Promise<ContactMessage> {
    const message = await this.findOne(id);
    message.status = MessageStatus.ARCHIVED;
    return this.contactMessageRepository.save(message);
  }

  async remove(id: string): Promise<void> {
    const message = await this.findOne(id);
    await this.contactMessageRepository.remove(message);
  }

  async getUnreadCount(): Promise<number> {
    return this.contactMessageRepository.count({
      where: { status: MessageStatus.UNREAD },
    });
  }
}
