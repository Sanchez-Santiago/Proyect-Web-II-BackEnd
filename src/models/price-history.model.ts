import { prisma } from './prisma';

export const PriceHistoryModel = {
  async create(publicationId: string, amount: number, currency: string = 'USD') {
    return prisma.priceHistory.create({
      data: { publicationId, amount, currency },
    });
  },

  async findByPublicationId(publicationId: string) {
    return prisma.priceHistory.findMany({
      where: { publicationId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getLatestByPublicationId(publicationId: string) {
    return prisma.priceHistory.findFirst({
      where: { publicationId },
      orderBy: { createdAt: 'desc' },
    });
  },
};