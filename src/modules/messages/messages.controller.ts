import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageInput } from './dto/create-message.dto';
import { MessageFiltersInput } from './dto/message-filters.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('messages')
@UseGuards(JwtGuard)
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

  @Get('vehicle/:vehicleId')
  async findByVehicleId(
    @Param('vehicleId') vehicleId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('senderId') senderId?: string,
    @Query('receiverId') receiverId?: string,
  ) {
    const filters = from || to || senderId || receiverId
      ? { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined, senderId, receiverId }
      : undefined;

    const messages = await this.messagesService.findByVehicleId(vehicleId, filters);
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