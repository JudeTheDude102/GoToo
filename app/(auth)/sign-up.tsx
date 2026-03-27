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
import { authService, getSignUpErrorMessage } from '@/services/authService';
import { signUpSchema } from '@/schemas/auth.schema';

export default function SignUpScreen() {
  const { colors, spacing } = useTheme();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading]   = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  function validate() {
    const result = signUpSchema.safeParse({ email, password });
    if (result.success) { setErrors({}); return true; }
    const fieldErrors: typeof errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password';
      if (field === 'email')    fieldErrors.email    = "That doesn't look like an email address.";
      if (field === 'password') fieldErrors.password = "Password needs at least 8 characters.";
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await authService.signUp(email, password);
      router.push({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (e) {
      setErrors({ form: getSignUpErrorMessage(e) });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setSocialLoading('google');
    try { await authService.signInWithGoogle(); }
    catch (e) { setErrors({ form: getSignUpErrorMessage(e) }); }
    finally { setSocialLoading(null); }
  }

  async function handleApple() {
    setSocialLoading('apple');
    try { await authService.signInWithApple(); }
    catch (e) { setErrors({ form: getSignUpErrorMessage(e) }); }
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
            <Text style={[styles.title, { color: colors.textPrimary }]}>Create account</Text>
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
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              placeholder="At least 8 characters"
            />
            {errors.form && (
              <Text style={[styles.formError, { color: colors.error }]}>{errors.form}</Text>
            )}
            <Button
              label="Create Account"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              onPress={handleSignUp}
            />
          </View>

          {/* Footer */}
          <Pressable onPress={() => router.replace('/(auth)/sign-in')} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Log in</Text>
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
  footer:      { alignItems: 'center', paddingVertical: 8 },
  footerText:  { fontFamily: 'Inter_400Regular', fontSize: 14 },
});
