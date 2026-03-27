import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';
import { showToast } from '@/components/ui/ToastProvider';

const db = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface TasteProfile {
  id: string;
  user_id: string;
  spice_tolerance: number;
  adventurousness: number;
  price_preference: number; // column is price_preference, not price_sensitivity
  profile_strength: number;
  taste_embedding: number[] | null;
  updated_at: string;
}

export interface CuisinePreference {
  id: string;
  taste_profile_id: string; // FK to taste_profiles.id
  cuisine_type: string;
  preference_level: 'love' | 'like' | 'neutral' | 'dislike';
}

export interface DietaryRestrictionRow {
  id: string;
  user_id: string;
  restriction_type_id: string; // UUID FK to dietary_restriction_types.id
  is_hard_constraint: boolean;
  notes: string | null;
  dietary_restriction_types?: {
    name: string;
    display_name: string;
    severity: string;
  } | null;
}

export interface TasteProfileData {
  profile: TasteProfile | null;
  cuisines: CuisinePreference[];
  dietary: DietaryRestrictionRow[];
}

export function useTasteProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = ['taste-profile', userId] as const;

  const query = useQuery<TasteProfileData>({
    queryKey,
    enabled: !!userId,
    queryFn: async () => {
      // Fetch profile first to get taste_profile_id for cuisine join
      const profileRes = await db
        .from('taste_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const profile = profileRes.data ?? null;
      const tasteProfileId: string | null = profile?.id ?? null;

      const [cuisinesRes, dietaryRes] = await Promise.all([
        tasteProfileId
          ? db.from('cuisine_preferences')
              .select('*')
              .eq('taste_profile_id', tasteProfileId)
          : Promise.resolve({ data: [], error: null }),
        db.from('user_dietary_restrictions')
          .select('*, dietary_restriction_types(name, display_name, severity)')
          .eq('user_id', userId),
      ]);

      return {
        profile,
        cuisines: cuisinesRes.data ?? [],
        dietary: dietaryRes.data ?? [],
      };
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Pick<TasteProfile, 'spice_tolerance' | 'adventurousness' | 'price_preference'>>) => {
      const { error } = await db
        .from('taste_profiles')
        .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast.success('Taste profile updated.');
    },
    onError: () => showToast.error("Couldn't save changes. Try again."),
  });

  const updateCuisines = useMutation({
    mutationFn: async (cuisines: string[]) => {
      const profileId: string | null = query.data?.profile?.id ?? null;
      if (!profileId) throw new Error('No taste profile found');

      await db.from('cuisine_preferences').delete().eq('taste_profile_id', profileId);
      if (cuisines.length > 0) {
        const { error } = await db.from('cuisine_preferences').insert(
          cuisines.map((cuisine_type) => ({
            taste_profile_id: profileId,
            cuisine_type,
            preference_level: 'love' as const,
          })),
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast.success('Cuisines updated.');
    },
    onError: () => showToast.error("Couldn't update cuisines. Try again."),
  });

  const updateDietary = useMutation({
    mutationFn: async (restrictions: Array<{ typeId: string; isHardConstraint: boolean }>) => {
      await db.from('user_dietary_restrictions').delete().eq('user_id', userId);
      if (restrictions.length > 0) {
        const { error } = await db.from('user_dietary_restrictions').insert(
          restrictions.map((r) => ({
            user_id: userId,
            restriction_type_id: r.typeId,
            is_hard_constraint: r.isHardConstraint,
          })),
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast.success('Dietary preferences updated.');
    },
    onError: () => showToast.error("Couldn't update dietary preferences. Try again."),
  });

  return {
    profile: query.data?.profile ?? null,
    cuisines: query.data?.cuisines ?? [],
    dietary: query.data?.dietary ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateProfile,
    updateCuisines,
    updateDietary,
  };
}
