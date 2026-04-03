import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../../features/auth/AuthProvider';
import { isValidEmail, normalizeEmail, normalizeName } from '../../../features/auth/authValidation';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';
import { AuthScaffold } from '../../components/auth/AuthScaffold';

type CreateAccountScreenProps = {
  onBack: () => void;
};

export function CreateAccountScreen({ onBack }: CreateAccountScreenProps) {
  const { signUp } = useAuth();
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (confirmPassword.trim().length === 0) {
      setFormError(strings.auth.validation.confirmPasswordRequired);
      return;
    }

    if (password !== confirmPassword) {
      setFormError(strings.auth.validation.passwordsDoNotMatch);
      return;
    }

    setFormError(null);
    setInfoMessage(null);
    await signUp({
      name: normalizeName(name),
      email: normalizeEmail(email),
      password
    });
    setInfoMessage(strings.auth.createAccount.unavailableNotice);
  }

  return (
    <AuthScaffold
      backLabel={strings.auth.common.back}
      onBack={onBack}
      subtitle={strings.auth.createAccount.subtitle}
      title={strings.auth.createAccount.title}
    >
      <View style={styles.fieldGroup}>
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>{strings.auth.createAccount.nameLabel}</Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={(value) => {
              setName(value);
              setFormError(null);
            }}
            placeholder={strings.auth.createAccount.namePlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={name}
          />
        </View>

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

        <View style={styles.passwordCard}>
          <View style={styles.fieldBlock}>
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

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{strings.auth.createAccount.confirmPasswordLabel}</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setFormError(null);
              }}
              placeholder={strings.auth.createAccount.confirmPasswordPlaceholder}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={[styles.input, formError != null ? styles.inputError : null]}
              value={confirmPassword}
            />
          </View>
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

      <Pressable accessibilityRole="button" onPress={() => void onSubmit()} style={styles.primaryButton}>
        <Text style={styles.primaryButtonLabel}>{strings.auth.createAccount.submit}</Text>
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
    passwordCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.m
    },
    label: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    },
    input: {
      backgroundColor: colors.surface,
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
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    }
  });
