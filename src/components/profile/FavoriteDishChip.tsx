import { Chip } from '@/components/ui/Chip';
import type { FavoriteDish } from '@/hooks/useFavoriteDishes';

interface FavoriteDishChipProps {
  dish: FavoriteDish;
  onRemove: (id: string) => void;
}

export function FavoriteDishChip({ dish, onRemove }: FavoriteDishChipProps) {
  return (
    <Chip
      label={dish.dish_name}
      selected
      onRemove={() => onRemove(dish.id)}
    />
  );
}
