import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

export type ImportHubChoiceOption<T extends string> = {
  id: T;
  label: string;
  support: string;
  disabled?: boolean;
};

type ImportHubChoiceGridProps<T extends string> = {
  activeId: T;
  options: Array<ImportHubChoiceOption<T>>;
  onChange: (id: T) => void;
};

export function ImportHubChoiceGrid<T extends string>({
  activeId,
  options,
  onChange
}: ImportHubChoiceGridProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.grid}>
      {options.map((option) => {
        const isActive = option.id === activeId;

        return (
          <Pressable
            accessibilityRole="button"
            disabled={option.disabled}
            key={option.id}
            onPress={() => {
              onChange(option.id);
            }}
            style={[
              styles.optionCard,
              isActive ? styles.optionCardActive : null,
              option.disabled ? styles.optionCardDisabled : null
            ]}
          >
            <Text style={[styles.optionTitle, isActive ? styles.optionTitleActive : null]}>
              {option.label}
            </Text>
            <Text style={styles.optionSupport}>{option.support}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    grid: {
      gap: spacing.s
    },
    optionCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.xs,
      padding: spacing.m
    },
    optionCardActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary
    },
    optionCardDisabled: {
      opacity: 0.55
    },
    optionTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    optionTitleActive: {
      color: colors.primary
    },
    optionSupport: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    }
  });
