export const radius = {
  radiusNone: 0,     // No rounding
  radiusSm:   4,     // Inline badges
  radiusMd:   8,     // Chips, tags, inputs, small buttons
  radiusLg:   12,    // Cards, large buttons
  radiusXl:   16,    // Bottom sheets, modals
  radiusXxl:  20,    // Onboarding cards
  radiusFull: 9999,  // Avatars, pills
} as const;

export type Radius = typeof radius;
