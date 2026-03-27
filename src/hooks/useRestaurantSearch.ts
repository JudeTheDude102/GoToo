import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';

const DEBOUNCE_MS = 400;
const MIN_CHARS   = 2;

export interface SearchRestaurant {
  id: string;
  google_place_id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  google_rating: number | null;
  price_level: number | null;
  cuisine_types: string[];
  photo_url: string | null;
}

interface SearchInput {
  latitude?: number;
  longitude?: number;
  radius_meters?: number;
}

export function useRestaurantSearch(rawQuery: string, options: SearchInput = {}) {
  const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(rawQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  const trimmed = debouncedQuery.trim();
  const enabled = trimmed.length >= MIN_CHARS;

  const query = useQuery<SearchRestaurant[]>({
    queryKey: ['restaurants', 'search', trimmed, options.latitude, options.longitude],
    enabled,
    staleTime: 2 * 60 * 1000, // 2 min — searches are cacheable
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('search-restaurants', {
        body: {
          query: trimmed,
          latitude: options.latitude,
          longitude: options.longitude,
          radius_meters: options.radius_meters,
        },
      });
      if (error) throw error;
      return (data as { restaurants: SearchRestaurant[] }).restaurants ?? [];
    },
  });

  return {
    results: query.data ?? [],
    isLoading: query.isFetching,
    isError: query.isError,
    hasQuery: enabled,
  };
}
