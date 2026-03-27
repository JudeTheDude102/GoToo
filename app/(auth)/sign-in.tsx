import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService, getSignInErrorMessage } from '@/services/authService';
import { signInSchema } from '@/schemas/auth.schema';

export default function SignInScreen() {
  const { colors, spacing } = useTheme();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading]   = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  function validate() {
    const result = signInSchema.safeParse({ email, password });
    if (result.success) { setErrors({}); return true; }
    const fieldErrors: typeof errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password';
      if (field === 'email') fieldErrors.email = "That doesn't look like an email address.";
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSignIn() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await authService.signIn(email, password);
      // auth state change in root layout handles redirect
    } catch (e) {
      setErrors({ form: getSignInErrorMessage(e) });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setSocialLoading('google');
    try { await authService.signInWithGoogle(); }
    catch (e) { setErrors({ form: getSignInErrorMessage(e) }); }
    finally { setSocialLoading(null); }
  }

  async function handleApple() {
    setSocialLoading('apple');
    try { await authService.signInWithApple(); }
    catch (e) { setErrors({ form: getSignInErrorMessage(e) }); }
    finally { setSocialLoading(null); }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { gap: spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
          </View>

          {/* Social buttons */}
          <View style={{ gap: spacing.sm }}>
            <Button
              label="Continue with Google"
              variant="secondary"
              size="large"
              fullWidth
              loading={socialLoading === 'google'}
              onPress={handleGoogle}
            />
            <Button
              label="Continue with Apple"
              variant="primary"
              size="large"
              fullWidth
              loading={socialLoading === 'apple'}
              onPress={handleApple}
            />
          </View>

          {/* Divider */}
          <View style={[styles.divider, { gap: spacing.md }]}>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
            <Text style={[styles.dividerText, { color: colors.textTertiary }]}>or</Text>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
          </View>

          {/* Form */}
          <View style={{ gap: spacing.md }}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              placeholder="you@example.com"
            />
            <View style={{ gap: spacing.xs }}>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
                placeholder="Your password"
              />
              <Pressable
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotLink}
              >
                <Text style={[styles.forgotText, { color: colors.primary }]}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>
            {errors.form && (
              <Text style={[styles.formError, { color: colors.error }]}>{errors.form}</Text>
            )}
            <Button
              label="Log In"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              onPress={handleSignIn}
            />
          </View>

          {/* Footer */}
          <Pressable onPress={() => router.replace('/(auth)/sign-up')} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Sign up</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { padding: 24, flexGrow: 1 },
  title:       { fontFamily: 'Inter_700Bold', fontSize: 28 },
  divider:     { flexDirection: 'row', alignItems: 'center' },
  line:        { flex: 1, height: 1 },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  formError:   { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center' },
  forgotLink:  { alignSelf: 'flex-end' },
  forgotText:  { fontFamily: 'Inter_400Regular', fontSize: 13 },
  footer:      { alignItems: 'center', paddingVertical: 8 },
  footerText:  { fontFamily: 'Inter_400Regular', fontSize: 14 },
});
