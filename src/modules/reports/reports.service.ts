import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportModel } from '../../models/report.model';
import { PublicationModel } from '../../models/publication.model';

@Injectable()
export class ReportsService {
  async create(userId: string, data: { publicationId: string; reason: string; description?: string }) {
    const publication = await PublicationModel.findById(data.publicationId);
    if (!publication) throw new NotFoundException('Publicación no encontrada');

    return ReportModel.create({
      user: { connect: { id: userId } },
      publication: { connect: { id: data.publicationId } },
      reason: data.reason,
      description: data.description,
      status: 'PENDING',
    });
  }

  async findAll(filters?: { status?: string }) {
    return ReportModel.findAll(filters ? { status: filters.status as any } : undefined);
  }

  async findById(id: string) {
    const report = await ReportModel.findById(id);
    if (!report) throw new NotFoundException('Reporte no encontrado');
    return report;
  }

  async updateStatus(id: string, status: string) {
    return ReportModel.updateStatus(id, status as any);
  }

  async delete(id: string) {
    return ReportModel.delete(id);
  }
}