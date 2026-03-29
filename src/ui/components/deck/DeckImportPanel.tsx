import { StyleSheet, Text, View } from 'react-native';

import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';
import { TextImportPreviewList } from '../card/TextImportPreviewList';
import { TextImportWorkspace } from '../card/TextImportWorkspace';

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

const DECK_IMPORT_EXAMPLE =
  '# Deck: Spanish Basics\nhola | hello\nperro | dog | animal domestico\ncorrer | run | moverse rapido | usado en deportes';

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
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const buttonLabel = isSubmitting ? 'Importing...' : 'Import deck';

  function getStatusText(): string | null {
    if (!preview.hasContent) {
      return null;
    }

    if (preview.canImport) {
      if (preview.cardPreview.validCount > 0) {
        return `${preview.cardPreview.validCount} cards ready`;
      }

      return 'Deck ready';
    }

    if (preview.cardPreview.invalidCount > 0) {
      return 'Fix invalid lines to import';
    }

    return null;
  }

  const statusText = getStatusText();

  return (
    <TextImportWorkspace
      actionLabel={buttonLabel}
      exampleText={DECK_IMPORT_EXAMPLE}
      importText={importText}
      isActionDisabled={isDisabled || !preview.canImport || isSubmitting}
      isSubmitting={isSubmitting}
      minInputHeight={180}
      onAction={() => {
        void onImportDeck();
      }}
      onClearImport={onClearImport}
      onImportTextChange={onImportTextChange}
      subtitle="Paste a deck export."
      title="Import deck"
    >
      {preview.hasContent ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {preview.deckName.length > 0 ? preview.deckName : 'Deck name not ready'}
          </Text>
          <Text style={styles.summaryText}>{`${preview.cardPreview.validCount} valid`}</Text>
          <Text style={styles.summaryText}>{`${preview.cardPreview.invalidCount} invalid`}</Text>
        </View>
      ) : null}
      {preview.blockingError != null ? <Text style={styles.errorText}>{preview.blockingError}</Text> : null}
      {preview.headerError != null ? <Text style={styles.errorText}>{preview.headerError}</Text> : null}
      {importResultMessage != null ? <Text style={styles.resultText}>{importResultMessage}</Text> : null}
      {preview.cardPreview.hasContent ? (
        <TextImportPreviewList emptyValidDetailLabel="Front and back only" rows={preview.cardPreview.rows} />
      ) : null}
      {statusText != null ? <Text style={styles.supportText}>{statusText}</Text> : null}
    </TextImportWorkspace>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
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
  }
});
