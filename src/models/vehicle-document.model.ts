import { prisma } from './prisma';
import { Prisma } from '../../generated/prisma/client';

export const VehicleDocumentModel = {
  async create(data: Prisma.VehicleDocumentCreateInput) {
    return prisma.vehicleDocument.create({ data });
  },

  async findById(id: string) {
    return prisma.vehicleDocument.findUnique({ where: { id } });
  },

  async findByVehicleId(vehicleId: string) {
    return prisma.vehicleDocument.findMany({ where: { vehicleId } });
  },

  async verify(id: string) {
    return prisma.vehicleDocument.update({
      where: { id },
      data: { verified: true },
    });
  },

  async delete(id: string) {
    return prisma.vehicleDocument.delete({ where: { id } });
  },
};