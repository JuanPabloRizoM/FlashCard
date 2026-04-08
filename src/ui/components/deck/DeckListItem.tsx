import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import { DeckReadinessBadge } from './DeckReadinessBadge';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type DeckListItemProps = {
  deck: Deck;
  insights: DeckStudyInsights | null;
  onPress: () => void;
};

type DeckMetaPillProps = {
  label: string;
};

function DeckMetaPill({ label }: DeckMetaPillProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaPillLabel}>{label}</Text>
    </View>
  );
}

export function DeckListItem({ deck, insights, onPress }: DeckListItemProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const totalCards = insights?.totalCards ?? 0;
  const studyableCards = insights?.studyableCards ?? 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.deckCard, pressed ? styles.deckCardPressed : null]}
    >
      <View style={styles.deckCardHeader}>
        <View style={styles.deckTypePill}>
          <Text style={styles.deckType}>{strings.deckTypeLabels[deck.type]}</Text>
        </View>
        <DeckReadinessBadge
          label={insights?.readinessLabel ?? strings.deckInsights.readinessEmpty}
          readiness={insights?.readiness ?? 'empty'}
        />
      </View>
      <View style={styles.copyBlock}>
        <Text style={styles.deckName}>{deck.name}</Text>
      </View>
      <View style={styles.deckMetaRow}>
        <DeckMetaPill label={strings.deckList.cardsCount(totalCards)} />
        <DeckMetaPill label={strings.deckList.readyToStudy(studyableCards)} />
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  deckCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  deckCardPressed: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong
  },
  deckCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  deckTypePill: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  deckType: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  copyBlock: {
    gap: spacing.xxs
  },
  deckName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700'
  },
  deckMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  metaPill: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  metaPillLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600'
  }
});
