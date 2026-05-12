import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageModel } from '../../model/prisma.model';
import { CreateMessageInput, MessageFiltersInput } from './dto/message.dto';

@Injectable()
export class MessagesService {
  async create(senderId: string, input: CreateMessageInput) {
    return MessageModel.create({
      userId: senderId,
      chatId: input.chatId,
      buyerId: input.buyerId,
      sellerId: input.sellerId,
      publicationId: input.publicationId,
      message: input.message,
      status: input.status,
      leadStatus: input.leadStatus,
      lastMessageAt: new Date(),
    });
  }

  async findById(id: string) {
    const message = await MessageModel.findById(id);
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    return message;
  }

  async findByChatId(chatId: string, filters?: { from?: Date; to?: Date; userId?: string }) {
    const processedFilters = filters ? {
      from: filters.from ? new Date(filters.from) : undefined,
      to: filters.to ? new Date(filters.to) : undefined,
      userId: filters.userId,
    } : undefined;

    return MessageModel.findByChatId(chatId, processedFilters);
  }

  async getConversations(userId: string) {
    return MessageModel.getConversations(userId);
  }

  async findAll(filters: MessageFiltersInput) {
    const processedFilters = {
      userId: filters.userId,
      from: filters.from ? new Date(filters.from) : undefined,
      to: filters.to ? new Date(filters.to) : undefined,
    };

    return MessageModel.findAll(processedFilters);
  }
}
