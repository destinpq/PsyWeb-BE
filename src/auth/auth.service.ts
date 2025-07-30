import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';


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

@Injectable()
export class AuthService {
  private otpStorage = new Map<
    string,
    { otp: string; expiresAt: Date; phone: string }
  >();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,

  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email, isActive: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
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

  async validateUser(id: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { id, isActive: true },
      });
    } catch {
      return null;
    }
  }

  // Generate and send OTP via WhatsApp
  async sendOTP(email: string): Promise<{ message: string; phone: string }> {
    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Use admin phone number for admin users, or user's phone for patients
    const phoneNumber = user.role === 'admin' ? '7722021968' : user.phone;

    if (!phoneNumber) {
      throw new UnauthorizedException('Phone number not found for user');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP
    this.otpStorage.set(email, { otp, expiresAt, phone: phoneNumber });

    // Log OTP for development (replace with SMS/Email service in production)
    console.log(`🔐 OTP for ${email} (${phoneNumber}): ${otp}`);

    return {
      message: 'OTP sent successfully',
      phone: phoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+91 $1***$3'), // Mask phone number
    };
  }

  // Verify OTP and login
  async verifyOTP(
    email: string,
    otp: string,
  ): Promise<{ access_token: string; user: any }> {
    const storedOTP = this.otpStorage.get(email);

    if (!storedOTP) {
      throw new UnauthorizedException('OTP not found or expired');
    }

    if (new Date() > storedOTP.expiresAt) {
      this.otpStorage.delete(email);
      throw new UnauthorizedException('OTP has expired');
    }

    if (storedOTP.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // OTP is valid, clean up and login user
    this.otpStorage.delete(email);

    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
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
}
