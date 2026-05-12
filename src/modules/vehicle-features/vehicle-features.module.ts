import { Module } from '@nestjs/common';
import { VehicleFeaturesController } from './vehicle-features.controller';
import { VehicleFeaturesService } from './vehicle-features.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VehicleFeaturesController],
  providers: [VehicleFeaturesService],
  exports: [VehicleFeaturesService],
})
export class VehicleFeaturesModule {}