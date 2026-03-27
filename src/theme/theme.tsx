import React, { createContext, useCallback, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { lightColors, darkColors, type Colors } from './tokens/colors';
import { typography, type Typography } from './tokens/typography';
import { spacing, type Spacing } from './tokens/spacing';
import { radius, type Radius } from './tokens/radius';
import { elevation, type Elevation } from './tokens/elevation';
import { animation, type Animation } from './tokens/animation';

export type ColorScheme = 'system' | 'light' | 'dark';

const storage = createMMKV({ id: 'theme' });
const THEME_KEY = 'colorScheme';

export interface ThemeContextValue {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  radius: Radius;
  elevation: Elevation;
  animation: Animation;
  isDark: boolean;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    () => (storage.getString(THEME_KEY) as ColorScheme | undefined) ?? 'system',
  );

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    storage.set(THEME_KEY, scheme);
    setColorSchemeState(scheme);
  }, []);

  const isDark =
    colorScheme === 'dark' ||
    (colorScheme === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, typography, spacing, radius, elevation, animation, isDark, colorScheme, setColorScheme }),
    [colors, isDark, colorScheme, setColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
