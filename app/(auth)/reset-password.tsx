import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';
import { resetPasswordSchema } from '@/schemas/auth.schema';

export default function ResetPasswordScreen() {
  const { colors, spacing } = useTheme();

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [errors, setErrors]       = useState<{ password?: string; confirm?: string; form?: string }>({});
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  function validate() {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword: confirm });
    if (result.success) { setErrors({}); return true; }
    const errs: typeof errors = {};
    for (const issue of result.error.issues) {
      if (issue.path[0] === 'password')         errs.password = "Password needs at least 8 characters.";
      if (issue.path[0] === 'confirmPassword')  errs.confirm  = "Passwords do not match.";
    }
    setErrors(errs);
    return false;
  }

  async function handleUpdate() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await authService.updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.replace('/(auth)/sign-in'), 2000);
    } catch {
      setErrors({ form: "Something broke on our end. Try again in a sec." });
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
            <Text style={[styles.title, { color: colors.textPrimary }]}>Set a new password</Text>
          </View>

          {success ? (
            <Text style={[styles.successText, { color: colors.success }]}>
              Password updated. You're good to go.
            </Text>
          ) : (
            <View style={{ gap: spacing.md }}>
              <Input
                label="New password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
                placeholder="At least 8 characters"
              />
              <Input
                label="Confirm password"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                error={errors.confirm}
                placeholder="Same password again"
              />
              {errors.form && (
                <Text style={[styles.formError, { color: colors.error }]}>{errors.form}</Text>
              )}
              <Button
                label="Update Password"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                onPress={handleUpdate}
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
  successText: { fontFamily: 'Inter_600SemiBold', fontSize: 18, textAlign: 'center' },
  formError:   { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center' },
});
