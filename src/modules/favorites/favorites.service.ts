import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FavoriteModel } from '../../models/favorite.model';
import { PublicationModel } from '../../models/publication.model';
import { CreateFavoriteInput } from './dto/create-favorite.dto';
import { FavoriteFiltersInput } from './dto/favorite-filters.dto';

@Injectable()
export class FavoritesService {
  async add(userId: string, input: CreateFavoriteInput) {
    if (!input.publicationId) {
      throw new BadRequestException('Se requiere publicationId');
    }

    const publication = await PublicationModel.findById(input.publicationId);
    if (!publication) throw new NotFoundException('Publicación no encontrada');

    const existing = await FavoriteModel.isFavorite(userId, input.publicationId);
    if (existing) throw new BadRequestException('La publicación ya está en favoritos');

    return FavoriteModel.create({
      user: { connect: { id: userId } },
      publication: { connect: { id: input.publicationId } },
    });
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
        }
      : undefined;

    return FavoriteModel.findByUserId(userId, processedFilters);
  }

  async checkFavorite(userId: string, publicationId: string) {
    const isFavorite = await FavoriteModel.isFavorite(userId, publicationId);
    return { isFavorite };
  }
}