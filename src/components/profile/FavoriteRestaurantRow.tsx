import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { FavoriteRestaurant } from '@/hooks/useFavoriteRestaurants';

interface FavoriteRestaurantRowProps {
  favorite: FavoriteRestaurant;
  onDelete: () => void;
  onPress?: () => void;
}

export function FavoriteRestaurantRow({ favorite, onDelete, onPress }: FavoriteRestaurantRowProps) {
  const { colors } = useTheme();
  const restaurant = favorite.restaurants;
  if (!restaurant) return null;

  const cuisineLabel = restaurant.cuisine_types.slice(0, 3).join(' · ');

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {restaurant.photo_references ? (
        <Image source={{ uri: restaurant.photo_references }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder, { backgroundColor: colors.surfaceDim }]} />
      )}

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {restaurant.name}
        </Text>
        {cuisineLabel ? (
          <Text style={[styles.cuisine, { color: colors.textSecondary }]} numberOfLines={1}>
            {cuisineLabel}
          </Text>
        ) : null}
        {favorite.notes ? (
          <Text style={[styles.notes, { color: colors.textTertiary }]} numberOfLines={1}>
            {favorite.notes}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onDelete}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Remove favorite"
        style={styles.deleteButton}
      >
        <Trash2 size={18} color={colors.error} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  thumbnailPlaceholder: {},
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  cuisine: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  notes: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
