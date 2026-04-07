import type { ReactElement } from 'react';

import { ImportHubInfoCard } from './ImportHubInfoCard';
import type { ImportHubSource } from './importHubConfig';
import type { AppStrings } from '../../strings/translations';

type TextSourceProfile = {
  title: string;
  subtitle: string;
  exampleText: string;
  introSlot: ReactElement;
};

export function getTextSourceProfile(
  strings: AppStrings,
  {
    isDeckFlow,
    selectedDeckName,
    source
  }: {
    isDeckFlow: boolean;
    selectedDeckName: string | null;
    source: Exclude<ImportHubSource, 'csv_excel'>;
  }
): TextSourceProfile {
  switch (source) {
    case 'notebooklm':
      return {
        title: isDeckFlow ? strings.importHub.notebookLm.deckTitle : strings.importHub.notebookLm.cardsTitle,
        subtitle: isDeckFlow
          ? strings.importHub.notebookLm.deckSubtitle
          : selectedDeckName != null
            ? strings.importHub.notebookLm.cardsSubtitleForDeck(selectedDeckName)
            : strings.cardImport.subtitleNoDeck,
        exampleText: isDeckFlow ? strings.importHub.notebookLm.deckExample : strings.importHub.notebookLm.cardsExample,
        introSlot: (
          <ImportHubInfoCard
            bullets={[
              strings.importHub.notebookLm.tipQa,
              strings.importHub.notebookLm.tipNotes,
              strings.importHub.notebookLm.tipCsv
            ]}
            support={isDeckFlow ? strings.importHub.notebookLm.deckSupport : strings.importHub.notebookLm.cardsSupport}
            title={strings.importHub.notebookLm.guideTitle}
            variant="feature"
          />
        )
      };
    case 'structured_deck':
      return {
        title: strings.importHub.structuredDeck.title,
        subtitle: strings.importHub.structuredDeck.subtitle,
        exampleText: strings.importHub.structuredDeck.example,
        introSlot: (
          <ImportHubInfoCard
            bullets={[strings.importHub.structuredDeck.tipFormat, strings.importHub.structuredDeck.tipPower]}
            support={strings.importHub.structuredDeck.support}
            title={strings.importHub.structuredDeck.guideTitle}
            variant="utility"
          />
        )
      };
    default:
      return {
        title: isDeckFlow ? strings.importHub.pasteNotes.deckTitle : strings.importHub.pasteNotes.cardsTitle,
        subtitle: isDeckFlow
          ? strings.importHub.pasteNotes.deckSubtitle
          : selectedDeckName != null
            ? strings.importHub.pasteNotes.cardsSubtitleForDeck(selectedDeckName)
            : strings.cardImport.subtitleNoDeck,
        exampleText: isDeckFlow ? strings.deckImport.exampleText : strings.cardImport.exampleText,
        introSlot: (
          <ImportHubInfoCard
            support={isDeckFlow ? strings.importHub.pasteNotes.deckSupport : strings.importHub.pasteNotes.cardsSupport}
            title={isDeckFlow ? strings.importHub.pasteNotes.deckTitle : strings.importHub.pasteNotes.cardsTitle}
          />
        )
      };
  }
}
