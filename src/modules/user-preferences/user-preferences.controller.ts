import { Controller, Get, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UpdateUserPreferenceInput } from './dto/update-user-preference.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('user-preferences')
@UseGuards(JwtGuard)
export class UserPreferencesController {
  constructor(private preferencesService: UserPreferencesService) {}

  @Get()
  async get(@Request() req: any) {
    const preference = await this.preferencesService.findByUserId(req.user.userId);
    return { preference };
  }

  @Put()
  async update(@Request() req: any, @Body() dto: UpdateUserPreferenceInput) {
    const preference = await this.preferencesService.upsert(req.user.userId, dto);
    return { message: 'Preferencias actualizadas', preference };
  }

  @Delete()
  async delete(@Request() req: any) {
    const result = await this.preferencesService.delete(req.user.userId);
    return result;
  }
}