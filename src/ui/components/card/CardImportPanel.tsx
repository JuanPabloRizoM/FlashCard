import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import { colors, spacing, typography } from '../../theme';

type CardImportPanelProps = {
  importText: string;
  preview: CardImportPreview;
  importResultMessage: string | null;
  isSubmitting: boolean;
  isDisabled: boolean;
  selectedDeckName: string | null;
  onImportTextChange: (value: string) => void;
  onImportCards: () => Promise<void>;
  onClearImport: () => void;
};

const MAX_VISIBLE_PREVIEW_ROWS = 12;

export function CardImportPanel({
  importText,
  preview,
  importResultMessage,
  isSubmitting,
  isDisabled,
  selectedDeckName,
  onImportTextChange,
  onImportCards,
  onClearImport
}: CardImportPanelProps) {
  const visibleRows = preview.rows.slice(0, MAX_VISIBLE_PREVIEW_ROWS);
  const hiddenRowCount = Math.max(preview.rows.length - visibleRows.length, 0);

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>Import cards</Text>
          <Text style={styles.supportText}>
            Paste one card per line using `title | translation`, with optional `| definition | application`.
          </Text>
          <Text style={styles.supportText}>
            {selectedDeckName != null
              ? `Imported cards will be created in ${selectedDeckName}.`
              : 'Choose a deck before importing cards.'}
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
        placeholder={'to run | correr\nheart | corazon | Organ that pumps blood\narray | arreglo | Ordered list | Use in programming examples'}
        placeholderTextColor={colors.muted}
        style={styles.input}
        textAlignVertical="top"
        value={importText}
      />

      {preview.hasContent ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{`${preview.validCount} valid`}</Text>
          <Text style={styles.summaryText}>{`${preview.invalidCount} invalid`}</Text>
          <Text style={styles.summaryText}>{`${preview.totalCount} total`}</Text>
        </View>
      ) : null}

      {importResultMessage != null ? (
        <Text style={styles.resultText}>{importResultMessage}</Text>
      ) : null}

      {preview.hasContent ? (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
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
                    {[row.translation, row.definition, row.application].filter(Boolean).join(' | ')}
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
        disabled={isDisabled || preview.validCount === 0 || isSubmitting}
        onPress={() => {
          void onImportCards();
        }}
        style={[
          styles.primaryButton,
          isDisabled || preview.validCount === 0 || isSubmitting ? styles.primaryButtonDisabled : null
        ]}
      >
        <Text style={styles.primaryButtonLabel}>
          {isSubmitting ? 'Importing cards...' : `Import ${preview.validCount} valid card${preview.validCount === 1 ? '' : 's'}`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.m
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
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  supportText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 140,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.m,
    padding: spacing.m
  },
  summaryText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
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
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  previewList: {
    gap: spacing.s
  },
  previewRow: {
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.s
  },
  previewRowValid: {
    backgroundColor: '#dcfce7'
  },
  previewRowInvalid: {
    backgroundColor: '#fee2e2'
  },
  previewLineLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  previewMainText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600'
  },
  previewDetailText: {
    color: colors.muted,
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
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  primaryButtonDisabled: {
    backgroundColor: colors.muted
  },
  primaryButtonLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700'
  },
  secondaryButton: {
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
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
