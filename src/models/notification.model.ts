import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const NotificationModel = {
  async create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  },

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  },

  async findByUserId(userId: string, filters?: { isRead?: boolean }) {
    const where: Prisma.NotificationWhereInput = { userId };
    if (filters?.isRead !== undefined) where.isRead = filters.isRead;

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  },
};