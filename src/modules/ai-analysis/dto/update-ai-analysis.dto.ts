import { z } from 'zod';

export const UpdateAiAnalysisDto = z.object({
  vehicleId: z.string().uuid().optional(),
  condition: z.string().min(1).optional(),
  estimatedPrice: z.number().positive().optional(),
  damageReport: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export type UpdateAiAnalysisInput = z.infer<typeof UpdateAiAnalysisDto>;