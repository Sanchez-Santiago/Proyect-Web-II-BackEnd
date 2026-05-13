import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const FavoriteModel = {
  async create(data: Prisma.FavoriteCreateInput) {
    return prisma.favorite.create({
      data,
      include: { publication: { include: { vehicle: { include: { images: true } }, seller: true } } },
    });
  },

  async delete(userId: string, publicationId: string) {
    return prisma.favorite.deleteMany({
      where: { userId, publicationId },
    });
  },

  async findByUserId(userId: string, filters?: { brand?: string; priceMin?: number; priceMax?: number }) {
    const where: Prisma.FavoriteWhereInput = { userId };

    if (filters?.brand || filters?.priceMin || filters?.priceMax) {
      where.publication = {};
      if (filters.brand) (where.publication as any).vehicle = { brand: filters.brand };
      if (filters.priceMin || filters.priceMax) {
        (where.publication as any).price = {};
        if (filters.priceMin) ((where.publication as any).price as any).gte = filters.priceMin;
        if (filters.priceMax) ((where.publication as any).price as any).lte = filters.priceMax;
      }
    }

    return prisma.favorite.findMany({
      where,
      include: {
        publication: {
          include: { vehicle: { include: { images: true } }, seller: { select: { id: true, fullName: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async isFavorite(userId: string, publicationId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_publicationId: { userId, publicationId } },
    });
    return !!favorite;
  },
};