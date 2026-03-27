import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { Deck } from '../../core/models/Deck';
import { useDeckCards } from '../../features/cards/useDeckCards';
import { useDeckImport } from '../../features/decks/useDeckImport';
import { listDecks } from '../../storage/repositories/deckRepository';
import type { RootTabParamList } from '../../navigation/types';
import { CardEditorPanel } from '../components/card/CardEditorPanel';
import { CardImportPanel } from '../components/card/CardImportPanel';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { CardWorkspaceCardList } from '../components/card/CardWorkspaceCardList';
import { CardWorkspaceDeckSelector } from '../components/card/CardWorkspaceDeckSelector';
import { DeckImportPanel } from '../components/deck/DeckImportPanel';
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
  const {
    importText: deckImportText,
    importPreview: deckImportPreview,
    importResultMessage: deckImportResultMessage,
    isSubmitting: isDeckImportSubmitting,
    onImportTextChange: onDeckImportTextChange,
    onImportDeck,
    onClearImport: onClearDeckImport
  } = useDeckImport({
    existingDeckNames: decks.map((deck) => deck.name),
    onImportSuccess: (importedDeck) => {
      setDecks((currentDecks) => [importedDeck, ...currentDecks]);
      setSelectedDeckId(importedDeck.id);
      setHandoffDeckId(null);
      setDeckScreenError(null);
    }
  });
  const isEditorLocked = isSubmitting || isImportSubmitting || isDeckImportSubmitting;
  const isImportLocked =
    isSubmitting || isImportSubmitting || isDeckImportSubmitting || editingCardId != null;

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
        subtitle="Add or edit cards."
      >
        <CardWorkspaceFeedbackState isLoading message="Loading decks..." />
      </ScreenContainer>
    );
  }

  if (decks.length === 0) {
    return (
      <ScreenContainer
        title="Cards"
        subtitle="Import a deck or pick one to start."
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <CardWorkspaceFeedbackState
            message="Import a deck here or create one in Decks."
            title="No decks available"
          />
          <DeckImportPanel
            importResultMessage={deckImportResultMessage}
            importText={deckImportText}
            isDisabled={isDeckImportSubmitting}
            isSubmitting={isDeckImportSubmitting}
            onClearImport={onClearDeckImport}
            onImportDeck={onImportDeck}
            onImportTextChange={onDeckImportTextChange}
            preview={deckImportPreview}
          />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      title="Cards"
      subtitle="Choose a deck, then add or import cards."
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

        <DeckImportPanel
          importResultMessage={deckImportResultMessage}
          importText={deckImportText}
          isDisabled={isImportLocked}
          isSubmitting={isDeckImportSubmitting}
          onClearImport={onClearDeckImport}
          onImportDeck={onImportDeck}
          onImportTextChange={onDeckImportTextChange}
          preview={deckImportPreview}
        />

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
    color: colors.textPrimary,
    fontSize: typography.subtitle,
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
    color: colors.textMuted,
    fontSize: typography.caption
  }
});
