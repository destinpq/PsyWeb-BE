import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.CREATED)
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // New OTP endpoints
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOTP(@Body() body: { email: string }) {
    return this.authService.sendOTP(body.email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOTP(body.email, body.otp);
  }

  @Post('admin/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendAdminOTP(@Body() body: { email: string }) {
    return this.authService.sendOTP(body.email);
  }

  @Post('admin/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyAdminOTP(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOTP(body.email, body.otp);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { message: 'Logged out successfully' };
  }
}
