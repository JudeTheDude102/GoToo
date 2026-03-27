import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { DietaryList } from '@/components/onboarding/DietaryList';
import { useOnboardingStore } from '@/stores/onboardingStore';
import type { DietaryRestriction } from '@/stores/onboardingStore';

export default function DietaryScreen() {
  const { colors, spacing } = useTheme();
  const { dietaryRestrictions, setDietary, setStep } = useOnboardingStore();

  function handleToggle(type: string) {
    const exists = dietaryRestrictions.find((r) => r.type === type);
    if (exists) {
      setDietary(dietaryRestrictions.filter((r) => r.type !== type));
    } else {
      // Add with default severity based on known types
      const defaultSeverity = getDefaultSeverity(type);
      const newRestriction: DietaryRestriction = {
        type,
        severity: defaultSeverity,
        isHardConstraint: defaultSeverity === 'critical',
      };
      setDietary([...dietaryRestrictions, newRestriction]);
    }
  }

  function handleSeverityChange(type: string, severity: string) {
    setDietary(
      dietaryRestrictions.map((r) =>
        r.type === type
          ? { ...r, severity, isHardConstraint: severity === 'critical' }
          : r,
      ),
    );
  }

  function handleNext() {
    setStep(4);
    router.push('/(onboarding)/complete');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
        ]}
      >
        <OnboardingProgress currentStep={3} />
        <View style={{ gap: spacing.xs, marginTop: spacing.lg }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Any dietary needs?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Optional — skip if none apply
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <DietaryList
          restrictions={dietaryRestrictions}
          onToggle={handleToggle}
          onSeverityChange={handleSeverityChange}
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

function getDefaultSeverity(type: string): string {
  const critical = ['peanuts', 'tree_nuts', 'shellfish', 'fish'];
  const important = ['dairy', 'eggs', 'wheat_gluten', 'soy', 'halal', 'kosher'];
  if (critical.includes(type)) return 'critical';
  if (important.includes(type)) return 'important';
  return 'preference';
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  header:        {},
  scrollContent: {},
  title:         { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.3 },
  subtitle:      { fontFamily: 'Inter_400Regular', fontSize: 15 },
  footer:        { borderTopWidth: StyleSheet.hairlineWidth },
});
