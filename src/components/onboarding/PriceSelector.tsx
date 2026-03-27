import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

const PRICE_OPTIONS = [
  { value: 1, label: '$',    description: 'Budget' },
  { value: 2, label: '$$',   description: 'Moderate' },
  { value: 3, label: '$$$',  description: 'Upscale' },
  { value: 4, label: '$$$$', description: 'Fine dining' },
];

interface PriceSelectorProps {
  label: string;
  value: number; // 1–4
  onChange: (value: number) => void;
}

export function PriceSelector({ label, value, onChange }: PriceSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View style={styles.options}>
        {PRICE_OPTIONS.map((option) => {
          const selected = value >= option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: value === option.value }}
              accessibilityLabel={`${option.label} ${option.description}`}
              style={[
                styles.option,
                {
                  backgroundColor: selected ? colors.primaryLight : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.priceLabel,
                  { color: selected ? colors.primary : colors.textSecondary },
                ]}
              >
                {option.label}
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {option.description}
              </Text>
            </Pressable>
          );
        })}
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
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    gap: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  priceLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
});
