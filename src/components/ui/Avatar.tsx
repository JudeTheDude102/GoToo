import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

const SIZES = {
  small:  32,
  medium: 40,
  large:  56,
  xlarge: 80,
} as const;

const FONT_SIZES: Record<keyof typeof SIZES, number> = {
  small:  12,
  medium: 14,
  large:  20,
  xlarge: 28,
};

type AvatarSize = keyof typeof SIZES;

interface AvatarProps {
  size?: AvatarSize;
  uri?: string | null;
  name?: string | null; // used to generate initials fallback
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ size = 'medium', uri, name }: AvatarProps) {
  const { colors } = useTheme();
  const dim = SIZES[size];
  const fontSize = FONT_SIZES[size];

  const containerStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    backgroundColor: colors.secondaryContainer,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, containerStyle]}
        accessibilityRole="image"
        accessibilityLabel={name ?? 'Avatar'}
      />
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.initials, { fontSize, color: colors.onSecondaryContainer }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
  initials: {
    fontFamily: 'Inter_600SemiBold',
  },
});
