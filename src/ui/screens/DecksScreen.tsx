import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useDecks } from '../../features/decks/useDecks';
import type { RootTabParamList } from '../../navigation/types';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { DeckCollectionOverview } from '../components/deck/DeckCollectionOverview';
import { DeckListItem } from '../components/deck/DeckListItem';
import { DeckSummaryModal } from '../components/deck/DeckSummaryModal';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../theme';

const INITIAL_VISIBLE_DECKS = 2;

export function DecksScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [isShowingAllDecks, setIsShowingAllDecks] = useState(false);
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
  const visibleDecks = useMemo(
    () => (isShowingAllDecks ? decks : decks.slice(0, INITIAL_VISIBLE_DECKS)),
    [decks, isShowingAllDecks]
  );
  const hasMoreDecks = decks.length > INITIAL_VISIBLE_DECKS;
  const selectedDeck = selectedDeckId != null ? decks.find((deck) => deck.id === selectedDeckId) ?? null : null;

  return (
    <ScreenContainer title={strings.screens.decks.title}>
      <ScrollView contentContainerStyle={styles.layout} showsVerticalScrollIndicator={false}>
        <DeckCollectionOverview
          deckCount={decks.length}
          readyDeckCount={readyDeckCount}
          studyableCardCount={studyableCardCount}
        />

        <View style={styles.formCard}>
          <Text style={styles.eyebrow}>{strings.screens.decks.newDeckEyebrow}</Text>
          <Text style={styles.cardTitle}>{strings.screens.decks.newDeckTitle}</Text>

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
          <Text style={styles.listTitle}>{strings.screens.decks.savedDecksTitle}</Text>
          <Text style={styles.listCount}>{strings.common.total(decks.length)}</Text>
        </View>

        {isLoading ? (
          <CardWorkspaceFeedbackState isLoading message={strings.common.loadingDecks} />
        ) : decks.length === 0 ? (
          <CardWorkspaceFeedbackState
            message={strings.screens.decks.noDecksMessage}
            title={strings.screens.decks.noDecksTitle}
          />
        ) : (
          <View style={styles.listContent}>
            {visibleDecks.map((deck) => (
              <DeckListItem
                key={deck.id}
                deck={deck}
                insights={deckInsightsByDeckId[deck.id] ?? null}
                onPress={() => {
                  setSelectedDeckId(deck.id);
                }}
              />
            ))}
            {hasMoreDecks && !isShowingAllDecks ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsShowingAllDecks(true);
                }}
                style={styles.moreDecksAction}
              >
                <Text style={styles.moreDecksActionLabel}>{strings.screens.decks.showMoreDecks}</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>

      <DeckSummaryModal
        deck={selectedDeck}
        insights={selectedDeck != null ? deckInsightsByDeckId[selectedDeck.id] ?? null : null}
        onClose={() => {
          setSelectedDeckId(null);
        }}
        onOpenCards={() => {
          if (selectedDeck == null) {
            return;
          }

          setSelectedDeckId(null);
          navigation.navigate('Cards', { selectedDeckId: selectedDeck.id });
        }}
        onStudy={() => {
          if (selectedDeck == null) {
            return;
          }

          setSelectedDeckId(null);
          navigation.navigate('Study', {
            params: { autoStart: true, selectedDeckId: selectedDeck.id },
            screen: 'StudyDashboard'
          });
        }}
        visible={selectedDeckId != null}
      />
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    layout: {
      gap: spacing.l,
      paddingBottom: spacing.xl
    },
    formCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
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
      justifyContent: 'space-between',
      paddingTop: spacing.xs
    },
    listTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    listCount: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    listContent: {
      gap: spacing.s
    },
    moreDecksAction: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    moreDecksActionLabel: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    }
  });
