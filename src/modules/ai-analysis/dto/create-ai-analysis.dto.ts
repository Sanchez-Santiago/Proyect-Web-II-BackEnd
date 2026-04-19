import { z } from 'zod';

export const CreateAiAnalysisDto = z.object({
  vehicleId: z.string().uuid(),
  condition: z.string().min(1),
  estimatedPrice: z.number().positive().optional(),
  damageReport: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export type CreateAiAnalysisInput = z.infer<typeof CreateAiAnalysisDto>;