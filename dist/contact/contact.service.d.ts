import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { EmailService } from '../email/email.service';
export declare class ContactService {
    private readonly contactMessageRepository;
    private readonly emailService;
    constructor(contactMessageRepository: Repository<ContactMessage>, emailService: EmailService);
    create(createContactMessageDto: CreateContactMessageDto): Promise<ContactMessage>;
    findAll(): Promise<ContactMessage[]>;
    findOne(id: string): Promise<ContactMessage>;
    markAsRead(id: string): Promise<ContactMessage>;
    reply(id: string, replyText: string): Promise<ContactMessage>;
    archive(id: string): Promise<ContactMessage>;
    remove(id: string): Promise<void>;
    getUnreadCount(): Promise<number>;
}
