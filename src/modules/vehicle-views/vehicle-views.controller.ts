import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { VehicleViewsService } from './vehicle-views.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('vehicle-views')
export class VehicleViewsController {
  constructor(private vehicleViewsService: VehicleViewsService) {}

  @Post('publication/:publicationId')
  async trackView(
    @Param('publicationId') publicationId: string,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userId = req.user?.userId;
    const view = await this.create(publicationId, userId, ipAddress);
    return { message: 'Vista registrada', view };
  }

  private async create(publicationId: string, userId?: string, ipAddress?: string) {
    return this.vehicleViewsService.create(publicationId, userId, ipAddress);
  }

  @Get('publication/:publicationId')
  async getViews(@Param('publicationId') publicationId: string) {
    const views = await this.vehicleViewsService.findByPublication(publicationId);
    return { views };
  }

  @Get('publication/:publicationId/count')
  async getCount(@Param('publicationId') publicationId: string) {
    const count = await this.vehicleViewsService.countByPublication(publicationId);
    return { count };
  }

  @Get('my-views')
  @UseGuards(JwtGuard)
  async getMyViewsCount(@Request() req: any) {
    const count = await this.vehicleViewsService.countByUser(req.user.userId);
    return { count };
  }
}