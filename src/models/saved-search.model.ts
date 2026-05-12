import { prisma } from './prisma';
import { Prisma } from '../../generated/prisma/client';

export const SavedSearchModel = {
  async create(userId: string, filtersJson: Prisma.JsonObject) {
    return prisma.savedSearch.create({
      data: { userId, filtersJson },
    });
  },

  async findById(id: string) {
    return prisma.savedSearch.findUnique({ where: { id } });
  },

  async findByUserId(userId: string) {
    return prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, filtersJson: Prisma.JsonObject) {
    return prisma.savedSearch.update({
      where: { id },
      data: { filtersJson },
    });
  },

  async delete(id: string) {
    return prisma.savedSearch.delete({ where: { id } });
  },
};