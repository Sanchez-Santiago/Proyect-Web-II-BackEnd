import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const BuyerPreferenceModel = {
  async upsert(userId: string, data: Prisma.BuyerPreferenceCreateInput) {
    return prisma.buyerPreference.upsert({
      where: { userId },
      update: data,
      create: { ...data, user: { connect: { id: userId } } },
    });
  },

  async findByUserId(userId: string) {
    return prisma.buyerPreference.findUnique({ where: { userId } });
  },

  async delete(userId: string) {
    return prisma.buyerPreference.delete({ where: { userId } });
  },
};