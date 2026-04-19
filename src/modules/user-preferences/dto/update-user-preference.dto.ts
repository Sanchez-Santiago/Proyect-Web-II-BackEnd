import { z } from 'zod';

export const UpdateUserPreferenceDto = z.object({
  yearRange: z.array(z.number().int()).optional(),
  mileageRange: z.array(z.number().int()).optional(),
  colorRange: z.array(z.string()).optional(),
  interiorRange: z.array(z.number().int()).optional(),
  paintRange: z.array(z.number().int()).optional(),
  rimsRange: z.array(z.number().int()).optional(),
  dashboardRange: z.array(z.number().int()).optional(),
  tiresRange: z.array(z.number().int()).optional(),
  fuelTypes: z.array(z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER'])).optional(),
  vehicleTypes: z.array(z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN', 'WAGON', 'CONVERTIBLE', 'SPORTS', 'ELECTRIC', 'OTHER'])).optional(),
  brands: z.array(z.string()).optional(),
  models: z.array(z.string()).optional(),
});

export type UpdateUserPreferenceInput = z.infer<typeof UpdateUserPreferenceDto>;