import { prisma } from './prisma';
import { Prisma, MessageStatus } from '../../generated/prisma/client';

export const MessageModel = {
  async create(data: Prisma.MessageCreateInput) {
    return prisma.message.create({
      data,
      include: { user: { select: { id: true, fullName: true } } },
    });
  },

  async findById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true } } },
    });
  },

  async findByChatId(chatId: string, options?: { limit?: number; offset?: number }) {
    return prisma.message.findMany({
      where: { chatId },
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  },

  async updateStatus(id: string, status: MessageStatus) {
    return prisma.message.update({
      where: { id },
      data: { status },
    });
  },

  async markAsRead(chatId: string, userId: string) {
    return prisma.message.updateMany({
      where: { chatId, userId: { not: userId }, status: { not: 'READ' } },
      data: { status: 'READ' },
    });
  },

  async getUnreadCount(chatId: string, userId: string) {
    return prisma.message.count({
      where: { chatId, userId: { not: userId }, status: { not: 'READ' } },
    });
  },

  async delete(id: string) {
    return prisma.message.delete({ where: { id } });
  },
};