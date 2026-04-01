import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MessageModel } from '../../model/prisma.model';
import { CreateMessageInput, MessageFiltersInput } from './dto/message.dto';

@Injectable()
export class MessagesService {
  async create(senderId: string, input: CreateMessageInput) {
    if (senderId === input.receiverId) {
      throw new BadRequestException('No puedes enviarte mensajes a ti mismo');
    }

    return MessageModel.create({
      senderId,
      vehicleId: input.vehicleId,
      receiverId: input.receiverId,
      message: input.message,
    });
  }

  async findById(id: string) {
    const message = await MessageModel.findById(id);
    if (!message) throw new NotFoundException('Mensaje no encontrado');
    return message;
  }

  async findByVehicleId(vehicleId: string, filters?: { from?: Date; to?: Date; senderId?: string; receiverId?: string }) {
    const processedFilters = filters ? {
      from: filters.from ? new Date(filters.from) : undefined,
      to: filters.to ? new Date(filters.to) : undefined,
      senderId: filters.senderId,
      receiverId: filters.receiverId,
    } : undefined;

    return MessageModel.findByVehicleId(vehicleId, processedFilters);
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