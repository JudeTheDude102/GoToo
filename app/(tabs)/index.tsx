import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { EmptyState } from '@/components/ui/EmptyState';

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.container}>
        <EmptyState
          title="Your Picks Are Coming"
          description="We're building your personalized feed. Hang tight."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1 },
  container: { flex: 1, justifyContent: 'center' },
});
