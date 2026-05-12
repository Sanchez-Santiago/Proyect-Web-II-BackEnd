import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('chats')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { publicationId: string }) {
    const chat = await this.chatService.create(req.user.userId, body.publicationId);
    return { message: 'Chat creado', chat };
  }

  @Get()
  async findAll(@Request() req: any) {
    const chats = await this.chatService.findAllByUser(req.user.userId);
    return { chats };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const chat = await this.chatService.findById(id);
    return { chat };
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const messages = await this.chatService.getMessages(id, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
    return { messages };
  }

  @Post(':id/messages')
  async sendMessage(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    const message = await this.chatService.sendMessage(req.user.userId, id, body.message);
    return { message: 'Mensaje enviado', data: message };
  }

  @Post(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    await this.chatService.markAsRead(id, req.user.userId);
    return { message: 'Mensajes marcados como leídos' };
  }

  @Get(':id/unread')
  async getUnreadCount(@Request() req: any, @Param('id') id: string) {
    const count = await this.chatService.getUnreadCount(id, req.user.userId);
    return { count };
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    const result = await this.chatService.delete(id, req.user.userId);
    return result;
  }
}