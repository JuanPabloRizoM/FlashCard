import { StyleSheet, Text, View } from 'react-native';

import type { InsightReadiness } from '../../../features/study/studyInsights';
import { spacing } from '../../theme';

type DeckReadinessBadgeProps = {
  readiness: InsightReadiness;
  label: string;
};

function getReadinessColors(readiness: InsightReadiness) {
  switch (readiness) {
    case 'good':
      return { backgroundColor: '#dcfce7', textColor: '#166534' };
    case 'needs_improvement':
      return { backgroundColor: '#fef3c7', textColor: '#92400e' };
    case 'poor':
      return { backgroundColor: '#fee2e2', textColor: '#b91c1c' };
    default:
      return { backgroundColor: '#e2e8f0', textColor: '#475569' };
  }
}

export function DeckReadinessBadge({ readiness, label }: DeckReadinessBadgeProps) {
  const tone = getReadinessColors(readiness);

  return (
    <View style={[styles.badge, { backgroundColor: tone.backgroundColor }]}>
      <Text style={[styles.badgeLabel, { color: tone.textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  }
});
