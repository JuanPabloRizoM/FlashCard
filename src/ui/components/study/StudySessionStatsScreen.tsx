import { Share, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { StudySessionDetail } from '../../../core/models/StudySessionRecord';
import {
  buildPromptDistribution,
  buildStudySessionShareMessage,
  filterSessionAnswersByResult,
  formatDurationLabel,
  formatSessionDateTime,
  getLocalizedStudyFieldLabel
} from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionStatsScreenProps = {
  detail: StudySessionDetail | null;
  isLoading: boolean;
  onBack: () => void;
};

export function StudySessionStatsScreen({
  detail,
  isLoading,
  onBack
}: StudySessionStatsScreenProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  const failedAnswers = detail == null ? [] : filterSessionAnswersByResult(detail.answers, 'incorrect');
  const correctAnswers = detail == null ? [] : filterSessionAnswersByResult(detail.answers, 'correct');
  const promptDistribution = detail == null ? [] : buildPromptDistribution(detail.answers);

  async function handleShare() {
    if (detail == null) {
      return;
    }

    await Share.share({
      message: buildStudySessionShareMessage(detail, strings)
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.headerRow}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
            <Text style={styles.iconLabel}>←</Text>
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{strings.studyStats.detailEyebrow}</Text>
            <Text numberOfLines={1} style={styles.title}>
              {detail?.session.deckName ?? strings.studyStats.detailTitle}
            </Text>
            <Text style={styles.support}>{strings.studyStats.detailSupport}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={detail == null}
            onPress={() => {
              void handleShare();
            }}
            style={[styles.shareButton, detail == null ? styles.buttonDisabled : null]}
          >
            <Text style={styles.shareButtonLabel}>{strings.studyStats.shareAction}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? <CardWorkspaceFeedbackState isLoading message={strings.common.loadingStudy} /> : null}

          {!isLoading && detail == null ? (
            <CardWorkspaceFeedbackState
              message={strings.studyStats.emptyDetailSupport}
              title={strings.studyStats.emptyDetailTitle}
            />
          ) : null}

          {detail != null ? (
            <>
              <View style={styles.panel}>
                <View style={styles.headerCopy}>
                  <Text style={styles.sectionTitle}>{strings.studyStats.detailTitle}</Text>
                  <Text style={styles.support}>{formatSessionDateTime(detail.session.completedAt, strings.locale)}</Text>
                </View>

                <View style={styles.metricGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{strings.studySummary.answered}</Text>
                    <Text style={styles.metricValue}>{detail.session.answeredCount}</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{strings.studySummary.correct}</Text>
                    <Text style={styles.metricValue}>{detail.session.correctCount}</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{strings.studySummary.incorrect}</Text>
                    <Text style={styles.metricValue}>{detail.session.incorrectCount}</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{strings.studySummary.accuracy}</Text>
                    <Text style={styles.metricValue}>{`${detail.session.accuracyPercentage}%`}</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{strings.studyStats.bestStreak}</Text>
                    <Text style={styles.metricValue}>{detail.session.bestStreak}</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{strings.studyStats.sessionTime}</Text>
                    <Text style={styles.metricValueSmall}>{formatDurationLabel(detail.session.durationSeconds, strings)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.panel}>
                <Text style={styles.sectionTitle}>{strings.studyStats.promptDistribution}</Text>
                <View style={styles.list}>
                  {promptDistribution.map((metric) => (
                    <View key={metric.label} style={styles.listRow}>
                      <Text style={styles.listLabel}>{getLocalizedStudyFieldLabel(metric.label, strings.locale)}</Text>
                      <Text style={styles.listValue}>{metric.count}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.panel}>
                <Text style={styles.sectionTitle}>{strings.studyStats.failedCards}</Text>
                {failedAnswers.length === 0 ? (
                  <Text style={styles.support}>{strings.studySummary.noMissedPrompts}</Text>
                ) : (
                  <View style={styles.list}>
                    {failedAnswers.map((answer) => (
                      <View key={answer.id} style={styles.answerCard}>
                        <Text style={styles.answerLabel}>{getLocalizedStudyFieldLabel(answer.promptLabel, strings.locale)}</Text>
                        <Text style={styles.answerValue}>{answer.promptValue}</Text>
                        <Text style={styles.answerResponse}>{answer.responseValue}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.panel}>
                <Text style={styles.sectionTitle}>{strings.studyStats.correctCards}</Text>
                <View style={styles.list}>
                  {correctAnswers.slice(0, 8).map((answer) => (
                    <View key={answer.id} style={styles.answerCard}>
                      <Text style={styles.answerLabel}>{getLocalizedStudyFieldLabel(answer.promptLabel, strings.locale)}</Text>
                      <Text style={styles.answerValue}>{answer.promptValue}</Text>
                      <Text style={styles.answerResponse}>{answer.responseValue}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
      flex: 1
    },
    shell: {
      flex: 1,
      gap: spacing.m,
      paddingBottom: spacing.m,
      paddingHorizontal: spacing.l,
      paddingTop: spacing.s
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.m
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      height: 42,
      justifyContent: 'center',
      width: 42
    },
    iconLabel: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700'
    },
    headerCopy: {
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
    title: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    shareButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    shareButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    buttonDisabled: {
      opacity: 0.5
    },
    content: {
      gap: spacing.m,
      paddingBottom: spacing.xl
    },
    panel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    metricCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexBasis: '48%',
      gap: spacing.xs,
      padding: spacing.m
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    metricValueSmall: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    list: {
      gap: spacing.s
    },
    listRow: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    listLabel: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    },
    listValue: {
      color: colors.primary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    answerCard: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.xs,
      padding: spacing.m
    },
    answerLabel: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    answerValue: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    answerResponse: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 20
    }
  });
