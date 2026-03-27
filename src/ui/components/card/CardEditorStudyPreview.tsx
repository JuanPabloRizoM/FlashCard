import { StyleSheet, Text, View } from 'react-native';

import type { CardEditorStudyPreview as CardEditorStudyPreviewType } from '../../../features/study/cardStudyPreview';
import { CardStudyFeedback } from './CardStudyFeedback';
import { colors, spacing, typography } from '../../theme';

type CardEditorStudyPreviewProps = {
  preview: CardEditorStudyPreviewType;
};

export function CardEditorStudyPreview({ preview }: CardEditorStudyPreviewProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Card support</Text>
      <Text style={styles.supportText}>This updates as you type.</Text>

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
  }
});
