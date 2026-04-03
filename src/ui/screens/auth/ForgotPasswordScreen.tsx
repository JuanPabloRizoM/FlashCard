import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../../features/auth/AuthProvider';
import { isValidEmail, normalizeEmail } from '../../../features/auth/authValidation';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';
import { AuthScaffold } from '../../components/auth/AuthScaffold';

type ForgotPasswordScreenProps = {
  onBack: () => void;
};

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const { resetPassword } = useAuth();
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  async function onSubmit() {
    if (!isValidEmail(email)) {
      setFormError(strings.auth.validation.invalidEmail);
      return;
    }

    setFormError(null);
    const result = await resetPassword(normalizeEmail(email));
    setSubmittedEmail(result.email);
  }

  return (
    <AuthScaffold
      backLabel={strings.auth.common.back}
      onBack={onBack}
      subtitle={strings.auth.forgotPassword.subtitle}
      title={strings.auth.forgotPassword.title}
    >
      {submittedEmail != null ? (
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>{strings.auth.forgotPassword.confirmationTitle}</Text>
          <Text style={styles.confirmationText}>{strings.auth.forgotPassword.confirmationMessage(submittedEmail)}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSubmittedEmail(null);
              setEmail('');
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonLabel}>{strings.auth.forgotPassword.sendAnother}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.fieldGroup}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>{strings.auth.common.emailLabel}</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(value) => {
                  setEmail(value);
                  setFormError(null);
                }}
                placeholder={strings.auth.common.emailPlaceholder}
                placeholderTextColor={colors.textMuted}
                style={[styles.input, formError != null ? styles.inputError : null]}
                value={email}
              />
            </View>
          </View>

          {formError != null ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          <Pressable accessibilityRole="button" onPress={() => void onSubmit()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonLabel}>{strings.auth.forgotPassword.submit}</Text>
          </Pressable>
        </>
      )}
    </AuthScaffold>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    fieldGroup: {
      gap: spacing.m
    },
    fieldBlock: {
      gap: spacing.s
    },
    label: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    },
    input: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: typography.body,
      paddingHorizontal: spacing.m,
      paddingVertical: 15
    },
    inputError: {
      borderColor: colors.error
    },
    errorBanner: {
      backgroundColor: colors.errorSoft,
      borderColor: colors.error,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption,
      lineHeight: 18
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: spacing.m,
      paddingVertical: 17
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    confirmationCard: {
      backgroundColor: colors.successSoft,
      borderColor: colors.success,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    confirmationTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    confirmationText: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22
    },
    secondaryButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    secondaryButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    }
  });
