import type { AppStrings } from '../../strings/translations';
import type { ImportHubChoiceOption } from './ImportHubChoiceGrid';

export type ImportHubIntent = 'cards_into_deck' | 'new_deck';

export type ImportHubSource =
  | 'paste_notes'
  | 'notebooklm'
  | 'csv_excel'
  | 'structured_deck';

export function buildIntentOptions(
  strings: AppStrings,
  canImportCards: boolean,
  selectedDeckName: string | null
): Array<ImportHubChoiceOption<ImportHubIntent>> {
  return [
    {
      id: 'cards_into_deck',
      label: strings.importHub.intentLabels.cardsIntoDeck,
      support:
        canImportCards && selectedDeckName != null
          ? strings.importHub.intentDescriptions.cardsIntoDeck(selectedDeckName)
          : strings.importHub.intentDescriptions.cardsIntoDeckDisabled,
      disabled: !canImportCards
    },
    {
      id: 'new_deck',
      label: strings.importHub.intentLabels.newDeck,
      support: strings.importHub.intentDescriptions.newDeck
    }
  ];
}

export function buildSourceOptions(
  strings: AppStrings,
  activeIntent: ImportHubIntent
): Array<ImportHubChoiceOption<ImportHubSource>> {
  if (activeIntent === 'new_deck') {
    return [
      {
        id: 'notebooklm',
        label: strings.importHub.sourceLabels.notebooklm,
        support: strings.importHub.sourceDescriptions.notebookLmDeck,
        emphasis: 'featured',
        group: 'featured'
      },
      {
        id: 'paste_notes',
        label: strings.importHub.sourceLabels.pasteNotes,
        support: strings.importHub.sourceDescriptions.pasteNotesDeck,
        group: 'other'
      },
      {
        id: 'structured_deck',
        label: strings.importHub.sourceLabels.structuredDeck,
        support: strings.importHub.sourceDescriptions.structuredDeck,
        emphasis: 'utility',
        group: 'other'
      }
    ];
  }

  return [
    {
      id: 'notebooklm',
      label: strings.importHub.sourceLabels.notebooklm,
      support: strings.importHub.sourceDescriptions.notebookLmCards,
      emphasis: 'featured',
      group: 'featured'
    },
    {
      id: 'paste_notes',
      label: strings.importHub.sourceLabels.pasteNotes,
      support: strings.importHub.sourceDescriptions.pasteNotesCards,
      group: 'other'
    },
    {
      id: 'csv_excel',
      label: strings.importHub.sourceLabels.csvExcel,
      support: strings.importHub.sourceDescriptions.csvExcelCards,
      emphasis: 'utility',
      group: 'other'
    }
  ];
}

export function getInputSupport(
  strings: AppStrings,
  source: ImportHubSource
): string {
  switch (source) {
    case 'csv_excel':
      return strings.importHub.inputSupportFile;
    case 'notebooklm':
      return strings.importHub.inputSupportNotebookLm;
    case 'structured_deck':
      return strings.importHub.inputSupportStructuredDeck;
    default:
      return strings.importHub.inputSupportText;
  }
}
