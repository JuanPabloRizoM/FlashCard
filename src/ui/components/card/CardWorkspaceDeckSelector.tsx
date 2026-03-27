import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import { colors, spacing, typography } from '../../theme';

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
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Choose a deck</Text>
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
      <Text style={styles.supportText}>
        {selectedDeckName == null
          ? 'Choose a deck to open the card workspace.'
          : isEditing
            ? `Editing a card in ${selectedDeckName}.`
            : `Creating cards for ${selectedDeckName}.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.l
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
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
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  }
});
