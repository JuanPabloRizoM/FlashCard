import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { Deck } from '../../core/models/Deck';
import { DECK_TYPE_LABELS } from '../../core/types/deck';
import { useDeckCards } from '../../features/cards/useDeckCards';
import { buildCardStudyFeedback } from '../../features/study/cardStudyPreview';
import { buildDeckStudyInsights } from '../../features/study/studyInsights';
import type { RootTabParamList } from '../../navigation/types';
import { DeckCardListItem } from '../components/card/DeckCardListItem';
import { DeckStudyInsightCard } from '../components/deck/DeckStudyInsightCard';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { colors, spacing, typography } from '../theme';
type DeckDetailScreenProps = { deck: Deck; onBack: () => void };

function formatCardTimestampLabel(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Saved locally';
  }

  return `Created ${date.toLocaleDateString()}`;
}
export function DeckDetailScreen({ deck, onBack }: DeckDetailScreenProps) {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { cards, screenError, isLoading } = useDeckCards(deck.id);
  const deckInsights = useMemo(() => buildDeckStudyInsights(cards), [cards]);
  const cardFeedbackById = useMemo(
    () =>
      cards.reduce<Record<number, ReturnType<typeof buildCardStudyFeedback>>>((feedbackMap, card) => {
        feedbackMap[card.id] = buildCardStudyFeedback(card);
        return feedbackMap;
      }, {}),
    [cards]
  );

  return (
    <ScreenContainer
      title={deck.name}
      subtitle={deck.description ?? `${DECK_TYPE_LABELS[deck.type]} deck`}
    >
      <View style={styles.layout}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonLabel}>Back to decks</Text>
        </Pressable>

        <View style={styles.deckMetaRow}>
          <Text style={styles.deckType}>{DECK_TYPE_LABELS[deck.type]}</Text>
          <Text style={styles.deckCounter}>{`${cards.length} cards`}</Text>
        </View>

        <DeckStudyInsightCard insights={deckInsights} />
        {screenError != null ? <Text style={styles.screenError}>{screenError}</Text> : null}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <Text style={styles.sectionText}>
              Create and edit cards from the Cards tab workspace with this deck preselected.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              navigation.navigate('Cards', { selectedDeckId: deck.id });
            }}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.primaryButtonPressed : null]}
          >
            <Text style={styles.primaryButtonLabel}>Create cards</Text>
          </Pressable>
        </View>
        {isLoading ? (
          <View style={styles.feedbackState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.feedbackText}>Loading cards...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={cards.length === 0 ? styles.emptyListContent : styles.listContent}
            data={cards}
            keyExtractor={(card) => card.id.toString()}
            renderItem={({ item }) => {
              const feedback = cardFeedbackById[item.id] ?? buildCardStudyFeedback(item);

              return (
                <DeckCardListItem
                  card={item}
                  feedback={feedback}
                  timestampLabel={formatCardTimestampLabel(item.createdAt)}
                />
              );
            }}
            ListEmptyComponent={
              <View style={styles.feedbackState}>
                <Text style={styles.feedbackTitle}>No cards yet</Text>
                <Text style={styles.feedbackText}>
                  Open the Cards tab workspace to create the first card in this deck.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    gap: spacing.m
  },
  backButton: {
    alignSelf: 'flex-start'
  },
  backButtonLabel: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700'
  },
  deckMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deckType: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  deckCounter: {
    color: colors.muted,
    fontSize: typography.caption
  },
  screenError: {
    color: colors.error,
    fontSize: typography.caption
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'space-between'
  },
  sectionCopy: {
    flex: 1,
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  sectionText: {
    color: colors.muted,
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
  listContent: {
    gap: spacing.s,
    paddingBottom: spacing.xl
  },
  emptyListContent: {
    flexGrow: 1
  },
  feedbackState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    justifyContent: 'center',
    minHeight: 160,
    padding: spacing.l
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  feedbackText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center'
  }
});
