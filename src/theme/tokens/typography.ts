import type { TextStyle } from 'react-native';

export interface TypeStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: NonNullable<TextStyle['fontWeight']>;
  lineHeight: number;
  letterSpacing: number;
}

export const typography = {
  displayLarge:  { fontFamily: 'Inter_700Bold',    fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 },
  displaySmall:  { fontFamily: 'Inter_700Bold',    fontSize: 28, fontWeight: '700' as const, lineHeight: 36, letterSpacing: -0.3 },
  headlineLarge: { fontFamily: 'Inter_700Bold',    fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.2 },
  headlineMedium:{ fontFamily: 'Inter_600SemiBold',fontSize: 20, fontWeight: '600' as const, lineHeight: 26, letterSpacing:  0   },
  headlineSmall: { fontFamily: 'Inter_600SemiBold',fontSize: 18, fontWeight: '600' as const, lineHeight: 24, letterSpacing:  0   },
  bodyLarge:     { fontFamily: 'Inter_400Regular', fontSize: 16, fontWeight: '400' as const, lineHeight: 24, letterSpacing:  0.1 },
  bodyMedium:    { fontFamily: 'Inter_400Regular', fontSize: 14, fontWeight: '400' as const, lineHeight: 20, letterSpacing:  0.15},
  bodySmall:     { fontFamily: 'Inter_400Regular', fontSize: 13, fontWeight: '400' as const, lineHeight: 18, letterSpacing:  0.15},
  labelLarge:    { fontFamily: 'Inter_600SemiBold',fontSize: 14, fontWeight: '600' as const, lineHeight: 20, letterSpacing:  0.2 },
  labelMedium:   { fontFamily: 'Inter_500Medium',  fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing:  0.3 },
  labelSmall:    { fontFamily: 'Inter_500Medium',  fontSize: 11, fontWeight: '500' as const, lineHeight: 14, letterSpacing:  0.4 },
  caption:       { fontFamily: 'Inter_400Regular', fontSize: 10, fontWeight: '400' as const, lineHeight: 14, letterSpacing:  0.3 },
} satisfies Record<string, TypeStyle>;

export type Typography = typeof typography;
