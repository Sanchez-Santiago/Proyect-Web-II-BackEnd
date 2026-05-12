import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UpdateReportStatusDto } from './dto/update-report.dto';

@Controller('reports')
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { publicationId: string; reason: string; description?: string }) {
    const report = await this.reportsService.create(req.user.userId, body);
    return { message: 'Reporte enviado', report };
  }

  @Get()
  async findAll(@Query('status') status?: string) {
    const reports = await this.reportsService.findAll(status ? { status } : undefined);
    return { reports };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const report = await this.reportsService.findById(id);
    return { report };
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    const report = await this.reportsService.updateStatus(id, dto.status);
    return { message: 'Estado actualizado', report };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    const result = await this.reportsService.delete(id);
    return result;
  }
}