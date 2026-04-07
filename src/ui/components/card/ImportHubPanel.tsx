import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import type {
  CsvImportField,
  CsvImportMapping,
  CsvImportPreview
} from '../../../features/cards/csvImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import {
  ImportHubChoiceGrid,
  type ImportHubChoiceOption
} from './ImportHubChoiceGrid';
import { ImportHubStepHeader } from './ImportHubStepHeader';
import { CsvImportPanel } from './CsvImportPanel';
import { ImportHubInfoCard } from './ImportHubInfoCard';
import { ImportHubTextFlow } from './ImportHubTextFlow';
import {
  buildIntentOptions,
  buildSourceOptions,
  getInputSupport,
  type ImportHubIntent,
  type ImportHubSource
} from './importHubConfig';

type ImportHubPanelProps = {
  selectedDeckName: string | null;
  canImportCards: boolean;
  isLocked: boolean;
  cardImportText: string;
  cardImportPreview: CardImportPreview;
  cardImportResultMessage: string | null;
  isCardImportSubmitting: boolean;
  onCardImportTextChange: (value: string) => void;
  onImportCards: () => Promise<void>;
  onClearCardImport: () => void;
  csvFileName: string | null;
  csvHeaders: string[];
  csvMapping: CsvImportMapping;
  csvPreview: CsvImportPreview;
  csvImportResultMessage: string | null;
  isCsvImportSubmitting: boolean;
  onPickCsvFile: () => Promise<void>;
  onChangeCsvMapping: (field: CsvImportField, header: string | null) => void;
  onImportCsv: () => Promise<void>;
  onClearCsvImport: () => void;
  deckImportText: string;
  deckImportPreview: DeckImportPreview;
  deckImportResultMessage: string | null;
  isDeckImportSubmitting: boolean;
  onDeckImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearDeckImport: () => void;
};

export function ImportHubPanel({
  selectedDeckName,
  canImportCards,
  isLocked,
  cardImportText,
  cardImportPreview,
  cardImportResultMessage,
  isCardImportSubmitting,
  onCardImportTextChange,
  onImportCards,
  onClearCardImport,
  csvFileName,
  csvHeaders,
  csvMapping,
  csvPreview,
  csvImportResultMessage,
  isCsvImportSubmitting,
  onPickCsvFile,
  onChangeCsvMapping,
  onImportCsv,
  onClearCsvImport,
  deckImportText,
  deckImportPreview,
  deckImportResultMessage,
  isDeckImportSubmitting,
  onDeckImportTextChange,
  onImportDeck,
  onClearDeckImport
}: ImportHubPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [activeIntent, setActiveIntent] = useState<ImportHubIntent>(
    canImportCards ? 'cards_into_deck' : 'new_deck'
  );
  const [activeSource, setActiveSource] = useState<ImportHubSource>('notebooklm');

  useEffect(() => {
    if (!canImportCards && activeIntent !== 'new_deck') {
      setActiveIntent('new_deck');
    }
  }, [activeIntent, canImportCards]);

  useEffect(() => {
    if (
      activeIntent === 'new_deck' &&
      activeSource === 'csv_excel'
    ) {
      setActiveSource('notebooklm');
    }
  }, [activeIntent, activeSource]);

  const sourceOptions = useMemo<Array<ImportHubChoiceOption<ImportHubSource>>>(
    () => buildSourceOptions(strings, activeIntent),
    [activeIntent, strings]
  );

  const intentOptions = useMemo<Array<ImportHubChoiceOption<ImportHubIntent>>>(
    () => buildIntentOptions(strings, canImportCards, selectedDeckName),
    [canImportCards, selectedDeckName, strings]
  );

  const isDeckFlow = activeIntent === 'new_deck';
  const isCsvFlow = activeIntent === 'cards_into_deck' && activeSource === 'csv_excel';
  const textSource: Exclude<ImportHubSource, 'csv_excel'> =
    activeSource === 'csv_excel' ? 'paste_notes' : activeSource;

  const helperTarget = isDeckFlow
    ? strings.importHub.targetNewDeck
    : selectedDeckName != null
      ? strings.importHub.targetDeck(selectedDeckName)
      : strings.importHub.targetDeckMissing;

  return (
    <View style={styles.panel}>
      <View style={styles.headerBlock}>
        <Text style={styles.panelTitle}>{strings.importHub.title}</Text>
        <Text style={styles.panelSubtitle}>{strings.importHub.subtitle}</Text>
      </View>

      <View style={styles.stepSection}>
        <ImportHubStepHeader
          eyebrow={strings.importHub.stepLabel(1)}
          support={strings.importHub.intentSupport}
          title={strings.importHub.intentTitle}
        />
        <ImportHubChoiceGrid
          activeId={activeIntent}
          onChange={setActiveIntent}
          options={intentOptions}
        />
      </View>

      <View style={styles.stepSection}>
        <ImportHubStepHeader
          eyebrow={strings.importHub.stepLabel(2)}
          support={isDeckFlow ? strings.importHub.sourceSupportDeck : strings.importHub.sourceSupportCards}
          title={strings.importHub.sourceTitle}
        />
        <ImportHubChoiceGrid
          activeId={activeSource}
          groupLabels={{
            featured: strings.importHub.featuredSourcesTitle,
            other: strings.importHub.otherSourcesTitle
          }}
          onChange={setActiveSource}
          options={sourceOptions}
        />
        <ImportHubInfoCard
          support={strings.importHub.futureSourcesSupport}
          title={strings.importHub.futureSourcesTitle}
          bullets={[strings.importHub.notionFutureNote]}
          variant="utility"
        />
        <Text style={styles.targetLabel}>{helperTarget}</Text>
      </View>

      <View style={styles.stepSection}>
        <ImportHubStepHeader
          eyebrow={strings.importHub.stepLabel(3)}
          support={getInputSupport(strings, activeSource)}
          title={strings.importHub.inputTitle}
        />

        {isCsvFlow ? (
          <CsvImportPanel
            fileName={csvFileName}
            headers={csvHeaders}
            importResultMessage={csvImportResultMessage}
            isDisabled={isLocked || selectedDeckName == null}
            isEmbedded
            isSubmitting={isCsvImportSubmitting}
            mapping={csvMapping}
            onChangeMapping={onChangeCsvMapping}
            onClearFile={onClearCsvImport}
            onImportCsv={onImportCsv}
            onPickFile={onPickCsvFile}
            preview={csvPreview}
          />
        ) : (
          <ImportHubTextFlow
            canImportCards={canImportCards}
            cardImportPreview={cardImportPreview}
            cardImportResultMessage={cardImportResultMessage}
            cardImportText={cardImportText}
            deckImportPreview={deckImportPreview}
            deckImportResultMessage={deckImportResultMessage}
            deckImportText={deckImportText}
            isCardImportSubmitting={isCardImportSubmitting}
            isDeckFlow={isDeckFlow}
            isDeckImportSubmitting={isDeckImportSubmitting}
            isLocked={isLocked}
            onCardImportTextChange={onCardImportTextChange}
            onClearCardImport={onClearCardImport}
            onClearDeckImport={onClearDeckImport}
            onDeckImportTextChange={onDeckImportTextChange}
            onImportCards={onImportCards}
            onImportDeck={onImportDeck}
            selectedDeckName={selectedDeckName}
            source={textSource}
          />
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    panel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.l,
      padding: spacing.l
    },
    headerBlock: {
      gap: spacing.xs
    },
    panelTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    panelSubtitle: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    stepSection: {
      gap: spacing.s
    },
    targetLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600'
    }
  });
