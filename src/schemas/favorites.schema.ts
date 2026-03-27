import { z } from 'zod';

export const favoriteRestaurantSchema = z.object({
  restaurantId: z.string().uuid(),
  addedFrom: z.enum(['profile', 'onboarding', 'rating', 'detail']),
  notes: z.string().max(200).optional(),
});

export const favoriteDishSchema = z.object({
  dishName: z.string().min(1).max(100),
  cuisineTag: z.string().optional(),
});

export type FavoriteRestaurantInput = z.infer<typeof favoriteRestaurantSchema>;
export type FavoriteDishInput = z.infer<typeof favoriteDishSchema>;
