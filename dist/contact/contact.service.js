"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_message_entity_1 = require("./entities/contact-message.entity");
const email_service_1 = require("../email/email.service");
let ContactService = class ContactService {
    contactMessageRepository;
    emailService;
    constructor(contactMessageRepository, emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }
    async create(createContactMessageDto) {
        const message = this.contactMessageRepository.create(createContactMessageDto);
        return this.contactMessageRepository.save(message);
    }
    async findAll() {
        return this.contactMessageRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const message = await this.contactMessageRepository.findOne({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        return message;
    }
    async markAsRead(id) {
        const message = await this.findOne(id);
        message.status = contact_message_entity_1.MessageStatus.READ;
        return this.contactMessageRepository.save(message);
    }
    async reply(id, replyText) {
        const message = await this.findOne(id);
        message.reply = replyText;
        message.status = contact_message_entity_1.MessageStatus.REPLIED;
        message.repliedAt = new Date();
        try {
            await this.emailService.sendContactReply(message.email, `${message.firstName} ${message.lastName}`, message.message, replyText);
        }
        catch (error) {
            console.error('Failed to send reply email:', error);
        }
        return this.contactMessageRepository.save(message);
    }
    async archive(id) {
        const message = await this.findOne(id);
        message.status = contact_message_entity_1.MessageStatus.ARCHIVED;
        return this.contactMessageRepository.save(message);
    }
    async remove(id) {
        const message = await this.findOne(id);
        await this.contactMessageRepository.remove(message);
    }
    async getUnreadCount() {
        return this.contactMessageRepository.count({
            where: { status: contact_message_entity_1.MessageStatus.UNREAD },
        });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_message_entity_1.ContactMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map