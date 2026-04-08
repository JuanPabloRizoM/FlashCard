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
    <View style={styles.collectionWrap}>
      <Text style={styles.eyebrow}>{strings.screens.decks.collectionEyebrow}</Text>
      <Text style={styles.collectionTitle}>{strings.screens.decks.collectionTitle}</Text>
      <Text style={styles.helperText}>{strings.screens.decks.collectionSubtitle}</Text>
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
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    collectionWrap: {
      gap: spacing.s,
      paddingBottom: spacing.xs
    },
    eyebrow: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    collectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: '700'
    },
    helperText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    collectionStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.l,
      paddingTop: spacing.s
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
