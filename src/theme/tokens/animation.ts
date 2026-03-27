import { Easing } from 'react-native-reanimated';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring/springConfigs';

// Duration tokens (milliseconds) — pair with an easing when calling withTiming()
export const durations = {
  fast:    100,  // Button press, toggles
  normal:  250,  // Screen transitions
  slow:    400,  // Reveal animations
  slowest: 600,  // Onboarding hero
} as const;

// Easing tokens — use with withTiming({ duration, easing })
export const easings = {
  fast:      Easing.out(Easing.cubic),             // Button press, toggles
  standard:  Easing.bezier(0.4, 0.0, 0.2, 1),     // Screen transitions
  reveal:    Easing.bezier(0.0, 0.0, 0.2, 1),     // Reveal animations
  decelerate:Easing.bezier(0.4, 0.0, 0.2, 1),     // Onboarding hero
} as const;

// Spring presets — pass as config to withSpring()
export const springs = {
  interactive: { damping: 15, stiffness: 150 } satisfies SpringConfig,  // Interactive feedback
  overshoot:   { damping: 12, stiffness: 180 } satisfies SpringConfig,  // Celebrations, completion
} as const;

export const animation = { durations, easings, springs };
export type Animation = typeof animation;
