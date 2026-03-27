import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { Deck } from '../../core/models/Deck';
import { useDeckCards } from '../../features/cards/useDeckCards';
import { useDeckImport } from '../../features/decks/useDeckImport';
import { listDecks } from '../../storage/repositories/deckRepository';
import type { RootTabParamList } from '../../navigation/types';
import { CardWorkspaceCardList } from '../components/card/CardWorkspaceCardList';
import { CardWorkspaceDeckSelector } from '../components/card/CardWorkspaceDeckSelector';
import { CardWorkspaceNoDecks } from '../components/card/CardWorkspaceNoDecks';
import {
  CardWorkspaceModeSwitch,
  type CardWorkspaceMode
} from '../components/card/CardWorkspaceModeSwitch';
import { CardWorkspacePanel } from '../components/card/CardWorkspacePanel';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { resolveSelectedDeckId } from '../components/card/cardWorkspaceUtils';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { colors, spacing, typography } from '../theme';

type CardsScreenProps = BottomTabScreenProps<RootTabParamList, 'Cards'>;

export function CardsScreen({ navigation, route }: CardsScreenProps) {
  const routeSelectedDeckId = route.params?.selectedDeckId ?? null;
  const [decks, setDecks] = useState<Deck[]>([]);
  const [handoffDeckId, setHandoffDeckId] = useState<number | null>(routeSelectedDeckId);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(routeSelectedDeckId);
  const [workspaceMode, setWorkspaceMode] = useState<CardWorkspaceMode>('create');
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
      setWorkspaceMode('create');
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

  useEffect(() => {
    if (editingCardId != null) {
      setWorkspaceMode('create');
    }
  }, [editingCardId]);

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
      <ScreenContainer title="Cards" subtitle="Build your study deck.">
        <CardWorkspaceFeedbackState isLoading message="Loading decks..." />
      </ScreenContainer>
    );
  }

  if (decks.length === 0) {
    return (
      <ScreenContainer title="Cards" subtitle="Import a deck to start.">
        <CardWorkspaceNoDecks
          importResultMessage={deckImportResultMessage}
          importText={deckImportText}
          isSubmitting={isDeckImportSubmitting}
          onClearImport={onClearDeckImport}
          onImportDeck={onImportDeck}
          onImportTextChange={onDeckImportTextChange}
          preview={deckImportPreview}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Cards" subtitle="Build your study deck.">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CardWorkspaceDeckSelector
          decks={decks}
          isDisabled={isEditorLocked}
          isEditing={editingCardId != null}
          onSelectDeck={setSelectedDeckId}
          selectedDeckId={selectedDeckId}
          selectedDeckName={selectedDeck?.name ?? null}
        />

        <CardWorkspaceModeSwitch
          activeMode={workspaceMode}
          isDisabled={isEditorLocked || editingCardId != null}
          onChangeMode={setWorkspaceMode}
        />

        {deckScreenError != null || screenError != null ? (
          <View style={styles.workspaceHeader}>
            {deckScreenError != null ? <Text style={styles.errorText}>{deckScreenError}</Text> : null}
            {screenError != null ? <Text style={styles.errorText}>{screenError}</Text> : null}
          </View>
        ) : null}

        <CardWorkspacePanel
          canSubmit={canSubmit}
          deckImportPreview={deckImportPreview}
          deckImportResultMessage={deckImportResultMessage}
          deckImportText={deckImportText}
          draftApplication={draftApplication}
          draftDefinition={draftDefinition}
          draftImageUri={draftImageUri}
          draftStudyPreview={draftStudyPreview}
          draftTitle={draftTitle}
          draftTranslation={draftTranslation}
          editingCardId={editingCardId}
          formError={formError}
          importPreview={importPreview}
          importResultMessage={importResultMessage}
          importText={importText}
          isDeckImportSubmitting={isDeckImportSubmitting}
          isEditorLocked={isEditorLocked}
          isImportLocked={isImportLocked}
          isImportSubmitting={isImportSubmitting}
          mode={workspaceMode}
          onCancelEditing={onCancelEditing}
          onClearDeckImport={onClearDeckImport}
          onClearImport={onClearImport}
          onDeckImportTextChange={onDeckImportTextChange}
          onDraftApplicationChange={onDraftApplicationChange}
          onDraftDefinitionChange={onDraftDefinitionChange}
          onDraftImageUriChange={onDraftImageUriChange}
          onDraftTitleChange={onDraftTitleChange}
          onDraftTranslationChange={onDraftTranslationChange}
          onImportCards={onImportCards}
          onImportDeck={onImportDeck}
          onImportTextChange={onImportTextChange}
          onSaveCard={onSaveCard}
          selectedDeckName={selectedDeck?.name ?? null}
        />

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Cards</Text>
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
  workspaceHeader: {
    gap: spacing.xs
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
