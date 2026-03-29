import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type DeckExportPanelProps = {
  exportText: string;
  copyMessage: string | null;
  deckName: string;
  isVisible: boolean;
  onCopy: () => Promise<void>;
  onToggleVisibility: () => void;
};

export function DeckExportPanel({
  exportText,
  copyMessage,
  deckName,
  isVisible,
  onCopy,
  onToggleVisibility
}: DeckExportPanelProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>Export deck</Text>
          <Text style={styles.supportText}>
            Copy this deck as text.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleVisibility}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.secondaryButtonPressed : null
          ]}
        >
          <Text style={styles.secondaryButtonLabel}>{isVisible ? 'Hide export' : 'Export deck'}</Text>
        </Pressable>
      </View>

      {isVisible ? (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{deckName}</Text>
            <Text style={styles.summaryText}>Header plus one card per line.</Text>
          </View>

          <ScrollView style={styles.exportScroller} contentContainerStyle={styles.exportScrollerContent}>
            <Text selectable style={styles.exportText}>
              {exportText}
            </Text>
          </ScrollView>

          {copyMessage != null ? <Text style={styles.resultText}>{copyMessage}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void onCopy();
            }}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.primaryButtonPressed : null]}
          >
            <Text style={styles.primaryButtonLabel}>Copy text</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
  summaryCard: {
    backgroundColor: colors.primarySoft,
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
  exportScroller: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    maxHeight: 240
  },
  exportScrollerContent: {
    padding: spacing.m
  },
  exportText: {
    color: colors.textPrimary,
    fontFamily: 'Courier',
    fontSize: typography.caption,
    lineHeight: 20
  },
  resultText: {
    color: colors.primary,
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
  primaryButtonPressed: {
    backgroundColor: colors.primaryPressed
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
  secondaryButtonPressed: {
    borderColor: colors.borderStrong
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
