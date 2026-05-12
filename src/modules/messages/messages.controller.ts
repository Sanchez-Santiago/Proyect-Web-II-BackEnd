import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, MessageFiltersDto, CreateMessageInput, MessageFiltersInput } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateMessageInput) {
    const message = await this.messagesService.create(req.user.userId, dto);
    return { message: 'Mensaje enviado exitosamente', data: message };
  }

  @Get('conversations')
  async getConversations(@Request() req: any) {
    const conversations = await this.messagesService.getConversations(req.user.userId);
    return { conversations };
  }

  @Get('chat/:chatId')
  async findByChatId(
    @Param('chatId') chatId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
  ) {
    const filters = from || to || userId
      ? { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined, userId }
      : undefined;

    const messages = await this.messagesService.findByChatId(chatId, filters);
    return { messages };
  }

  @Get('filters')
  async findAll(@Query() query: MessageFiltersInput) {
    const messages = await this.messagesService.findAll(query);
    return { messages };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const message = await this.messagesService.findById(id);
    return { message };
  }
}
