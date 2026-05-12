import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { PasswordService } from './services/password.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { UserModel } from '../../models/user.model';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      signOptions: { expiresIn: '15m' as const },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, PasswordService, JwtGuard],
  exports: [AuthService, RefreshTokenService, PasswordService, JwtGuard, JwtModule],
})
export class AuthModule {}