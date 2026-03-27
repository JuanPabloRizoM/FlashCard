import { StyleSheet, Text, View } from 'react-native';

import type { CardEditorStudyPreview as CardEditorStudyPreviewType } from '../../../features/study/cardStudyPreview';
import { CardStudyFeedback } from './CardStudyFeedback';
import { colors, spacing, typography } from '../../theme';

type CardEditorStudyPreviewProps = {
  preview: CardEditorStudyPreviewType;
};

function getTechniqueTone(status: CardEditorStudyPreviewType['techniqueSupport'][number]['status']) {
  switch (status) {
    case 'ready':
      return styles.techniqueReady;
    case 'limited':
      return styles.techniqueLimited;
    default:
      return styles.techniqueUnavailable;
  }
}

export function CardEditorStudyPreview({ preview }: CardEditorStudyPreviewProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Study support preview</Text>
      <Text style={styles.supportText}>
        This updates as you type and never blocks saving.
      </Text>

      <CardStudyFeedback feedback={preview.feedback} />

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Prompt modes</Text>
        <View style={styles.promptWrap}>
          {preview.promptSupport.map((prompt) => (
            <View
              key={prompt.mode}
              style={[
                styles.promptCard,
                prompt.isSupported ? styles.promptSupported : styles.promptMissing
              ]}
            >
              <Text style={styles.promptLabel}>{prompt.label}</Text>
              <Text style={styles.promptGuidance}>{prompt.guidance}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Technique usefulness</Text>
        <View style={styles.techniqueWrap}>
          {preview.techniqueSupport.map((technique) => (
            <View key={technique.techniqueId} style={[styles.techniqueCard, getTechniqueTone(technique.status)]}>
              <Text style={styles.techniqueLabel}>{technique.label}</Text>
              <Text style={styles.techniqueMessage}>{technique.message}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.m
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700'
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  section: {
    gap: spacing.s
  },
  subsectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  promptWrap: {
    gap: spacing.s
  },
  promptCard: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.m
  },
  promptSupported: {
    backgroundColor: colors.successSoft
  },
  promptMissing: {
    backgroundColor: colors.surface
  },
  promptLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  promptGuidance: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  techniqueWrap: {
    gap: spacing.s
  },
  techniqueCard: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.m
  },
  techniqueReady: {
    backgroundColor: colors.successSoft
  },
  techniqueLimited: {
    backgroundColor: colors.warningSoft
  },
  techniqueUnavailable: {
    backgroundColor: colors.errorSoft
  },
  techniqueLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  techniqueMessage: {
    color: colors.textSecondary,
    fontSize: typography.caption
  }
});
