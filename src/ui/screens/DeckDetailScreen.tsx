import {
  Clipboard,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { Deck } from '../../core/models/Deck';
import { DECK_TYPE_LABELS } from '../../core/types/deck';
import type { RootTabParamList } from '../../navigation/types';
import { useDeckCards } from '../../features/cards/useDeckCards';
import { buildDeckExportText } from '../../features/decks/deckPortability';
import { buildCardStudyFeedback } from '../../features/study/cardStudyPreview';
import { buildDeckStudyInsights } from '../../features/study/studyInsights';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { DeckCardListItem } from '../components/card/DeckCardListItem';
import { DeckExportPanel } from '../components/deck/DeckExportPanel';
import { DeckStudyInsightCard } from '../components/deck/DeckStudyInsightCard';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../theme';

type DeckDetailScreenProps = {
  deck: Deck;
  onBack: () => void;
};

function formatCardTimestampLabel(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Saved locally';
  }

  return `Created ${date.toLocaleDateString()}`;
}

export function DeckDetailScreen({ deck, onBack }: DeckDetailScreenProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { cards, screenError, isLoading } = useDeckCards(deck.id);
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const deckInsights = useMemo(() => buildDeckStudyInsights(cards), [cards]);
  const exportText = useMemo(() => buildDeckExportText(deck, cards), [cards, deck]);
  const cardFeedbackById = useMemo(
    () =>
      cards.reduce<Record<number, ReturnType<typeof buildCardStudyFeedback>>>((feedbackMap, card) => {
        feedbackMap[card.id] = buildCardStudyFeedback(card);
        return feedbackMap;
      }, {}),
    [cards]
  );

  async function onCopyExportText() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText != null) {
        await navigator.clipboard.writeText(exportText);
      } else {
        Clipboard.setString(exportText);
      }

      setCopyMessage('Export text copied to the clipboard.');
    } catch {
      setCopyMessage('Could not copy automatically. Select and copy the export text manually.');
    }
  }

  return (
    <ScreenContainer
      subtitle={
        deck.description ?? `${DECK_TYPE_LABELS[deck.type]} deck`
      }
      title={deck.name}
    >
      <View style={styles.layout}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonLabel}>Back to decks</Text>
        </Pressable>

        <View style={styles.deckMetaRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.deckType}>{DECK_TYPE_LABELS[deck.type]}</Text>
          </View>
          <Text style={styles.deckCounter}>{`${cards.length} cards`}</Text>
        </View>

        <DeckStudyInsightCard insights={deckInsights} />

        <DeckExportPanel
          copyMessage={copyMessage}
          deckName={deck.name}
          exportText={exportText}
          isVisible={isExportVisible}
          onCopy={onCopyExportText}
          onToggleVisibility={() => {
            setIsExportVisible((currentValue) => !currentValue);

            if (copyMessage != null) {
              setCopyMessage(null);
            }
          }}
        />

        {screenError != null ? <Text style={styles.screenError}>{screenError}</Text> : null}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <Text style={styles.sectionText}>
              Add or edit cards in the Cards tab.
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
          <CardWorkspaceFeedbackState isLoading message="Loading cards..." />
        ) : (
          <FlatList
            contentContainerStyle={cards.length === 0 ? styles.emptyListContent : styles.listContent}
            data={cards}
            keyExtractor={(card) => card.id.toString()}
            ListEmptyComponent={
              <CardWorkspaceFeedbackState
                message="Open Cards to add the first card."
                title="No cards yet"
              />
            }
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
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
  metaBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
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
  deckCounter: {
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  sectionText: {
    color: colors.textSecondary,
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
  listContent: {
    gap: spacing.s,
    paddingBottom: spacing.xl
  },
  emptyListContent: {
    flexGrow: 1
  }
});
