import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'] },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtGuard, RolesGuard],
})
export class AdminModule {}
