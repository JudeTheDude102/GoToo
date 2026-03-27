import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme';

const TOTAL_STEPS = 4;
const SEGMENT_GAP = 6;
const BAR_HEIGHT = 4;
const FILL_DURATION = 300;

interface OnboardingProgressProps {
  currentStep: number; // 1-4
}

interface SegmentProps {
  filled: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}

function Segment({ filled, colors }: SegmentProps) {
  const progress = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(filled ? 1 : 0, { duration: FILL_DURATION });
  }, [filled]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.segment,
        { backgroundColor: colors.surfaceDim, flex: 1 },
      ]}
    >
      <Animated.View
        style={[styles.fill, fillStyle, { backgroundColor: colors.primary }]}
      />
    </View>
  );
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <Segment
          key={i}
          filled={i < currentStep}
          colors={colors}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SEGMENT_GAP,
    height: BAR_HEIGHT,
  },
  segment: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BAR_HEIGHT / 2,
  },
});
