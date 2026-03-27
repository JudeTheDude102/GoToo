import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { PreferenceSlider } from '@/components/onboarding/PreferenceSlider';
import { PriceSelector } from '@/components/onboarding/PriceSelector';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function PreferencesScreen() {
  const { colors, spacing } = useTheme();
  const { spiceTolerance, adventurousness, pricePreference, setPreferences, setStep } =
    useOnboardingStore();

  function handleNext() {
    setStep(3);
    router.push('/(onboarding)/dietary');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
        ]}
      >
        <OnboardingProgress currentStep={2} />
        <View style={{ gap: spacing.xs, marginTop: spacing.lg }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            How do you like to eat?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Be honest — we won't judge
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg, gap: spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <PreferenceSlider
          label="Spice tolerance"
          minLabel="No heat"
          maxLabel="Bring it on"
          value={spiceTolerance}
          onChange={(v) => setPreferences({ spiceTolerance: v })}
        />

        <PreferenceSlider
          label="Adventurousness"
          minLabel="Keep it familiar"
          maxLabel="Surprise me"
          value={adventurousness}
          onChange={(v) => setPreferences({ adventurousness: v })}
        />

        <PriceSelector
          label="Typical budget"
          value={pricePreference}
          onChange={(v) => setPreferences({ pricePreference: v })}
        />

        <View style={{ height: spacing.jumbo }} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { padding: spacing.lg, backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <Button
          label="Next"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  header:        {},
  scrollContent: { flexGrow: 1 },
  title:         { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.3 },
  subtitle:      { fontFamily: 'Inter_400Regular', fontSize: 15 },
  footer:        { borderTopWidth: StyleSheet.hairlineWidth },
});
