import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('vehicle/:vehicleId')
  async findByVehicle(@Param('vehicleId') vehicleId: string) {
    const documents = await this.documentsService.findByVehicle(vehicleId);
    return { documents };
  }

  @Post('vehicle/:vehicleId')
  @UseGuards(JwtGuard)
  async create(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    const document = await this.documentsService.create(req.user.userId, vehicleId, dto);
    return { message: 'Documento subido', document };
  }

  @Post(':id/verify')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async verify(@Param('id') id: string) {
    const result = await this.documentsService.verify(id, '');
    return { message: 'Documento verificado' };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Request() req: any, @Param('id') id: string) {
    const result = await this.documentsService.delete(id, req.user.userId);
    return result;
  }
}