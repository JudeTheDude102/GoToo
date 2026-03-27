import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { onboardingService } from '@/services/onboardingService';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { showToast } from '@/components/ui/ToastProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 30;
const OVERSHOOT_SPRING = { damping: 12, stiffness: 180 };
const SETTLE_SPRING   = { damping: 15, stiffness: 150 };

// ─── Confetti particle ───────────────────────────────────────────────────────

interface ParticleConfig {
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

function ConfettiParticle({ x, color, delay, rotation, size }: ParticleConfig) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const opacity    = useSharedValue(0);
  const rotate     = useSharedValue(0);

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 120;
    opacity.value    = withDelay(delay, withTiming(1, { duration: 100 }));
    translateY.value = withDelay(delay, withTiming(SCREEN_HEIGHT + 40, { duration: 1800 }));
    translateX.value = withDelay(delay, withTiming(drift, { duration: 1800 }));
    rotate.value     = withDelay(delay, withTiming(rotation, { duration: 1800 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value + x },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        style,
        { top: 0, left: 0 },
      ]}
      pointerEvents="none"
    >
      <View style={{ width: size, height: size * 0.6, backgroundColor: color, borderRadius: 2 }} />
    </Animated.View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function OnboardingComplete() {
  const { colors, spacing } = useTheme();
  const { user, setIsOnboarded } = useAuthStore();
  const { cuisineSelections, spiceTolerance, adventurousness, pricePreference, dietaryRestrictions, reset } =
    useOnboardingStore();

  const [loading, setLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const hasRun = useRef(false);

  const checkScale   = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTransY  = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);

  const AMBER_COLORS = [
    colors.primary,
    colors.primaryLight,
    '#F5C842',
    '#E8A020',
    '#FDE68A',
    '#FBBF24',
  ];

  const particles: ParticleConfig[] = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: (i / PARTICLE_COUNT) * SCREEN_WIDTH,
      color: AMBER_COLORS[i % AMBER_COLORS.length],
      delay: 400 + Math.random() * 400,
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 6,
    })),
  ).current;

  function startAnimations() {
    checkScale.value = withSequence(
      withSpring(1.15, OVERSHOOT_SPRING),
      withSpring(1.0, SETTLE_SPRING),
    );
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    titleTransY.value  = withDelay(300, withTiming(0, { duration: 400 }));
    buttonOpacity.value = withDelay(600, withTiming(1, { duration: 300 }));
    runOnJS(setShowParticles)(true);
  }

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!user?.id) return;

    setLoading(true);
    onboardingService
      .completeOnboarding({
        userId: user.id,
        cuisineSelections,
        spiceTolerance,
        adventurousness,
        pricePreference,
        dietaryRestrictions,
      })
      .then(() => {
        setIsOnboarded(true);
        startAnimations();
      })
      .catch(() => {
        showToast.error("Couldn't save your preferences. Try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTransY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  function handleContinue() {
    reset();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {showParticles &&
        particles.map((p, i) => <ConfettiParticle key={i} {...p} />)}

      <View style={[styles.container, { gap: spacing.xl }]}>
        {loading ? (
          <Text style={[styles.saving, { color: colors.textSecondary }]}>
            Saving your taste profile…
          </Text>
        ) : (
          <>
            <Animated.View
              style={[
                styles.checkCircle,
                checkStyle,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text style={[styles.checkMark, { color: colors.primary }]}>✓</Text>
            </Animated.View>

            <Animated.View style={[styles.textBlock, titleStyle]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                You're all set!
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                We've built your taste profile. Time to find somewhere amazing to eat.
              </Text>
            </Animated.View>

            <Animated.View style={[styles.buttonContainer, buttonStyle]}>
              <Button
                label="Find Restaurants"
                variant="primary"
                size="large"
                fullWidth
                onPress={handleContinue}
              />
            </Animated.View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  container:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  checkCircle:     { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  checkMark:       { fontFamily: 'Inter_700Bold', fontSize: 48, lineHeight: 56 },
  textBlock:       { alignItems: 'center', gap: 12 },
  title:           { fontFamily: 'Inter_700Bold', fontSize: 30, letterSpacing: -0.5, textAlign: 'center' },
  subtitle:        { fontFamily: 'Inter_400Regular', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  buttonContainer: { width: '100%' },
  saving:          { fontFamily: 'Inter_400Regular', fontSize: 16 },
});
