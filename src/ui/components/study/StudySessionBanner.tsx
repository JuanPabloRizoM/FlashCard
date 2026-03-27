import { StyleSheet, Text, View } from 'react-native';

import type { StudySessionMode, StudySessionSize } from '../../../core/types/study';
import { STUDY_SESSION_MODE_LABELS, STUDY_SESSION_SIZE_LABELS } from '../../../core/types/study';

import { colors, spacing, typography } from '../../theme';

type StudySessionBannerProps = {
  deckName: string;
  techniqueLabel: string;
  sessionMode: StudySessionMode;
  sessionSize: StudySessionSize;
};

export function StudySessionBanner({
  deckName,
  techniqueLabel,
  sessionMode,
  sessionSize
}: StudySessionBannerProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>In session</Text>
        <View style={styles.techniqueBadge}>
          <Text style={styles.techniqueLabel}>{techniqueLabel}</Text>
        </View>
      </View>
      <Text style={styles.deckName}>{deckName}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaBadge}>
          <Text style={styles.metaBadgeLabel}>{STUDY_SESSION_MODE_LABELS[sessionMode]}</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaBadgeLabel}>{`${STUDY_SESSION_SIZE_LABELS[sessionSize]} items`}</Text>
        </View>
      </View>
      <Text style={styles.supportText}>
        Reveal, answer, continue.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.l
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: '700'
  },
  techniqueBadge: {
    backgroundColor: colors.surface,
    borderColor: colors.primarySoft,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  techniqueLabel: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700'
  },
  deckName: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '700'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  metaBadge: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  metaBadgeLabel: {
    color: colors.textSecondary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
    lineHeight: 22
  }
});
