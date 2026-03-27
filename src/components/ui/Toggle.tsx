import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '@/theme';

const TRACK_WIDTH  = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE   = 24;
const THUMB_INSET  = (TRACK_HEIGHT - THUMB_SIZE) / 2; // 2px
const THUMB_OFF    = THUMB_INSET;
const THUMB_ON     = TRACK_WIDTH - THUMB_SIZE - THUMB_INSET;

const SPRING = { damping: 18, stiffness: 220, mass: 0.8 }; // ~200ms settle

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function Toggle({ value, onValueChange, disabled = false, accessibilityLabel }: ToggleProps) {
  const { colors } = useTheme();

  const thumbX = useSharedValue(value ? THUMB_ON : THUMB_OFF);

  useEffect(() => {
    thumbX.value = withSpring(value ? THUMB_ON : THUMB_OFF, SPRING);
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const trackColor = value ? colors.primary : 'transparent';
  const borderColor = value ? colors.primary : colors.border;

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: trackColor, borderColor },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            thumbStyle,
            { backgroundColor: '#FFFFFF', shadowColor: colors.textPrimary },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: THUMB_INSET,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
