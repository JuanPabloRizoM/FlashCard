import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../../features/auth/AuthProvider';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { AuthScaffold } from '../../components/auth/AuthScaffold';

type AuthLandingScreenProps = {
  onOpenSignIn: () => void;
  onOpenCreateAccount: () => void;
};

export function AuthLandingScreen({ onOpenSignIn, onOpenCreateAccount }: AuthLandingScreenProps) {
  const { continueAsGuest, signInWithGoogle } = useAuth();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function onGooglePress() {
    await signInWithGoogle();
    setInfoMessage(strings.auth.landing.googleSupport);
  }

  return (
    <AuthScaffold
      footer={<Text style={styles.footerText}>{strings.auth.landing.footer}</Text>}
      subtitle={strings.auth.landing.subtitle}
      title={strings.auth.landing.title}
    >
      <View style={styles.actionGroup}>
        <Pressable accessibilityRole="button" onPress={() => void onGooglePress()} style={styles.googleButton}>
          <View style={styles.googleBadge}>
            <Text style={styles.googleBadgeLabel}>G</Text>
          </View>
          <Text style={styles.googleButtonLabel}>{strings.auth.landing.googleButton}</Text>
        </Pressable>

        <Text style={styles.placeholderText}>{infoMessage ?? strings.auth.landing.googleSupport}</Text>

        <Pressable accessibilityRole="button" onPress={onOpenSignIn} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>{strings.auth.landing.emailButton}</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={onOpenCreateAccount} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonLabel}>{strings.auth.landing.createAccount}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void continueAsGuest();
          }}
          style={styles.guestButton}
        >
          <Text style={styles.guestButtonLabel}>{strings.auth.landing.guestButton}</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    actionGroup: {
      gap: spacing.s
    },
    googleButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.borderStrong,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'center',
      paddingHorizontal: spacing.m,
      paddingVertical: 16
    },
    googleBadge: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      height: 28,
      justifyContent: 'center',
      width: 28
    },
    googleBadgeLabel: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    googleButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    placeholderText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: spacing.m,
      paddingVertical: 16
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: 16
    },
    secondaryButtonLabel: {
      color: colors.primary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    guestButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: 16
    },
    guestButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    footerText: {
      color: colors.textMuted,
      fontSize: typography.caption,
      lineHeight: 18,
      textAlign: 'center'
    }
  });
