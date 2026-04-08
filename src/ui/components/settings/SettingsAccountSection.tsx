import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AuthSession } from '../../../core/types/auth';
import { useAuth } from '../../../features/auth/AuthProvider';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type SettingsAccountSectionProps = {
  session: AuthSession;
};

export function SettingsAccountSection({ session }: SettingsAccountSectionProps) {
  const { signOut } = useAuth();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const providerLabels = strings.screens.settings.providerLabels;
  const accountState =
    session.status === 'authenticated'
      ? strings.screens.settings.accountStateAuthenticated
      : session.status === 'guest'
        ? strings.screens.settings.accountStateGuest
        : strings.screens.settings.accountStateSignedOut;
  const badgeLabel = session.provider != null ? providerLabels[session.provider] : accountState;
  const accountSupport =
    session.status === 'guest'
      ? strings.screens.settings.accountSupportGuest
      : strings.screens.settings.accountSupportAuthenticated;
  const signOutSupport =
    session.status === 'guest'
      ? strings.screens.settings.signOutSupportGuest
      : strings.screens.settings.signOutSupportAuthenticated;
  const signOutActionLabel =
    session.status === 'guest'
      ? strings.screens.settings.signOutActionGuest
      : isSigningOut
        ? strings.screens.settings.signingOutAction
        : strings.screens.settings.signOutAction;
  const sessionTitle = useMemo(() => {
    if (session.displayName != null) {
      return session.displayName;
    }

    if (session.email != null) {
      return session.email;
    }

    return accountState;
  }, [accountState, session.displayName, session.email]);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setSignOutError(null);
    setIsSigningOut(true);

    try {
      await signOut();
    } catch {
      setIsSigningOut(false);
      setSignOutError(strings.screens.settings.signOutError);
    }
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.eyebrow}>{strings.screens.settings.accountEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.accountTitle}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeLabel}>{badgeLabel}</Text>
        </View>
      </View>
      <Text style={styles.supportText}>{accountSupport}</Text>
      <View style={styles.accountSummary}>
        <Text style={styles.accountSummaryTitle}>{sessionTitle}</Text>
        <Text style={styles.accountSummarySupport}>{signOutSupport}</Text>
      </View>
      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{strings.screens.settings.accountStatusLabel}</Text>
          <Text style={styles.infoValue}>{accountState}</Text>
        </View>
        {session.provider != null ? (
          <>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{strings.screens.settings.accountProviderLabel}</Text>
              <Text style={styles.infoValue}>{providerLabels[session.provider]}</Text>
            </View>
          </>
        ) : null}
        {session.displayName != null ? (
          <>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{strings.screens.settings.accountNameLabel}</Text>
              <Text style={styles.infoValue}>{session.displayName}</Text>
            </View>
          </>
        ) : null}
        {session.email != null ? (
          <>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{strings.screens.settings.accountEmailLabel}</Text>
              <Text style={styles.infoValue}>{session.email}</Text>
            </View>
          </>
        ) : null}
      </View>
      {signOutError != null ? <Text style={styles.errorText}>{signOutError}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={isSigningOut}
        onPress={() => {
          void handleSignOut();
        }}
        style={[styles.signOutButton, isSigningOut ? styles.signOutButtonDisabled : null]}
      >
        <Text style={styles.signOutButtonLabel}>{signOutActionLabel}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    sectionHeaderRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between'
    },
    sectionHeaderCopy: {
      flex: 1,
      gap: spacing.xs
    },
    eyebrow: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    supportText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    statusBadge: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    statusBadgeLabel: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    accountSummary: {
      gap: spacing.xs,
      paddingTop: spacing.xs
    },
    accountSummaryTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    accountSummarySupport: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    infoList: {
      gap: spacing.s,
      paddingTop: spacing.xs
    },
    infoRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    infoDivider: {
      backgroundColor: colors.border,
      height: 1
    },
    infoLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    infoValue: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '600'
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    },
    signOutButton: {
      alignItems: 'center',
      backgroundColor: colors.errorSoft,
      borderColor: colors.error,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m
    },
    signOutButtonDisabled: {
      opacity: 0.7
    },
    signOutButtonLabel: {
      color: colors.error,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    }
  });
