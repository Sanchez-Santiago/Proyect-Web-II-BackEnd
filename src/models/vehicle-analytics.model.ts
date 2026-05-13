import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const VehicleAnalyticsModel = {
  async create(data: Prisma.VehicleAnalyticsCreateInput) {
    return prisma.vehicleAnalytics.create({ data });
  },

  async findById(id: string) {
    return prisma.vehicleAnalytics.findUnique({ where: { id } });
  },

  async findByVehicleId(vehicleId: string) {
    return prisma.vehicleAnalytics.findUnique({ where: { vehicleId } });
  },

  async update(id: string, data: Prisma.VehicleAnalyticsUpdateInput) {
    return prisma.vehicleAnalytics.update({ where: { id }, data });
  },

  async updateByVehicleId(vehicleId: string, data: Prisma.VehicleAnalyticsUpdateInput) {
    return prisma.vehicleAnalytics.update({ where: { vehicleId }, data });
  },

  async delete(id: string) {
    return prisma.vehicleAnalytics.delete({ where: { id } });
  },

  async deleteByVehicleId(vehicleId: string) {
    return prisma.vehicleAnalytics.delete({ where: { vehicleId } });
  },
};