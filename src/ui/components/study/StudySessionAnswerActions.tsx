import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionAnswerActionsProps = {
  isSubmittingAnswer: boolean;
  onSubmitAnswer: (isCorrect: boolean) => void | Promise<void>;
};

export function StudySessionAnswerActions({
  isSubmittingAnswer,
  onSubmitAnswer
}: StudySessionAnswerActionsProps) {
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.actionRow}>
      <Pressable
        disabled={isSubmittingAnswer}
        onPress={() => {
          onSubmitAnswer(false);
        }}
        style={[
          styles.answerButton,
          styles.answerButtonMuted,
          isSubmittingAnswer ? styles.buttonDisabled : null
        ]}
      >
        <Text style={styles.answerButtonLabel}>
          {isSubmittingAnswer
            ? strings.locale.startsWith('es') ? 'Guardando...' : 'Saving...'
            : strings.studyAnswers.needsReview}
        </Text>
      </Pressable>
      <Pressable
        disabled={isSubmittingAnswer}
        onPress={() => {
          onSubmitAnswer(true);
        }}
        style={[
          styles.answerButton,
          styles.answerButtonSuccess,
          isSubmittingAnswer ? styles.buttonDisabled : null
        ]}
      >
        <Text style={styles.answerButtonLabel}>
          {isSubmittingAnswer
            ? strings.locale.startsWith('es') ? 'Guardando...' : 'Saving...'
            : strings.locale.startsWith('es') ? 'La recordé' : 'I got it'}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: spacing.s
  },
  answerButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m
  },
  answerButtonMuted: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    borderWidth: 1
  },
  answerButtonSuccess: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderWidth: 1
  },
  answerButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: '700'
  },
  buttonDisabled: {
    opacity: 0.55
  }
});
