import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { Deck } from '../../core/models/Deck';
import { useDeckCards } from '../../features/cards/useDeckCards';
import { useDeckImport } from '../../features/decks/useDeckImport';
import { listDecks } from '../../storage/repositories/deckRepository';
import type { RootTabParamList } from '../../navigation/types';
import { CardListFilterBar } from '../components/card/CardListFilterBar';
import { CardWorkspaceCardList } from '../components/card/CardWorkspaceCardList';
import { CardWorkspaceDeckSelector } from '../components/card/CardWorkspaceDeckSelector';
import { CardWorkspaceNoDecks } from '../components/card/CardWorkspaceNoDecks';
import {
  CardWorkspaceModeSwitch,
  type CardWorkspaceMode
} from '../components/card/CardWorkspaceModeSwitch';
import { CardWorkspacePanel } from '../components/card/CardWorkspacePanel';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { getCardListEmptyState, matchesCardListFilter, type CardListFilter } from '../components/card/cardListFilters';
import { resolveSelectedDeckId } from '../components/card/cardWorkspaceUtils';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../theme';

type CardsScreenProps = BottomTabScreenProps<RootTabParamList, 'Cards'>;

export function CardsScreen({ navigation, route }: CardsScreenProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const routeSelectedDeckId = route.params?.selectedDeckId ?? null;
  const [decks, setDecks] = useState<Deck[]>([]);
  const [handoffDeckId, setHandoffDeckId] = useState<number | null>(routeSelectedDeckId);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(routeSelectedDeckId);
  const [workspaceMode, setWorkspaceMode] = useState<CardWorkspaceMode>('create');
  const [cardListFilter, setCardListFilter] = useState<CardListFilter>('all');
  const [deckScreenError, setDeckScreenError] = useState<string | null>(null);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? null,
    [decks, selectedDeckId]
  );
  const {
    cards,
    editingCardId,
    draftFront,
    draftBack,
    draftDescription,
    draftApplication,
    draftImageUri,
    importText,
    importPreview,
    importResultMessage,
    csvFileName,
    csvHeaders,
    csvMapping,
    csvPreview,
    csvImportResultMessage,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    isImportSubmitting,
    isCsvImportSubmitting,
    saveFeedbackMessage,
    canSubmit,
    onDraftFrontChange,
    onDraftBackChange,
    onDraftDescriptionChange,
    onDraftApplicationChange,
    onDraftImageUriChange,
    onImportTextChange,
    onPickCsvFile,
    onChangeCsvMapping,
    onSaveCard,
    onImportCards,
    onImportCsv,
    onClearImport,
    onClearCsvImport,
    onEditCard,
    onCancelEditing
  } = useDeckCards(selectedDeckId);
  const filteredCards = useMemo(
    () => cards.filter((card) => matchesCardListFilter(card, cardListFilter)),
    [cardListFilter, cards]
  );
  const emptyListState = useMemo(() => getCardListEmptyState(cardListFilter), [cardListFilter]);
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
  const isEditorLocked =
    isSubmitting || isImportSubmitting || isCsvImportSubmitting || isDeckImportSubmitting;
  const isImportLocked =
    isSubmitting ||
    isImportSubmitting ||
    isCsvImportSubmitting ||
    isDeckImportSubmitting ||
    editingCardId != null;
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

  useEffect(() => {
    setCardListFilter('all');
  }, [selectedDeckId]);
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
            setDeckScreenError(strings.featureMessages.couldNotLoadDecks);
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
      <ScreenContainer title={strings.screens.cards.title} subtitle={strings.screens.cards.subtitle}>
        <CardWorkspaceFeedbackState isLoading message={strings.screens.cards.loadingDecks} />
      </ScreenContainer>
    );
  }

  if (decks.length === 0) {
    return (
      <ScreenContainer title={strings.screens.cards.title} subtitle={strings.screens.cards.noDecksSubtitle}>
        <CardWorkspaceNoDecks
          cardImportPreview={importPreview}
          cardImportResultMessage={importResultMessage}
          cardImportText={importText}
          csvFileName={csvFileName}
          csvHeaders={csvHeaders}
          csvImportResultMessage={csvImportResultMessage}
          csvMapping={csvMapping}
          csvPreview={csvPreview}
          deckImportPreview={deckImportPreview}
          deckImportResultMessage={deckImportResultMessage}
          deckImportText={deckImportText}
          isCardImportSubmitting={isImportSubmitting}
          isCsvImportSubmitting={isCsvImportSubmitting}
          isDeckImportSubmitting={isDeckImportSubmitting}
          onChangeCsvMapping={onChangeCsvMapping}
          onCardImportTextChange={onImportTextChange}
          onClearCardImport={onClearImport}
          onClearCsvImport={onClearCsvImport}
          onClearDeckImport={onClearDeckImport}
          onDeckImportTextChange={onDeckImportTextChange}
          onImportCards={onImportCards}
          onImportCsv={onImportCsv}
          onImportDeck={onImportDeck}
          onPickCsvFile={onPickCsvFile}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title={strings.screens.cards.title} subtitle={strings.screens.cards.subtitle}>
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
          draftDescription={draftDescription}
          draftImageUri={draftImageUri}
          draftFront={draftFront}
          draftBack={draftBack}
          editingCardId={editingCardId}
          formError={formError}
          importPreview={importPreview}
          importResultMessage={importResultMessage}
          importText={importText}
          csvFileName={csvFileName}
          csvHeaders={csvHeaders}
          csvImportResultMessage={csvImportResultMessage}
          csvMapping={csvMapping}
          csvPreview={csvPreview}
          isDeckImportSubmitting={isDeckImportSubmitting}
          isEditorLocked={isEditorLocked}
          isImportLocked={isImportLocked}
          isImportSubmitting={isImportSubmitting}
          isCsvImportSubmitting={isCsvImportSubmitting}
          mode={workspaceMode}
          onChangeCsvMapping={onChangeCsvMapping}
          onCancelEditing={onCancelEditing}
          onClearDeckImport={onClearDeckImport}
          onClearImport={onClearImport}
          onClearCsvImport={onClearCsvImport}
          onDeckImportTextChange={onDeckImportTextChange}
          onDraftApplicationChange={onDraftApplicationChange}
          onDraftDescriptionChange={onDraftDescriptionChange}
          onDraftImageUriChange={onDraftImageUriChange}
          onDraftFrontChange={onDraftFrontChange}
          onDraftBackChange={onDraftBackChange}
          onImportCards={onImportCards}
          onImportCsv={onImportCsv}
          onImportDeck={onImportDeck}
          onImportTextChange={onImportTextChange}
          onPickCsvFile={onPickCsvFile}
          onSaveCard={onSaveCard}
          saveFeedbackMessage={saveFeedbackMessage}
          selectedDeckName={selectedDeck?.name ?? null}
        />
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>{strings.screens.cards.cardsSectionTitle}</Text>
          <Text style={styles.listCount}>
            {cardListFilter === 'all'
              ? strings.common.total(cards.length)
              : strings.screens.cards.filteredCount(filteredCards.length, cards.length)}
          </Text>
        </View>
        <CardListFilterBar activeFilter={cardListFilter} onChangeFilter={setCardListFilter} />
        <CardWorkspaceCardList
          cards={filteredCards}
          emptyMessage={emptyListState.message}
          emptyTitle={emptyListState.title}
          isLoading={isLoading}
          onEditCard={onEditCard}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
