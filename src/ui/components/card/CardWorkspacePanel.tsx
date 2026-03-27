import type { CardEditorStudyPreview as CardEditorStudyPreviewType } from '../../../features/study/cardStudyPreview';
import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { CardEditorPanel } from './CardEditorPanel';
import { CardImportPanel } from './CardImportPanel';
import { DeckImportPanel } from '../deck/DeckImportPanel';
import type { CardWorkspaceMode } from './CardWorkspaceModeSwitch';

type CardWorkspacePanelProps = {
  mode: CardWorkspaceMode;
  selectedDeckName: string | null;
  editingCardId: number | null;
  isEditorLocked: boolean;
  isImportLocked: boolean;
  canSubmit: boolean;
  draftTitle: string;
  draftTranslation: string;
  draftDefinition: string;
  draftApplication: string;
  draftImageUri: string;
  draftStudyPreview: CardEditorStudyPreviewType;
  formError: string | null;
  saveFeedbackMessage: string | null;
  saveFeedbackTick: number;
  importText: string;
  importPreview: CardImportPreview;
  importResultMessage: string | null;
  deckImportText: string;
  deckImportPreview: DeckImportPreview;
  deckImportResultMessage: string | null;
  isImportSubmitting: boolean;
  isDeckImportSubmitting: boolean;
  onDraftTitleChange: (value: string) => void;
  onDraftTranslationChange: (value: string) => void;
  onDraftDefinitionChange: (value: string) => void;
  onDraftApplicationChange: (value: string) => void;
  onDraftImageUriChange: (value: string) => void;
  onSaveCard: () => Promise<void>;
  onCancelEditing?: () => void;
  onImportTextChange: (value: string) => void;
  onImportCards: () => Promise<void>;
  onClearImport: () => void;
  onDeckImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearDeckImport: () => void;
};

export function CardWorkspacePanel({
  mode,
  selectedDeckName,
  editingCardId,
  isEditorLocked,
  isImportLocked,
  canSubmit,
  draftTitle,
  draftTranslation,
  draftDefinition,
  draftApplication,
  draftImageUri,
  draftStudyPreview,
  formError,
  saveFeedbackMessage,
  saveFeedbackTick,
  importText,
  importPreview,
  importResultMessage,
  deckImportText,
  deckImportPreview,
  deckImportResultMessage,
  isImportSubmitting,
  isDeckImportSubmitting,
  onDraftTitleChange,
  onDraftTranslationChange,
  onDraftDefinitionChange,
  onDraftApplicationChange,
  onDraftImageUriChange,
  onSaveCard,
  onCancelEditing,
  onImportTextChange,
  onImportCards,
  onClearImport,
  onDeckImportTextChange,
  onImportDeck,
  onClearDeckImport
}: CardWorkspacePanelProps) {
  switch (mode) {
    case 'import_cards':
      return (
        <CardImportPanel
          importResultMessage={importResultMessage}
          importText={importText}
          isDisabled={selectedDeckName == null || isImportLocked}
          isSubmitting={isImportSubmitting}
          onClearImport={onClearImport}
          onImportCards={onImportCards}
          onImportTextChange={onImportTextChange}
          preview={importPreview}
          selectedDeckName={selectedDeckName}
        />
      );
    case 'import_deck':
      return (
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
      );
    default:
      return (
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
          saveFeedbackMessage={saveFeedbackMessage}
          saveFeedbackTick={saveFeedbackTick}
          onSubmit={onSaveCard}
          preview={draftStudyPreview}
        />
      );
  }
}
