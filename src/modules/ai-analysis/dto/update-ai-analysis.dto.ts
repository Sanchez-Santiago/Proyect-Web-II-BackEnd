import { z } from 'zod';

export const UpdateAiAnalysisDto = z.object({
  paintCondition: z.number().int().min(1).max(10).optional(),
  engineCondition: z.number().int().min(1).max(10).optional(),
  interiorCondition: z.number().int().min(1).max(10).optional(),
  tiresCondition: z.number().int().min(1).max(10).optional(),
  rimsCondition: z.number().int().min(1).max(10).optional(),
  suspensionCondition: z.number().int().min(1).max(10).optional(),
  transmissionCondition: z.number().int().min(1).max(10).optional(),
  lightsCondition: z.number().int().min(1).max(10).optional(),
  overallScore: z.number().min(0).max(10).optional(),
  estimatedPrice: z.number().positive().optional(),
  damageReport: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export type UpdateAiAnalysisInput = z.infer<typeof UpdateAiAnalysisDto>;