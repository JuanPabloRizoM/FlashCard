import { StyleSheet, Text, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';
import { TextImportPreviewList } from './TextImportPreviewList';
import { TextImportWorkspace } from './TextImportWorkspace';

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

const CARD_IMPORT_EXAMPLE =
  'hola | hello\nperro | dog | animal domestico\ncorrer | run | moverse rapido | usado en deportes';

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
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const buttonLabel = isSubmitting ? 'Importing...' : 'Import cards';

  function getStatusText(): string | null {
    if (!preview.hasContent) {
      return null;
    }

    if (preview.validCount > 0) {
      return `${preview.validCount} ready`;
    }

    if (preview.invalidCount > 0) {
      return 'Fix invalid lines to import';
    }

    return null;
  }

  const statusText = getStatusText();

  return (
    <TextImportWorkspace
      actionLabel={buttonLabel}
      exampleText={CARD_IMPORT_EXAMPLE}
      importText={importText}
      isActionDisabled={isDisabled || preview.validCount === 0 || isSubmitting}
      isSubmitting={isSubmitting}
      onAction={() => {
        void onImportCards();
      }}
      onClearImport={onClearImport}
      onImportTextChange={onImportTextChange}
      subtitle={selectedDeckName != null ? `Paste front | back lines for ${selectedDeckName}.` : 'Choose a deck first.'}
      title="Import cards"
    >
      {preview.hasContent ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{`${preview.validCount} valid`}</Text>
          <Text style={styles.summaryText}>{`${preview.invalidCount} invalid`}</Text>
          <Text style={styles.summaryText}>{`${preview.totalCount} total`}</Text>
        </View>
      ) : null}
      {importResultMessage != null ? <Text style={styles.resultText}>{importResultMessage}</Text> : null}
      {preview.hasContent ? <TextImportPreviewList rows={preview.rows} /> : null}
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
    flexDirection: 'row',
    gap: spacing.m,
    padding: spacing.m
  },
  summaryText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  resultText: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 18
  }
});
