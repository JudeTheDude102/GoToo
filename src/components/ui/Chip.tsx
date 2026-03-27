import { Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void; // removable variant — shows X button
}

export function Chip({ label, selected = false, onPress, onRemove }: ChipProps) {
  const { colors } = useTheme();

  const backgroundColor = selected ? colors.primary : colors.secondaryContainer;
  const textColor       = selected ? '#FFFFFF'      : colors.onSecondaryContainer;
  const iconColor       = selected ? '#FFFFFF'      : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      style={[styles.chip, { backgroundColor }]}
    >
      <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>

      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          style={styles.removeButton}
        >
          <X size={12} color={iconColor} strokeWidth={2.5} />
        </Pressable>
      )}
    </Pressable>
  );
}

// Convenience wrapper for rendering a list of chips with consistent gap
interface ChipGroupProps {
  children: React.ReactNode;
}

export function ChipGroup({ children }: ChipGroupProps) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8, // radiusMd
    gap: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
