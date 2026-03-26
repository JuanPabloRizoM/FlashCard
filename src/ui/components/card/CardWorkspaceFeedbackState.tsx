import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type CardWorkspaceFeedbackStateProps = {
  message: string;
  title?: string;
  isLoading?: boolean;
};

export function CardWorkspaceFeedbackState({
  message,
  title,
  isLoading = false
}: CardWorkspaceFeedbackStateProps) {
  return (
    <View style={styles.feedbackState}>
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
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    justifyContent: 'center',
    minHeight: 160,
    padding: spacing.l
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  feedbackText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center'
  }
});
