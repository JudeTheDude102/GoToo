import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_EMBED_URL = 'https://api.openai.com/v1/embeddings';
const EMBED_MODEL      = 'text-embedding-3-small';

interface EmbedInput {
  userId: string;
}

interface CuisinePref {
  cuisine_type: string;
  preference_score: number;
  rank: number;
}

interface DietaryRow {
  restriction_type: string;
  severity: string;
}

interface FavoriteRestaurant {
  cuisine_types: string[] | null;
}

interface FavoriteDish {
  dish_name: string;
  cuisine_type: string | null;
}

interface TasteProfile {
  spice_tolerance: number | null;
  adventurousness: number | null;
  price_sensitivity: number | null;
}

function buildTasteSummary(
  profile: TasteProfile,
  cuisines: CuisinePref[],
  dietary: DietaryRow[],
  favRestaurants: FavoriteRestaurant[],
  favDishes: FavoriteDish[],
): string {
  const parts: string[] = [];

  // Cuisine preferences (weighted 1x)
  if (cuisines.length > 0) {
    const top = cuisines.slice(0, 8).map((c) => c.cuisine_type).join(', ');
    parts.push(`Preferred cuisines: ${top}.`);
  }

  // Taste preferences
  if (profile.spice_tolerance !== null) {
    const spiceDesc = ['', 'very mild', 'mild', 'medium', 'spicy', 'very spicy'][profile.spice_tolerance] ?? 'medium';
    parts.push(`Spice tolerance: ${spiceDesc}.`);
  }
  if (profile.adventurousness !== null) {
    const advDesc = ['', 'very conservative', 'conservative', 'moderate', 'adventurous', 'very adventurous'][profile.adventurousness] ?? 'moderate';
    parts.push(`Adventurousness: ${advDesc}.`);
  }
  if (profile.price_sensitivity !== null) {
    const priceDesc = ['', 'budget', 'moderate', 'upscale', 'fine dining'][profile.price_sensitivity] ?? 'moderate';
    parts.push(`Budget preference: ${priceDesc}.`);
  }

  // Dietary restrictions
  const hard = dietary.filter((d) => d.severity === 'critical').map((d) => d.restriction_type);
  const pref = dietary.filter((d) => d.severity !== 'critical').map((d) => d.restriction_type);
  if (hard.length > 0) parts.push(`Hard dietary constraints: ${hard.join(', ')}.`);
  if (pref.length > 0) parts.push(`Dietary preferences: ${pref.join(', ')}.`);

  // Favorite restaurants — 1.5x weight (repeated)
  const restCuisines = favRestaurants
    .flatMap((r) => r.cuisine_types ?? [])
    .filter(Boolean);
  if (restCuisines.length > 0) {
    const unique = [...new Set(restCuisines)];
    // Repeat for 1.5x weighting
    parts.push(`Enjoys restaurants serving: ${unique.join(', ')}.`);
    parts.push(`Restaurants this person loves serve: ${unique.join(', ')}.`);
  }

  // Favorite dishes — 1.3x weight
  if (favDishes.length > 0) {
    const dishes = favDishes.map((d) =>
      d.cuisine_type ? `${d.dish_name} (${d.cuisine_type})` : d.dish_name,
    );
    parts.push(`Favorite dishes: ${dishes.join(', ')}.`);
    // Extra repeat for 1.3x weighting
    parts.push(`Loved dishes include: ${favDishes.map((d) => d.dish_name).join(', ')}.`);
  }

  return parts.join(' ');
}

function computeProfileStrength(
  cuisines: CuisinePref[],
  favRestaurants: FavoriteRestaurant[],
  favDishes: FavoriteDish[],
): number {
  const base = Math.min(cuisines.length * 5, 50); // up to 50 points from cuisines
  const fromRestaurants = favRestaurants.length * 3;
  const fromDishes      = favDishes.length * 1;
  return Math.min(base + fromRestaurants + fromDishes, 100);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' },
    });
  }

  try {
    const { userId } = (await req.json()) as EmbedInput;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAiKey   = Deno.env.get('OPENAI_API_KEY')!;

    const supabase = createClient(supabaseUrl, serviceKey);

    // Collect all taste data in parallel
    const [profileRes, cuisinesRes, dietaryRes, favRestRes, favDishRes] = await Promise.all([
      supabase.from('taste_profiles').select('spice_tolerance, adventurousness, price_sensitivity').eq('user_id', userId).single(),
      supabase.from('cuisine_preferences').select('cuisine_type, preference_score, rank').eq('user_id', userId).order('rank'),
      supabase.from('user_dietary_restrictions').select('restriction_type, severity').eq('user_id', userId),
      supabase.from('favorite_restaurants').select('restaurants(cuisine_types)').eq('user_id', userId),
      supabase.from('favorite_dishes').select('dish_name, cuisine_type').eq('user_id', userId),
    ]);

    const profile        = (profileRes.data as TasteProfile | null) ?? { spice_tolerance: 3, adventurousness: 3, price_sensitivity: 2 };
    const cuisines       = (cuisinesRes.data as CuisinePref[] | null) ?? [];
    const dietary        = (dietaryRes.data as DietaryRow[] | null) ?? [];
    const favRestaurants = ((favRestRes.data ?? []) as Array<{ restaurants: FavoriteRestaurant | null }>).map((r) => r.restaurants).filter(Boolean) as FavoriteRestaurant[];
    const favDishes      = (favDishRes.data as FavoriteDish[] | null) ?? [];

    const summary = buildTasteSummary(profile, cuisines, dietary, favRestaurants, favDishes);

    if (!summary.trim()) {
      return new Response(JSON.stringify({ message: 'No taste data to embed' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate embedding via OpenAI
    const embedRes = await fetch(OPENAI_EMBED_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({ model: EMBED_MODEL, input: summary }),
    });

    if (!embedRes.ok) {
      const err = await embedRes.text();
      throw new Error(`OpenAI error ${embedRes.status}: ${err}`);
    }

    const embedData = (await embedRes.json()) as { data: Array<{ embedding: number[] }> };
    const embedding = embedData.data[0].embedding;
    const profileStrength = computeProfileStrength(cuisines, favRestaurants, favDishes);

    // Store embedding + profile strength
    const { error } = await supabase
      .from('taste_profiles')
      .update({
        taste_embedding: JSON.stringify(embedding),
        profile_strength: profileStrength,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, profile_strength: profileStrength }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    console.error('[regenerate-taste-embedding]', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
