import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../../model/auth.model';
import { hashPassword, comparePassword } from '../../utils/hash.util';
import { Role } from '../../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = hashPassword(data.password);
    const role: Role = (data.role as Role) || 'BUYER';
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: { email: string; password: string }) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async getProfile(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
