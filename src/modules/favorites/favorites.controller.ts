import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto, FavoriteFiltersDto, CreateFavoriteInput, FavoriteFiltersInput } from './dto/favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  async add(@Request() req: any, @Body() dto: CreateFavoriteInput) {
    const favorite = await this.favoritesService.add(req.user.userId, dto);
    return { message: 'Vehículo agregado a favoritos', favorite };
  }

  @Delete(':vehicleId')
  async remove(@Request() req: any, @Param('vehicleId') vehicleId: string) {
    const result = await this.favoritesService.remove(req.user.userId, vehicleId);
    return result;
  }

  @Get()
  async findAll(@Request() req: any, @Query() query: FavoriteFiltersInput) {
    const favorites = await this.favoritesService.findByUserId(req.user.userId, query);
    return { favorites };
  }

  @Get('check/:vehicleId')
  async checkFavorite(@Request() req: any, @Param('vehicleId') vehicleId: string) {
    const result = await this.favoritesService.checkFavorite(req.user.userId, vehicleId);
    return result;
  }
}