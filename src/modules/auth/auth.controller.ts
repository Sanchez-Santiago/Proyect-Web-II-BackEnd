import { Controller, Post, Get, Body, UseGuards, Request, Res, Headers } from '@nestjs/common';
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
    
    res.cookie('token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { 
      message: 'Login exitoso', 
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user 
    };
  }

  @Post('refresh')
  async refresh(@Headers('x-refresh-token') refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Refresh token no proporcionado');
    }
    const result = await this.authService.refresh(refreshToken);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Headers('x-refresh-token') refreshToken?: string,
  ) {
    await this.authService.logout(req.user.userId, refreshToken);
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return { message: 'Logout exitoso' };
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @Request() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const result = await this.authService.changePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );
    return result;
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.getProfile(req.user.userId);
    return { user };
  }
}