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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/entities/user.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    whatsappService;
    otpStorage = new Map();
    constructor(usersRepository, jwtService, whatsappService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.whatsappService = whatsappService;
    }
    async login(loginDto) {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email, isActive: true },
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async validateUser(id) {
        try {
            return await this.usersRepository.findOne({
                where: { id, isActive: true },
            });
        }
        catch {
            return null;
        }
    }
    async sendOTP(email) {
        const user = await this.usersRepository.findOne({
            where: { email, isActive: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const phoneNumber = user.role === 'admin' ? '7722021968' : user.phone;
        if (!phoneNumber) {
            throw new common_1.UnauthorizedException('Phone number not found for user');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStorage.set(email, { otp, expiresAt, phone: phoneNumber });
        const message = `🔐 Your login OTP is: ${otp}

This OTP will expire in 5 minutes.

Dr. Akanksha Psychology Clinic`;
        try {
            await this.whatsappService.sendMessage({
                to: phoneNumber,
                message: message,
                type: 'text'
            });
        }
        catch (error) {
            console.error('Failed to send WhatsApp OTP:', error);
            throw new common_1.UnauthorizedException('Failed to send OTP');
        }
        return {
            message: 'OTP sent successfully',
            phone: phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+91 $1***$3'),
        };
    }
    async verifyOTP(email, otp) {
        const storedOTP = this.otpStorage.get(email);
        if (!storedOTP) {
            throw new common_1.UnauthorizedException('OTP not found or expired');
        }
        if (new Date() > storedOTP.expiresAt) {
            this.otpStorage.delete(email);
            throw new common_1.UnauthorizedException('OTP has expired');
        }
        if (storedOTP.otp !== otp) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        this.otpStorage.delete(email);
        const user = await this.usersRepository.findOne({
            where: { email, isActive: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        whatsapp_service_1.WhatsAppService])
], AuthService);
//# sourceMappingURL=auth.service.js.map