import { z } from 'zod';

export const CreateAiAnalysisDto = z.object({
  type: z.enum(['VEHICULO', 'PUBLICACION', 'PRECIO', 'RIESGO', 'FOTO', 'RESPUESTA']).optional().default('VEHICULO'),
  vehicleId: z.string().uuid(),
  publicationId: z.string().uuid().optional(),
  requestedById: z.string().uuid().optional(),
  fairPrice: z.number().positive().optional(),
  estimatedPrice: z.number().positive().optional(),
  depreciationEstimate: z.number().optional(),
  marketDeltaPercent: z.number().optional(),
  riskScore: z.number().min(0).max(100).optional(),
  opportunityScore: z.number().min(0).max(100).optional(),
  confidence: z.number().min(0).max(100).optional(),
  summary: z.string().optional(),
  damageReport: z.string().optional(),
  suggestions: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAiAnalysisDto = CreateAiAnalysisDto.partial();

export type CreateAiAnalysisInput = z.infer<typeof CreateAiAnalysisDto>;
export type UpdateAiAnalysisInput = z.infer<typeof UpdateAiAnalysisDto>;
