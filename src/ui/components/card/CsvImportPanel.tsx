import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CsvImportField, CsvImportMapping, CsvImportPreview } from '../../../features/cards/csvImport';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { CsvImportMappingField } from './CsvImportMappingField';
import { ImportHubReviewSection } from './ImportHubReviewSection';

type CsvImportPanelProps = {
  isEmbedded?: boolean;
  reviewStepEyebrow: string;
  fileName: string | null;
  headers: string[];
  mapping: CsvImportMapping;
  preview: CsvImportPreview;
  importResultMessage: string | null;
  isSubmitting: boolean;
  isDisabled: boolean;
  onPickFile: () => Promise<void>;
  onChangeMapping: (field: CsvImportField, header: string | null) => void;
  onImportCsv: () => Promise<void>;
  onClearFile: () => void;
};

export function CsvImportPanel({
  isEmbedded = false,
  reviewStepEyebrow,
  fileName,
  headers,
  mapping,
  preview,
  importResultMessage,
  isSubmitting,
  isDisabled,
  onPickFile,
  onChangeMapping,
  onImportCsv,
  onClearFile
}: CsvImportPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  function getStatusText(): string | null {
    if (!preview.hasFile) {
      return null;
    }

    if (preview.validCount > 0) {
      return strings.csvImport.validReady(preview.validCount);
    }

    if (preview.invalidCount > 0 || preview.mappingErrors.length > 0) {
      return strings.csvImport.fixInvalidRows;
    }

    return null;
  }

  return (
    <View style={[styles.panel, isEmbedded ? styles.panelEmbedded : null]}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>{strings.importHub.sourceLabels.csvExcel}</Text>
          <Text style={styles.supportText}>{strings.importHub.inputSupportFile}</Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={() => {
              void onPickFile();
            }}
            style={({ pressed }) => [styles.primaryChip, isSubmitting ? styles.chipDisabled : null, pressed && !isSubmitting ? styles.primaryChipPressed : null]}
          >
            <Text style={styles.primaryChipLabel}>
              {fileName == null ? strings.csvImport.chooseFile : strings.csvImport.replaceFile}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={fileName == null || isSubmitting}
            onPress={onClearFile}
            style={({ pressed }) => [styles.secondaryChip, fileName == null || isSubmitting ? styles.chipDisabled : null, pressed && fileName != null && !isSubmitting ? styles.secondaryChipPressed : null]}
          >
            <Text style={styles.secondaryChipLabel}>{strings.common.clear}</Text>
          </Pressable>
        </View>
      </View>

      {fileName != null ? <Text style={styles.fileName}>{strings.csvImport.selectedFile(fileName)}</Text> : null}
      {headers.length > 0 ? (
        <View style={styles.mappingCard}>
          <Text style={styles.mappingTitle}>{strings.csvImport.mappingTitle}</Text>
          <Text style={styles.supportText}>{strings.csvImport.mappingSupport}</Text>
          <CsvImportMappingField
            columns={headers}
            isRequired
            label={strings.cardEditor.frontLabel}
            notUsedLabel={strings.csvImport.notUsed}
            onSelectColumn={(header) => {
              onChangeMapping('front', header);
            }}
            selectedColumn={mapping.front}
          />
          <CsvImportMappingField
            columns={headers}
            isRequired
            label={strings.cardEditor.backLabel}
            notUsedLabel={strings.csvImport.notUsed}
            onSelectColumn={(header) => {
              onChangeMapping('back', header);
            }}
            selectedColumn={mapping.back}
          />
          <Text style={styles.optionalLabel}>{strings.common.optional}</Text>
          <CsvImportMappingField
            columns={headers}
            isRequired={false}
            label={strings.cardEditor.descriptionLabel}
            notUsedLabel={strings.csvImport.notUsed}
            onSelectColumn={(header) => {
              onChangeMapping('description', header);
            }}
            selectedColumn={mapping.description}
          />
          <CsvImportMappingField
            columns={headers}
            isRequired={false}
            label={strings.cardEditor.applicationLabel}
            notUsedLabel={strings.csvImport.notUsed}
            onSelectColumn={(header) => {
              onChangeMapping('application', header);
            }}
            selectedColumn={mapping.application}
          />
          <CsvImportMappingField
            columns={headers}
            isRequired={false}
            label={strings.csvImport.imageLabel}
            notUsedLabel={strings.csvImport.notUsed}
            onSelectColumn={(header) => {
              onChangeMapping('imageUri', header);
            }}
            selectedColumn={mapping.imageUri}
          />
        </View>
      ) : null}

      <ImportHubReviewSection
        actionLabel={isSubmitting ? strings.csvImport.importing : strings.csvImport.actionLabel}
        emptyValidDetailLabel={strings.preview.emptyValidDetail}
        errorMessages={[preview.parseError, ...preview.mappingErrors].filter((message): message is string => message != null)}
        isActionDisabled={isDisabled || !preview.canImport || isSubmitting}
        onAction={() => {
          void onImportCsv();
        }}
        resultMessage={importResultMessage}
        rows={preview.rows}
        statusText={getStatusText()}
        stepEyebrow={reviewStepEyebrow}
        summaryItems={
          preview.hasFile
            ? [strings.common.valid(preview.validCount), strings.common.invalid(preview.invalidCount), strings.common.total(preview.totalCount)]
            : []
        }
        support={strings.importHub.reviewSupport}
        title={strings.importHub.reviewTitle}
      />
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
      gap: spacing.m,
      padding: spacing.l
    },
    panelEmbedded: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between'
    },
    headerCopy: {
      flex: 1,
      gap: spacing.xs
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    supportText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.s
    },
    primaryChip: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    primaryChipPressed: {
      opacity: 0.8
    },
    primaryChipLabel: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    secondaryChip: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    secondaryChipPressed: {
      opacity: 0.8
    },
    secondaryChipLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    chipDisabled: {
      opacity: 0.5
    },
    fileName: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    mappingCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.m
    },
    mappingTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    optionalLabel: {
      color: colors.textMuted,
      fontSize: typography.caption,
      fontWeight: '600'
    }
  });
