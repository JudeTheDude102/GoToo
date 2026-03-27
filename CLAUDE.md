# Go Too

AI-powered restaurant recommendation app. Expo (React Native) + Supabase + TanStack Query + Zustand.

## Stack
- Expo SDK 54+, Expo Router v4+, TypeScript strict
- Supabase (Postgres, Auth, Edge Functions, Realtime, pgvector)
- TanStack Query for server state, Zustand for client state
- React Native Reanimated 4 for animation
- sonner-native for toasts
- Zod for validation, Lucide React Native for icons
- Inter font (build-time via expo-font config plugin)

## Commands
- `npx expo start` — start dev server
- `npx expo start --dev-client` — start with dev build (needed for native auth)
- `npx supabase start` — start local Supabase
- `npx supabase db push` — push migrations
- `npx supabase functions serve` — local Edge Functions
- `npx supabase gen types typescript --local > src/types/database.ts` — regen DB types

## Architecture Rules
- Thin routes, fat services. No business logic in route files.
- No query inside a loop. Use JOINs or batch fetches.
- Page components are composition. Max 5-7 useState per page. Extract domain hooks.
- Server state = TanStack Query. Client state = Zustand. Local UI = useState.
- Every data component renders: loading (skeleton), empty (message+CTA), error (retry). All three visually distinct.
- Validate at boundaries with Zod. Every form, every Edge Function.
- Multi-step DB writes require transactions.

## File Conventions
- Components: PascalCase (RestaurantCard.tsx)
- Hooks/utils/stores: camelCase (useAuth.ts)
- Types: PascalCase with suffix (RestaurantCardProps, TasteProfileRow)
- Constants: SCREAMING_SNAKE_CASE
- Schemas: src/schemas/[domain].schema.ts

## Design System
- Theme via useTheme() hook — never hardcode colors, spacing, typography
- Tokens live in src/theme/tokens/
- Primary: amber #D4882C (light) / #F0A848 (dark)
- Dark mode bg: #121212 (dark gray, NOT pure black)
- Touch targets: 44px minimum. WCAG AA contrast required.

## Critical Gotchas
- Reanimated 4 babel: 'react-native-worklets/plugin' NOT 'react-native-reanimated/plugin'
- Supabase client: detectSessionInUrl: false (required for React Native)
- AppState listener: start/stop auth auto-refresh on foreground/background
- Never log passwords, tokens, or PII beyond user ID
- All API keys in Edge Function secrets, never in client bundle
- expo-sqlite/localStorage polyfill for Supabase session storage

## Build Approach
- Work section by section from the Build Spec, not all at once
- Verify each section compiles before moving to the next
- Reference Screen Spec only when building that specific screen
- Reference Technical Architecture only for DB schema and API patterns
