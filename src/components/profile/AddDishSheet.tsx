import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

const CUISINE_SUGGESTIONS = [
  'Italian', 'Japanese', 'Mexican', 'Chinese', 'Indian', 'Thai',
  'American', 'French', 'Mediterranean', 'Korean', 'Vietnamese',
  'Greek', 'Spanish', 'Middle Eastern', 'Seafood', 'Pizza', 'Sushi',
];

interface AddDishSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (dishName: string, cuisineTag: string | null) => void;
  isLoading?: boolean;
}

export function AddDishSheet({ visible, onClose, onAdd, isLoading = false }: AddDishSheetProps) {
  const { colors, spacing } = useTheme();
  const [dishName, setDishName] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ dishName?: string }>({});

  function handleAdd() {
    const trimmed = dishName.trim();
    if (!trimmed) {
      setErrors({ dishName: 'Enter a dish name' });
      return;
    }
    onAdd(trimmed, selectedCuisine);
    setDishName('');
    setSelectedCuisine(null);
    setErrors({});
  }

  function handleClose() {
    setDishName('');
    setSelectedCuisine(null);
    setErrors({});
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.textPrimary }]}>What's the dish?</Text>

          <Input
            label="Dish name"
            placeholder="e.g. Tonkotsu ramen, Tiramisu…"
            value={dishName}
            onChangeText={(t) => { setDishName(t); setErrors({}); }}
            error={errors.dishName}
            autoFocus
          />

          <Text style={[styles.cuisineLabel, { color: colors.textSecondary }]}>
            Cuisine (optional)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cuisineScroll}
          >
            {CUISINE_SUGGESTIONS.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={selectedCuisine === c}
                onPress={() => setSelectedCuisine(selectedCuisine === c ? null : c)}
              />
            ))}
          </ScrollView>

          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            <Button
              label="Add Dish"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={!dishName.trim()}
              onPress={handleAdd}
            />
            <Button
              label="Cancel"
              variant="ghost"
              size="medium"
              fullWidth
              onPress={handleClose}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  keyboardView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  cuisineLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginBottom: -8,
  },
  cuisineScroll: {
    gap: 8,
    paddingRight: 8,
  },
});
