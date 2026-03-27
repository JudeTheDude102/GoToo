import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';

const db = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface FavoriteRestaurant {
  id: string;
  user_id: string;
  restaurant_id: string;
  notes: string | null;
  added_from: string;
  created_at: string;
  restaurants: {
    id: string;
    name: string;
    address: string | null;
    google_rating: number | null;
    price_level: number | null;
    cuisine_types: string[];
    photo_references: string | null; // first photo URL extracted by Edge Function, or null
  } | null;
}

export function useFavoriteRestaurants() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = ['favorites', 'restaurants', userId] as const;

  const query = useQuery<FavoriteRestaurant[]>({
    queryKey,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await db
        .from('user_favorite_restaurants')
        .select('*, restaurants(id, name, address, google_rating, price_level, cuisine_types, photo_references)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({
      restaurantId,
      addedFrom = 'profile',
    }: {
      restaurantId: string;
      addedFrom?: 'profile' | 'onboarding' | 'rating' | 'detail';
    }) => {
      const { error } = await db
        .from('user_favorite_restaurants')
        .insert({ user_id: userId, restaurant_id: restaurantId, added_from: addedFrom });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await db
        .from('user_favorite_restaurants')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ favoriteId, notes }: { favoriteId: string; notes: string }) => {
      const { error } = await db
        .from('user_favorite_restaurants')
        .update({ notes })
        .eq('id', favoriteId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    add: addMutation.mutate,
    addAsync: addMutation.mutateAsync,
    remove: removeMutation.mutate,
    updateNotes: updateNotesMutation.mutate,
  };
}
