import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { FavoriteRestaurant } from '@/hooks/useFavoriteRestaurants';

interface FavoriteRestaurantMiniProps {
  favorite: FavoriteRestaurant;
  onPress?: () => void;
}

export function FavoriteRestaurantMini({ favorite, onPress }: FavoriteRestaurantMiniProps) {
  const { colors } = useTheme();
  const restaurant = favorite.restaurants;
  if (!restaurant) return null;

  const cuisineLabel = restaurant.cuisine_types.slice(0, 2).join(' · ');

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {restaurant.photo_references ? (
        <Image source={{ uri: restaurant.photo_references }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: colors.surfaceDim }]} />
      )}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {restaurant.name}
        </Text>
        {cuisineLabel ? (
          <Text style={[styles.cuisine, { color: colors.textSecondary }]} numberOfLines={1}>
            {cuisineLabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imagePlaceholder: {},
  info: {
    padding: 10,
    gap: 2,
  },
  name: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  cuisine: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
});
