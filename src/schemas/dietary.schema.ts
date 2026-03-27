import { z } from 'zod';

export const dietaryRestrictionSchema = z.object({
  restrictionType: z.string(),
  severity: z.enum(['critical', 'important', 'preference']),
  isHardConstraint: z.boolean(),
});

export type DietaryRestrictionInput = z.infer<typeof dietaryRestrictionSchema>;
