import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

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
  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>Export deck</Text>
          <Text style={styles.supportText}>
            Copy this deck as structured text so it can be backed up or imported somewhere else.
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
            <Text style={styles.summaryText}>Header plus one card per line using the import format.</Text>
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
            <Text style={styles.primaryButtonLabel}>Copy export text</Text>
          </Pressable>
        </>
      ) : null}
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
  summaryCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.m
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  summaryText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  exportScroller: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 240
  },
  exportScrollerContent: {
    padding: spacing.m
  },
  exportText: {
    color: colors.text,
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
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  primaryButtonPressed: {
    opacity: 0.9
  },
  primaryButtonLabel: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  secondaryButtonPressed: {
    opacity: 0.9
  },
  secondaryButtonLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
