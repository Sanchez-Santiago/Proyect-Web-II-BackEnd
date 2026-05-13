import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const ChatModel = {
  async create(data: Prisma.ChatCreateInput) {
    return prisma.chat.create({
      data,
      include: {
        publication: { include: { vehicle: true, seller: true } },
        messages: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        publication: { include: { vehicle: { include: { images: true } }, seller: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, fullName: true } } },
        },
      },
    });
  },

  async findAllByUserId(userId: string) {
    const messages = await prisma.message.findMany({
      where: { userId },
      select: { chatId: true },
      distinct: ['chatId'],
    });

    const chatIds = messages.map((m) => m.chatId);

    return prisma.chat.findMany({
      where: { id: { in: chatIds } },
      include: {
        publication: { include: { vehicle: { include: { images: true } }, seller: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: { select: { id: true, fullName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByPublicationAndUser(publicationId: string, userId: string) {
    const messages = await prisma.message.findMany({
      where: { chat: { publicationId }, userId },
      distinct: ['chatId'],
    });

    if (messages.length > 0) {
      return prisma.chat.findUnique({
        where: { id: messages[0].chatId },
        include: {
          publication: true,
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    return null;
  },

  async delete(id: string) {
    return prisma.chat.delete({ where: { id } });
  },
};