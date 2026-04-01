import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { MessagesModule } from './modules/messages/messages.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { AiAnalysisModule } from './modules/ai-analysis/ai-analysis.module';

@Module({
  imports: [
    AuthModule,
    VehiclesModule,
    MessagesModule,
    FavoritesModule,
    UserPreferencesModule,
    AiAnalysisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}