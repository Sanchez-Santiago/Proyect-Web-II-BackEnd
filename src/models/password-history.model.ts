import { prisma } from './prisma';
import { Prisma } from '../../generated/prisma/client';

export const PasswordHistoryModel = {
  async create(data: Prisma.PasswordHistoryCreateInput) {
    return prisma.passwordHistory.create({ data });
  },

  async findByUserId(userId: string, limit: number = 5) {
    return prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async isPasswordReused(userId: string, passwordHash: string, limit: number = 5) {
    const history = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return history.some((h) => h.passwordHash === passwordHash);
  },

  async deleteOldExceptRecent(userId: string, keepCount: number = 5) {
    const toDelete = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: keepCount,
      select: { id: true },
    });

    const ids = toDelete.map((h) => h.id);
    if (ids.length > 0) {
      return prisma.passwordHistory.deleteMany({
        where: { id: { in: ids } },
      });
    }
  },
};