import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
import { CsvImportPanel } from './CsvImportPanel';
import { ImportHubInfoCard } from './ImportHubInfoCard';
import { ImportHubStepHeader } from './ImportHubStepHeader';
import { ImportHubTextFlow } from './ImportHubTextFlow';
import { buildSourceOptions, getInputSupport, type ImportHubSource } from './importHubConfig';

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

function buildStructuredDeckOption(strings: ReturnType<typeof useAppStrings>): ImportHubChoiceOption<ImportHubSource> {
  return {
    id: 'structured_deck',
    label: strings.importHub.sourceLabels.structuredDeck,
    support: strings.importHub.sourceDescriptions.structuredDeck,
    emphasis: 'utility'
  };
}

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
  const [activeSource, setActiveSource] = useState<ImportHubSource>('notebooklm');

  const sourceOptions = useMemo<Array<ImportHubChoiceOption<ImportHubSource>>>(
    () => buildSourceOptions(strings, canImportCards),
    [canImportCards, strings]
  );
  const renderedSourceOptions = useMemo<Array<ImportHubChoiceOption<ImportHubSource>>>(
    () =>
      activeSource === 'structured_deck'
        ? [...sourceOptions, buildStructuredDeckOption(strings)]
        : sourceOptions,
    [activeSource, sourceOptions, strings]
  );

  useEffect(() => {
    if (!canImportCards && (activeSource === 'csv_excel' || activeSource === 'paste_notes')) {
      setActiveSource('notebooklm');
    }
  }, [activeSource, canImportCards]);

  const isDeckFlow =
    activeSource === 'structured_deck' || (!canImportCards && activeSource === 'notebooklm');
  const isCsvFlow = activeSource === 'csv_excel';
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
          support={strings.importHub.guidedSupport}
          title={strings.importHub.guidedTitle}
        />
        <ImportHubChoiceGrid
          activeId={activeSource}
          onChange={setActiveSource}
          options={renderedSourceOptions}
        />
        {canImportCards && activeSource !== 'structured_deck' ? (
          <ImportHubInfoCard
            support={strings.importHub.structuredDeckSupport}
            title={strings.importHub.structuredDeckShortcutTitle}
            bullets={[strings.importHub.structuredDeckShortcutBullet]}
            variant="utility"
          />
        ) : null}
        {activeSource !== 'structured_deck' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setActiveSource('structured_deck');
            }}
          >
            <Text style={styles.utilityLink}>{strings.importHub.structuredDeckShortcutAction}</Text>
          </Pressable>
        ) : null}
        <Text style={styles.targetLabel}>{helperTarget}</Text>
      </View>

      <View style={styles.stepSection}>
        <ImportHubStepHeader
          eyebrow={strings.importHub.stepLabel(2)}
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
            reviewStepEyebrow={strings.importHub.stepLabel(3)}
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
            reviewStepEyebrow={strings.importHub.stepLabel(3)}
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
    utilityLink: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    targetLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600'
    }
  });
