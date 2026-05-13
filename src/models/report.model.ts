import { prisma } from './prisma';
import { Prisma, ReportStatus } from '@prisma/client';

export const ReportModel = {
  async create(data: Prisma.ReportCreateInput) {
    return prisma.report.create({
      data,
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
    });
  },

  async findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
    });
  },

  async findAll(filters?: { status?: ReportStatus; userId?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.userId) where.userId = filters.userId;

    return prisma.report.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, email: true } }, publication: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateStatus(id: string, status: ReportStatus) {
    return prisma.report.update({
      where: { id },
      data: { status },
    });
  },

  async delete(id: string) {
    return prisma.report.delete({ where: { id } });
  },
};