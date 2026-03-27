import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

interface ProgressBarProps {
  progress: number;        // 0–1
  height?: number;         // default 4
  borderRadius?: number;   // defaults to height / 2
  duration?: number;       // animation duration ms, default 300
  color?: string;          // default primary
  trackColor?: string;     // default border
}

export function ProgressBar({
  progress,
  height = 4,
  borderRadius,
  duration = 300,
  color,
  trackColor,
}: ProgressBarProps) {
  const { colors } = useTheme();

  const clampedProgress = Math.min(1, Math.max(0, progress));
  const fillWidth = useSharedValue(clampedProgress);

  useEffect(() => {
    fillWidth.value = withTiming(Math.min(1, Math.max(0, progress)), { duration });
  }, [progress, duration]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value * 100}%`,
  }));

  const radius = borderRadius ?? height / 2;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: radius,
          backgroundColor: trackColor ?? colors.border,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampedProgress * 100) }}
    >
      <Animated.View
        style={[
          styles.fill,
          fillStyle,
          {
            height,
            borderRadius: radius,
            backgroundColor: color ?? colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
