import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationModel } from '../../models/notification.model';

@Injectable()
export class NotificationsService {
  async create(userId: string, data: { type: string; title: string; message: string }) {
    return NotificationModel.create({
      user: { connect: { id: userId } },
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: false,
    });
  }

  async findByUser(userId: string, filters?: { isRead?: boolean }) {
    return NotificationModel.findByUserId(userId, filters);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await NotificationModel.findById(id);
    if (!notification) throw new NotFoundException('Notificación no encontrada');
    if (notification.userId !== userId) throw new NotFoundException('Notificación no autorizada');
    return NotificationModel.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return NotificationModel.markAllAsRead(userId);
  }

  async delete(id: string, userId: string) {
    const notification = await NotificationModel.findById(id);
    if (!notification) throw new NotFoundException('Notificación no encontrada');
    if (notification.userId !== userId) throw new NotFoundException('Notificación no autorizada');
    return NotificationModel.delete(id);
  }
}