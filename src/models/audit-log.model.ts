import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const AuditLogModel = {
  async create(data: Prisma.AuditLogCreateInput) {
    return prisma.auditLog.create({ data });
  },

  async findById(id: string) {
    return prisma.auditLog.findUnique({ where: { id } });
  },

  async findAll(filters?: { userId?: string; tableName?: string; action?: string }) {
    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.tableName) where.tableName = filters.tableName;
    if (filters?.action) where.action = filters.action;

    return prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  },

  async delete(id: string) {
    return prisma.auditLog.delete({ where: { id } });
  },
};