import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';
import { showToast } from '@/components/ui/ToastProvider';

const db = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = ['profile', userId] as const;

  const query = useQuery<UserProfile | null>({
    queryKey,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data ?? null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { display_name?: string; avatar_url?: string }) => {
      const { error } = await db
        .from('users')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast.success('Profile updated.');
    },
    onError: () => {
      showToast.error("Couldn't update profile. Try again.");
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateProfile,
  };
}
