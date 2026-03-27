import { useCallback, useRef } from 'react';
import { StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

interface PreferenceSliderProps {
  label: string;
  minLabel: string;
  maxLabel: string;
  value: number;    // 1–5
  onChange: (value: number) => void;
  steps?: number;   // default 5
}

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 6;
const SPRING_CONFIG = { damping: 15, stiffness: 200 };

export function PreferenceSlider({
  label,
  minLabel,
  maxLabel,
  value,
  onChange,
  steps = 5,
}: PreferenceSliderProps) {
  const { colors } = useTheme();

  const trackWidth = useRef(0);
  const thumbPosition = useSharedValue(((value - 1) / (steps - 1)) * 100);
  const isPressed = useSharedValue(false);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  const positionToValue = useCallback(
    (positionPct: number): number => {
      const step = Math.round((positionPct / 100) * (steps - 1));
      return clamp(step + 1, 1, steps);
    },
    [steps],
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      if (trackWidth.current === 0) return;
      const raw = ((value - 1) / (steps - 1)) * trackWidth.current + e.translationX;
      const pct = clamp((raw / trackWidth.current) * 100, 0, 100);
      thumbPosition.value = pct;
      const newValue = positionToValue(pct);
      runOnJS(onChange)(newValue);
    })
    .onEnd(() => {
      isPressed.value = false;
      // Snap to step
      const snappedPct = ((value - 1) / (steps - 1)) * 100;
      thumbPosition.value = withSpring(snappedPct, SPRING_CONFIG);
    });

  function handleTrackLayout(e: LayoutChangeEvent) {
    trackWidth.current = e.nativeEvent.layout.width;
    thumbPosition.value = ((value - 1) / (steps - 1)) * 100;
  }

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${thumbPosition.value}%`,
    transform: [{ translateX: -THUMB_SIZE / 2 }],
    shadowOpacity: isPressed.value ? 0.25 : 0.1,
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${thumbPosition.value}%`,
  }));

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View style={styles.trackContainer} onLayout={handleTrackLayout}>
        {/* Track background */}
        <View style={[styles.track, { backgroundColor: colors.surfaceDim }]}>
          {/* Fill */}
          <Animated.View
            style={[styles.fill, fillStyle, { backgroundColor: colors.primary }]}
          />
        </View>
        {/* Thumb */}
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.thumb,
              thumbStyle,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                shadowColor: colors.textPrimary,
              },
            ]}
          />
        </GestureDetector>
      </View>
      <View style={styles.labels}>
        <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>{minLabel}</Text>
        <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>{maxLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  trackContainer: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
});
