import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

export type ImportHubChoiceOption<T extends string> = {
  id: T;
  label: string;
  support: string;
  disabled?: boolean;
  emphasis?: 'featured' | 'standard' | 'utility';
  group?: 'featured' | 'other';
};

type ImportHubChoiceGridProps<T extends string> = {
  activeId: T;
  options: Array<ImportHubChoiceOption<T>>;
  onChange: (id: T) => void;
  groupLabels?: Partial<Record<'featured' | 'other', string>>;
};

export function ImportHubChoiceGrid<T extends string>({
  activeId,
  options,
  onChange,
  groupLabels
}: ImportHubChoiceGridProps<T>) {
  const styles = useThemedStyles(createStyles);
  const groups = groupLabels == null
    ? [{ id: 'all' as const, label: null, options }]
    : ([
        {
          id: 'featured' as const,
          label: groupLabels.featured ?? null,
          options: options.filter((option) => option.group === 'featured')
        },
        {
          id: 'other' as const,
          label: groupLabels.other ?? null,
          options: options.filter((option) => option.group !== 'featured')
        }
      ].filter((group) => group.options.length > 0));

  return (
    <View style={styles.grid}>
      {groups.map((group) => (
        <View key={group.id} style={styles.groupSection}>
          {group.label != null ? <Text style={styles.groupLabel}>{group.label}</Text> : null}
          <View style={styles.groupList}>
            {group.options.map((option) => {
              const isActive = option.id === activeId;
              const isFeatured = option.emphasis === 'featured';
              const isUtility = option.emphasis === 'utility';

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
                    isFeatured ? styles.optionCardFeatured : null,
                    isUtility ? styles.optionCardUtility : null,
                    isActive ? styles.optionCardActive : null,
                    option.disabled ? styles.optionCardDisabled : null
                  ]}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      isFeatured ? styles.optionTitleFeatured : null,
                      isActive ? styles.optionTitleActive : null
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionSupport}>{option.support}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    grid: {
      gap: spacing.s
    },
    groupSection: {
      gap: spacing.s
    },
    groupList: {
      gap: spacing.s
    },
    groupLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
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
    optionCardFeatured: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: 18,
      padding: spacing.l
    },
    optionCardUtility: {
      backgroundColor: colors.surfaceMuted
    },
    optionCardDisabled: {
      opacity: 0.55
    },
    optionTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    optionTitleFeatured: {
      fontSize: typography.subtitle
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
