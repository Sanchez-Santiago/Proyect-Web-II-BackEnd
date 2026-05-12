import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export const VehicleModel = {
  async create(data: any) {
    return prisma.vehicle.create({ data });
  },

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { images: true, analyticState: true, publications: { include: { seller: true, priceHistory: true } } },
    });
  },

  async findAll(filters: {
    brand?: string;
    model?: string;
    year?: number;
    yearMin?: number;
    yearMax?: number;
    priceMin?: number;
    priceMax?: number;
    fuelType?: string;
    transmission?: string;
    kilometersMin?: number;
    kilometersMax?: number;
    province?: string;
    city?: string;
    interiorConditionMin?: number;
    paintConditionMin?: number;
    sellerId?: string;
  }) {
    const where: any = {};

    if (filters.brand) where.brand = filters.brand;
    if (filters.model) where.model = filters.model;
    if (filters.year) where.year = filters.year;
    if (filters.yearMin || filters.yearMax) {
      where.year = {};
      if (filters.yearMin) where.year.gte = filters.yearMin;
      if (filters.yearMax) where.year.lte = filters.yearMax;
    }
    if (filters.priceMin || filters.priceMax) {
      where.publications = { some: { price: {} } };
      if (filters.priceMin) where.publications.some.price.gte = filters.priceMin;
      if (filters.priceMax) where.publications.some.price.lte = filters.priceMax;
    }
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.kilometersMin || filters.kilometersMax) {
      where.kilometers = {};
      if (filters.kilometersMin) where.kilometers.gte = filters.kilometersMin;
      if (filters.kilometersMax) where.kilometers.lte = filters.kilometersMax;
    }
    if (filters.province || filters.city || filters.sellerId) {
      where.publications = where.publications || { some: {} };
      if (filters.province) where.publications.some.province = filters.province;
      if (filters.city) where.publications.some.city = filters.city;
      if (filters.sellerId) where.publications.some.sellerId = filters.sellerId;
    }
    if (filters.interiorConditionMin || filters.paintConditionMin) {
      where.analyticState = {};
      if (filters.interiorConditionMin) where.analyticState.interiorCondition = { gte: filters.interiorConditionMin };
      if (filters.paintConditionMin) where.analyticState.paintCondition = { gte: filters.paintConditionMin };
    }

    return prisma.vehicle.findMany({
      where,
      include: { images: true, analyticState: true, publications: { include: { seller: { select: { id: true, fullName: true, email: true } }, priceHistory: true } } },
      orderBy: { year: 'desc' },
    });
  },

  async update(id: string, data: any) {
    return prisma.vehicle.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  },
};

export const VehicleImageModel = {
  async create(data: any) {
    return prisma.vehicleImage.create({ data });
  },

  async createMany(data: any[]) {
    return prisma.vehicleImage.createMany({ data });
  },

  async findByVehicleId(vehicleId: string) {
    return prisma.vehicleImage.findMany({ where: { vehicleId } });
  },

  async delete(id: string) {
    return prisma.vehicleImage.delete({ where: { id } });
  },

  async deleteByVehicleId(vehicleId: string) {
    return prisma.vehicleImage.deleteMany({ where: { vehicleId } });
  },
};

export const PublicationModel = {
  async create(sellerId: string, data: any) {
    const { currency, ...publicationData } = data;
    return prisma.publication.create({
      data: {
        ...publicationData,
        currency: currency || 'ARS',
        sellerId,
        priceHistory: {
          create: {
            amount: publicationData.price,
            currency: currency || 'ARS',
          },
        },
      },
      include: { vehicle: { include: { images: true, analyticState: true } }, seller: true, priceHistory: true },
    });
  },

  async findById(id: string) {
    return prisma.publication.findUnique({
      where: { id },
      include: { vehicle: { include: { images: true, analyticState: true } }, seller: true, priceHistory: true, favorites: true },
    });
  },

  async update(id: string, data: any) {
    const { currency, price, ...publicationData } = data;
    return prisma.publication.update({
      where: { id },
      data: {
        ...publicationData,
        ...(price
          ? {
              price,
              priceHistory: {
                create: {
                  amount: price,
                  currency: currency || 'ARS',
                },
              },
            }
          : {}),
      },
      include: { vehicle: { include: { images: true, analyticState: true } }, seller: true, priceHistory: true },
    });
  },

  async delete(id: string) {
    return prisma.publication.delete({ where: { id } });
  },
};

export const MessageModel = {
  async create(data: any) {
    return prisma.message.create({
      data,
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
    });
  },

  async findById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
    });
  },

  async findByChatId(chatId: string, filters?: { from?: Date; to?: Date; userId?: string }) {
    const where: any = { chatId };
    if (filters?.from || filters?.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }
    if (filters?.userId) where.userId = filters.userId;

    return prisma.message.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getConversations(userId: string) {
    return prisma.message.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
      orderBy: { createdAt: 'desc' },
      distinct: ['chatId'],
    });
  },

  async findAll(filters: { userId?: string; from?: Date; to?: Date }) {
    const where: any = {};
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }

    return prisma.message.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
      orderBy: { createdAt: 'desc' },
    });
  },
};

export const FavoriteModel = {
  async create(data: any) {
    return prisma.favorite.create({ data });
  },

  async delete(userId: string, publicationId: string) {
    return prisma.favorite.deleteMany({
      where: { userId, publicationId },
    });
  },

  async findByUserId(userId: string, filters?: { brand?: string; from?: Date; to?: Date; priceMin?: number; priceMax?: number }) {
    const where: any = { userId };
    if (filters?.brand || filters?.priceMin || filters?.priceMax) {
      where.publication = {};
      if (filters.brand) where.publication.vehicle = { brand: filters.brand };
      if (filters.priceMin || filters.priceMax) {
        where.publication.price = {};
        if (filters.priceMin) where.publication.price.gte = filters.priceMin;
        if (filters.priceMax) where.publication.price.lte = filters.priceMax;
      }
    }

    const favorites = await prisma.favorite.findMany({
      where,
      include: { publication: { include: { vehicle: { include: { images: true } }, seller: { select: { id: true, fullName: true, email: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    let result = favorites;
    if (filters?.from || filters?.to) {
      result = result.filter((f) => {
        const date = new Date(f.createdAt);
        if (filters.from && date < filters.from) return false;
        if (filters.to && date > filters.to) return false;
        return true;
      });
    }

    return result;
  },

  async findByVehicleId(publicationId: string) {
    return prisma.favorite.findMany({ where: { publicationId } });
  },

  async isFavorite(userId: string, publicationId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_publicationId: { userId, publicationId } },
    });
    return !!favorite;
  },
};

export const UserPreferenceModel = {
  async upsert(userId: string, data: any) {
    return prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId },
    });
  },

  async findByUserId(userId: string) {
    return prisma.userPreference.findUnique({ where: { userId } });
  },

  async delete(userId: string) {
    return prisma.userPreference.delete({ where: { userId } });
  },
};

export const AiAnalysisModel = {
  async create(data: any) {
    return prisma.aiAnalysis.create({ data });
  },

  async findById(id: string) {
    return prisma.aiAnalysis.findUnique({ where: { id } });
  },

  async findByVehicleId(vehicleId: string) {
    return prisma.aiAnalysis.findFirst({ where: { vehicleId } });
  },

  async update(id: string, data: any) {
    return prisma.aiAnalysis.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.aiAnalysis.delete({ where: { id } });
  },
};

export default prisma;
