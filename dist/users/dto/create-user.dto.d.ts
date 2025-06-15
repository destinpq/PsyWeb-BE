import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    age?: number;
    password?: string;
    role?: UserRole;
}
