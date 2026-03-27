import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { colors, spacing, typography } from '../../theme';

type DeckImportPanelProps = {
  importText: string;
  preview: DeckImportPreview;
  importResultMessage: string | null;
  isDisabled: boolean;
  isSubmitting: boolean;
  onImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearImport: () => void;
};

const MAX_VISIBLE_PREVIEW_ROWS = 12;

export function DeckImportPanel({
  importText,
  preview,
  importResultMessage,
  isDisabled,
  isSubmitting,
  onImportTextChange,
  onImportDeck,
  onClearImport
}: DeckImportPanelProps) {
  const visibleRows = preview.cardPreview.rows.slice(0, MAX_VISIBLE_PREVIEW_ROWS);
  const hiddenRowCount = Math.max(preview.cardPreview.rows.length - visibleRows.length, 0);

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>Import deck</Text>
          <Text style={styles.supportText}>
            Paste an exported deck starting with `# Deck: Name`, then keep one card per line using `title | translation | definition | application`.
          </Text>
          <Text style={styles.supportText}>
            Empty optional fields are allowed, but the field order must stay consistent.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={importText.length === 0 || isSubmitting}
          onPress={onClearImport}
          style={[
            styles.secondaryButton,
            importText.length === 0 || isSubmitting ? styles.secondaryButtonDisabled : null
          ]}
        >
          <Text style={styles.secondaryButtonLabel}>Clear</Text>
        </Pressable>
      </View>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
        multiline
        onChangeText={onImportTextChange}
        placeholder={'# Deck: Spanish Basics\nhola | hello\nperro | dog | animal domestico\ncorrer | run | moverse rapido | usado en deportes'}
        placeholderTextColor={colors.muted}
        style={styles.input}
        textAlignVertical="top"
        value={importText}
      />

      {preview.hasContent ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {preview.deckName.length > 0 ? preview.deckName : 'Deck name not ready'}
          </Text>
          <Text style={styles.summaryText}>{`${preview.cardPreview.validCount} valid card line${preview.cardPreview.validCount === 1 ? '' : 's'}`}</Text>
          <Text style={styles.summaryText}>{`${preview.cardPreview.invalidCount} invalid line${preview.cardPreview.invalidCount === 1 ? '' : 's'}`}</Text>
        </View>
      ) : null}

      {preview.blockingError != null ? <Text style={styles.errorText}>{preview.blockingError}</Text> : null}
      {preview.headerError != null ? <Text style={styles.errorText}>{preview.headerError}</Text> : null}
      {importResultMessage != null ? <Text style={styles.resultText}>{importResultMessage}</Text> : null}

      {preview.cardPreview.hasContent ? (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Card preview</Text>
          <View style={styles.previewList}>
            {visibleRows.map((row) => (
              <View
                key={`${row.lineNumber}-${row.rawLine}`}
                style={[styles.previewRow, row.isValid ? styles.previewRowValid : styles.previewRowInvalid]}
              >
                <Text style={styles.previewLineLabel}>{`Line ${row.lineNumber}`}</Text>
                <Text style={styles.previewMainText}>
                  {row.title.length > 0 ? row.title : row.rawLine.trim() || 'Empty line'}
                </Text>
                {row.isValid ? (
                  <Text style={styles.previewDetailText}>
                    {[row.translation, row.definition, row.application].filter(Boolean).join(' | ') || 'Title only'}
                  </Text>
                ) : (
                  <Text style={styles.previewErrorText}>{row.error}</Text>
                )}
              </View>
            ))}
          </View>
          {hiddenRowCount > 0 ? (
            <Text style={styles.supportText}>{`${hiddenRowCount} more line${hiddenRowCount === 1 ? '' : 's'} not shown in preview.`}</Text>
          ) : null}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={isDisabled || !preview.canImport || isSubmitting}
        onPress={() => {
          void onImportDeck();
        }}
        style={[
          styles.primaryButton,
          isDisabled || !preview.canImport || isSubmitting ? styles.primaryButtonDisabled : null
        ]}
      >
        <Text style={styles.primaryButtonLabel}>
          {isSubmitting
            ? 'Importing deck...'
            : preview.cardPreview.validCount > 0
              ? `Import deck with ${preview.cardPreview.validCount} valid card${preview.cardPreview.validCount === 1 ? '' : 's'}`
              : 'Import empty deck'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.l
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'space-between'
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    minHeight: 180,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m
  },
  summaryCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.m
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700'
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption,
    lineHeight: 18
  },
  resultText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 18
  },
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
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  primaryButtonDisabled: {
    backgroundColor: colors.borderStrong
  },
  primaryButtonLabel: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  secondaryButtonDisabled: {
    opacity: 0.5
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
