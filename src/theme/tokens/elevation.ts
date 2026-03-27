// In dark mode, shadows are invisible — elevation is conveyed by surface color changes instead.
// These values are applied directly to View styles (iOS shadow props + Android elevation).

export interface ElevationLevel {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const shadow = (height: number, opacity: number, blur: number, elev: number): ElevationLevel => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: blur,
  elevation: elev,
});

export const elevation = {
  level0: shadow(0, 0,    0,  0),   // Flat
  level1: shadow(1, 0.08, 3,  2),   // Cards, chips
  level2: shadow(2, 0.12, 6,  4),   // Floating buttons
  level3: shadow(4, 0.16, 12, 8),   // Bottom sheets
  level4: shadow(8, 0.20, 24, 16),  // Modals
} as const;

export type Elevation = typeof elevation;
