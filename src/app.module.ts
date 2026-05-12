import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { ChatModule } from './modules/chat/chat.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { AiAnalysisModule } from './modules/ai-analysis/ai-analysis.module';
import { UploadModule } from './modules/upload/upload.module';
import { HomeModule } from './modules/home/home.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { VehicleFeaturesModule } from './modules/vehicle-features/vehicle-features.module';
import { VehicleViewsModule } from './modules/vehicle-views/vehicle-views.module';
import { SavedSearchesModule } from './modules/saved-searches/saved-searches.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    HomeModule,
    AuthModule,
    VehiclesModule,
    PublicationsModule,
    ChatModule,
    FavoritesModule,
    UserPreferencesModule,
    AiAnalysisModule,
    UploadModule,
    NotificationsModule,
    ReportsModule,
    VehicleFeaturesModule,
    VehicleViewsModule,
    SavedSearchesModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}