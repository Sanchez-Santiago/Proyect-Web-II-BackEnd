import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenModel } from '../../../models/refresh-token.model';
import { randomUUID } from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(private jwtService: JwtService) {}

  async createRefreshToken(userId: string): Promise<string> {
    await RefreshTokenModel.deleteExpiredByUserId(userId);

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshTokenModel.create({
      token,
      expiresAt,
      user: { connect: { id: userId } },
    });

    return token;
  }

  async validateRefreshToken(token: string): Promise<{ userId: string; email: string }> {
    const refreshToken = await RefreshTokenModel.findByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (new Date() > refreshToken.expiresAt) {
      await RefreshTokenModel.deleteByToken(token);
      throw new UnauthorizedException('Refresh token expirado');
    }

    return {
      userId: refreshToken.user.id,
      email: refreshToken.user.email,
    };
  }

  async rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const validated = await this.validateRefreshToken(oldToken);

    await RefreshTokenModel.deleteByToken(oldToken);

    const accessToken = await this.jwtService.signAsync({
      userId: validated.userId,
      email: validated.email,
    });

    const newRefreshToken = await this.createRefreshToken(validated.userId);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteByToken(token);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshTokenModel.deleteAllByUserId(userId);
  }

  async getUserRefreshTokens(userId: string) {
    return RefreshTokenModel.findByUserId(userId);
  }
}