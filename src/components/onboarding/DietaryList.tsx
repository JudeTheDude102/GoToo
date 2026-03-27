import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { DietaryItem, type DietaryOption } from './DietaryItem';
import type { DietaryRestriction } from '@/stores/onboardingStore';

const DIETARY_OPTIONS: DietaryOption[] = [
  // Critical allergies
  { type: 'peanuts',      displayName: 'Peanuts',      category: 'allergy',     defaultSeverity: 'critical',   iconName: 'AlertTriangle' },
  { type: 'tree_nuts',    displayName: 'Tree Nuts',    category: 'allergy',     defaultSeverity: 'critical',   iconName: 'AlertTriangle' },
  { type: 'shellfish',    displayName: 'Shellfish',    category: 'allergy',     defaultSeverity: 'critical',   iconName: 'AlertTriangle' },
  { type: 'fish',         displayName: 'Fish',         category: 'allergy',     defaultSeverity: 'critical',   iconName: 'AlertTriangle' },
  // Important allergies/intolerances
  { type: 'dairy',        displayName: 'Dairy',        category: 'allergy',     defaultSeverity: 'important',  iconName: 'AlertCircle' },
  { type: 'eggs',         displayName: 'Eggs',         category: 'allergy',     defaultSeverity: 'important',  iconName: 'AlertCircle' },
  { type: 'wheat_gluten', displayName: 'Wheat/Gluten', category: 'intolerance', defaultSeverity: 'important',  iconName: 'AlertCircle' },
  { type: 'soy',          displayName: 'Soy',          category: 'allergy',     defaultSeverity: 'important',  iconName: 'AlertCircle' },
  // Dietary preferences
  { type: 'vegetarian',   displayName: 'Vegetarian',   category: 'diet',        defaultSeverity: 'preference', iconName: 'Leaf' },
  { type: 'vegan',        displayName: 'Vegan',        category: 'diet',        defaultSeverity: 'preference', iconName: 'Leaf' },
  // Religious
  { type: 'halal',        displayName: 'Halal',        category: 'religious',   defaultSeverity: 'important',  iconName: 'Star' },
  { type: 'kosher',       displayName: 'Kosher',       category: 'religious',   defaultSeverity: 'important',  iconName: 'Star' },
  // Lifestyle diets
  { type: 'keto',         displayName: 'Keto',         category: 'diet',        defaultSeverity: 'preference', iconName: 'Flame' },
  { type: 'paleo',        displayName: 'Paleo',        category: 'diet',        defaultSeverity: 'preference', iconName: 'Flame' },
];

const SECTIONS: { title: string; types: string[] }[] = [
  {
    title: 'Allergies & Intolerances',
    types: ['peanuts', 'tree_nuts', 'shellfish', 'fish', 'dairy', 'eggs', 'wheat_gluten', 'soy'],
  },
  {
    title: 'Dietary Preferences',
    types: ['vegetarian', 'vegan', 'halal', 'kosher', 'keto', 'paleo'],
  },
];

interface DietaryListProps {
  restrictions: DietaryRestriction[];
  onToggle: (type: string) => void;
  onSeverityChange: (type: string, severity: string) => void;
}

export function DietaryList({ restrictions, onToggle, onSeverityChange }: DietaryListProps) {
  const { colors, spacing } = useTheme();

  const restrictionMap = new Map(restrictions.map((r) => [r.type, r]));

  return (
    <View style={{ gap: spacing.xl }}>
      {SECTIONS.map((section) => (
        <View key={section.title} style={{ gap: spacing.sm }}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {section.title.toUpperCase()}
          </Text>
          <View style={{ gap: spacing.sm }}>
            {section.types.map((type) => {
              const option = DIETARY_OPTIONS.find((o) => o.type === type)!;
              return (
                <DietaryItem
                  key={type}
                  option={option}
                  restriction={restrictionMap.get(type)}
                  onToggle={onToggle}
                  onSeverityChange={onSeverityChange}
                />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
