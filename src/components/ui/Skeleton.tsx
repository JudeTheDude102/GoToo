import { useEffect, useRef } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Light/dark shimmer colours per spec
const LIGHT_BASE      = '#EEEBE5';
const LIGHT_HIGHLIGHT = '#F8F6F1';
const DARK_BASE       = '#2A2A2A';
const DARK_HIGHLIGHT  = '#363636';

const SHIMMER_DURATION = 1200;

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const base      = isDark ? DARK_BASE      : LIGHT_BASE;
  const highlight = isDark ? DARK_HIGHLIGHT : LIGHT_HIGHLIGHT;

  const containerWidth = useRef(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Will be driven once we have a width; re-trigger if width changes
  }, []);

  function startShimmer() {
    const w = containerWidth.current;
    if (w === 0) return;
    translateX.value = -w;
    translateX.value = withRepeat(
      withTiming(w, { duration: SHIMMER_DURATION }),
      -1,
      false,
    );
  }

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { width: width as number, height, borderRadius, backgroundColor: base },
        style,
      ]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w !== containerWidth.current) {
          containerWidth.current = w;
          cancelAnimation(translateX);
          startShimmer();
        }
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={[base, highlight, base]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
