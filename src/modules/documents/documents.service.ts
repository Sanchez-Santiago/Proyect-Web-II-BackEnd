import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VehicleDocumentModel } from '../../models/vehicle-document.model';
import { VehicleModel } from '../../models/vehicle.model';

@Injectable()
export class DocumentsService {
  async create(
    sellerId: string,
    vehicleId: string,
    data: { documentType: string; documentUrl: string },
  ) {
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    if (vehicle.sellerId !== sellerId) throw new ForbiddenException('No eres el propietario');

    return VehicleDocumentModel.create({
      vehicle: { connect: { id: vehicleId } },
      documentType: data.documentType as any,
      documentUrl: data.documentUrl,
      verified: false,
    });
  }

  async findByVehicle(vehicleId: string) {
    return VehicleDocumentModel.findByVehicleId(vehicleId);
  }

  async verify(id: string, adminId: string) {
    return VehicleDocumentModel.verify(id);
  }

  async delete(id: string, sellerId: string) {
    const document = await VehicleDocumentModel.findById(id);
    if (!document) throw new NotFoundException('Documento no encontrado');

    const vehicle = await VehicleModel.findById(document.vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    if (vehicle.sellerId !== sellerId) throw new ForbiddenException('No autorizado');

    return VehicleDocumentModel.delete(id);
  }
}