import type { AppStrings } from '../../strings/translations';
import type { ImportHubChoiceOption } from './ImportHubChoiceGrid';

export type ImportHubSource =
  | 'paste_notes'
  | 'notebooklm'
  | 'csv_excel'
  | 'structured_deck';

export function buildSourceOptions(
  strings: AppStrings,
  canImportCards: boolean
): Array<ImportHubChoiceOption<ImportHubSource>> {
  return [
    {
      id: 'notebooklm',
      label: strings.importHub.sourceLabels.notebooklm,
      support: canImportCards
        ? strings.importHub.sourceDescriptions.notebookLmCards
        : strings.importHub.sourceDescriptions.notebookLmDeck,
      emphasis: 'featured'
    },
    {
      id: 'paste_notes',
      label: strings.importHub.sourceLabels.pasteNotes,
      support: canImportCards
        ? strings.importHub.sourceDescriptions.pasteNotesCards
        : strings.importHub.intentDescriptions.cardsIntoDeckDisabled,
      disabled: !canImportCards
    },
    {
      id: 'csv_excel',
      label: strings.importHub.sourceLabels.csvExcel,
      support: strings.importHub.sourceDescriptions.csvExcelCards,
      emphasis: 'utility',
      disabled: !canImportCards
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
