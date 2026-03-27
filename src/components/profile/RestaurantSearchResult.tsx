import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus, Check } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { SearchRestaurant } from '@/hooks/useRestaurantSearch';

interface RestaurantSearchResultProps {
  restaurant: SearchRestaurant;
  isFavorited: boolean;
  onAdd: () => void;
  onPress?: () => void;
}

export function RestaurantSearchResult({
  restaurant,
  isFavorited,
  onAdd,
  onPress,
}: RestaurantSearchResultProps) {
  const { colors } = useTheme();

  const cuisineLabel = restaurant.cuisine_types.slice(0, 3).join(' · ');

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {restaurant.photo_url ? (
        <Image source={{ uri: restaurant.photo_url }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, { backgroundColor: colors.surfaceDim }]} />
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
        {restaurant.google_rating ? (
          <Text style={[styles.rating, { color: colors.textTertiary }]}>
            ★ {restaurant.google_rating.toFixed(1)}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={isFavorited ? undefined : onAdd}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={isFavorited ? 'Already favorited' : 'Add to favorites'}
        style={[
          styles.actionButton,
          { backgroundColor: isFavorited ? colors.successContainer : colors.primaryLight },
        ]}
      >
        {isFavorited ? (
          <Check size={18} color={colors.success} strokeWidth={2.5} />
        ) : (
          <Plus size={18} color={colors.primary} strokeWidth={2.5} />
        )}
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
  rating: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
