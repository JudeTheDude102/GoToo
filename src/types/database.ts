// Generated from supabase/migrations/001_initial_schema.sql
// Regenerate after pushing migrations:
//   npx supabase login
//   npx supabase link --project-id hkmxhbokaweiyslkykgq
//   npx supabase gen types typescript --linked > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id:                   string;
          email:                string;
          display_name:         string;
          avatar_url:           string | null;
          onboarding_completed: boolean;
          created_at:           string;
          updated_at:           string;
        };
        Insert: {
          id?:                   string;
          email:                 string;
          display_name:          string;
          avatar_url?:           string | null;
          onboarding_completed?: boolean;
          created_at?:           string;
          updated_at?:           string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };

      taste_profiles: {
        Row: {
          id:                    string;
          user_id:               string;
          spice_tolerance:       number;
          adventurousness:       number;
          price_preference:      number;
          ambiance_preference:   'casual' | 'moderate' | 'upscale' | 'no_preference';
          noise_preference:      'quiet' | 'moderate' | 'lively' | 'no_preference';
          taste_embedding:       number[] | null;
          profile_strength:      number;
          last_embedding_update: string | null;
          created_at:            string;
          updated_at:            string;
        };
        Insert: {
          id?:                    string;
          user_id:                string;
          spice_tolerance?:       number;
          adventurousness?:       number;
          price_preference?:      number;
          ambiance_preference?:   'casual' | 'moderate' | 'upscale' | 'no_preference';
          noise_preference?:      'quiet' | 'moderate' | 'lively' | 'no_preference';
          taste_embedding?:       number[] | null;
          profile_strength?:      number;
          last_embedding_update?: string | null;
          created_at?:            string;
          updated_at?:            string;
        };
        Update: Partial<Database['public']['Tables']['taste_profiles']['Insert']>;
      };

      cuisine_preferences: {
        Row: {
          id:               string;
          taste_profile_id: string;
          cuisine_type:     string;
          preference_level: 'love' | 'like' | 'neutral' | 'dislike';
        };
        Insert: {
          id?:              string;
          taste_profile_id: string;
          cuisine_type:     string;
          preference_level: 'love' | 'like' | 'neutral' | 'dislike';
        };
        Update: Partial<Database['public']['Tables']['cuisine_preferences']['Insert']>;
      };

      dietary_restriction_types: {
        Row: {
          id:           string;
          name:         string;
          display_name: string;
          category:     'allergy' | 'intolerance' | 'diet' | 'religious';
          severity:     'critical' | 'important' | 'preference';
          icon_name:    string | null;
        };
        Insert: {
          id?:          string;
          name:         string;
          display_name: string;
          category:     'allergy' | 'intolerance' | 'diet' | 'religious';
          severity:     'critical' | 'important' | 'preference';
          icon_name?:   string | null;
        };
        Update: Partial<Database['public']['Tables']['dietary_restriction_types']['Insert']>;
      };

      user_dietary_restrictions: {
        Row: {
          id:                  string;
          user_id:             string;
          restriction_type_id: string;
          is_hard_constraint:  boolean;
          notes:               string | null;
        };
        Insert: {
          id?:                 string;
          user_id:             string;
          restriction_type_id: string;
          is_hard_constraint?: boolean;
          notes?:              string | null;
        };
        Update: Partial<Database['public']['Tables']['user_dietary_restrictions']['Insert']>;
      };

      restaurants: {
        Row: {
          id:                    string;
          google_place_id:       string;
          name:                  string;
          address:               string | null;
          latitude:              number | null;
          longitude:             number | null;
          google_rating:         number | null;
          google_review_count:   number | null;
          price_level:           number | null;
          phone_number:          string | null;
          website_url:           string | null;
          google_maps_url:       string | null;
          photo_references:      Json;
          opening_hours:         Json | null;
          cuisine_types:         string[];
          dietary_tags:          string[];
          dietary_confidence:    number;
          restaurant_embedding:  number[] | null;
          last_google_sync:      string | null;
          data_freshness_score:  number;
          is_permanently_closed: boolean;
          created_at:            string;
          updated_at:            string;
        };
        Insert: {
          id?:                    string;
          google_place_id:        string;
          name:                   string;
          address?:               string | null;
          latitude?:              number | null;
          longitude?:             number | null;
          google_rating?:         number | null;
          google_review_count?:   number | null;
          price_level?:           number | null;
          phone_number?:          string | null;
          website_url?:           string | null;
          google_maps_url?:       string | null;
          photo_references?:      Json;
          opening_hours?:         Json | null;
          cuisine_types?:         string[];
          dietary_tags?:          string[];
          dietary_confidence?:    number;
          restaurant_embedding?:  number[] | null;
          last_google_sync?:      string | null;
          data_freshness_score?:  number;
          is_permanently_closed?: boolean;
          created_at?:            string;
          updated_at?:            string;
        };
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>;
      };

      ratings: {
        Row: {
          id:               string;
          user_id:          string;
          restaurant_id:    string;
          overall_rating:   number;
          food_rating:      number | null;
          service_rating:   number | null;
          ambiance_rating:  number | null;
          value_rating:     number | null;
          visit_context:    'solo' | 'date' | 'friends' | 'family' | 'business' | null;
          would_return:     boolean | null;
          notes:            string | null;
          group_session_id: string | null;
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          id?:               string;
          user_id:           string;
          restaurant_id:     string;
          overall_rating:    number;
          food_rating?:      number | null;
          service_rating?:   number | null;
          ambiance_rating?:  number | null;
          value_rating?:     number | null;
          visit_context?:    'solo' | 'date' | 'friends' | 'family' | 'business' | null;
          would_return?:     boolean | null;
          notes?:            string | null;
          group_session_id?: string | null;
          created_at?:       string;
          updated_at?:       string;
        };
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
      };

      groups: {
        Row: {
          id:          string;
          name:        string;
          created_by:  string;
          invite_code: string;
          avatar_url:  string | null;
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          id?:         string;
          name:        string;
          created_by:  string;
          invite_code: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['groups']['Insert']>;
      };

      group_members: {
        Row: {
          id:        string;
          group_id:  string;
          user_id:   string;
          role:      'owner' | 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          id?:        string;
          group_id:   string;
          user_id:    string;
          role?:      'owner' | 'admin' | 'member';
          joined_at?: string;
        };
        Update: Partial<Database['public']['Tables']['group_members']['Insert']>;
      };

      group_sessions: {
        Row: {
          id:                     string;
          group_id:               string;
          initiated_by:           string;
          status:                 'configuring' | 'waiting' | 'generating' | 'voting' | 'decided' | 'expired' | 'cancelled';
          location_latitude:      number | null;
          location_longitude:     number | null;
          search_radius_meters:   number;
          max_price_level:        number | null;
          cuisine_filter:         string[] | null;
          when_text:              string | null;
          recommendation_results: Json | null;
          selected_restaurant_id: string | null;
          expires_at:             string | null;
          decided_at:             string | null;
          created_at:             string;
          updated_at:             string;
        };
        Insert: {
          id?:                     string;
          group_id:                string;
          initiated_by:            string;
          status?:                 'configuring' | 'waiting' | 'generating' | 'voting' | 'decided' | 'expired' | 'cancelled';
          location_latitude?:      number | null;
          location_longitude?:     number | null;
          search_radius_meters?:   number;
          max_price_level?:        number | null;
          cuisine_filter?:         string[] | null;
          when_text?:              string | null;
          recommendation_results?: Json | null;
          selected_restaurant_id?: string | null;
          expires_at?:             string | null;
          decided_at?:             string | null;
          created_at?:             string;
          updated_at?:             string;
        };
        Update: Partial<Database['public']['Tables']['group_sessions']['Insert']>;
      };

      session_participants: {
        Row: {
          id:                 string;
          session_id:         string;
          user_id:            string | null;
          guest_display_name: string | null;
          has_joined:         boolean;
          vote:               Json | null;
          joined_at:          string | null;
        };
        Insert: {
          id?:                 string;
          session_id:          string;
          user_id?:            string | null;
          guest_display_name?: string | null;
          has_joined?:         boolean;
          vote?:               Json | null;
          joined_at?:          string | null;
        };
        Update: Partial<Database['public']['Tables']['session_participants']['Insert']>;
      };

      recommendation_log: {
        Row: {
          id:              string;
          user_id:         string | null;
          session_id:      string | null;
          restaurant_id:   string;
          match_score:     number | null;
          score_breakdown: Json | null;
          rank_position:   number | null;
          was_viewed:      boolean;
          was_selected:    boolean;
          was_rated:       boolean;
          created_at:      string;
        };
        Insert: {
          id?:              string;
          user_id?:         string | null;
          session_id?:      string | null;
          restaurant_id:    string;
          match_score?:     number | null;
          score_breakdown?: Json | null;
          rank_position?:   number | null;
          was_viewed?:      boolean;
          was_selected?:    boolean;
          was_rated?:       boolean;
          created_at?:      string;
        };
        Update: Partial<Database['public']['Tables']['recommendation_log']['Insert']>;
      };

      user_favorite_restaurants: {
        Row: {
          id:            string;
          user_id:       string;
          restaurant_id: string;
          added_from:    'profile' | 'onboarding' | 'rating' | 'detail';
          notes:         string | null;
          created_at:    string;
        };
        Insert: {
          id?:           string;
          user_id:       string;
          restaurant_id: string;
          added_from:    'profile' | 'onboarding' | 'rating' | 'detail';
          notes?:        string | null;
          created_at?:   string;
        };
        Update: Partial<Database['public']['Tables']['user_favorite_restaurants']['Insert']>;
      };

      user_favorite_dishes: {
        Row: {
          id:          string;
          user_id:     string;
          dish_name:   string;
          cuisine_tag: string | null;
          created_at:  string;
        };
        Insert: {
          id?:          string;
          user_id:      string;
          dish_name:    string;
          cuisine_tag?: string | null;
          created_at?:  string;
        };
        Update: Partial<Database['public']['Tables']['user_favorite_dishes']['Insert']>;
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
