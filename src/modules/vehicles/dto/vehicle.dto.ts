import { z } from 'zod';

export const CreateVehicleDto = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  version: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'OTHER']).optional(),
  color: z.string().optional(),
  doors: z.number().int().min(1).max(6).optional(),
  engine: z.string().optional(),
  kilometers: z.number().int().min(0).optional(),
  accidents: z.string().optional(),
  ownerCount: z.number().int().min(0).optional(),
  hasDebtOrTaxes: z.boolean().optional(),
  debtOrTaxesNote: z.string().optional(),
  analyticState: z.object({
    paintCondition: z.number().int().min(1).max(10).optional(),
    engineCondition: z.number().int().min(1).max(10).optional(),
    interiorCondition: z.number().int().min(1).max(10).optional(),
    tiresCondition: z.number().int().min(1).max(10).optional(),
    rimsCondition: z.number().int().min(1).max(10).optional(),
    suspensionCondition: z.number().int().min(1).max(10).optional(),
    transmissionCondition: z.number().int().min(1).max(10).optional(),
    lightsCondition: z.number().int().min(1).max(10).optional(),
  }).optional(),
  images: z.array(z.object({ url: z.string(), name: z.string().optional() })).optional(),
});

export const CreatePublicationDto = z.object({
  vehicleId: z.string().uuid(),
  description: z.string().optional(),
  price: z.number().positive(),
  city: z.string().min(1),
  province: z.string().min(1),
  status: z.enum(['A_LA_VENTA', 'VENDIDO', 'BLOQUEADO', 'FRAUDE', 'SUSPENDIDO']).optional(),
  currency: z.enum(['ARS', 'USD']).optional(),
});

export const UpdateVehicleDto = CreateVehicleDto.partial();

export const VehicleFiltersDto = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  yearMin: z.number().int().optional(),
  yearMax: z.number().int().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  accidents: z.string().optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'OTHER']).optional(),
  kilometersMin: z.number().int().min(0).optional(),
  kilometersMax: z.number().int().min(0).optional(),
  interiorConditionMin: z.number().int().min(1).max(10).optional(),
  paintConditionMin: z.number().int().min(1).max(10).optional(),
  sellerId: z.string().uuid().optional(),
});

export type CreateVehicleInput = z.infer<typeof CreateVehicleDto>;
export type CreatePublicationInput = z.infer<typeof CreatePublicationDto>;
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDto>;
export type VehicleFiltersInput = z.infer<typeof VehicleFiltersDto>;
