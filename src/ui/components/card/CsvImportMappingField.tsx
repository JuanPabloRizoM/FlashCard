import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type CsvImportMappingFieldProps = {
  label: string;
  isRequired: boolean;
  columns: string[];
  selectedColumn: string | null;
  onSelectColumn: (column: string | null) => void;
  notUsedLabel: string;
};

export function CsvImportMappingField({
  label,
  isRequired,
  columns,
  selectedColumn,
  onSelectColumn,
  notUsedLabel
}: CsvImportMappingFieldProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.choiceRow}>
          {!isRequired ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onSelectColumn(null);
              }}
              style={[styles.choiceChip, selectedColumn == null ? styles.choiceChipActive : null]}
            >
              <Text style={[styles.choiceLabel, selectedColumn == null ? styles.choiceLabelActive : null]}>
                {notUsedLabel}
              </Text>
            </Pressable>
          ) : null}
          {columns.map((column) => (
            <Pressable
              accessibilityRole="button"
              key={column}
              onPress={() => {
                onSelectColumn(column);
              }}
              style={[styles.choiceChip, selectedColumn === column ? styles.choiceChipActive : null]}
            >
              <Text style={[styles.choiceLabel, selectedColumn === column ? styles.choiceLabelActive : null]}>
                {column}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    fieldBlock: {
      gap: spacing.s
    },
    fieldLabel: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    },
    choiceRow: {
      flexDirection: 'row',
      gap: spacing.s
    },
    choiceChip: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    choiceChipActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary
    },
    choiceLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    choiceLabelActive: {
      color: colors.primary
    }
  });
