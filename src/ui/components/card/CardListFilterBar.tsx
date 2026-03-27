import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';
import { CARD_LIST_FILTER_LABELS, type CardListFilter } from './cardListFilters';

type CardListFilterBarProps = {
  activeFilter: CardListFilter;
  onChangeFilter: (filter: CardListFilter) => void;
};

const FILTERS: CardListFilter[] = ['all', 'needs_details', 'ready'];

export function CardListFilterBar({ activeFilter, onChangeFilter }: CardListFilterBarProps) {
  return (
    <View style={styles.row}>
      {FILTERS.map((filter) => (
        <Pressable
          key={filter}
          accessibilityRole="button"
          onPress={() => {
            onChangeFilter(filter);
          }}
          style={({ pressed }) => [
            styles.chip,
            activeFilter === filter ? styles.chipActive : null,
            pressed ? styles.chipPressed : null
          ]}
        >
          <Text style={[styles.chipLabel, activeFilter === filter ? styles.chipLabelActive : null]}>
            {CARD_LIST_FILTER_LABELS[filter]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  chipPressed: {
    opacity: 0.8
  },
  chipLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  chipLabelActive: {
    color: colors.primary
  }
});
