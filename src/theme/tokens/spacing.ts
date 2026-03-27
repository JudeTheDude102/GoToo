export const spacing = {
  xxs:   2,  // Hairline: icon-to-text nudge
  xs:    4,  // Tight: icon-label gap, chip internal
  sm:    8,  // Standard tight: title/subtitle gap
  md:   12,  // Moderate: card internal padding
  lg:   16,  // Comfortable: screen padding, card padding
  xl:   20,  // Generous: between sections
  xxl:  24,  // Large: major sections
  xxxl: 32,  // Hero: screen top padding
  jumbo:48,  // Extreme: onboarding spacing
} as const;

export type Spacing = typeof spacing;
