import { prisma } from './prisma';
import { Prisma } from '../../generated/prisma/client';

export const RefreshTokenModel = {
  async create(data: Prisma.RefreshTokenCreateInput) {
    return prisma.refreshToken.create({ data });
  },

  async findByToken(token: string) {
    return prisma.refreshToken.findFirst({
      where: { token },
      include: { user: true },
    });
  },

  async findByUserId(userId: string) {
    return prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async delete(id: string) {
    return prisma.refreshToken.delete({ where: { id } });
  },

  async deleteByToken(token: string) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  },

  async deleteExpiredByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId, expiresAt: { lt: new Date() } },
    });
  },

  async deleteAllByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },
};