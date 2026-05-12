import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PublicationModel } from '../../models/publication.model';
import { VehicleModel } from '../../models/vehicle.model';
import { PriceHistoryModel } from '../../models/price-history.model';
import { PublicationStatusHistoryModel } from '../../models/publication-status-history.model';
import { CreatePublicationInput } from './dto/create-publication.dto';
import { UpdatePublicationInput } from './dto/update-publication.dto';
import { PublicationFiltersInput } from './dto/publication-filters.dto';

@Injectable()
export class PublicationsService {
  async create(sellerId: string, input: CreatePublicationInput) {
    const vehicle = await VehicleModel.findById(input.vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    if (vehicle.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de este vehículo');
    }

    const existingPublication = await PublicationModel.findByVehicleId(input.vehicleId);
    if (existingPublication) {
      throw new ForbiddenException('Ya existe una publicación para este vehículo');
    }

    const publication = await PublicationModel.create({
      title: input.title || `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
      description: input.description,
      price: input.price,
      currency: input.currency || 'USD',
      province: input.province,
      city: input.city,
      latitude: input.latitude,
      longitude: input.longitude,
      status: 'ACTIVE',
      vehicle: { connect: { id: input.vehicleId } },
      seller: { connect: { id: sellerId } },
    });

    await PriceHistoryModel.create(publication.id, Number(input.price), input.currency || 'USD');

    return this.findById(publication.id);
  }

  async findById(id: string) {
    const publication = await PublicationModel.findById(id);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }
    return publication;
  }

  async findAll(filters: PublicationFiltersInput = {}) {
    return PublicationModel.findAll(filters);
  }

  async update(id: string, sellerId: string, input: UpdatePublicationInput) {
    const publication = await PublicationModel.findById(id);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de esta publicación');
    }

    const updateData: any = { ...input };

    if (input.price && Number(input.price) !== Number(publication.price)) {
      await PriceHistoryModel.create(
        id,
        Number(input.price),
        input.currency || publication.currency,
      );
    }

    if (input.status && input.status !== publication.status) {
      await PublicationStatusHistoryModel.create(
        id,
        publication.status,
        input.status,
      );
    }

    return PublicationModel.update(id, updateData);
  }

  async updateStatus(id: string, sellerId: string, status: string) {
    const publication = await PublicationModel.findById(id);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de esta publicación');
    }

    await PublicationStatusHistoryModel.create(
      id,
      publication.status,
      status as any,
    );

    return PublicationModel.updateStatus(id, status as any);
  }

  async delete(id: string, sellerId: string) {
    const publication = await PublicationModel.findById(id);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de esta publicación');
    }

    return PublicationModel.delete(id);
  }

  async getByVehicleId(vehicleId: string) {
    return PublicationModel.findByVehicleId(vehicleId);
  }

  async addFeature(publicationId: string, featureId: string, sellerId: string) {
    const publication = await PublicationModel.findById(publicationId);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de esta publicación');
    }

    return PublicationModel.addFeature(publicationId, featureId);
  }

  async removeFeature(publicationId: string, featureId: string, sellerId: string) {
    const publication = await PublicationModel.findById(publicationId);
    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publication.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de esta publicación');
    }

    return PublicationModel.removeFeature(publicationId, featureId);
  }

  async getFeatures(publicationId: string) {
    return PublicationModel.getFeatures(publicationId);
  }
}