import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
import { router } from 'expo-router';
import { useTheme } from '../../theme';

// ─── Shared fallback card ────────────────────────────────────────────────────

interface ErrorCardProps extends FallbackProps {
  onSecondaryPress: () => void;
  secondaryLabel: string;
}

function ErrorCard({ error, resetErrorBoundary, onSecondaryPress, secondaryLabel }: ErrorCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.errorContainer, maxWidth: 320 }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Something went wrong
        </Text>

        {__DEV__ && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {error instanceof Error ? error.message : String(error)}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={resetErrorBoundary}
          accessibilityRole="button"
        >
          <Text style={[styles.primaryLabel, { color: colors.onPrimary }]}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostButton}
          onPress={onSecondaryPress}
          accessibilityRole="button"
        >
          <Text style={[styles.ghostLabel, { color: colors.info }]}>{secondaryLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── FullScreenError ─────────────────────────────────────────────────────────

function FullScreenFallback(props: FallbackProps) {
  return (
    <ErrorCard
      {...props}
      onSecondaryPress={() => router.replace('/')}
      secondaryLabel="Go Home"
    />
  );
}

export function FullScreenError({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FullScreenFallback}>
      {children}
    </ErrorBoundary>
  );
}

// ─── PageError ───────────────────────────────────────────────────────────────

function PageFallback(props: FallbackProps) {
  return (
    <ErrorCard
      {...props}
      onSecondaryPress={() => router.back()}
      secondaryLabel="Go Back"
    />
  );
}

export function PageError({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={PageFallback}>
      {children}
    </ErrorBoundary>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 4,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  ghostButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
});
