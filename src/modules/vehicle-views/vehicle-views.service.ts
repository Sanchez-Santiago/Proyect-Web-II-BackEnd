import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleViewModel } from '../../models/vehicle-view.model';
import { PublicationModel } from '../../models/publication.model';

@Injectable()
export class VehicleViewsService {
  async create(publicationId: string, userId?: string, ipAddress?: string) {
    const publication = await PublicationModel.findById(publicationId);
    if (!publication) throw new NotFoundException('Publicación no encontrada');

    return VehicleViewModel.create(publicationId, userId || null, ipAddress || null);
  }

  async findByPublication(publicationId: string) {
    return VehicleViewModel.findByPublicationId(publicationId);
  }

  async countByPublication(publicationId: string) {
    return VehicleViewModel.countByPublicationId(publicationId);
  }

  async countByUser(userId: string) {
    return VehicleViewModel.countByUserId(userId);
  }
}