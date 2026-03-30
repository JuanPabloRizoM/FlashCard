import { StyleSheet, Text, View } from 'react-native';

import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { useAppStrings } from '../../strings';
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
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const buttonLabel = isSubmitting ? strings.deckImport.importing : strings.deckImport.actionLabel;

  function getStatusText(): string | null {
    if (!preview.hasContent) {
      return null;
    }

    if (preview.canImport) {
      if (preview.cardPreview.validCount > 0) {
        return strings.deckImport.cardsReady(preview.cardPreview.validCount);
      }

      return strings.deckImport.deckReady;
    }

    if (preview.cardPreview.invalidCount > 0) {
      return strings.deckImport.fixInvalidLines;
    }

    return null;
  }

  const statusText = getStatusText();

  return (
    <TextImportWorkspace
      actionLabel={buttonLabel}
      exampleText={strings.deckImport.exampleText}
      importText={importText}
      isActionDisabled={isDisabled || !preview.canImport || isSubmitting}
      isSubmitting={isSubmitting}
      minInputHeight={180}
      onAction={() => {
        void onImportDeck();
      }}
      onClearImport={onClearImport}
      onImportTextChange={onImportTextChange}
      subtitle={strings.deckImport.subtitle}
      title={strings.deckImport.title}
    >
      {preview.hasContent ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {preview.deckName.length > 0 ? preview.deckName : strings.deckImport.deckNameNotReady}
          </Text>
          <Text style={styles.summaryText}>{strings.common.valid(preview.cardPreview.validCount)}</Text>
          <Text style={styles.summaryText}>{strings.common.invalid(preview.cardPreview.invalidCount)}</Text>
        </View>
      ) : null}
      {preview.blockingError != null ? <Text style={styles.errorText}>{preview.blockingError}</Text> : null}
      {preview.headerError != null ? <Text style={styles.errorText}>{preview.headerError}</Text> : null}
      {importResultMessage != null ? <Text style={styles.resultText}>{importResultMessage}</Text> : null}
      {preview.cardPreview.hasContent ? (
        <TextImportPreviewList emptyValidDetailLabel={strings.deckImport.frontBackOnly} rows={preview.cardPreview.rows} />
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
