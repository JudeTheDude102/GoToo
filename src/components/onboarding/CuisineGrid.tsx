import { StyleSheet, View } from 'react-native';
import { CuisineTile, type Cuisine } from './CuisineTile';

export const ALL_CUISINES: Cuisine[] = [
  { id: 'italian',      label: 'Italian',      emoji: '🍝' },
  { id: 'japanese',     label: 'Japanese',     emoji: '🍱' },
  { id: 'mexican',      label: 'Mexican',      emoji: '🌮' },
  { id: 'chinese',      label: 'Chinese',      emoji: '🥡' },
  { id: 'indian',       label: 'Indian',       emoji: '🍛' },
  { id: 'thai',         label: 'Thai',         emoji: '🍜' },
  { id: 'american',     label: 'American',     emoji: '🍔' },
  { id: 'french',       label: 'French',       emoji: '🥐' },
  { id: 'mediterranean',label: 'Mediterranean',emoji: '🫒' },
  { id: 'korean',       label: 'Korean',       emoji: '🥩' },
  { id: 'vietnamese',   label: 'Vietnamese',   emoji: '🍲' },
  { id: 'greek',        label: 'Greek',        emoji: '🥙' },
  { id: 'spanish',      label: 'Spanish',      emoji: '🥘' },
  { id: 'middle_eastern',label: 'Middle Eastern',emoji: '🧆' },
  { id: 'brazilian',    label: 'Brazilian',    emoji: '🥩' },
  { id: 'ethiopian',    label: 'Ethiopian',    emoji: '🫙' },
  { id: 'caribbean',    label: 'Caribbean',    emoji: '🌴' },
  { id: 'peruvian',     label: 'Peruvian',     emoji: '🥔' },
  { id: 'sushi',        label: 'Sushi',        emoji: '🍣' },
  { id: 'pizza',        label: 'Pizza',        emoji: '🍕' },
  { id: 'seafood',      label: 'Seafood',      emoji: '🦞' },
  { id: 'vegetarian',   label: 'Vegetarian',   emoji: '🥗' },
];

const NUM_COLUMNS = 3;

interface CuisineGridProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function CuisineGrid({ selected, onToggle }: CuisineGridProps) {
  // Split into rows of NUM_COLUMNS
  const rows: Cuisine[][] = [];
  for (let i = 0; i < ALL_CUISINES.length; i += NUM_COLUMNS) {
    rows.push(ALL_CUISINES.slice(i, i + NUM_COLUMNS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cuisine) => (
            <View key={cuisine.id} style={styles.cell}>
              <CuisineTile
                cuisine={cuisine}
                selected={selected.includes(cuisine.id)}
                onToggle={onToggle}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  cell: {
    flex: 1,
  },
});
