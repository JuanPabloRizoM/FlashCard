import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../../features/auth/AuthProvider';
import { isValidEmail, normalizeEmail } from '../../../features/auth/authValidation';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';
import { AuthScaffold } from '../../components/auth/AuthScaffold';

type SignInScreenProps = {
  onBack: () => void;
  onOpenForgotPassword: () => void;
};

export function SignInScreen({ onBack, onOpenForgotPassword }: SignInScreenProps) {
  const { signIn } = useAuth();
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    if (!isValidEmail(email)) {
      setFormError(strings.auth.validation.invalidEmail);
      return;
    }

    if (password.trim().length === 0) {
      setFormError(strings.auth.validation.passwordRequired);
      return;
    }

    setFormError(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    const result = await signIn({ email: normalizeEmail(email), password });
    setIsSubmitting(false);

    if (result.status === 'error') {
      setFormError(result.message);
      return;
    }

    if (result.status === 'info' || result.status === 'redirecting') {
      setInfoMessage(result.message ?? null);
    }
  }

  return (
    <AuthScaffold
      backLabel={strings.auth.common.back}
      onBack={onBack}
      subtitle={strings.auth.signIn.subtitle}
      title={strings.auth.signIn.title}
    >
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

        <View style={styles.fieldBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{strings.auth.common.passwordLabel}</Text>
            <Pressable accessibilityRole="button" onPress={onOpenForgotPassword} style={styles.inlineLinkButton}>
              <Text style={styles.inlineLinkLabel}>{strings.auth.signIn.forgotPassword}</Text>
            </Pressable>
          </View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(value) => {
              setPassword(value);
              setFormError(null);
            }}
            placeholder={strings.auth.common.passwordPlaceholder}
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[styles.input, formError != null ? styles.inputError : null]}
            value={password}
          />
        </View>
      </View>

      {formError != null ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}
      {infoMessage != null ? (
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>{infoMessage}</Text>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={() => void onSubmit()}
        style={[styles.primaryButton, isSubmitting ? styles.primaryButtonDisabled : null]}
      >
        <Text style={styles.primaryButtonLabel}>{strings.auth.signIn.submit}</Text>
      </Pressable>
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
    labelRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
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
      borderRadius: 16,
      paddingHorizontal: spacing.m,
      paddingVertical: 17
    },
    primaryButtonDisabled: {
      opacity: 0.7
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    inlineLinkButton: {
      paddingVertical: spacing.xs
    },
    inlineLinkLabel: {
      color: colors.primary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    }
  });
