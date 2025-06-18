import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    adminLogin(loginDto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    sendOTP(body: {
        email: string;
    }): Promise<{
        message: string;
        phone: string;
    }>;
    verifyOTP(body: {
        email: string;
        otp: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    sendAdminOTP(body: {
        email: string;
    }): Promise<{
        message: string;
        phone: string;
    }>;
    verifyAdminOTP(body: {
        email: string;
        otp: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    logout(): {
        message: string;
    };
}
