import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const SIZE = {
  large:  { height: 52, paddingH: 24, fontSize: 16, radius: 12 },
  medium: { height: 44, paddingH: 20, fontSize: 14, radius: 8  },
  small:  { height: 36, paddingH: 16, fontSize: 13, radius: 8  },
} as const;

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variantStyle = {
    primary:     { bg: colors.primary,      text: colors.onPrimary,      borderWidth: 0,   borderColor: 'transparent' },
    secondary:   { bg: 'transparent',       text: colors.primary,        borderWidth: 1.5, borderColor: colors.primary },
    ghost:       { bg: 'transparent',       text: colors.textSecondary,  borderWidth: 0,   borderColor: 'transparent' },
    destructive: { bg: colors.error,        text: '#FFFFFF',             borderWidth: 0,   borderColor: 'transparent' },
  }[variant];

  const sz = SIZE[size];
  const opacity = disabled ? 0.4 : 1;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withTiming(0.97, { duration: 100 }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration: 100 }); }}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={fullWidth ? { width: '100%' } : undefined}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            height: sz.height,
            paddingHorizontal: sz.paddingH,
            borderRadius: sz.radius,
            backgroundColor: variantStyle.bg,
            borderWidth: variantStyle.borderWidth,
            borderColor: variantStyle.borderColor,
            opacity,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variantStyle.text} size="small" />
        ) : (
          <>
            {iconLeft && <View>{iconLeft}</View>}
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: sz.fontSize,
                color: variantStyle.text,
              }}
            >
              {label}
            </Text>
            {iconRight && <View>{iconRight}</View>}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}
