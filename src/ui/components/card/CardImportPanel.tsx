import { StyleSheet, Text, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import { useAppStrings } from '../../strings';
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
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const buttonLabel = isSubmitting ? strings.cardImport.importing : strings.cardImport.actionLabel;

  function getStatusText(): string | null {
    if (!preview.hasContent) {
      return null;
    }

    if (preview.validCount > 0) {
      return strings.cardImport.validReady(preview.validCount);
    }

    if (preview.invalidCount > 0) {
      return strings.cardImport.fixInvalidLines;
    }

    return null;
  }

  const statusText = getStatusText();

  return (
    <TextImportWorkspace
      actionLabel={buttonLabel}
      exampleText={strings.cardImport.exampleText}
      importText={importText}
      isActionDisabled={isDisabled || preview.validCount === 0 || isSubmitting}
      isSubmitting={isSubmitting}
      onAction={() => {
        void onImportCards();
      }}
      onClearImport={onClearImport}
      onImportTextChange={onImportTextChange}
      subtitle={
        selectedDeckName != null
          ? strings.cardImport.subtitleForDeck(selectedDeckName)
          : strings.cardImport.subtitleNoDeck
      }
      title={strings.cardImport.title}
    >
      {preview.hasContent ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{strings.common.valid(preview.validCount)}</Text>
          <Text style={styles.summaryText}>{strings.common.invalid(preview.invalidCount)}</Text>
          <Text style={styles.summaryText}>{strings.common.total(preview.totalCount)}</Text>
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
