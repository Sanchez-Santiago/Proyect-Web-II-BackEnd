import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageModel } from '../models/message.model';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      this.connectedUsers.set(client.id, payload.userId);
      
      console.log(`Client connected: ${client.id}, User: ${payload.userId}`);
    } catch (error) {
      console.log('Connection auth failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = client.data.user?.userId;
    if (!userId) return;

    client.join(`chat:${data.chatId}`);
    console.log(`User ${userId} joined chat ${data.chatId}`);
    
    return { event: 'joined', data: { chatId: data.chatId } };
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = client.data.user?.userId;
    if (!userId) return;

    client.leave(`chat:${data.chatId}`);
    console.log(`User ${userId} left chat ${data.chatId}`);
    
    return { event: 'left', data: { chatId: data.chatId } };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; message: string },
  ) {
    const userId = client.data.user?.userId;
    if (!userId) return;

    const newMessage = await MessageModel.create({
      chat: { connect: { id: data.chatId } },
      user: { connect: { id: userId } },
      message: data.message,
      status: 'SENT',
    });

    const messageWithUser = {
      ...newMessage,
      user: { id: userId, fullName: client.data.user?.email?.split('@')[0] || 'Usuario' },
    };

    this.server.to(`chat:${data.chatId}`).emit('newMessage', messageWithUser);

    return { event: 'messageSent', data: messageWithUser };
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = client.data.user?.userId;
    if (!userId) return;

    await MessageModel.markAsRead(data.chatId, userId);

    this.server.to(`chat:${data.chatId}`).emit('messagesRead', {
      chatId: data.chatId,
      userId,
    });

    return { event: 'markedAsRead', data: { chatId: data.chatId } };
  }

  async sendMessageToChat(chatId: string, message: any) {
    this.server.to(`chat:${chatId}`).emit('newMessage', message);
  }

  async notifyNewMessage(chatId: string, message: any) {
    this.server.to(`chat:${chatId}`).emit('newMessage', message);
  }
}