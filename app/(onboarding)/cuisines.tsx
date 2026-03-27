import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { CuisineGrid } from '@/components/onboarding/CuisineGrid';
import { useOnboardingStore } from '@/stores/onboardingStore';

const MIN_SELECTIONS = 3;

export default function CuisinesScreen() {
  const { colors, spacing } = useTheme();
  const { cuisineSelections, setCuisines, setStep } = useOnboardingStore();

  function handleToggle(id: string) {
    if (cuisineSelections.includes(id)) {
      setCuisines(cuisineSelections.filter((c) => c !== id));
    } else {
      setCuisines([...cuisineSelections, id]);
    }
  }

  function handleNext() {
    setStep(2);
    router.push('/(onboarding)/preferences');
  }

  const canProceed = cuisineSelections.length >= MIN_SELECTIONS;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm }]}>
        <OnboardingProgress currentStep={1} />
        <View style={{ gap: spacing.xs, marginTop: spacing.lg }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            What cuisines do you love?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Pick at least {MIN_SELECTIONS} to get started
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <CuisineGrid selected={cuisineSelections} onToggle={handleToggle} />
        <View style={{ height: spacing.jumbo }} />
      </ScrollView>

      <View style={[styles.footer, { padding: spacing.lg, backgroundColor: colors.background }]}>
        {!canProceed && (
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {MIN_SELECTIONS - cuisineSelections.length} more to go
          </Text>
        )}
        <Button
          label="Next"
          variant="primary"
          size="large"
          fullWidth
          disabled={!canProceed}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  header:        {},
  scrollContent: {},
  title:         { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.3 },
  subtitle:      { fontFamily: 'Inter_400Regular', fontSize: 15 },
  footer:        { borderTopWidth: StyleSheet.hairlineWidth, gap: 8 },
  hint:          { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center' },
});
