-- ============================================================
-- GoToo — Initial Schema Migration
-- Tasks 20, 21, 22: Schema + RLS + Seed Data
-- ============================================================

-- Extensions

CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================
-- TASK 20: SCHEMA
-- ============================================================

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE users (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                TEXT UNIQUE NOT NULL,
  display_name         TEXT NOT NULL,
  avatar_url           TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─── Taste Profiles ──────────────────────────────────────────
CREATE TABLE taste_profiles (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spice_tolerance        INTEGER CHECK (spice_tolerance BETWEEN 1 AND 5) DEFAULT 3,
  adventurousness        INTEGER CHECK (adventurousness BETWEEN 1 AND 5) DEFAULT 3,
  price_preference       INTEGER CHECK (price_preference BETWEEN 1 AND 4) DEFAULT 2,
  ambiance_preference    TEXT CHECK (ambiance_preference IN ('casual','moderate','upscale','no_preference')) DEFAULT 'no_preference',
  noise_preference       TEXT CHECK (noise_preference IN ('quiet','moderate','lively','no_preference')) DEFAULT 'no_preference',
  taste_embedding        vector(1536),
  profile_strength       INTEGER DEFAULT 0,
  last_embedding_update  TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_taste_profiles_user_id  ON taste_profiles(user_id);
CREATE INDEX idx_taste_profiles_embedding ON taste_profiles USING hnsw (taste_embedding vector_cosine_ops);

-- ─── Cuisine Preferences ─────────────────────────────────────
CREATE TABLE cuisine_preferences (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taste_profile_id UUID NOT NULL REFERENCES taste_profiles(id) ON DELETE CASCADE,
  cuisine_type     TEXT NOT NULL,
  preference_level TEXT NOT NULL CHECK (preference_level IN ('love','like','neutral','dislike')),
  UNIQUE(taste_profile_id, cuisine_type)
);

-- ─── Dietary Restriction Types (reference data) ──────────────
CREATE TABLE dietary_restriction_types (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('allergy','intolerance','diet','religious')),
  severity     TEXT NOT NULL CHECK (severity IN ('critical','important','preference')),
  icon_name    TEXT
);

-- ─── User Dietary Restrictions ───────────────────────────────
CREATE TABLE user_dietary_restrictions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restriction_type_id   UUID NOT NULL REFERENCES dietary_restriction_types(id),
  is_hard_constraint    BOOLEAN DEFAULT TRUE,
  notes                 TEXT,
  UNIQUE(user_id, restriction_type_id)
);

-- ─── Restaurants ─────────────────────────────────────────────
CREATE TABLE restaurants (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id        TEXT UNIQUE NOT NULL,
  name                   TEXT NOT NULL,
  address                TEXT,
  latitude               DOUBLE PRECISION,
  longitude              DOUBLE PRECISION,
  google_rating          NUMERIC(2,1),
  google_review_count    INTEGER,
  price_level            INTEGER,
  phone_number           TEXT,
  website_url            TEXT,
  google_maps_url        TEXT,
  photo_references       JSONB DEFAULT '[]'::JSONB,
  opening_hours          JSONB,
  cuisine_types          TEXT[] DEFAULT '{}',
  dietary_tags           TEXT[] DEFAULT '{}',
  dietary_confidence     NUMERIC(3,2) DEFAULT 0.0,
  restaurant_embedding   vector(1536),
  last_google_sync       TIMESTAMPTZ,
  data_freshness_score   NUMERIC(3,2) DEFAULT 1.0,
  is_permanently_closed  BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_restaurants_place_id  ON restaurants(google_place_id);
CREATE INDEX idx_restaurants_cuisine   ON restaurants USING gin(cuisine_types);
CREATE INDEX idx_restaurants_dietary   ON restaurants USING gin(dietary_tags);
CREATE INDEX idx_restaurants_embedding ON restaurants USING hnsw (restaurant_embedding vector_cosine_ops);
CREATE INDEX idx_restaurants_rating    ON restaurants(google_rating DESC);

-- ─── Ratings ─────────────────────────────────────────────────
CREATE TABLE ratings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  overall_rating    INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  food_rating       INTEGER CHECK (food_rating BETWEEN 1 AND 5),
  service_rating    INTEGER CHECK (service_rating BETWEEN 1 AND 5),
  ambiance_rating   INTEGER CHECK (ambiance_rating BETWEEN 1 AND 5),
  value_rating      INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  visit_context     TEXT CHECK (visit_context IN ('solo','date','friends','family','business')),
  would_return      BOOLEAN,
  notes             TEXT,
  group_session_id  UUID,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Groups ──────────────────────────────────────────────────
CREATE TABLE groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES users(id),
  invite_code TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('owner','admin','member')) DEFAULT 'member',
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ─── Group Sessions (state machine) ──────────────────────────
CREATE TABLE group_sessions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id                UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  initiated_by            UUID NOT NULL REFERENCES users(id),
  status                  TEXT NOT NULL CHECK (status IN (
                            'configuring','waiting','generating','voting','decided','expired','cancelled'
                          )) DEFAULT 'configuring',
  location_latitude       DOUBLE PRECISION,
  location_longitude      DOUBLE PRECISION,
  search_radius_meters    INTEGER DEFAULT 5000,
  max_price_level         INTEGER,
  cuisine_filter          TEXT[],
  when_text               TEXT,
  recommendation_results  JSONB,
  selected_restaurant_id  UUID REFERENCES restaurants(id),
  expires_at              TIMESTAMPTZ,
  decided_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Session Participants ─────────────────────────────────────
-- user_id is nullable to support guest access (guest_display_name used instead)
CREATE TABLE session_participants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES group_sessions(id) ON DELETE CASCADE,
  user_id             UUID REFERENCES users(id),           -- nullable for guest access
  guest_display_name  TEXT,
  has_joined          BOOLEAN DEFAULT FALSE,
  vote                JSONB,
  joined_at           TIMESTAMPTZ,
  UNIQUE(session_id, user_id),
  CONSTRAINT user_or_guest CHECK (user_id IS NOT NULL OR guest_display_name IS NOT NULL)
);

-- ─── Recommendation Log ──────────────────────────────────────
CREATE TABLE recommendation_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id),
  session_id     UUID REFERENCES group_sessions(id),
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id),
  match_score    NUMERIC(5,2),
  score_breakdown JSONB,
  rank_position  INTEGER,
  was_viewed     BOOLEAN DEFAULT FALSE,
  was_selected   BOOLEAN DEFAULT FALSE,
  was_rated      BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Additions: Favorite Restaurants ─────────────────────────
CREATE TABLE user_favorite_restaurants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id  UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  added_from     TEXT NOT NULL CHECK (added_from IN ('profile','onboarding','rating','detail')),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorite_restaurants(user_id);

-- ─── Additions: Favorite Dishes ──────────────────────────────
CREATE TABLE user_favorite_dishes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dish_name   TEXT NOT NULL,
  cuisine_tag TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_dishes_user ON user_favorite_dishes(user_id);
CREATE UNIQUE INDEX idx_user_dishes_unique ON user_favorite_dishes(user_id, lower(dish_name));


-- ============================================================
-- TASK 21: ROW LEVEL SECURITY
-- ============================================================

-- ─── users ───────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own"   ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- ─── taste_profiles ──────────────────────────────────────────
ALTER TABLE taste_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner all" ON taste_profiles FOR ALL USING (auth.uid() = user_id);

-- ─── cuisine_preferences ─────────────────────────────────────
ALTER TABLE cuisine_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner all" ON cuisine_preferences FOR ALL
  USING (taste_profile_id IN (SELECT id FROM taste_profiles WHERE user_id = auth.uid()));

-- ─── user_dietary_restrictions ───────────────────────────────
ALTER TABLE user_dietary_restrictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner all" ON user_dietary_restrictions FOR ALL USING (auth.uid() = user_id);

-- ─── dietary_restriction_types (public read) ─────────────────
ALTER TABLE dietary_restriction_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON dietary_restriction_types FOR SELECT USING (true);

-- ─── restaurants (public read, service role writes) ──────────
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON restaurants FOR SELECT USING (true);

-- ─── ratings ─────────────────────────────────────────────────
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner all" ON ratings FOR ALL USING (auth.uid() = user_id);

-- ─── groups ──────────────────────────────────────────────────
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read" ON groups FOR SELECT
  USING (id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));
CREATE POLICY "Creator insert" ON groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator update" ON groups FOR UPDATE
  USING (auth.uid() = created_by);
CREATE POLICY "Creator delete" ON groups FOR DELETE
  USING (auth.uid() = created_by);

-- ─── group_members ────────────────────────────────────────────
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read" ON group_members FOR SELECT
  USING (group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));
CREATE POLICY "Self join" ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner manage" ON group_members FOR ALL
  USING (group_id IN (SELECT id FROM groups WHERE created_by = auth.uid()));

-- ─── group_sessions ───────────────────────────────────────────
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read" ON group_sessions FOR SELECT
  USING (group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));
CREATE POLICY "Initiator insert" ON group_sessions FOR INSERT
  WITH CHECK (auth.uid() = initiated_by);
CREATE POLICY "Initiator update" ON group_sessions FOR UPDATE
  USING (auth.uid() = initiated_by);

-- ─── session_participants ─────────────────────────────────────
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read" ON session_participants FOR SELECT
  USING (session_id IN (
    SELECT gs.id FROM group_sessions gs
    JOIN group_members gm ON gm.group_id = gs.group_id
    WHERE gm.user_id = auth.uid()
  ));
CREATE POLICY "Self insert" ON session_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Self update" ON session_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── recommendation_log ───────────────────────────────────────
ALTER TABLE recommendation_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner read" ON recommendation_log FOR SELECT
  USING (auth.uid() = user_id);

-- ─── user_favorite_restaurants ───────────────────────────────
ALTER TABLE user_favorite_restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner all" ON user_favorite_restaurants FOR ALL USING (auth.uid() = user_id);

-- ─── user_favorite_dishes ────────────────────────────────────
ALTER TABLE user_favorite_dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner all" ON user_favorite_dishes FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- TASK 22: SEED DIETARY RESTRICTION TYPES
-- ============================================================

INSERT INTO dietary_restriction_types (name, display_name, category, severity, icon_name) VALUES
  -- Critical allergies (life-threatening)
  ('peanuts',      'Peanuts',      'allergy',     'critical',   'AlertTriangle'),
  ('tree_nuts',    'Tree Nuts',    'allergy',     'critical',   'AlertTriangle'),
  ('shellfish',    'Shellfish',    'allergy',     'critical',   'AlertTriangle'),
  ('fish',         'Fish',         'allergy',     'critical',   'AlertTriangle'),
  -- Important allergies/intolerances
  ('dairy',        'Dairy',        'allergy',     'important',  'AlertCircle'),
  ('eggs',         'Eggs',         'allergy',     'important',  'AlertCircle'),
  ('wheat_gluten', 'Wheat/Gluten', 'intolerance', 'important',  'AlertCircle'),
  ('soy',          'Soy',          'allergy',     'important',  'AlertCircle'),
  -- Dietary preferences
  ('vegetarian',   'Vegetarian',   'diet',        'preference', 'Leaf'),
  ('vegan',        'Vegan',        'diet',        'preference', 'Leaf'),
  -- Religious
  ('halal',        'Halal',        'religious',   'important',  'Star'),
  ('kosher',       'Kosher',       'religious',   'important',  'Star'),
  -- Lifestyle diets
  ('keto',         'Keto',         'diet',        'preference', 'Flame'),
  ('paleo',        'Paleo',        'diet',        'preference', 'Flame');
