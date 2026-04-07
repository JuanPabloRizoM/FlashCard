import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { ImportHubPreviewContent } from './ImportHubPreviewContent';
import { ImportHubStepHeader } from './ImportHubStepHeader';

type ImportHubReviewSectionProps = {
  stepEyebrow: string;
  title: string;
  support: string;
  summaryItems: string[];
  resultMessage: string | null;
  errorMessages: string[];
  rows: CardImportPreview['rows'];
  emptyValidDetailLabel?: string;
  statusText: string | null;
  actionLabel: string;
  isActionDisabled: boolean;
  onAction: () => void;
};

export function ImportHubReviewSection({
  stepEyebrow,
  title,
  support,
  summaryItems,
  resultMessage,
  errorMessages,
  rows,
  emptyValidDetailLabel,
  statusText,
  actionLabel,
  isActionDisabled,
  onAction
}: ImportHubReviewSectionProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <ImportHubStepHeader eyebrow={stepEyebrow} support={support} title={title} />
      <ImportHubPreviewContent
        emptyValidDetailLabel={emptyValidDetailLabel}
        errorMessages={errorMessages}
        resultMessage={resultMessage}
        rows={rows}
        statusText={statusText}
        summaryItems={summaryItems}
      />
      <Pressable
        accessibilityRole="button"
        disabled={isActionDisabled}
        onPress={onAction}
        style={[styles.primaryButton, isActionDisabled ? styles.primaryButtonDisabled : null]}
      >
        <Text style={styles.primaryButtonLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      gap: spacing.s
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingHorizontal: spacing.m,
      paddingVertical: 14
    },
    primaryButtonDisabled: {
      backgroundColor: colors.borderStrong
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    }
  });
