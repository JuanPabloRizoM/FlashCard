import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type CardWorkspaceDeckSelectorProps = {
  decks: Deck[];
  selectedDeckId: number | null;
  selectedDeckName: string | null;
  isDisabled: boolean;
  isEditing: boolean;
  onSelectDeck: (deckId: number) => void;
};

export function CardWorkspaceDeckSelector({
  decks,
  selectedDeckId,
  selectedDeckName,
  isDisabled,
  isEditing,
  onSelectDeck
}: CardWorkspaceDeckSelectorProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.contextWrap}>
          <Text style={styles.contextLabel}>{isEditing ? 'Editing in' : 'Creating in'}</Text>
          <Text style={styles.contextValue}>{selectedDeckName ?? 'Choose a deck'}</Text>
        </View>
        {isEditing ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusLabel}>Editing</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.choiceRow}>
        {decks.map((deck) => (
          <Pressable
            disabled={isDisabled}
            key={deck.id}
            onPress={() => {
              onSelectDeck(deck.id);
            }}
            style={[
              styles.choiceChip,
              deck.id === selectedDeckId ? styles.choiceChipActive : null,
              isDisabled ? styles.choiceChipDisabled : null
            ]}
          >
            <Text
              style={[
                styles.choiceLabel,
                deck.id === selectedDeckId ? styles.choiceLabelActive : null
              ]}
            >
              {deck.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.s
  },
  contextWrap: {
    flex: 1,
    gap: spacing.xxs
  },
  contextLabel: {
    color: colors.textMuted,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  contextValue: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: '700'
  },
  statusBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  statusLabel: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  choiceChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  choiceChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  choiceChipDisabled: {
    opacity: 0.5
  },
  choiceLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  choiceLabelActive: {
    color: colors.primary
  }
});
