import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private whatsappService;
    private otpStorage;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, whatsappService: WhatsAppService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(id: string): Promise<User | null>;
    sendOTP(email: string): Promise<{
        message: string;
        phone: string;
    }>;
    verifyOTP(email: string, otp: string): Promise<{
        access_token: string;
        user: any;
    }>;
}
