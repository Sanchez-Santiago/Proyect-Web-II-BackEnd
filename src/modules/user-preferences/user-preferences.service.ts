import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPreferenceModel } from '../../model/prisma.model';
import { UpdateUserPreferenceInput } from './dto/user-preference.dto';

@Injectable()
export class UserPreferencesService {
  async upsert(userId: string, input: UpdateUserPreferenceInput) {
    return UserPreferenceModel.upsert(userId, input);
  }

  async findByUserId(userId: string) {
    const preference = await UserPreferenceModel.findByUserId(userId);
    if (!preference) throw new NotFoundException('Preferencias no encontradas');
    return preference;
  }

  async delete(userId: string) {
    await UserPreferenceModel.delete(userId);
    return { message: 'Preferencias eliminadas correctamente' };
  }
}