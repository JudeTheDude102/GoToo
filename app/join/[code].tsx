import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

// Invite codes are alphanumeric, 6–12 characters
const INVITE_CODE_RE = /^[A-Za-z0-9]{6,12}$/;

export default function GroupInviteScreen() {
  const { colors, spacing } = useTheme();
  const { code } = useLocalSearchParams<{ code: string }>();
  const session = useAuthStore((s) => s.session);

  const isValidCode = typeof code === 'string' && INVITE_CODE_RE.test(code);

  if (!isValidCode) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { gap: spacing.lg }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Invalid invite link</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            This link doesn't look right. Ask whoever invited you for a new one.
          </Text>
          <Button
            label="Go Home"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.replace('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { gap: spacing.lg }]}>
          <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
            <Users size={32} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Create an account to join this group
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Sign up for GoToo to join group sessions and find restaurants everyone loves.
          </Text>
          <Button
            label="Sign Up"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.replace('/(auth)/sign-up')}
          />
          <Button
            label="Already have an account? Sign in"
            variant="ghost"
            size="medium"
            fullWidth
            onPress={() => router.replace('/(auth)/sign-in')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { gap: spacing.lg }]}>
        <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
          <Users size={32} color={colors.primary} strokeWidth={2} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Group joining coming soon</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          You've been invited to join a group. Group sessions are coming in a future update — stay tuned!
        </Text>
        <Text style={[styles.code, { color: colors.textTertiary }]}>Invite code: {code}</Text>
        <Button
          label="Back to Home"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1 },
  container: { flex: 1, padding: 32, justifyContent: 'center', alignItems: 'center' },
  icon:      { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  title:     { fontFamily: 'Inter_700Bold', fontSize: 24, textAlign: 'center', letterSpacing: -0.3 },
  body:      { fontFamily: 'Inter_400Regular', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  code:      { fontFamily: 'Inter_400Regular', fontSize: 12 },
});
