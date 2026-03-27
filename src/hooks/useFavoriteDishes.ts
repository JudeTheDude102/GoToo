import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';

const db = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface FavoriteDish {
  id: string;
  user_id: string;
  dish_name: string;
  cuisine_tag: string | null; // column name is cuisine_tag, not cuisine_type
  created_at: string;
}

export function useFavoriteDishes() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = ['favorites', 'dishes', userId] as const;

  const query = useQuery<FavoriteDish[]>({
    queryKey,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await db
        .from('user_favorite_dishes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({
      dishName,
      cuisineTag,
    }: {
      dishName: string;
      cuisineTag?: string | null;
    }) => {
      const { error } = await db
        .from('user_favorite_dishes')
        .insert({ user_id: userId, dish_name: dishName, cuisine_tag: cuisineTag ?? null });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: async (dishId: string) => {
      const { error } = await db
        .from('user_favorite_dishes')
        .delete()
        .eq('id', dishId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    dishes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    add: addMutation.mutate,
    addAsync: addMutation.mutateAsync,
    remove: removeMutation.mutate,
  };
}
