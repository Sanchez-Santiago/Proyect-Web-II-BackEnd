import { prisma } from './prisma';

export const VehicleFeatureModel = {
  async create(data: { featureName: string }) {
    return prisma.vehicleFeature.create({ data });
  },

  async findById(id: string) {
    return prisma.vehicleFeature.findUnique({ where: { id } });
  },

  async findAll() {
    return prisma.vehicleFeature.findMany({ orderBy: { featureName: 'asc' } });
  },

  async findByName(featureName: string) {
    return prisma.vehicleFeature.findUnique({ where: { featureName } });
  },

  async delete(id: string) {
    return prisma.vehicleFeature.delete({ where: { id } });
  },
};