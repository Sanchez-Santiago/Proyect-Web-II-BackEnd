import { prisma } from './prisma';
import { UserRole, Prisma } from '@prisma/client';

export const UserModel = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { buyerPreference: true },
    });
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async findAll(filters?: { role?: UserRole; province?: string; city?: string }) {
    const where: Prisma.UserWhereInput = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.province) where.province = filters.province;
    if (filters?.city) where.city = filters.city;

    return prisma.user.findMany({ where });
  },

  async incrementFailedLoginAttempts(id: string) {
    return prisma.user.update({
      where: { id },
      data: { failedLoginAttempts: { increment: 1 } },
    });
  },

  async resetFailedLoginAttempts(id: string) {
    return prisma.user.update({
      where: { id },
      data: { failedLoginAttempts: 0 },
    });
  },

  async verify(id: string) {
    return prisma.user.update({
      where: { id },
      data: { verified: true },
    });
  },
};