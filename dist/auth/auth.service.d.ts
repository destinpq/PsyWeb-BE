import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
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
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(id: string): Promise<User | null>;
}
