import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { Deck } from '../../core/models/Deck';
import { useDecks } from '../../features/decks/useDecks';
import type { RootTabParamList } from '../../navigation/types';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { DeckCollectionOverview } from '../components/deck/DeckCollectionOverview';
import { DeckListItem } from '../components/deck/DeckListItem';
import { DeckSummaryModal } from '../components/deck/DeckSummaryModal';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../theme';

function formatDeckTimestampLabel(deck: Deck, createdLabel: string, updatedLabel: string, fallbackLabel: string): string {
  const sourceDate = deck.updatedAt !== deck.createdAt ? deck.updatedAt : deck.createdAt;
  const date = new Date(sourceDate);

  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  const prefix = deck.updatedAt !== deck.createdAt ? updatedLabel : createdLabel;

  return `${prefix} ${date.toLocaleDateString()}`;
}

export function DecksScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const {
    decks,
    deckInsightsByDeckId,
    draftName,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    canSubmit,
    onDraftNameChange,
    onCreateDeck
  } = useDecks();
  const readyDeckCount = useMemo(
    () => decks.filter((deck) => (deckInsightsByDeckId[deck.id]?.studyableCards ?? 0) > 0).length,
    [deckInsightsByDeckId, decks]
  );
  const studyableCardCount = useMemo(
    () =>
      decks.reduce((total, deck) => total + (deckInsightsByDeckId[deck.id]?.studyableCards ?? 0), 0),
    [deckInsightsByDeckId, decks]
  );

  return (
    <ScreenContainer title={strings.screens.decks.title} subtitle={strings.screens.decks.subtitle}>
      <View style={styles.layout}>
        <DeckCollectionOverview
          deckCount={decks.length}
          readyDeckCount={readyDeckCount}
          studyableCardCount={studyableCardCount}
        />

        <View style={styles.formCard}>
          <Text style={styles.eyebrow}>{strings.screens.decks.newDeckEyebrow}</Text>
          <Text style={styles.cardTitle}>{strings.screens.decks.newDeckTitle}</Text>
          <Text style={styles.helperText}>{strings.screens.decks.newDeckHelper}</Text>

          <Text style={styles.label}>{strings.screens.decks.deckNameLabel}</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            onChangeText={onDraftNameChange}
            onSubmitEditing={() => {
              void onCreateDeck();
            }}
            placeholder={strings.screens.decks.deckNamePlaceholder}
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            style={[styles.input, formError != null ? styles.inputError : null]}
            value={draftName}
          />

          {formError != null ? <Text style={styles.formError}>{formError}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={() => {
              void onCreateDeck();
            }}
            style={({ pressed }) => [
              styles.submitButton,
              !canSubmit ? styles.submitButtonDisabled : null,
              pressed && canSubmit ? styles.submitButtonPressed : null
            ]}
          >
            <Text style={styles.submitButtonLabel}>
              {isSubmitting ? strings.screens.decks.savingDeck : strings.screens.decks.createDeck}
            </Text>
          </Pressable>
        </View>

        {screenError != null ? <Text style={styles.screenError}>{screenError}</Text> : null}

        <View style={styles.listHeader}>
          <View style={styles.listHeaderCopy}>
            <Text style={styles.listTitle}>{strings.screens.decks.savedDecksTitle}</Text>
            <Text style={styles.listSubtitle}>{strings.screens.decks.savedDecksSubtitle}</Text>
          </View>
          <Text style={styles.listCount}>{strings.common.total(decks.length)}</Text>
        </View>

        {isLoading ? (
          <CardWorkspaceFeedbackState isLoading message={strings.common.loadingDecks} />
        ) : (
          <FlatList
            contentContainerStyle={decks.length === 0 ? styles.emptyListContent : styles.listContent}
            data={decks}
            keyExtractor={(deck) => deck.id.toString()}
            ListEmptyComponent={
              <CardWorkspaceFeedbackState
                message={strings.screens.decks.noDecksMessage}
                title={strings.screens.decks.noDecksTitle}
              />
            }
            renderItem={({ item }) => {
              const insights = deckInsightsByDeckId[item.id];

              return (
                <DeckListItem
                  deck={item}
                  insights={insights ?? null}
                  onPress={() => {
                    setSelectedDeck(item);
                  }}
                  timestampLabel={formatDeckTimestampLabel(
                    item,
                    strings.common.created,
                    strings.common.updated,
                    strings.common.savedLocally
                  )}
                />
              );
            }}
          />
        )}
      </View>

      <DeckSummaryModal
        deck={selectedDeck}
        insights={selectedDeck != null ? deckInsightsByDeckId[selectedDeck.id] ?? null : null}
        onClose={() => {
          setSelectedDeck(null);
        }}
        onOpenCards={() => {
          if (selectedDeck == null) {
            return;
          }

          setSelectedDeck(null);
          navigation.navigate('Cards', { selectedDeckId: selectedDeck.id });
        }}
        onStudy={() => {
          if (selectedDeck == null) {
            return;
          }

          setSelectedDeck(null);
          navigation.navigate('Study', { selectedDeckId: selectedDeck.id });
        }}
        visible={selectedDeck != null}
      />
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  layout: {
    flex: 1,
    gap: spacing.m
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.l
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: '600'
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  inputError: {
    borderColor: colors.error
  },
  formError: {
    color: colors.error,
    fontSize: typography.caption
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  submitButtonDisabled: {
    backgroundColor: colors.borderStrong
  },
  submitButtonPressed: {
    backgroundColor: colors.primaryPressed
  },
  submitButtonLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700'
  },
  screenError: {
    color: colors.error,
    fontSize: typography.caption
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'space-between'
  },
  listHeaderCopy: {
    flex: 1,
    gap: spacing.xs
  },
  listTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  listSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  listCount: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  listContent: {
    gap: spacing.m,
    paddingBottom: spacing.xl
  },
  emptyListContent: {
    flexGrow: 1
  }
});
