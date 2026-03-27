import { Stack } from 'expo-router';
import { PageError } from '@/components/ui/ErrorCard';

export default function OnboardingLayout() {
  return (
    <PageError>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
        <Stack.Screen name="cuisines" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="dietary" />
        <Stack.Screen name="complete" />
      </Stack>
    </PageError>
  );
}
