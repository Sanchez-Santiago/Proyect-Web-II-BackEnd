import { prisma } from './prisma';
import { PublicationStatus } from '../../generated/prisma/client';

export const PublicationStatusHistoryModel = {
  async create(publicationId: string, oldStatus: PublicationStatus | null, newStatus: PublicationStatus) {
    return prisma.publicationStatusHistory.create({
      data: { publicationId, oldStatus, newStatus },
    });
  },

  async findByPublicationId(publicationId: string) {
    return prisma.publicationStatusHistory.findMany({
      where: { publicationId },
      orderBy: { changedAt: 'desc' },
    });
  },
};