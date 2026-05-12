import { Injectable, BadRequestException } from '@nestjs/common';
import { UserModel } from '../../../models/user.model';
import { PasswordHistoryModel } from '../../../models/password-history.model';
import { hashPassword, comparePassword } from '../../../common/utils/hash.util';

const PASSWORD_HISTORY_LIMIT = 5;
const MIN_PASSWORD_CHANGE_INTERVAL = 24 * 60 * 60 * 1000;

@Injectable()
export class PasswordService {
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const isValid = comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    const newPasswordHash = hashPassword(newPassword);

    const isReused = await PasswordHistoryModel.isPasswordReused(
      userId,
      newPasswordHash,
      PASSWORD_HISTORY_LIMIT,
    );
    if (isReused) {
      throw new BadRequestException(
        `No puedes usar una de las últimas ${PASSWORD_HISTORY_LIMIT} contraseñas`,
      );
    }

    await PasswordHistoryModel.create({
      passwordHash: user.passwordHash,
      user: { connect: { id: userId } },
    });

    await UserModel.update(userId, { passwordHash: newPasswordHash });

    await PasswordHistoryModel.deleteOldExceptRecent(userId, PASSWORD_HISTORY_LIMIT);
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (!user) return false;
    return comparePassword(password, user.passwordHash);
  }

  async setPassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = hashPassword(newPassword);

    await PasswordHistoryModel.create({
      passwordHash,
      user: { connect: { id: userId } },
    });

    await UserModel.update(userId, { passwordHash });
  }

  async getPasswordHistory(userId: string) {
    return PasswordHistoryModel.findByUserId(userId, PASSWORD_HISTORY_LIMIT);
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = hashPassword(newPassword);

    await PasswordHistoryModel.create({
      passwordHash,
      user: { connect: { id: userId } },
    });

    await UserModel.update(userId, { passwordHash });
  }
}