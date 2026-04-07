import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { CardEditorPanel } from './CardEditorPanel';
import { ImportHubPanel, type ImportHubSource } from './ImportHubPanel';
import type { CardWorkspaceMode } from './CardWorkspaceModeSwitch';

type CardWorkspacePanelProps = {
  mode: CardWorkspaceMode;
  selectedDeckName: string | null;
  editingCardId: number | null;
  isEditorLocked: boolean;
  isImportLocked: boolean;
  canSubmit: boolean;
  draftFront: string;
  draftBack: string;
  draftDescription: string;
  draftApplication: string;
  draftImageUri: string;
  formError: string | null;
  saveFeedbackMessage: string | null;
  importText: string;
  importPreview: CardImportPreview;
  importResultMessage: string | null;
  deckImportText: string;
  deckImportPreview: DeckImportPreview;
  deckImportResultMessage: string | null;
  isImportSubmitting: boolean;
  isDeckImportSubmitting: boolean;
  defaultImportSource?: ImportHubSource;
  onDraftFrontChange: (value: string) => void;
  onDraftBackChange: (value: string) => void;
  onDraftDescriptionChange: (value: string) => void;
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
  draftFront,
  draftBack,
  draftDescription,
  draftApplication,
  draftImageUri,
  formError,
  saveFeedbackMessage,
  importText,
  importPreview,
  importResultMessage,
  deckImportText,
  deckImportPreview,
  deckImportResultMessage,
  isImportSubmitting,
  isDeckImportSubmitting,
  defaultImportSource,
  onDraftFrontChange,
  onDraftBackChange,
  onDraftDescriptionChange,
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
    case 'import':
      return (
        <ImportHubPanel
          canImportCards={selectedDeckName != null}
          cardImportPreview={importPreview}
          cardImportResultMessage={importResultMessage}
          cardImportText={importText}
          deckImportPreview={deckImportPreview}
          deckImportResultMessage={deckImportResultMessage}
          deckImportText={deckImportText}
          defaultSource={defaultImportSource}
          isCardImportSubmitting={isImportSubmitting}
          isDeckImportSubmitting={isDeckImportSubmitting}
          isLocked={isImportLocked}
          onCardImportTextChange={onImportTextChange}
          onClearCardImport={onClearImport}
          onClearDeckImport={onClearDeckImport}
          onDeckImportTextChange={onDeckImportTextChange}
          onImportCards={onImportCards}
          onImportDeck={onImportDeck}
          selectedDeckName={selectedDeckName}
        />
      );
    default:
      return (
        <CardEditorPanel
          canSubmit={canSubmit && !isImportSubmitting}
          draftApplication={draftApplication}
          draftDescription={draftDescription}
          draftImageUri={draftImageUri}
          draftFront={draftFront}
          draftBack={draftBack}
          formError={formError}
          isSubmitting={isEditorLocked}
          mode={editingCardId == null ? 'create' : 'edit'}
          onCancelEditing={editingCardId != null ? onCancelEditing : undefined}
          onDraftApplicationChange={onDraftApplicationChange}
          onDraftDescriptionChange={onDraftDescriptionChange}
          onDraftImageUriChange={onDraftImageUriChange}
          onDraftFrontChange={onDraftFrontChange}
          onDraftBackChange={onDraftBackChange}
          saveFeedbackMessage={saveFeedbackMessage}
          onSubmit={onSaveCard}
        />
      );
  }
}
