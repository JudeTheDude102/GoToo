import { supabase } from './supabase';
import type { DietaryRestriction } from '@/stores/onboardingStore';

export interface CompleteOnboardingParams {
  userId: string;
  cuisineSelections: string[];
  spiceTolerance: number;
  adventurousness: number;
  pricePreference: number;
  dietaryRestrictions: DietaryRestriction[];
}

// supabase.from() typed as `never` until real Database type is wired via createClient<Database>
/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

export const onboardingService = {
  async completeOnboarding(params: CompleteOnboardingParams): Promise<void> {
    const {
      userId,
      cuisineSelections,
      spiceTolerance,
      adventurousness,
      pricePreference,
      dietaryRestrictions,
    } = params;

    // 1. Upsert taste_profiles row (price_preference, not price_sensitivity)
    const { data: tasteRow, error: tasteError } = await db
      .from('taste_profiles')
      .upsert(
        { user_id: userId, spice_tolerance: spiceTolerance, adventurousness, price_preference: pricePreference },
        { onConflict: 'user_id' },
      )
      .select('id')
      .single();

    if (tasteError) throw tasteError;

    const tasteProfileId: string = tasteRow.id;

    // 2. Replace cuisine_preferences (keyed by taste_profile_id, preference_level not score/rank)
    await db.from('cuisine_preferences').delete().eq('taste_profile_id', tasteProfileId);

    if (cuisineSelections.length > 0) {
      const { error: cuisineError } = await db
        .from('cuisine_preferences')
        .insert(
          cuisineSelections.map((cuisine_type: string) => ({
            taste_profile_id: tasteProfileId,
            cuisine_type,
            preference_level: 'love',
          })),
        );
      if (cuisineError) throw cuisineError;
    }

    // 3. Replace user_dietary_restrictions
    //    Schema uses restriction_type_id (UUID FK to dietary_restriction_types.id)
    await db.from('user_dietary_restrictions').delete().eq('user_id', userId);

    if (dietaryRestrictions.length > 0) {
      // Fetch restriction type IDs by name
      const names = dietaryRestrictions.map((r) => r.type);
      const { data: typeRows, error: typeLookupError } = await db
        .from('dietary_restriction_types')
        .select('id, name')
        .in('name', names);

      if (typeLookupError) throw typeLookupError;

      const nameToId = new Map<string, string>(
        (typeRows as Array<{ id: string; name: string }>).map((r) => [r.name, r.id]),
      );

      const rows = dietaryRestrictions
        .filter((r) => nameToId.has(r.type))
        .map((r) => ({
          user_id:             userId,
          restriction_type_id: nameToId.get(r.type)!,
          is_hard_constraint:  r.isHardConstraint,
        }));

      if (rows.length > 0) {
        const { error: dietaryError } = await db
          .from('user_dietary_restrictions')
          .insert(rows);
        if (dietaryError) throw dietaryError;
      }
    }

    // 4. Mark onboarding complete
    const { error: userError } = await db
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (userError) throw userError;

    // 5. Trigger taste embedding generation (non-blocking)
    supabase.functions
      .invoke('regenerate-taste-embedding', { body: { userId } })
      .catch(() => {
        // Best-effort; embedding generated on next request if this fails
      });
  },
};
