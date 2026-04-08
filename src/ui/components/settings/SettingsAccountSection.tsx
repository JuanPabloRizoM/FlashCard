import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AuthEntryDestination, AuthSession } from '../../../core/types/auth';
import { useAuth } from '../../../features/auth/AuthProvider';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { GuestUpgradeModal } from './GuestUpgradeModal';

type SettingsAccountSectionProps = {
  session: AuthSession;
};

type UpgradeModalState = {
  destination: AuthEntryDestination;
  title: string;
  support: string;
  actionLabel: string;
} | null;

export function SettingsAccountSection({ session }: SettingsAccountSectionProps) {
  const { beginAuthEntry, signOut } = useAuth();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [upgradeModal, setUpgradeModal] = useState<UpgradeModalState>(null);

  const providerLabels = strings.screens.settings.providerLabels;
  const accountState =
    session.status === 'authenticated'
      ? strings.screens.settings.accountStateAuthenticated
      : session.status === 'guest'
        ? strings.screens.settings.accountStateGuest
        : strings.screens.settings.accountStateSignedOut;
  const sessionTitle = useMemo(() => {
    if (session.displayName != null) {
      return session.displayName;
    }

    if (session.email != null) {
      return session.email;
    }

    return accountState;
  }, [accountState, session.displayName, session.email]);

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
      return;
    }

    setIsSigningOut(false);
  }

  async function handleUpgradeConfirm() {
    if (upgradeModal == null) {
      return;
    }

    setSignOutError(null);
    setUpgradeModal(null);
    await beginAuthEntry(upgradeModal.destination);
  }

  return (
    <View style={styles.sectionGroup}>
      <View style={styles.section}>
        <Text style={styles.eyebrow}>{strings.screens.settings.accountEyebrow}</Text>
        <Text style={styles.sectionTitle}>{strings.screens.settings.accountTitle}</Text>
        <Text style={styles.supportText}>
          {session.status === 'guest'
            ? strings.screens.settings.accountSupportGuest
            : strings.screens.settings.accountSupportAuthenticated}
        </Text>

        {session.status === 'guest' ? (
          <>
            <View style={styles.accountMetaRow}>
              <Text style={styles.metaLabel}>{strings.screens.settings.accountStatusLabel}</Text>
              <Text style={styles.metaValue}>{accountState}</Text>
            </View>
            <View style={styles.actionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setUpgradeModal({
                    actionLabel: strings.screens.settings.linkGoogleAction,
                    destination: 'google',
                    support: strings.screens.settings.linkGoogleModalSupport,
                    title: strings.screens.settings.linkGoogleModalTitle
                  });
                }}
                style={styles.secondaryAction}
              >
                <Text style={styles.secondaryActionLabel}>{strings.screens.settings.linkGoogleAction}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setUpgradeModal({
                    actionLabel: strings.auth.landing.createAccount,
                    destination: 'create_account',
                    support: strings.screens.settings.createAccountModalSupport,
                    title: strings.screens.settings.createAccountModalTitle
                  });
                }}
                style={styles.secondaryAction}
              >
                <Text style={styles.secondaryActionLabel}>{strings.auth.landing.createAccount}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.metaList}>
            <View style={styles.accountMetaRow}>
              <Text style={styles.metaLabel}>{strings.screens.settings.accountStatusLabel}</Text>
              <Text style={styles.metaValue}>{accountState}</Text>
            </View>
            {session.provider != null ? (
              <View style={styles.accountMetaRow}>
                <Text style={styles.metaLabel}>{strings.screens.settings.accountProviderLabel}</Text>
                <Text style={styles.metaValue}>{providerLabels[session.provider]}</Text>
              </View>
            ) : null}
            {session.email != null ? (
              <View style={styles.accountMetaRow}>
                <Text style={styles.metaLabel}>{strings.screens.settings.accountEmailLabel}</Text>
                <Text style={styles.metaValue}>{session.email}</Text>
              </View>
            ) : null}
            {session.displayName != null ? (
              <View style={styles.accountMetaRow}>
                <Text style={styles.metaLabel}>{strings.screens.settings.accountNameLabel}</Text>
                <Text style={styles.metaValue}>{session.displayName}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.sectionDivider} />

      <View style={styles.section}>
        <Text style={styles.eyebrow}>{strings.screens.settings.signOutEyebrow}</Text>
        <Text style={styles.sectionTitle}>{strings.screens.settings.signOutTitle}</Text>
        <Text style={styles.supportText}>{signOutSupport}</Text>
        {session.status === 'authenticated' ? (
          <Text style={styles.sessionTitle}>{sessionTitle}</Text>
        ) : null}
        {signOutError != null ? <Text style={styles.errorText}>{signOutError}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={isSigningOut}
          onPress={() => {
            void handleSignOut();
          }}
          style={[styles.dangerAction, isSigningOut ? styles.dangerActionDisabled : null]}
        >
          <Text style={styles.dangerActionLabel}>{signOutActionLabel}</Text>
        </Pressable>
      </View>

      <GuestUpgradeModal
        actionLabel={upgradeModal?.actionLabel ?? ''}
        onClose={() => setUpgradeModal(null)}
        onConfirm={() => {
          void handleUpgradeConfirm();
        }}
        support={upgradeModal?.support ?? ''}
        title={upgradeModal?.title ?? ''}
        visible={upgradeModal != null}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionGroup: {
      gap: spacing.l
    },
    section: {
      gap: spacing.s
    },
    sectionDivider: {
      backgroundColor: colors.border,
      height: 1
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
    metaList: {
      gap: spacing.s,
      paddingTop: spacing.xs
    },
    accountMetaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between'
    },
    metaLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    metaValue: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: typography.bodySmall,
      fontWeight: '600',
      textAlign: 'right'
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      paddingTop: spacing.xs
    },
    secondaryAction: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    secondaryActionLabel: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    sessionTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '600'
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    },
    dangerAction: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.errorSoft,
      borderColor: colors.error,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    dangerActionDisabled: {
      opacity: 0.7
    },
    dangerActionLabel: {
      color: colors.error,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    }
  });
