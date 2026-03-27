import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './supabase';
import { logger } from '@/utils/logger';

// Configure Google Sign-In once at module load.
// Replace WEB_CLIENT_ID with your OAuth 2.0 Web Client ID from Google Cloud Console.
GoogleSignin.configure({
  webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
  scopes: ['email', 'profile'],
});

export const authService = {
  // ─── Email / Password ─────────────────────────────────────

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Create the public.users row (safe to fail silently if trigger handles it)
    if (data.user) {
      const { error: rowError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        display_name: email.split('@')[0],
      } as never);
      if (rowError && rowError.code !== '23505') {
        logger.warn('Failed to create user profile row', { code: rowError.code });
      }
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // ─── Social ───────────────────────────────────────────────

  async signInWithGoogle() {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokens.idToken,
    });
    if (error) throw error;
    return data;
  },

  async signInWithApple() {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
    });
    if (!credential.identityToken) throw new Error('No identity token returned');
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
    if (error) throw error;
    return data;
  },

  // ─── Password Reset ───────────────────────────────────────

  async sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'gotoo://reset-password',
    });
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  // ─── Email Verification ───────────────────────────────────

  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  },
};

// ─── Auth error → user-facing message ────────────────────────

export function getSignUpErrorMessage(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? '';
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return "That email's already taken. Try logging in?";
  if (msg.includes('network') || msg.includes('fetch'))
    return "Can't reach our servers. Check your connection.";
  return "Something broke on our end. Try again in a sec.";
}

export function getSignInErrorMessage(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? '';
  if (msg.includes('Invalid login credentials'))
    return "Wrong password. Give it another shot or reset it.";
  if (msg.includes('not found') || msg.includes('No user'))
    return "We couldn't find that account. Want to sign up?";
  if (msg.includes('Email not confirmed'))
    return "Check your inbox — you need to verify your email first.";
  if (msg.includes('Too many') || msg.includes('rate limit'))
    return "Too many tries. Take a breather and try again in a minute.";
  return "Something broke on our end. Try again in a sec.";
}
