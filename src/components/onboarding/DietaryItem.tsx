import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertTriangle, AlertCircle, Leaf, Star, Flame } from 'lucide-react-native';
import { useTheme } from '@/theme';
import type { DietaryRestriction } from '@/stores/onboardingStore';

export interface DietaryOption {
  type: string;
  displayName: string;
  category: 'allergy' | 'intolerance' | 'diet' | 'religious';
  defaultSeverity: 'critical' | 'important' | 'preference';
  iconName: 'AlertTriangle' | 'AlertCircle' | 'Leaf' | 'Star' | 'Flame';
}

const SEVERITY_LABELS: Record<string, string> = {
  critical:    'Allergy',
  important:   'Intolerance',
  preference:  'Preference',
};

const SEVERITY_ORDER = ['critical', 'important', 'preference'] as const;

interface DietaryItemProps {
  option: DietaryOption;
  restriction: DietaryRestriction | undefined;
  onToggle: (type: string) => void;
  onSeverityChange: (type: string, severity: string) => void;
}

function DietaryIcon({ name, color, size }: { name: DietaryOption['iconName']; color: string; size: number }) {
  switch (name) {
    case 'AlertTriangle': return <AlertTriangle size={size} color={color} />;
    case 'AlertCircle':   return <AlertCircle size={size} color={color} />;
    case 'Leaf':          return <Leaf size={size} color={color} />;
    case 'Star':          return <Star size={size} color={color} />;
    case 'Flame':         return <Flame size={size} color={color} />;
  }
}

export function DietaryItem({ option, restriction, onToggle, onSeverityChange }: DietaryItemProps) {
  const { colors } = useTheme();
  const isSelected = !!restriction;

  return (
    <View>
      <Pressable
        onPress={() => onToggle(option.type)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={option.displayName}
        style={[
          styles.row,
          {
            backgroundColor: isSelected ? colors.primaryLight : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
      >
        <DietaryIcon
          name={option.iconName}
          color={isSelected ? colors.primary : colors.textSecondary}
          size={20}
        />
        <Text style={[styles.name, { color: colors.textPrimary, flex: 1 }]}>
          {option.displayName}
        </Text>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isSelected ? colors.primary : 'transparent',
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          {isSelected && (
            <Text style={[styles.checkmark, { color: colors.onPrimary }]}>✓</Text>
          )}
        </View>
      </Pressable>

      {isSelected && (
        <View style={[styles.severityRow, { backgroundColor: colors.surfaceDim }]}>
          {SEVERITY_ORDER.map((level) => {
            const active = restriction.severity === level;
            return (
              <Pressable
                key={level}
                onPress={() => onSeverityChange(option.type, level)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={[
                  styles.severityButton,
                  {
                    backgroundColor: active ? colors.primary : 'transparent',
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.severityLabel,
                    { color: active ? colors.onPrimary : colors.textSecondary },
                  ]}
                >
                  {SEVERITY_LABELS[level]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 12,
    minHeight: 52,
  },
  name: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  severityRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -4,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 32,
    justifyContent: 'center',
  },
  severityLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
