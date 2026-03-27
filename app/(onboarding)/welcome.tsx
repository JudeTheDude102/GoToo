import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';

const HERO_DURATION = 400;
const BUTTON_DELAY = 200;
const BUTTON_DURATION = 300;

export default function OnboardingWelcome() {
  const { colors, spacing } = useTheme();

  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(16);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(12);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: HERO_DURATION });
    heroTranslateY.value = withTiming(0, { duration: HERO_DURATION });
    buttonOpacity.value = withDelay(BUTTON_DELAY, withTiming(1, { duration: BUTTON_DURATION }));
    buttonTranslateY.value = withDelay(BUTTON_DELAY, withTiming(0, { duration: BUTTON_DURATION }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { gap: spacing.xl }]}>
        <Animated.View style={[styles.hero, heroStyle]}>
          <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.onPrimary }]}>GT</Text>
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Let's find your taste
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tell us what you love and we'll recommend restaurants that actually match your vibe.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Button
            label="Let's Go"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/(onboarding)/cuisines')}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  container:       { flex: 1, padding: 24, justifyContent: 'center' },
  hero:            { alignItems: 'center', gap: 20 },
  logoMark:        { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  logoText:        { fontFamily: 'Inter_700Bold', fontSize: 28 },
  title:           { fontFamily: 'Inter_700Bold', fontSize: 32, textAlign: 'center', letterSpacing: -0.5 },
  subtitle:        { fontFamily: 'Inter_400Regular', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  buttonContainer: { gap: 12 },
});
