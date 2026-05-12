import { prisma } from './prisma';
import { Prisma } from '../../generated/prisma/client';

export const VehicleImageModel = {
  async create(data: Prisma.VehicleImageCreateInput) {
    return prisma.vehicleImage.create({ data });
  },

  async createMany(images: { vehicleId: string; imageUrl: string; imageName?: string }[]) {
    return prisma.vehicleImage.createMany({ data: images });
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