import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../../features/auth/AuthProvider';
import { AuthScaffold } from '../../components/auth/AuthScaffold';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type AuthLandingScreenProps = {
  autoTriggerGoogle?: boolean;
  onOpenSignIn: () => void;
  onOpenCreateAccount: () => void;
};

export function AuthLandingScreen({
  autoTriggerGoogle = false,
  onOpenSignIn,
  onOpenCreateAccount
}: AuthLandingScreenProps) {
  const { continueAsGuest, signInWithGoogle } = useAuth();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const hasAutoTriggeredGoogle = useRef(false);

  async function onGooglePress() {
    const result = await signInWithGoogle();

    if (result.status === 'error' || result.status === 'info' || result.status === 'redirecting') {
      setInfoMessage(result.message ?? strings.auth.landing.googleSupport);
      return;
    }

    setInfoMessage(null);
  }

  useEffect(() => {
    if (!autoTriggerGoogle || hasAutoTriggeredGoogle.current) {
      return;
    }

    hasAutoTriggeredGoogle.current = true;
    void onGooglePress();
  }, [autoTriggerGoogle]);

  return (
    <AuthScaffold
      footer={<Text style={styles.footerText}>{strings.auth.landing.footer}</Text>}
      subtitle={strings.auth.landing.subtitle}
      title={strings.auth.landing.title}
    >
      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>{strings.auth.landing.googleButton}</Text>
        <Text style={styles.supportText}>{strings.auth.landing.googleSupport}</Text>
      </View>

      <View style={styles.primaryGroup}>
        <Pressable accessibilityRole="button" onPress={() => void onGooglePress()} style={styles.googleButton}>
          <View style={styles.googleBadge}>
            <Text style={styles.googleBadgeLabel}>G</Text>
          </View>
          <Text style={styles.googleButtonLabel}>{strings.auth.landing.googleButton}</Text>
        </Pressable>

        {infoMessage != null ? (
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>{infoMessage}</Text>
          </View>
        ) : null}

        <Pressable accessibilityRole="button" onPress={onOpenSignIn} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>{strings.auth.landing.emailButton}</Text>
        </Pressable>
      </View>

      <View style={styles.secondaryGroup}>
        <Pressable accessibilityRole="button" onPress={onOpenCreateAccount} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonLabel}>{strings.auth.landing.createAccount}</Text>
        </Pressable>
      </View>

      <View style={styles.guestCard}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void continueAsGuest();
          }}
          style={styles.guestButton}
        >
          <Text style={styles.guestButtonLabel}>{strings.auth.landing.guestButton}</Text>
        </Pressable>
        <Text style={styles.guestSupport}>{strings.auth.landing.guestSupport}</Text>
      </View>
    </AuthScaffold>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    supportCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 18,
      borderWidth: 1,
      gap: spacing.xs,
      padding: spacing.m
    },
    supportTitle: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    supportText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    primaryGroup: {
      gap: spacing.s
    },
    secondaryGroup: {
      gap: spacing.s
    },
    guestCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.s
    },
    googleButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'center',
      paddingHorizontal: spacing.m,
      paddingVertical: 18
    },
    googleBadge: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
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
    infoBanner: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    infoText: {
      color: colors.primary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingHorizontal: spacing.m,
      paddingVertical: 18
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.borderStrong,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: 16
    },
    secondaryButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    guestButton: {
      alignItems: 'center',
      paddingHorizontal: spacing.m,
      paddingTop: spacing.m,
      paddingBottom: spacing.xs
    },
    guestButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    guestSupport: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18,
      paddingBottom: spacing.m,
      paddingHorizontal: spacing.m,
      textAlign: 'center'
    },
    footerText: {
      color: colors.textMuted,
      fontSize: typography.caption,
      lineHeight: 18,
      textAlign: 'center'
    }
  });
