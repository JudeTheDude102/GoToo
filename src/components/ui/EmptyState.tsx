import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  illustration?: React.ReactNode; // 160x160 slot
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export function EmptyState({
  illustration,
  title,
  description,
  ctaLabel,
  onCtaPress,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {illustration && (
        <View style={styles.illustration}>{illustration}</View>
      )}

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {title}
      </Text>

      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      )}

      {ctaLabel && onCtaPress && (
        <Button
          label={ctaLabel}
          variant="primary"
          size="medium"
          onPress={onCtaPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  illustration: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});
