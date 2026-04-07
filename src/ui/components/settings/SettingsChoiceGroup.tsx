import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type SettingsChoiceOption = {
  id: string;
  label: string;
};

type SettingsChoiceGroupProps = {
  activeId: string;
  options: SettingsChoiceOption[];
  onChange: (id: string) => void;
};

export function SettingsChoiceGroup({
  activeId,
  options,
  onChange
}: SettingsChoiceGroupProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.choiceGrid}>
      {options.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => {
            onChange(option.id);
          }}
          style={[styles.choiceCard, activeId === option.id ? styles.choiceCardActive : null]}
        >
          <Text style={[styles.choiceTitle, activeId === option.id ? styles.choiceTitleActive : null]}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    choiceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    choiceCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      minWidth: 104,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m
    },
    choiceCardActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary
    },
    choiceTitle: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    choiceTitleActive: {
      color: colors.primary
    }
  });
