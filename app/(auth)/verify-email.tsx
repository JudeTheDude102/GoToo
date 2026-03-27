import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';

export default function VerifyEmailScreen() {
  const { colors, spacing } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [cooldown, setCooldown]   = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      await authService.resendVerificationEmail(email);
      setCooldown(60);
    } finally {
      setResending(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { gap: spacing.xl }]}>
        <View style={styles.content}>
          <Mail size={48} color={colors.primary} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Check your inbox
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            We sent a verification link to{' '}
            <Text style={{ fontFamily: 'Inter_600SemiBold' }}>{email}</Text>
            {'. Tap it to get started.'}
          </Text>
        </View>

        <View style={{ gap: spacing.sm, width: '100%' }}>
          <Button
            label={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
            variant="secondary"
            size="medium"
            fullWidth
            loading={resending}
            disabled={cooldown > 0}
            onPress={handleResend}
          />
          <Button
            label="Use a different email"
            variant="ghost"
            size="medium"
            fullWidth
            onPress={() => router.replace('/(auth)/sign-up')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1 },
  container: { flex: 1, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  content:   { alignItems: 'center', gap: 16 },
  title:     { fontFamily: 'Inter_700Bold', fontSize: 24 },
  body:      { fontFamily: 'Inter_400Regular', fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
