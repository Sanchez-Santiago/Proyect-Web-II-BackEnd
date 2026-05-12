import { Module } from '@nestjs/common';
import { VehicleViewsController } from './vehicle-views.controller';
import { VehicleViewsService } from './vehicle-views.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VehicleViewsController],
  providers: [VehicleViewsService],
  exports: [VehicleViewsService],
})
export class VehicleViewsModule {}