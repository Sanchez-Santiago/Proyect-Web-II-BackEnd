import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../../model/auth.model';
import { hashPassword, comparePassword } from '../../utils/hash.util';
import { SellerType, UserRole } from '../../../generated/prisma/client';
import type { User } from '../../../generated/prisma/client';
import { RegisterInput } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data: RegisterInput) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = hashPassword(data.password);
    const role: UserRole = (data.role as UserRole) || 'BUYER';
    const sellerType = data.sellerType as SellerType | undefined;

    try {
      const user = await UserModel.create({
        fullName: data.name.trim(),
        email,
        password: hashedPassword,
        role,
        birthDate: new Date(data.birthDate),
        phone: data.phone.trim(),
        alternatePhone: data.alternatePhone?.trim(),
        sellerType,
        businessName: data.businessName?.trim(),
        taxId: data.taxId?.trim(),
        contactEmail: data.contactEmail?.trim().toLowerCase(),
        contactPhone: data.contactPhone?.trim(),
        province: data.province?.trim(),
        city: data.city?.trim(),
        address: data.address?.trim(),
        acceptsTradeIn: data.acceptsTradeIn,
        sellerDescription: data.sellerDescription?.trim(),
        aiAutoReply: data.aiAutoReply,
      });

      const publicUser = this.removeSensitiveFields(user);
      const token = await this.createToken(user);

      return { token, user: publicUser };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('El email ya está registrado');
      }

      throw error;
    }
  }

  async login(data: { email: string; password: string }) {
    const email = data.email.trim().toLowerCase();
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      await UserModel.incrementFailedAttempts(user.id);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    await UserModel.resetFailedAttempts(user.id);

    const token = await this.createToken(user);

    return {
      token,
      user: this.removeSensitiveFields(user),
    };
  }

  async getProfile(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return this.removeSensitiveFields(user);
  }

  private async createToken(user: Pick<User, 'id' | 'email' | 'role'>) {
    const payload = { userId: user.id, email: user.email, role: user.role };
    return this.jwtService.signAsync(payload);
  }

  private removeSensitiveFields<T extends { password?: string }>(user: T) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
