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
      include: { images: true, seller: true, aiAnalysis: true },
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
    vehicleType?: string;
    fuelType?: string;
    transmission?: string;
    mileageMin?: number;
    mileageMax?: number;
    province?: string;
    city?: string;
    interiorConditionMin?: number;
    paintConditionMin?: number;
    createdAtFrom?: Date;
    createdAtTo?: Date;
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
      where.price = {};
      if (filters.priceMin) where.price.gte = filters.priceMin;
      if (filters.priceMax) where.price.lte = filters.priceMax;
    }
    if (filters.vehicleType) where.vehicleType = filters.vehicleType;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.mileageMin || filters.mileageMax) {
      where.mileage = {};
      if (filters.mileageMin) where.mileage.gte = filters.mileageMin;
      if (filters.mileageMax) where.mileage.lte = filters.mileageMax;
    }
    if (filters.province) where.province = filters.province;
    if (filters.city) where.city = filters.city;
    if (filters.sellerId) where.sellerId = filters.sellerId;
    if (filters.interiorConditionMin) where.interiorCondition = { gte: filters.interiorConditionMin };
    if (filters.paintConditionMin) where.paintCondition = { gte: filters.paintConditionMin };
    if (filters.createdAtFrom || filters.createdAtTo) {
      where.createdAt = {};
      if (filters.createdAtFrom) where.createdAt.gte = filters.createdAtFrom;
      if (filters.createdAtTo) where.createdAt.lte = filters.createdAtTo;
    }

    return prisma.vehicle.findMany({
      where,
      include: { images: true, seller: { select: { id: true, name: true, email: true, province: true, city: true } }, aiAnalysis: true },
      orderBy: { createdAt: 'desc' },
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

  async findById(id: string) {
    return prisma.vehicleImage.findUnique({ where: { id } });
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

export const MessageModel = {
  async create(data: any) {
    return prisma.message.create({
      data,
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } }, vehicle: true },
    });
  },

  async findById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } }, vehicle: true },
    });
  },

  async findByVehicleId(vehicleId: string, filters?: { from?: Date; to?: Date; senderId?: string; receiverId?: string }) {
    const where: any = { vehicleId };
    if (filters?.from || filters?.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }
    if (filters?.senderId) where.senderId = filters.senderId;
    if (filters?.receiverId) where.receiverId = filters.receiverId;

    return prisma.message.findMany({
      where,
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } }, vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getConversations(userId: string) {
    const sent = await prisma.message.findMany({
      where: { senderId: userId },
      include: { vehicle: true, receiver: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      distinct: ['vehicleId', 'receiverId'],
    });

    const received = await prisma.message.findMany({
      where: { receiverId: userId },
      include: { vehicle: true, sender: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      distinct: ['vehicleId', 'senderId'],
    });

    const conversationMap = new Map();

    for (const msg of [...sent, ...received]) {
      const key = `${msg.vehicleId}-${msg.senderId === userId ? msg.receiverId : msg.senderId}`;
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          vehicleId: msg.vehicleId,
          vehicle: msg.vehicle,
          otherUser: msg.senderId === userId ? (msg as any).receiver : (msg as any).sender,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unreadCount: msg.receiverId === userId ? 1 : 0,
        });
      }
    }

    return Array.from(conversationMap.values()).sort((a: any, b: any) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  },

  async findAll(filters: { userId?: string; from?: Date; to?: Date }) {
    const where: any = {};
    if (filters.userId) {
      where.OR = [{ senderId: filters.userId }, { receiverId: filters.userId }];
    }
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }

    return prisma.message.findMany({
      where,
      include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } }, vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
  },
};

export const FavoriteModel = {
  async create(data: any) {
    return prisma.favorite.create({ data });
  },

  async delete(userId: string, vehicleId: string) {
    return prisma.favorite.deleteMany({
      where: { userId, vehicleId },
    });
  },

  async findByUserId(userId: string, filters?: { brand?: string; from?: Date; to?: Date; priceMin?: number; priceMax?: number; vehicleType?: string }) {
    const where: any = { userId };
    if (filters?.brand || filters?.priceMin || filters?.priceMax || filters?.vehicleType) {
      where.vehicle = {};
      if (filters.brand) where.vehicle.brand = filters.brand;
      if (filters.vehicleType) where.vehicle.vehicleType = filters.vehicleType;
      if (filters.priceMin || filters.priceMax) {
        where.vehicle.price = {};
        if (filters.priceMin) where.vehicle.price.gte = filters.priceMin;
        if (filters.priceMax) where.vehicle.price.lte = filters.priceMax;
      }
    }

    const favorites = await prisma.favorite.findMany({
      where,
      include: { vehicle: { include: { images: true, seller: { select: { id: true, name: true, email: true } } } } },
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

  async findByVehicleId(vehicleId: string) {
    return prisma.favorite.findMany({ where: { vehicleId } });
  },

  async isFavorite(userId: string, vehicleId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_vehicleId: { userId, vehicleId } },
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
    return prisma.aiAnalysis.findUnique({ where: { vehicleId } });
  },

  async update(id: string, data: any) {
    return prisma.aiAnalysis.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.aiAnalysis.delete({ where: { id } });
  },
};

export default prisma;