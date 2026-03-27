import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Logo / Wordmark */}
        <View style={styles.hero}>
          <Text style={[styles.logo, { color: colors.primary }]}>Go Too</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            The AI that knows what you and your crew want to eat.
          </Text>
        </View>

        {/* CTAs */}
        <View style={[styles.actions, { gap: spacing.md }]}>
          <Button
            label="Get Started"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/(auth)/sign-up')}
          />
          <Button
            label="I Have an Account"
            variant="ghost"
            size="medium"
            fullWidth
            onPress={() => router.push('/(auth)/sign-in')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1 },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: 'space-between', paddingBottom: 40 },
  hero:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo:      { fontFamily: 'Inter_700Bold', fontSize: 48, letterSpacing: -1 },
  tagline:   { fontFamily: 'Inter_400Regular', fontSize: 18, textAlign: 'center', lineHeight: 28 },
  actions:   { width: '100%' },
});
