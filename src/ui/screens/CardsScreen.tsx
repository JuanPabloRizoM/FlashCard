import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { Deck } from '../../core/models/Deck';
import { useDeckCards } from '../../features/cards/useDeckCards';
import { listDecks } from '../../storage/repositories/deckRepository';
import type { RootTabParamList } from '../../navigation/types';
import { CardEditorPanel } from '../components/card/CardEditorPanel';
import { CardImportPanel } from '../components/card/CardImportPanel';
import { CardWorkspaceCardList } from '../components/card/CardWorkspaceCardList';
import { CardWorkspaceDeckSelector } from '../components/card/CardWorkspaceDeckSelector';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { colors, spacing, typography } from '../theme';

type CardsScreenProps = BottomTabScreenProps<RootTabParamList, 'Cards'>;

function resolveSelectedDeckId(
  decks: Deck[],
  currentDeckId: number | null,
  requestedDeckId: number | null
): number | null {
  const requestedDeck = requestedDeckId != null ? decks.find((deck) => deck.id === requestedDeckId) : null;

  if (requestedDeck != null) {
    return requestedDeck.id;
  }

  const currentDeck = currentDeckId != null ? decks.find((deck) => deck.id === currentDeckId) : null;

  return currentDeck?.id ?? decks[0]?.id ?? null;
}

export function CardsScreen({ navigation, route }: CardsScreenProps) {
  const routeSelectedDeckId = route.params?.selectedDeckId ?? null;
  const [decks, setDecks] = useState<Deck[]>([]);
  const [handoffDeckId, setHandoffDeckId] = useState<number | null>(routeSelectedDeckId);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(routeSelectedDeckId);
  const [deckScreenError, setDeckScreenError] = useState<string | null>(null);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? null,
    [decks, selectedDeckId]
  );
  const {
    cards,
    editingCardId,
    draftTitle,
    draftTranslation,
    draftDefinition,
    draftApplication,
    draftImageUri,
    draftStudyPreview,
    importText,
    importPreview,
    importResultMessage,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    isImportSubmitting,
    canSubmit,
    onDraftTitleChange,
    onDraftTranslationChange,
    onDraftDefinitionChange,
    onDraftApplicationChange,
    onDraftImageUriChange,
    onImportTextChange,
    onSaveCard,
    onImportCards,
    onClearImport,
    onEditCard,
    onCancelEditing
  } = useDeckCards(selectedDeckId);
  const isEditorLocked = isSubmitting || isImportSubmitting;
  const isImportLocked = isSubmitting || isImportSubmitting || editingCardId != null;

  useEffect(() => {
    if (routeSelectedDeckId == null) {
      return;
    }

    setHandoffDeckId(routeSelectedDeckId);
    navigation.setParams({ selectedDeckId: undefined });
  }, [navigation, routeSelectedDeckId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadDeckCollection() {
        try {
          if (isActive) {
            setIsLoadingDecks(true);
          }

          const storedDecks = await listDecks();

          if (!isActive) {
            return;
          }

          setDecks(storedDecks);
          setSelectedDeckId((currentDeckId) =>
            resolveSelectedDeckId(storedDecks, currentDeckId, handoffDeckId)
          );
          setHandoffDeckId(null);
          setDeckScreenError(null);
        } catch {
          if (isActive) {
            setDeckScreenError('Could not load decks right now.');
          }
        } finally {
          if (isActive) {
            setIsLoadingDecks(false);
          }
        }
      }

      void loadDeckCollection();

      return () => {
        isActive = false;
      };
    }, [handoffDeckId])
  );

  if (isLoadingDecks) {
    return (
      <ScreenContainer
        title="Cards"
        subtitle="Use this workspace to create and manage cards for one deck at a time."
      >
        <View style={styles.feedbackState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.feedbackText}>Loading decks...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (decks.length === 0) {
    return (
      <ScreenContainer
        title="Cards"
        subtitle="Use this workspace to create and manage cards for one deck at a time."
      >
        <View style={styles.feedbackState}>
          <Text style={styles.feedbackTitle}>No decks available</Text>
          <Text style={styles.feedbackText}>
            Create a deck in the Decks tab before opening the card workspace.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      title="Cards"
      subtitle="Create and manage cards here. Deck detail stays focused on overview and study readiness."
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CardWorkspaceDeckSelector
          decks={decks}
          isDisabled={isEditorLocked}
          isEditing={editingCardId != null}
          onSelectDeck={setSelectedDeckId}
          selectedDeckId={selectedDeckId}
          selectedDeckName={selectedDeck?.name ?? null}
        />

        {deckScreenError != null ? <Text style={styles.errorText}>{deckScreenError}</Text> : null}
        {screenError != null ? <Text style={styles.errorText}>{screenError}</Text> : null}

        <CardImportPanel
          importResultMessage={importResultMessage}
          importText={importText}
          isDisabled={selectedDeckId == null || isImportLocked}
          isSubmitting={isImportSubmitting}
          onClearImport={onClearImport}
          onImportCards={onImportCards}
          onImportTextChange={onImportTextChange}
          preview={importPreview}
          selectedDeckName={selectedDeck?.name ?? null}
        />

        <CardEditorPanel
          canSubmit={canSubmit && !isImportSubmitting}
          draftApplication={draftApplication}
          draftDefinition={draftDefinition}
          draftImageUri={draftImageUri}
          draftTitle={draftTitle}
          draftTranslation={draftTranslation}
          formError={formError}
          isSubmitting={isEditorLocked}
          mode={editingCardId == null ? 'create' : 'edit'}
          onCancelEditing={editingCardId != null ? onCancelEditing : undefined}
          onDraftApplicationChange={onDraftApplicationChange}
          onDraftDefinitionChange={onDraftDefinitionChange}
          onDraftImageUriChange={onDraftImageUriChange}
          onDraftTitleChange={onDraftTitleChange}
          onDraftTranslationChange={onDraftTranslationChange}
          onSubmit={onSaveCard}
          preview={draftStudyPreview}
        />

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Cards in this deck</Text>
          <Text style={styles.listCount}>{`${cards.length} total`}</Text>
        </View>

        <CardWorkspaceCardList cards={cards} isLoading={isLoading} onEditCard={onEditCard} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.m,
    paddingBottom: spacing.xl
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listCount: {
    color: colors.muted,
    fontSize: typography.caption
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
