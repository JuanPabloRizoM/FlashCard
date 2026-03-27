import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type CardWorkspaceFeedbackStateProps = {
  message: string;
  title?: string;
  isLoading?: boolean;
  tone?: 'neutral' | 'info' | 'error';
};

export function CardWorkspaceFeedbackState({
  message,
  title,
  isLoading = false,
  tone = 'neutral'
}: CardWorkspaceFeedbackStateProps) {
  const toneStyles =
    tone === 'info'
      ? styles.infoTone
      : tone === 'error'
        ? styles.errorTone
        : styles.neutralTone;

  return (
    <View style={[styles.feedbackState, toneStyles]}>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {title != null ? <Text style={styles.feedbackTitle}>{title}</Text> : null}
      <Text style={styles.feedbackText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    justifyContent: 'center',
    minHeight: 160,
    padding: spacing.l
  },
  neutralTone: {
    backgroundColor: colors.surface
  },
  infoTone: {
    backgroundColor: colors.primarySoft
  },
  errorTone: {
    backgroundColor: colors.errorSoft
  },
  feedbackTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  feedbackText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center'
  }
});
