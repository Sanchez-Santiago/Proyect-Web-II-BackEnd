import { z } from 'zod';

export const UpdateUserPreferenceDto = z.object({
  minimumBudget: z.number().positive().optional(),
  maximumBudget: z.number().positive().optional(),
  preferredBrand: z.string().optional(),
  preferredModel: z.string().optional(),
  minimumYear: z.number().int().min(1900).optional(),
  maximumYear: z.number().int().min(1900).optional(),
});

export type UpdateUserPreferenceInput = z.infer<typeof UpdateUserPreferenceDto>;