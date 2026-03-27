import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  authService,
  getSignInErrorMessage,
  getSignUpErrorMessage,
} from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';
import { showToast } from '@/components/ui/ToastProvider';

export function useAuth() {
  const { setSession, setUser, setIsOnboarded, clear } = useAuthStore();
  const queryClient = useQueryClient();

  const signUp = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signUp(email, password),
    onSuccess: (data) => {
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
    },
    onError: (error) => {
      showToast.error(getSignUpErrorMessage(error));
    },
  });

  const signIn = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: async (data) => {
      setSession(data.session);
      setUser(data.user);
      // Sync onboarding status from DB
      if (data.user) {
        const db = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        const { data: profile } = await db
          .from('users')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single();
        if (profile?.onboarding_completed) setIsOnboarded(true);
      }
    },
    onError: (error) => {
      showToast.error(getSignInErrorMessage(error));
    },
  });

  const signOut = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      clear();
      queryClient.clear();
      router.replace('/(auth)/welcome');
    },
    onError: () => {
      showToast.error("Couldn't sign out. Try again.");
    },
  });

  const signInWithGoogle = useMutation({
    mutationFn: () => authService.signInWithGoogle(),
    onSuccess: (data) => {
      setSession(data.session);
      setUser(data.user);
    },
    onError: () => {
      showToast.error("Google sign-in failed. Try again.");
    },
  });

  const signInWithApple = useMutation({
    mutationFn: () => authService.signInWithApple(),
    onSuccess: (data) => {
      setSession(data.session);
      setUser(data.user);
    },
    onError: () => {
      showToast.error("Apple sign-in failed. Try again.");
    },
  });

  const forgotPassword = useMutation({
    mutationFn: (email: string) => authService.sendPasswordResetEmail(email),
    onError: () => {
      showToast.error("Couldn't send reset email. Try again.");
    },
  });

  const resetPassword = useMutation({
    mutationFn: (password: string) => authService.updatePassword(password),
    onSuccess: () => {
      showToast.success('Password updated.');
    },
    onError: () => {
      showToast.error("Couldn't update password. Try again.");
    },
  });

  return {
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithApple,
    forgotPassword,
    resetPassword,
  };
}
