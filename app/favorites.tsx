import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFavoriteRestaurants } from '@/hooks/useFavoriteRestaurants';
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch';
import { FavoriteRestaurantRow } from '@/components/profile/FavoriteRestaurantRow';
import { RestaurantSearchResult } from '@/components/profile/RestaurantSearchResult';
import { showToast } from '@/components/ui/ToastProvider';

export default function FavoritesScreen() {
  const { colors, spacing } = useTheme();
  const [query, setQuery] = useState('');

  const { favorites, isLoading: favLoading, remove, add } = useFavoriteRestaurants();
  const { results, isLoading: searchLoading, hasQuery } = useRestaurantSearch(query);

  const favoritedIds = new Set(favorites.map((f) => f.restaurant_id));

  function handleAdd(restaurantId: string) {
    add(
      { restaurantId, addedFrom: 'profile' },
      {
        onSuccess: () => showToast.success('Added to favorites'),
        onError: () => showToast.error('Could not add favorite'),
      },
    );
  }

  function handleRemove(favoriteId: string) {
    remove(favoriteId, {
      onError: () => showToast.error('Could not remove favorite'),
    });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomColor: colors.divider }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Favorite Spots</Text>
        <Button label="Done" variant="ghost" size="small" onPress={() => router.back()} />
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
        <Input
          variant="search"
          placeholder="Search restaurants…"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* List — search results or favorites */}
      {hasQuery ? (
        <FlatList
          data={searchLoading ? [] : results}
          keyExtractor={(item) => item.google_place_id}
          contentContainerStyle={[styles.list, { padding: spacing.lg }]}
          ListHeaderComponent={
            searchLoading ? (
              <View style={{ gap: 12 }}>
                {[0, 1, 2].map((i) => <Skeleton key={i} height={64} borderRadius={10} />)}
              </View>
            ) : null
          }
          ListEmptyComponent={
            !searchLoading ? (
              <EmptyState title="No results" description="Try a different search." />
            ) : null
          }
          renderItem={({ item }) => (
            <RestaurantSearchResult
              restaurant={item}
              isFavorited={favoritedIds.has(item.id)}
              onAdd={() => handleAdd(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      ) : (
        <FlatList
          data={favLoading ? [] : favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { padding: spacing.lg }]}
          ListHeaderComponent={
            favLoading ? (
              <View style={{ gap: 12 }}>
                {[0, 1, 2].map((i) => <Skeleton key={i} height={64} borderRadius={10} />)}
              </View>
            ) : null
          }
          ListEmptyComponent={
            !favLoading ? (
              <EmptyState
                title="No favorites yet"
                description="Search for a restaurant above to add your first favorite."
              />
            ) : null
          }
          renderItem={({ item }) => (
            <FavoriteRestaurantRow
              favorite={item}
              onDelete={() => handleRemove(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title:  { fontFamily: 'Inter_700Bold', fontSize: 20 },
  list:   { flexGrow: 1 },
});
