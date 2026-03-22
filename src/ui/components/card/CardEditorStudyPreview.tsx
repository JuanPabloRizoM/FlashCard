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
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.m
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  supportText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  section: {
    gap: spacing.s
  },
  subsectionTitle: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  promptWrap: {
    gap: spacing.s
  },
  promptCard: {
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.s
  },
  promptSupported: {
    backgroundColor: '#dcfce7'
  },
  promptMissing: {
    backgroundColor: colors.surface
  },
  promptLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  promptGuidance: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  techniqueWrap: {
    gap: spacing.s
  },
  techniqueCard: {
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.s
  },
  techniqueReady: {
    backgroundColor: '#dcfce7'
  },
  techniqueLimited: {
    backgroundColor: '#fef3c7'
  },
  techniqueUnavailable: {
    backgroundColor: '#fee2e2'
  },
  techniqueLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  techniqueMessage: {
    color: colors.muted,
    fontSize: typography.caption
  }
});
