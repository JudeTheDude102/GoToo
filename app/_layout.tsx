import 'expo-sqlite/localStorage/install';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/theme';
import { queryClient } from '@/services/queryClient';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';
import { FullScreenError } from '@/components/ui/ErrorCard';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function RootLayout() {
  const { session, isOnboarded, setSession, setUser, setIsOnboarded } = useAuthStore();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Determine initial auth state
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // If logged in, verify onboarding status from DB
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single() as { data: { onboarding_completed: boolean } | null };
        if (data) setIsOnboarded(data.onboarding_completed);
      }

      setAuthReady(true);
    });

    // Keep store in sync with auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setIsOnboarded(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Route once auth state is known
  useEffect(() => {
    if (!authReady) return;

    if (!session) {
      router.replace('/(auth)/welcome');
    } else if (!isOnboarded) {
      router.replace('/(onboarding)/welcome');
    } else {
      router.replace('/(tabs)');
    }
  }, [authReady, session, isOnboarded]);

  if (!authReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <StatusBar style="auto" />
            <FullScreenError>
              <>
                <Slot />
                <ToastProvider />
              </>
            </FullScreenError>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
