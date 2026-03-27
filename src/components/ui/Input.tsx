import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  variant?: 'default' | 'search';
}

export function Input({
  label,
  error,
  iconLeft,
  secureTextEntry,
  variant = 'default',
  ...rest
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  const isSearch = variant === 'search';
  const height = isSearch ? 40 : 48;
  const radius = isSearch ? 9999 : 8;
  const bg = isSearch ? colors.surfaceDim : colors.surface;

  const borderColor = error
    ? colors.error
    : focused
    ? colors.borderFocused
    : colors.border;
  const borderWidth = focused || error ? 2 : 1;

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          style={[styles.label, { color: colors.textSecondary }]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.row,
          {
            height,
            borderRadius: radius,
            backgroundColor: bg,
            borderColor,
            borderWidth,
            paddingHorizontal: 16,
          },
        ]}
      >
        {iconLeft && (
          <View style={styles.iconLeft}>{iconLeft}</View>
        )}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); rest.onBlur?.(e); }}
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
            },
          ]}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            {hidden
              ? <EyeOff size={20} color={colors.textTertiary} />
              : <Eye    size={20} color={colors.textTertiary} />
            }
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:  { gap: 4 },
  label:    { fontFamily: 'Inter_500Medium', fontSize: 13 },
  row:      { flexDirection: 'row', alignItems: 'center' },
  iconLeft: { marginRight: 8 },
  input:    { flex: 1 },
  error:    { fontFamily: 'Inter_400Regular', fontSize: 12 },
});
