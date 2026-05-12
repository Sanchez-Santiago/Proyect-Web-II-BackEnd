import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChatModel } from '../../models/chat.model';
import { MessageModel } from '../../models/message.model';
import { PublicationModel } from '../../models/publication.model';

@Injectable()
export class ChatService {
  async create(userId: string, publicationId: string) {
    const publication = await PublicationModel.findById(publicationId);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.sellerId === userId) {
      throw new BadRequestException('No puedes chatear con tu propia publicación');
    }

    let chat = await ChatModel.findByPublicationAndUser(publicationId, userId);
    
    if (!chat) {
      chat = await ChatModel.create({
        publication: { connect: { id: publicationId } },
      });
    }

    return this.findById(chat.id);
  }

  async findById(id: string) {
    const chat = await ChatModel.findById(id);
    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }
    return chat;
  }

  async findAllByUser(userId: string) {
    return ChatModel.findAllByUserId(userId);
  }

  async getMessages(chatId: string, options?: { limit?: number; offset?: number }) {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    return MessageModel.findByChatId(chatId, options);
  }

  async sendMessage(userId: string, chatId: string, messageText: string) {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    return MessageModel.create({
      chat: { connect: { id: chatId } },
      user: { connect: { id: userId } },
      message: messageText,
      status: 'SENT',
    });
  }

  async markAsRead(chatId: string, userId: string) {
    return MessageModel.markAsRead(chatId, userId);
  }

  async getUnreadCount(chatId: string, userId: string) {
    return MessageModel.getUnreadCount(chatId, userId);
  }

  async delete(chatId: string, userId: string) {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    const publication = await PublicationModel.findById(chat.publicationId);
    if (publication.sellerId !== userId && userId !== chat.messages[0]?.userId) {
      throw new BadRequestException('No tienes permiso para eliminar este chat');
    }

    return ChatModel.delete(chatId);
  }
}