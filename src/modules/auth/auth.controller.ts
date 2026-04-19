import { Controller, Post, Get, Body, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { message: 'Usuario registrado exitosamente', user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login exitoso', user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout exitoso' };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.getProfile(req.user.userId);
    return { user };
  }
}
