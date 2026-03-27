import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { authService } from '@/services/authService';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRICE_LABELS = ['', '$', '$$', '$$$', '$$$$'];

function scaleToPercent(value: number, max = 5): number {
  return (value - 1) / (max - 1);
}

function profileStrength(
  cuisines: string[],
  spice: number,
  adventure: number,
  dietary: unknown[],
): number {
  // Cuisine selections (40%), preferences set (40%), dietary (20%)
  const cuisineScore  = Math.min(cuisines.length / 5, 1) * 0.4;
  const prefScore     = (spice !== 3 || adventure !== 3 ? 1 : 0.5) * 0.4;
  const dietaryScore  = (dietary.length > 0 ? 1 : 0.5) * 0.2;
  return cuisineScore + prefScore + dietaryScore;
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, colors }: { title: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>{title}</Text>
  );
}

// ─── Scale row ────────────────────────────────────────────────────────────────

function ScaleRow({
  label,
  value,
  minLabel,
  maxLabel,
  colors,
}: {
  label: string;
  value: number;
  minLabel: string;
  maxLabel: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.scaleRowHeader}>
        <Text style={[styles.scaleLabel, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.scaleValue, { color: colors.textSecondary }]}>
          {value} / 5
        </Text>
      </View>
      <ProgressBar progress={scaleToPercent(value)} height={6} />
      <View style={styles.scaleLegend}>
        <Text style={[styles.scaleLegendText, { color: colors.textTertiary }]}>{minLabel}</Text>
        <Text style={[styles.scaleLegendText, { color: colors.textTertiary }]}>{maxLabel}</Text>
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const { user, clear } = useAuthStore();
  const {
    cuisineSelections,
    spiceTolerance,
    adventurousness,
    pricePreference,
    dietaryRestrictions,
  } = useOnboardingStore();

  const displayName = user?.user_metadata?.full_name as string | undefined
    ?? user?.email?.split('@')[0]
    ?? 'You';
  const email = user?.email ?? '';
  const avatarUri = user?.user_metadata?.avatar_url as string | undefined ?? null;

  const strength = profileStrength(
    cuisineSelections,
    spiceTolerance,
    adventurousness,
    dietaryRestrictions,
  );

  async function handleSignOut() {
    await authService.signOut();
    clear();
    router.replace('/(auth)/welcome');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { padding: spacing.lg, gap: spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User info card ─────────────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Avatar size="large" uri={avatarUri} name={displayName} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.displayName, { color: colors.textPrimary }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
              {email}
            </Text>
          </View>
          <Button
            label="Edit Profile"
            variant="ghost"
            size="small"
            onPress={() => { /* Task: profile edit screen */ }}
          />
        </View>

        {/* ── Taste Profile ──────────────────────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <SectionHeader title="Your Taste Profile" colors={colors} />

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, gap: spacing.md }]}>
            {/* Profile strength */}
            <View style={{ gap: 6 }}>
              <View style={styles.scaleRowHeader}>
                <Text style={[styles.scaleLabel, { color: colors.textPrimary }]}>Profile strength</Text>
                <Text style={[styles.scaleValue, { color: colors.textSecondary }]}>
                  {Math.round(strength * 100)}%
                </Text>
              </View>
              <ProgressBar progress={strength} height={8} />
            </View>

            {/* Cuisines */}
            {cuisineSelections.length > 0 ? (
              <View style={{ gap: 8 }}>
                <Text style={[styles.scaleLabel, { color: colors.textPrimary }]}>Cuisines</Text>
                <ChipGroup>
                  {cuisineSelections.map((c) => (
                    <Chip key={c} label={c.replace(/_/g, ' ')} selected />
                  ))}
                </ChipGroup>
              </View>
            ) : null}

            {/* Spice + Adventurousness */}
            <ScaleRow
              label="Spice tolerance"
              value={spiceTolerance}
              minLabel="No heat"
              maxLabel="Bring it on"
              colors={colors}
            />
            <ScaleRow
              label="Adventurousness"
              value={adventurousness}
              minLabel="Keep it familiar"
              maxLabel="Surprise me"
              colors={colors}
            />

            {/* Price */}
            <View style={styles.scaleRowHeader}>
              <Text style={[styles.scaleLabel, { color: colors.textPrimary }]}>Typical budget</Text>
              <Text style={[styles.scaleValue, { color: colors.primary }]}>
                {PRICE_LABELS[pricePreference]}
              </Text>
            </View>

            {/* Dietary badges */}
            {dietaryRestrictions.length > 0 && (
              <View style={{ gap: 8 }}>
                <Text style={[styles.scaleLabel, { color: colors.textPrimary }]}>Dietary</Text>
                <ChipGroup>
                  {dietaryRestrictions.map((r) => (
                    <Chip key={r.type} label={r.type.replace(/_/g, ' ')} />
                  ))}
                </ChipGroup>
              </View>
            )}

            <Button
              label="Edit Taste Profile"
              variant="secondary"
              size="medium"
              fullWidth
              onPress={() => router.push('/(onboarding)/cuisines')}
            />
          </View>
        </View>

        {/* ── Favorite Restaurants ───────────────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <View style={styles.sectionTitleRow}>
            <SectionHeader title="Favorite Spots" colors={colors} />
            <Button label="Add" variant="ghost" size="small" onPress={() => {}} />
          </View>
          <EmptyState
            title="No favorites yet"
            description="Save restaurants you love and they'll show up here."
            ctaLabel="Find Restaurants"
            onCtaPress={() => router.push('/(tabs)/search')}
          />
        </View>

        {/* ── Favorite Dishes ────────────────────────────────────────────── */}
        <View style={{ gap: spacing.md }}>
          <View style={styles.sectionTitleRow}>
            <SectionHeader title="Dishes You Love" colors={colors} />
            <Button label="Add" variant="ghost" size="small" onPress={() => {}} />
          </View>
          <EmptyState
            title="No dishes saved"
            description="Tell us your go-to dishes and we'll find more like them."
          />
        </View>

        {/* ── Sign Out ───────────────────────────────────────────────────── */}
        <Button
          label="Sign Out"
          variant="destructive"
          size="medium"
          fullWidth
          onPress={handleSignOut}
        />

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  scroll:          { flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  displayName:     { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
  email:           { fontFamily: 'Inter_400Regular', fontSize: 14 },
  sectionHeader:   { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scaleRowHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scaleLabel:      { fontFamily: 'Inter_500Medium', fontSize: 14 },
  scaleValue:      { fontFamily: 'Inter_500Medium', fontSize: 13 },
  scaleLegend:     { flexDirection: 'row', justifyContent: 'space-between' },
  scaleLegendText: { fontFamily: 'Inter_400Regular', fontSize: 11 },
});
