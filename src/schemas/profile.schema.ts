import { z } from 'zod';

export const cuisinePreferencesSchema = z.object({
  cuisines: z.array(z.string()).min(3, 'Select at least 3 cuisines'),
});

export const tastePreferencesSchema = z.object({
  spiceTolerance: z.number().min(1).max(5),
  adventurousness: z.number().min(1).max(5),
  pricePreference: z.number().min(1).max(4),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50),
  avatarUrl: z.string().url().optional(),
});

export type CuisinePreferencesInput = z.infer<typeof cuisinePreferencesSchema>;
export type TastePreferencesInput = z.infer<typeof tastePreferencesSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
