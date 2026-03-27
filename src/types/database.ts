export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cuisine_preferences: {
        Row: {
          cuisine_type: string
          id: string
          preference_level: string
          taste_profile_id: string
        }
        Insert: {
          cuisine_type: string
          id?: string
          preference_level: string
          taste_profile_id: string
        }
        Update: {
          cuisine_type?: string
          id?: string
          preference_level?: string
          taste_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuisine_preferences_taste_profile_id_fkey"
            columns: ["taste_profile_id"]
            isOneToOne: false
            referencedRelation: "taste_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dietary_restriction_types: {
        Row: {
          category: string
          display_name: string
          icon_name: string | null
          id: string
          name: string
          severity: string
        }
        Insert: {
          category: string
          display_name: string
          icon_name?: string | null
          id?: string
          name: string
          severity: string
        }
        Update: {
          category?: string
          display_name?: string
          icon_name?: string | null
          id?: string
          name?: string
          severity?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_sessions: {
        Row: {
          created_at: string | null
          cuisine_filter: string[] | null
          decided_at: string | null
          expires_at: string | null
          group_id: string
          id: string
          initiated_by: string
          location_latitude: number | null
          location_longitude: number | null
          max_price_level: number | null
          recommendation_results: Json | null
          search_radius_meters: number | null
          selected_restaurant_id: string | null
          status: string
          updated_at: string | null
          when_text: string | null
        }
        Insert: {
          created_at?: string | null
          cuisine_filter?: string[] | null
          decided_at?: string | null
          expires_at?: string | null
          group_id: string
          id?: string
          initiated_by: string
          location_latitude?: number | null
          location_longitude?: number | null
          max_price_level?: number | null
          recommendation_results?: Json | null
          search_radius_meters?: number | null
          selected_restaurant_id?: string | null
          status?: string
          updated_at?: string | null
          when_text?: string | null
        }
        Update: {
          created_at?: string | null
          cuisine_filter?: string[] | null
          decided_at?: string | null
          expires_at?: string | null
          group_id?: string
          id?: string
          initiated_by?: string
          location_latitude?: number | null
          location_longitude?: number | null
          max_price_level?: number | null
          recommendation_results?: Json | null
          search_radius_meters?: number | null
          selected_restaurant_id?: string | null
          status?: string
          updated_at?: string | null
          when_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_sessions_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_sessions_selected_restaurant_id_fkey"
            columns: ["selected_restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string
          id: string
          invite_code: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          invite_code: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          ambiance_rating: number | null
          created_at: string | null
          food_rating: number | null
          group_session_id: string | null
          id: string
          notes: string | null
          overall_rating: number
          restaurant_id: string
          service_rating: number | null
          updated_at: string | null
          user_id: string
          value_rating: number | null
          visit_context: string | null
          would_return: boolean | null
        }
        Insert: {
          ambiance_rating?: number | null
          created_at?: string | null
          food_rating?: number | null
          group_session_id?: string | null
          id?: string
          notes?: string | null
          overall_rating: number
          restaurant_id: string
          service_rating?: number | null
          updated_at?: string | null
          user_id: string
          value_rating?: number | null
          visit_context?: string | null
          would_return?: boolean | null
        }
        Update: {
          ambiance_rating?: number | null
          created_at?: string | null
          food_rating?: number | null
          group_session_id?: string | null
          id?: string
          notes?: string | null
          overall_rating?: number
          restaurant_id?: string
          service_rating?: number | null
          updated_at?: string | null
          user_id?: string
          value_rating?: number | null
          visit_context?: string | null
          would_return?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_log: {
        Row: {
          created_at: string | null
          id: string
          match_score: number | null
          rank_position: number | null
          restaurant_id: string
          score_breakdown: Json | null
          session_id: string | null
          user_id: string | null
          was_rated: boolean | null
          was_selected: boolean | null
          was_viewed: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_score?: number | null
          rank_position?: number | null
          restaurant_id: string
          score_breakdown?: Json | null
          session_id?: string | null
          user_id?: string | null
          was_rated?: boolean | null
          was_selected?: boolean | null
          was_viewed?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_score?: number | null
          rank_position?: number | null
          restaurant_id?: string
          score_breakdown?: Json | null
          session_id?: string | null
          user_id?: string | null
          was_rated?: boolean | null
          was_selected?: boolean | null
          was_viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_log_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string | null
          cuisine_types: string[] | null
          data_freshness_score: number | null
          dietary_confidence: number | null
          dietary_tags: string[] | null
          google_maps_url: string | null
          google_place_id: string
          google_rating: number | null
          google_review_count: number | null
          id: string
          is_permanently_closed: boolean | null
          last_google_sync: string | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone_number: string | null
          photo_references: Json | null
          price_level: number | null
          restaurant_embedding: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          cuisine_types?: string[] | null
          data_freshness_score?: number | null
          dietary_confidence?: number | null
          dietary_tags?: string[] | null
          google_maps_url?: string | null
          google_place_id: string
          google_rating?: number | null
          google_review_count?: number | null
          id?: string
          is_permanently_closed?: boolean | null
          last_google_sync?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone_number?: string | null
          photo_references?: Json | null
          price_level?: number | null
          restaurant_embedding?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          cuisine_types?: string[] | null
          data_freshness_score?: number | null
          dietary_confidence?: number | null
          dietary_tags?: string[] | null
          google_maps_url?: string | null
          google_place_id?: string
          google_rating?: number | null
          google_review_count?: number | null
          id?: string
          is_permanently_closed?: boolean | null
          last_google_sync?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone_number?: string | null
          photo_references?: Json | null
          price_level?: number | null
          restaurant_embedding?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      session_participants: {
        Row: {
          guest_display_name: string | null
          has_joined: boolean | null
          id: string
          joined_at: string | null
          session_id: string
          user_id: string | null
          vote: Json | null
        }
        Insert: {
          guest_display_name?: string | null
          has_joined?: boolean | null
          id?: string
          joined_at?: string | null
          session_id: string
          user_id?: string | null
          vote?: Json | null
        }
        Update: {
          guest_display_name?: string | null
          has_joined?: boolean | null
          id?: string
          joined_at?: string | null
          session_id?: string
          user_id?: string | null
          vote?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      taste_profiles: {
        Row: {
          adventurousness: number | null
          ambiance_preference: string | null
          created_at: string | null
          id: string
          last_embedding_update: string | null
          noise_preference: string | null
          price_preference: number | null
          profile_strength: number | null
          spice_tolerance: number | null
          taste_embedding: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adventurousness?: number | null
          ambiance_preference?: string | null
          created_at?: string | null
          id?: string
          last_embedding_update?: string | null
          noise_preference?: string | null
          price_preference?: number | null
          profile_strength?: number | null
          spice_tolerance?: number | null
          taste_embedding?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adventurousness?: number | null
          ambiance_preference?: string | null
          created_at?: string | null
          id?: string
          last_embedding_update?: string | null
          noise_preference?: string | null
          price_preference?: number | null
          profile_strength?: number | null
          spice_tolerance?: number | null
          taste_embedding?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taste_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dietary_restrictions: {
        Row: {
          id: string
          is_hard_constraint: boolean | null
          notes: string | null
          restriction_type_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_hard_constraint?: boolean | null
          notes?: string | null
          restriction_type_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_hard_constraint?: boolean | null
          notes?: string | null
          restriction_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dietary_restrictions_restriction_type_id_fkey"
            columns: ["restriction_type_id"]
            isOneToOne: false
            referencedRelation: "dietary_restriction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dietary_restrictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_dishes: {
        Row: {
          created_at: string | null
          cuisine_tag: string | null
          dish_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cuisine_tag?: string | null
          dish_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          cuisine_tag?: string | null
          dish_name?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_dishes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_restaurants: {
        Row: {
          added_from: string
          created_at: string | null
          id: string
          notes: string | null
          restaurant_id: string
          user_id: string
        }
        Insert: {
          added_from: string
          created_at?: string | null
          id?: string
          notes?: string | null
          restaurant_id: string
          user_id: string
        }
        Update: {
          added_from?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          restaurant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_restaurants_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_restaurants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string
          email: string
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          email: string
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          email?: string
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
