import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req: any, @Query('isRead') isRead?: string) {
    const filters = isRead !== undefined ? { isRead: isRead === 'true' } : undefined;
    const notifications = await this.notificationsService.findByUser(req.user.userId, filters);
    return { notifications };
  }

  @Post(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    const result = await this.notificationsService.markAsRead(id, req.user.userId);
    return { message: 'Notificación marcada como leída' };
  }

  @Post('read-all')
  async markAllAsRead(@Request() req: any) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    const result = await this.notificationsService.delete(id, req.user.userId);
    return result;
  }
}