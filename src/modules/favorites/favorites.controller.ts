import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteInput } from './dto/create-favorite.dto';
import { FavoriteFiltersInput } from './dto/favorite-filters.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('favorites')
@UseGuards(JwtGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  async add(@Request() req: any, @Body() dto: CreateFavoriteInput) {
    const favorite = await this.favoritesService.add(req.user.userId, dto);
    return { message: 'Publicación agregada a favoritos', favorite };
  }

  @Delete(':publicationId')
  async remove(@Request() req: any, @Param('publicationId') publicationId: string) {
    const result = await this.favoritesService.remove(req.user.userId, publicationId);
    return result;
  }

  @Get()
  async findAll(@Request() req: any, @Query() query: FavoriteFiltersInput) {
    const favorites = await this.favoritesService.findByUserId(req.user.userId, query);
    return { favorites };
  }

  @Get('check/:publicationId')
  async checkFavorite(@Request() req: any, @Param('publicationId') publicationId: string) {
    const result = await this.favoritesService.checkFavorite(req.user.userId, publicationId);
    return result;
  }
}
