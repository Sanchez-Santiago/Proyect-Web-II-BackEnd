import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FavoriteModel } from '../../model/prisma.model';
import { CreateFavoriteInput, FavoriteFiltersInput } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  async add(userId: string, input: CreateFavoriteInput) {
    const existing = await FavoriteModel.isFavorite(userId, input.publicationId);
    if (existing) throw new BadRequestException('La publicación ya está en favoritos');

    return FavoriteModel.create({ userId, publicationId: input.publicationId });
  }

  async remove(userId: string, publicationId: string) {
    const existing = await FavoriteModel.isFavorite(userId, publicationId);
    if (!existing) throw new NotFoundException('La publicación no está en favoritos');

    await FavoriteModel.delete(userId, publicationId);
    return { message: 'Favorito eliminado correctamente' };
  }

  async findByUserId(userId: string, filters?: FavoriteFiltersInput) {
    const processedFilters = filters
      ? {
          brand: filters.brand,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          from: filters.from ? new Date(filters.from) : undefined,
          to: filters.to ? new Date(filters.to) : undefined,
        }
      : undefined;

    return FavoriteModel.findByUserId(userId, processedFilters);
  }

  async checkFavorite(userId: string, publicationId: string) {
    const isFavorite = await FavoriteModel.isFavorite(userId, publicationId);
    return { isFavorite };
  }
}
