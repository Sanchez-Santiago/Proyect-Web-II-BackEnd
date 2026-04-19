import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FavoriteModel, VehicleModel } from '../../model/prisma.model';
import { CreateFavoriteInput } from './dto/create-favorite.dto';
import { FavoriteFiltersInput } from './dto/favorite-filters.dto';

@Injectable()
export class FavoritesService {
  async add(userId: string, input: CreateFavoriteInput) {
    const vehicle = await VehicleModel.findById(input.vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    const existing = await FavoriteModel.isFavorite(userId, input.vehicleId);
    if (existing) throw new BadRequestException('El vehículo ya está en favoritos');

    return FavoriteModel.create({ userId, vehicleId: input.vehicleId });
  }

  async remove(userId: string, vehicleId: string) {
    const existing = await FavoriteModel.isFavorite(userId, vehicleId);
    if (!existing) throw new NotFoundException('El vehículo no está en favoritos');

    await FavoriteModel.delete(userId, vehicleId);
    return { message: 'Favorito eliminado correctamente' };
  }

  async findByUserId(userId: string, filters?: FavoriteFiltersInput) {
    const processedFilters = filters
      ? {
          brand: filters.brand,
          vehicleType: filters.vehicleType,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          from: filters.from ? new Date(filters.from) : undefined,
          to: filters.to ? new Date(filters.to) : undefined,
        }
      : undefined;

    return FavoriteModel.findByUserId(userId, processedFilters);
  }

  async checkFavorite(userId: string, vehicleId: string) {
    const isFavorite = await FavoriteModel.isFavorite(userId, vehicleId);
    return { isFavorite };
  }
}