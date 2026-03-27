export const lightColors = {
  // Primary (Amber)
  primary: '#D4882C',
  primaryLight: '#F5DEB3',
  primaryDark: '#A66A1E',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#3D2E14',

  // Secondary (Warm Charcoal)
  secondary: '#4A4037',
  secondaryContainer: '#EDE0D0',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#4A4037',

  // Accent (Coral/Terracotta)
  accent: '#C75B39',
  accentContainer: '#FCDDD2',
  onAccent: '#FFFFFF',

  // Semantic
  success: '#2E8B57',
  successContainer: '#D4F5E2',
  warning: '#E09F3E',
  warningContainer: '#FFF0D1',
  error: '#CC3333',
  errorContainer: '#FFE0E0',
  info: '#3B82F6',
  infoContainer: '#DBEAFE',

  // Surface / Background
  background: '#FAFAF7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceHighest: '#FFFFFF',
  surfaceDim: '#F0EDE8',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textTertiary: '#888888',
  textDisabled: '#BBBBBB',
  textInverse: '#FFFFFF',

  // Border
  border: '#E0DDD8',
  borderFocused: '#D4882C',
  divider: '#EEEBE5',

  // Match Score Colors
  matchExcellent: '#2E8B57',
  matchExcellentBg: '#D4F5E2',
  matchGreat: '#3A9F6B',
  matchGreatBg: '#DCF7E8',
  matchGood: '#D4882C',
  matchGoodBg: '#FFF0D1',
  matchFair: '#B07830',
  matchFairBg: '#F5E8D0',
  matchLow: '#888888',
  matchLowBg: '#EEEEEE',
};

export const darkColors: typeof lightColors = {
  // Primary (Amber)
  primary: '#F0A848',
  primaryLight: '#3D2E14',
  primaryDark: '#FFD08A',
  onPrimary: '#1E1200',
  onPrimaryContainer: '#F5DEB3',

  // Secondary (Warm Charcoal)
  secondary: '#C9BAA8',
  secondaryContainer: '#352C22',
  onSecondary: '#1E1200',
  onSecondaryContainer: '#EDE0D0',

  // Accent (Coral/Terracotta)
  accent: '#F0A48A',
  accentContainer: '#3E1D10',
  onAccent: '#2E1108',

  // Semantic
  success: '#6FCF97',
  successContainer: '#1A3D28',
  warning: '#FFD166',
  warningContainer: '#3D2E0F',
  error: '#FF6B6B',
  errorContainer: '#3D1111',
  info: '#7CB3FF',
  infoContainer: '#1A2D4D',

  // Surface / Background
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#252525',
  surfaceHighest: '#2C2C2C',
  surfaceDim: '#161616',

  // Text
  textPrimary: '#F0F0F0',
  textSecondary: '#A0A0A0',
  textTertiary: '#6B6B6B',
  textDisabled: '#444444',
  textInverse: '#1A1A1A',

  // Border
  border: '#333333',
  borderFocused: '#F0A848',
  divider: '#2A2A2A',

  // Match Score Colors
  matchExcellent: '#6FCF97',
  matchExcellentBg: '#1A3D28',
  matchGreat: '#7EDB9F',
  matchGreatBg: '#1F4530',
  matchGood: '#F0A848',
  matchGoodBg: '#3D2E14',
  matchFair: '#D4A04A',
  matchFairBg: '#352E1A',
  matchLow: '#6B6B6B',
  matchLowBg: '#2A2A2A',
};

export type Colors = typeof lightColors;
