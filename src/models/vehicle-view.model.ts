import { prisma } from './prisma';

export const VehicleViewModel = {
  async create(publicationId: string, userId?: string, ipAddress?: string) {
    return prisma.vehicleView.create({
      data: { publicationId, userId, ipAddress },
    });
  },

  async findByPublicationId(publicationId: string) {
    return prisma.vehicleView.findMany({
      where: { publicationId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async countByPublicationId(publicationId: string) {
    return prisma.vehicleView.count({ where: { publicationId } });
  },

  async countByUserId(userId: string) {
    return prisma.vehicleView.count({ where: { userId } });
  },
};