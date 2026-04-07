import { StyleSheet, Text, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { TextImportPreviewList } from './TextImportPreviewList';

type ImportHubPreviewContentProps = {
  summaryItems: string[];
  resultMessage: string | null;
  errorMessages: string[];
  rows: CardImportPreview['rows'];
  emptyValidDetailLabel?: string;
  statusText: string | null;
};

export function ImportHubPreviewContent({
  summaryItems,
  resultMessage,
  errorMessages,
  rows,
  emptyValidDetailLabel,
  statusText
}: ImportHubPreviewContentProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      {summaryItems.length > 0 ? (
        <View style={styles.summaryCard}>
          {summaryItems.map((item) => (
            <Text key={item} style={styles.summaryText}>
              {item}
            </Text>
          ))}
        </View>
      ) : null}
      {errorMessages.map((message) => (
        <Text key={message} style={styles.errorText}>
          {message}
        </Text>
      ))}
      {resultMessage != null ? <Text style={styles.resultText}>{resultMessage}</Text> : null}
      {rows.length > 0 ? <TextImportPreviewList emptyValidDetailLabel={emptyValidDetailLabel} rows={rows} /> : null}
      {statusText != null ? <Text style={styles.supportText}>{statusText}</Text> : null}
    </>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    summaryCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
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
    },
    errorText: {
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
