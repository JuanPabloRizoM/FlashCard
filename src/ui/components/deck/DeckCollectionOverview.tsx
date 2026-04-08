import { StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type DeckCollectionOverviewProps = {
  deckCount: number;
  readyDeckCount: number;
  studyableCardCount: number;
};

export function DeckCollectionOverview({
  deckCount,
  readyDeckCount,
  studyableCardCount
}: DeckCollectionOverviewProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.collectionStatsRow}>
      <View style={styles.collectionStat}>
        <Text style={styles.collectionStatValue}>{deckCount}</Text>
        <Text style={styles.collectionStatLabel}>{strings.screens.decks.savedDecksTitle}</Text>
      </View>
      <View style={styles.collectionStat}>
        <Text style={styles.collectionStatValue}>{readyDeckCount}</Text>
        <Text style={styles.collectionStatLabel}>{strings.screens.decks.readyDecksStat}</Text>
      </View>
      <View style={styles.collectionStat}>
        <Text style={styles.collectionStatValue}>{studyableCardCount}</Text>
        <Text style={styles.collectionStatLabel}>{strings.screens.decks.studyableCardsStat}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    collectionStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.l
    },
    collectionStat: {
      flexGrow: 1,
      gap: spacing.xxs,
      minWidth: 96
    },
    collectionStatValue: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: '700'
    },
    collectionStatLabel: {
      color: colors.textMuted,
      fontSize: typography.caption,
      lineHeight: 18
    }
  });
