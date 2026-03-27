import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createZustandMMKVStorage } from '../utils/mmkvStorage';

export interface DietaryRestriction {
  type: string;
  severity: string;
  isHardConstraint: boolean;
}

interface OnboardingState {
  currentStep: number;
  cuisineSelections: string[];
  spiceTolerance: number;
  adventurousness: number;
  pricePreference: number;
  dietaryRestrictions: DietaryRestriction[];
}

interface OnboardingActions {
  setStep: (step: number) => void;
  setCuisines: (cuisines: string[]) => void;
  setPreferences: (prefs: {
    spiceTolerance?: number;
    adventurousness?: number;
    pricePreference?: number;
  }) => void;
  setDietary: (restrictions: DietaryRestriction[]) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  currentStep: 1,
  cuisineSelections: [],
  spiceTolerance: 3,
  adventurousness: 3,
  pricePreference: 2,
  dietaryRestrictions: [],
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (currentStep) => set({ currentStep }),
      setCuisines: (cuisineSelections) => set({ cuisineSelections }),
      setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
      setDietary: (dietaryRestrictions) => set({ dietaryRestrictions }),
      reset: () => set(initialState),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => createZustandMMKVStorage('onboarding')),
    },
  ),
);
