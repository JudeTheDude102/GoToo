import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

export interface Cuisine {
  id: string;
  label: string;
  emoji: string;
}

interface CuisineTileProps {
  cuisine: Cuisine;
  selected: boolean;
  onToggle: (id: string) => void;
}

const SPRING_CONFIG = { damping: 12, stiffness: 180 };

export function CuisineTile({ cuisine, selected, onToggle }: CuisineTileProps) {
  const { colors } = useTheme();

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.06 : 1, SPRING_CONFIG);
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = selected ? colors.primaryLight : colors.surface;
  const borderColor = selected ? colors.primary : colors.border;
  const textColor = selected ? colors.primary : colors.textPrimary;

  return (
    <Pressable
      onPress={() => onToggle(cuisine.id)}
      onPressIn={() => { scale.value = withSpring(0.95, SPRING_CONFIG); }}
      onPressOut={() => { scale.value = withSpring(selected ? 1.06 : 1, SPRING_CONFIG); }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={cuisine.label}
    >
      <Animated.View
        style={[
          styles.tile,
          animatedStyle,
          { backgroundColor, borderColor },
        ]}
      >
        <Text style={styles.emoji}>{cuisine.emoji}</Text>
        <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
          {cuisine.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    gap: 6,
    minHeight: 80,
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },
});
