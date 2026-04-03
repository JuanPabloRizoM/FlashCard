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
    await signIn({ email: normalizeEmail(email), password });
    setInfoMessage(strings.auth.signIn.unavailableNotice);
  }

  return (
    <AuthScaffold
      backLabel={strings.auth.common.back}
      onBack={onBack}
      subtitle={strings.auth.signIn.subtitle}
      title={strings.auth.signIn.title}
    >
      <View style={styles.fieldGroup}>
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

        <Text style={styles.label}>{strings.auth.common.passwordLabel}</Text>
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

      {formError != null ? <Text style={styles.errorText}>{formError}</Text> : null}
      {infoMessage != null ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

      <Pressable accessibilityRole="button" onPress={() => void onSubmit()} style={styles.primaryButton}>
        <Text style={styles.primaryButtonLabel}>{strings.auth.signIn.submit}</Text>
      </Pressable>

      <Pressable accessibilityRole="button" onPress={onOpenForgotPassword} style={styles.linkButton}>
        <Text style={styles.linkButtonLabel}>{strings.auth.signIn.forgotPassword}</Text>
      </Pressable>
    </AuthScaffold>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    fieldGroup: {
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
      borderRadius: 14,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: typography.body,
      paddingHorizontal: spacing.m,
      paddingVertical: 14
    },
    inputError: {
      borderColor: colors.error
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    },
    infoText: {
      color: colors.primary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingHorizontal: spacing.m,
      paddingVertical: 16
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    linkButton: {
      alignSelf: 'flex-start'
    },
    linkButtonLabel: {
      color: colors.primary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    }
  });
