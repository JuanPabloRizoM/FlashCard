import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { CsvImportField, CsvImportMapping, CsvImportPreview } from '../../../features/cards/csvImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { CardEditorPanel } from './CardEditorPanel';
import { ImportHubPanel } from './ImportHubPanel';
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
  csvFileName: string | null;
  csvHeaders: string[];
  csvMapping: CsvImportMapping;
  csvPreview: CsvImportPreview;
  csvImportResultMessage: string | null;
  deckImportText: string;
  deckImportPreview: DeckImportPreview;
  deckImportResultMessage: string | null;
  isImportSubmitting: boolean;
  isCsvImportSubmitting: boolean;
  isDeckImportSubmitting: boolean;
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
  onPickCsvFile: () => Promise<void>;
  onChangeCsvMapping: (field: CsvImportField, header: string | null) => void;
  onImportCsv: () => Promise<void>;
  onClearCsvImport: () => void;
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
  csvFileName,
  csvHeaders,
  csvMapping,
  csvPreview,
  csvImportResultMessage,
  deckImportText,
  deckImportPreview,
  deckImportResultMessage,
  isImportSubmitting,
  isCsvImportSubmitting,
  isDeckImportSubmitting,
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
  onPickCsvFile,
  onChangeCsvMapping,
  onImportCsv,
  onClearCsvImport,
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
          isLocked={isImportLocked}
          onCardImportTextChange={onImportTextChange}
          onClearCardImport={onClearImport}
          onClearCsvImport={onClearCsvImport}
          onClearDeckImport={onClearDeckImport}
          onDeckImportTextChange={onDeckImportTextChange}
          onImportCards={onImportCards}
          onImportCsv={onImportCsv}
          onImportDeck={onImportDeck}
          onPickCsvFile={onPickCsvFile}
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
