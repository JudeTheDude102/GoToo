import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PLACES_API_BASE = 'https://places.googleapis.com/v1/places:searchText';

// Essentials field mask — name, address, location, rating, price_level, photos, types
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.priceLevel',
  'places.photos',
  'places.types',
].join(',');

interface SearchInput {
  query: string;
  latitude?: number;
  longitude?: number;
  radius_meters?: number;
}

interface PlacesPhoto {
  name: string;
}

interface PlacesResult {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  priceLevel?: string;
  photos?: PlacesPhoto[];
  types?: string[];
}

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

function getPhotoUrl(photo: PlacesPhoto, apiKey: string): string {
  return `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
}

function mapCuisineTypes(types: string[]): string[] {
  const FOOD_TYPES = [
    'italian_restaurant', 'japanese_restaurant', 'mexican_restaurant', 'chinese_restaurant',
    'indian_restaurant', 'thai_restaurant', 'american_restaurant', 'french_restaurant',
    'mediterranean_restaurant', 'korean_restaurant', 'vietnamese_restaurant', 'greek_restaurant',
    'spanish_restaurant', 'middle_eastern_restaurant', 'brazilian_restaurant', 'seafood_restaurant',
    'pizza_restaurant', 'sushi_restaurant', 'vegetarian_restaurant', 'vegan_restaurant',
    'fast_food_restaurant', 'cafe', 'bar', 'bakery',
  ];
  return types
    .filter((t) => FOOD_TYPES.includes(t))
    .map((t) => t.replace('_restaurant', ''));
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' },
    });
  }

  try {
    const { query, latitude, longitude, radius_meters } = (await req.json()) as SearchInput;

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ error: 'query must be at least 2 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;
    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!;
    const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Build Places API request body
    const placesBody: Record<string, unknown> = { textQuery: query };
    if (latitude !== undefined && longitude !== undefined) {
      placesBody.locationBias = {
        circle: {
          center: { latitude, longitude },
          radius: radius_meters ?? 5000,
        },
      };
    }

    const placesRes = await fetch(PLACES_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleApiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify(placesBody),
    });

    if (!placesRes.ok) {
      const err = await placesRes.text();
      throw new Error(`Places API error ${placesRes.status}: ${err}`);
    }

    const placesData = (await placesRes.json()) as { places?: PlacesResult[] };
    const places = placesData.places ?? [];

    // Map to our schema
    const restaurants = places.map((place) => ({
      google_place_id: place.id,
      name: place.displayName?.text ?? '',
      address: place.formattedAddress ?? '',
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null,
      google_rating: place.rating ?? null,
      price_level: place.priceLevel ? (PRICE_LEVEL_MAP[place.priceLevel] ?? null) : null,
      cuisine_types: place.types ? mapCuisineTypes(place.types) : [],
      photo_url: place.photos?.[0] ? getPhotoUrl(place.photos[0], googleApiKey) : null,
    }));

    // Upsert into restaurants cache table (bypasses RLS with service role)
    const supabase = createClient(supabaseUrl, serviceKey);
    if (restaurants.length > 0) {
      await supabase
        .from('restaurants')
        .upsert(restaurants, { onConflict: 'google_place_id', ignoreDuplicates: false });
    }

    // Fetch back with DB-assigned IDs
    const placeIds = restaurants.map((r) => r.google_place_id);
    const { data: rows } = await supabase
      .from('restaurants')
      .select('id, google_place_id, name, address, latitude, longitude, google_rating, price_level, cuisine_types, photo_url')
      .in('google_place_id', placeIds);

    return new Response(JSON.stringify({ restaurants: rows ?? [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    console.error('[search-restaurants]', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
