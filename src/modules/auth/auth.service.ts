import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../../models/user.model';
import { RefreshTokenService } from './services/refresh-token.service';
import { PasswordService } from './services/password.service';
import { hashPassword, comparePassword } from '../../common/utils/hash.util';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private passwordService: PasswordService,
  ) {}

  async register(data: { name: string; email: string; password: string; role?: string; province?: string; city?: string }) {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = hashPassword(data.password);
    const role: UserRole = (data.role as UserRole) || 'BUYER';
    const user = await UserModel.create({
      fullName: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      role,
      province: data.province || null,
      city: data.city || null,
      verified: false,
      failedLoginAttempts: 0,
    });

    const { passwordHash: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  async login(data: { email: string; password: string }) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      await UserModel.incrementFailedLoginAttempts(user.id);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.failedLoginAttempts > 0) {
      await UserModel.resetFailedLoginAttempts(user.id);
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.refreshTokenService.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.fullName, email: user.email, role: user.role, verified: user.verified },
    };
  }

  async refresh(refreshToken: string) {
    const result = await this.refreshTokenService.rotateRefreshToken(refreshToken);
    return result;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
    }
    return { message: 'Logout exitoso' };
  }

  async getProfile(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { passwordHash: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    await this.passwordService.changePassword(userId, currentPassword, newPassword);
    return { message: 'Contraseña actualizada correctamente' };
  }
}