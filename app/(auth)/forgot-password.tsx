import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';
import { forgotPasswordSchema } from '@/schemas/auth.schema';

export default function ForgotPasswordScreen() {
  const { colors, spacing } = useTheme();

  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError("That doesn't look like an email address.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.sendPasswordResetEmail(email);
      setSuccess(true);
    } catch {
      // Deliberately vague — don't confirm whether email exists
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { gap: spacing.xl }]}>
          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Reset your password
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              Enter your email and we'll send a reset link.
            </Text>
          </View>

          {success ? (
            <Text style={[styles.successText, { color: colors.textSecondary }]}>
              If that email's in our system, you'll get a reset link.
            </Text>
          ) : (
            <View style={{ gap: spacing.md }}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={error}
                placeholder="you@example.com"
              />
              <Button
                label="Send Reset Link"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                onPress={handleSend}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  container:   { flex: 1, padding: 24, justifyContent: 'center' },
  title:       { fontFamily: 'Inter_700Bold', fontSize: 28 },
  body:        { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24 },
  successText: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24 },
});
