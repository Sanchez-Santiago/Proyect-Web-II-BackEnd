import { prisma } from './prisma';
import { Prisma, VehicleType, FuelType, Transmission } from '../../generated/prisma/client';

export const VehicleModel = {
  async create(data: Prisma.VehicleCreateInput) {
    return prisma.vehicle.create({ data });
  },

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: true,
        documents: true,
        analytics: true,
        seller: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });
  },

  async findAll(filters: {
    brand?: string;
    model?: string;
    year?: number;
    yearMin?: number;
    yearMax?: number;
    vehicleType?: VehicleType;
    fuelType?: FuelType;
    transmission?: Transmission;
    mileageMin?: number;
    mileageMax?: number;
    sellerId?: string;
  } = {}) {
    const where: Prisma.VehicleWhereInput = {};

    if (filters.brand) where.brand = filters.brand;
    if (filters.model) where.model = filters.model;
    if (filters.year) where.year = filters.year;
    if (filters.yearMin || filters.yearMax) {
      where.year = {};
      if (filters.yearMin) (where.year as any).gte = filters.yearMin;
      if (filters.yearMax) (where.year as any).lte = filters.yearMax;
    }
    if (filters.vehicleType) where.vehicleType = filters.vehicleType;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.mileageMin || filters.mileageMax) {
      where.mileage = {};
      if (filters.mileageMin) (where.mileage as any).gte = filters.mileageMin;
      if (filters.mileageMax) (where.mileage as any).lte = filters.mileageMax;
    }
    if (filters.sellerId) where.sellerId = filters.sellerId;

    return prisma.vehicle.findMany({
      where,
      include: {
        images: true,
        seller: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: Prisma.VehicleUpdateInput) {
    return prisma.vehicle.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  },

  async findByVin(vin: string) {
    return prisma.vehicle.findFirst({ where: { vin } });
  },

  async findByLicensePlate(licensePlate: string) {
    return prisma.vehicle.findFirst({ where: { licensePlate } });
  },
};