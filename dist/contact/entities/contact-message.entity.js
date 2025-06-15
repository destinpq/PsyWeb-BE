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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessage = exports.MessageStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["UNREAD"] = "unread";
    MessageStatus["READ"] = "read";
    MessageStatus["REPLIED"] = "replied";
    MessageStatus["ARCHIVED"] = "archived";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
let ContactMessage = class ContactMessage {
    id;
    firstName;
    lastName;
    email;
    phone;
    message;
    status;
    reply;
    repliedAt;
    createdAt;
    updatedAt;
    user;
    userId;
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.ContactMessage = ContactMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ContactMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactMessage.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactMessage.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactMessage.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactMessage.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ContactMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.UNREAD,
    }),
    __metadata("design:type", String)
], ContactMessage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ContactMessage.prototype, "reply", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ContactMessage.prototype, "repliedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactMessage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContactMessage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.contactMessages, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ContactMessage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactMessage.prototype, "userId", void 0);
exports.ContactMessage = ContactMessage = __decorate([
    (0, typeorm_1.Entity)('contact_messages')
], ContactMessage);
//# sourceMappingURL=contact-message.entity.js.map