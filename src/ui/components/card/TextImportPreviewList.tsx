import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type PreviewRow = {
  lineNumber: number;
  rawLine: string;
  title: string;
  translation: string | null;
  definition: string | null;
  application: string | null;
  isValid: boolean;
  error?: string | null;
};

type TextImportPreviewListProps = {
  rows: PreviewRow[];
  emptyValidDetailLabel?: string;
};

const MAX_VISIBLE_PREVIEW_ROWS = 12;

export function TextImportPreviewList({
  rows,
  emptyValidDetailLabel
}: TextImportPreviewListProps) {
  const visibleRows = rows.slice(0, MAX_VISIBLE_PREVIEW_ROWS);
  const hiddenRowCount = Math.max(rows.length - visibleRows.length, 0);

  return (
    <View style={styles.previewSection}>
      <Text style={styles.previewTitle}>Preview</Text>
      <View style={styles.previewList}>
        {visibleRows.map((row) => {
          const validDetails = [row.translation, row.definition, row.application].filter(Boolean).join(' | ');

          return (
            <View
              key={`${row.lineNumber}-${row.rawLine}`}
              style={[styles.previewRow, row.isValid ? styles.previewRowValid : styles.previewRowInvalid]}
            >
              <Text style={styles.previewLineLabel}>{`Line ${row.lineNumber}`}</Text>
              <Text style={styles.previewMainText}>
                {row.title.length > 0 ? row.title : row.rawLine.trim() || 'Empty line'}
              </Text>
              {row.isValid ? (
                <Text style={styles.previewDetailText}>{validDetails || emptyValidDetailLabel}</Text>
              ) : (
                <Text style={styles.previewErrorText}>{row.error}</Text>
              )}
            </View>
          );
        })}
      </View>
      {hiddenRowCount > 0 ? <Text style={styles.supportText}>{`${hiddenRowCount} more lines.`}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  previewSection: {
    gap: spacing.s
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  previewList: {
    gap: spacing.s
  },
  previewRow: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.m
  },
  previewRowValid: {
    backgroundColor: colors.successSoft
  },
  previewRowInvalid: {
    backgroundColor: colors.errorSoft
  },
  previewLineLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  previewMainText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600'
  },
  previewDetailText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  previewErrorText: {
    color: colors.error,
    fontSize: typography.caption,
    lineHeight: 18
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  }
});
