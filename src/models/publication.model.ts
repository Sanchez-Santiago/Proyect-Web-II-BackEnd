import { prisma } from './prisma';
import { Prisma, PublicationStatus } from '../../generated/prisma/client';

export const PublicationModel = {
  async create(data: Prisma.PublicationCreateInput) {
    return prisma.publication.create({
      data,
      include: {
        vehicle: { include: { images: true, seller: true } },
        seller: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.publication.findUnique({
      where: { id },
      include: {
        vehicle: { include: { images: true, documents: true, analytics: true } },
        seller: { select: { id: true, fullName: true, email: true, phone: true } },
        priceHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
        publicationFeatures: { include: { feature: true } },
      },
    });
  },

  async findAll(filters: {
    status?: PublicationStatus;
    priceMin?: number;
    priceMax?: number;
    province?: string;
    city?: string;
    brand?: string;
    model?: string;
    yearMin?: number;
    yearMax?: number;
    vehicleType?: string;
    fuelType?: string;
    transmission?: string;
    sellerId?: string;
  } = {}) {
    const where: Prisma.PublicationWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.province) where.province = filters.province;
    if (filters.city) where.city = filters.city;
    if (filters.sellerId) where.sellerId = filters.sellerId;

    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) (where.price as any).gte = filters.priceMin;
      if (filters.priceMax) (where.price as any).lte = filters.priceMax;
    }

    if (filters.brand || filters.model || filters.yearMin || filters.yearMax || filters.vehicleType || filters.fuelType || filters.transmission) {
      where.vehicle = {};
      if (filters.brand) (where.vehicle as any).brand = filters.brand;
      if (filters.model) (where.vehicle as any).model = filters.model;
      if (filters.vehicleType) (where.vehicle as any).vehicleType = filters.vehicleType;
      if (filters.fuelType) (where.vehicle as any).fuelType = filters.fuelType;
      if (filters.transmission) (where.vehicle as any).transmission = filters.transmission;
      if (filters.yearMin || filters.yearMax) {
        (where.vehicle as any).year = {};
        if (filters.yearMin) ((where.vehicle as any).year as any).gte = filters.yearMin;
        if (filters.yearMax) ((where.vehicle as any).year as any).lte = filters.yearMax;
      }
    }

    return prisma.publication.findMany({
      where,
      include: {
        vehicle: { include: { images: true, analytics: true } },
        seller: { select: { id: true, fullName: true, email: true } },
        publicationFeatures: { include: { feature: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: Prisma.PublicationUpdateInput) {
    return prisma.publication.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.publication.delete({ where: { id } });
  },

  async updateStatus(id: string, status: PublicationStatus) {
    return prisma.publication.update({
      where: { id },
      data: { status },
    });
  },

  async findByVehicleId(vehicleId: string) {
    return prisma.publication.findUnique({ where: { vehicleId } });
  },

  async addFeature(publicationId: string, featureId: string) {
    return prisma.publicationFeature.create({
      data: { publicationId, featureId },
    });
  },

  async removeFeature(publicationId: string, featureId: string) {
    return prisma.publicationFeature.delete({
      where: { publicationId_featureId: { publicationId, featureId } },
    });
  },

  async getFeatures(publicationId: string) {
    return prisma.publicationFeature.findMany({
      where: { publicationId },
      include: { feature: true },
    });
  },
};