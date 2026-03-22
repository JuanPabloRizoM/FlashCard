import { StyleSheet, Text, View } from 'react-native';

import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import { DeckReadinessBadge } from './DeckReadinessBadge';
import { colors, spacing, typography } from '../../theme';

type DeckStudyInsightCardProps = {
  insights: DeckStudyInsights;
};

function getTechniqueTone(status: DeckStudyInsights['techniqueInsights'][number]['status']) {
  switch (status) {
    case 'ready':
      return styles.techniqueReady;
    case 'limited':
      return styles.techniqueLimited;
    default:
      return styles.techniqueUnavailable;
  }
}

export function DeckStudyInsightCard({ insights }: DeckStudyInsightCardProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.sectionTitle}>Study readiness</Text>
          <Text style={styles.supportText}>{insights.readinessMessage}</Text>
        </View>
        <DeckReadinessBadge label={insights.readinessLabel} readiness={insights.readiness} />
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Cards</Text>
          <Text style={styles.metricValue}>{insights.totalCards}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Studyable</Text>
          <Text style={styles.metricValue}>{insights.studyableCards}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Prompt items</Text>
          <Text style={styles.metricValue}>{insights.validPromptItemCount}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Prompt coverage</Text>
        {insights.promptCoverage.map((coverage) => (
          <View key={coverage.mode} style={styles.coverageRow}>
            <View style={styles.coverageHeader}>
              <Text style={styles.coverageLabel}>{coverage.label}</Text>
              <Text style={styles.coverageMeta}>{`${coverage.count} cards · ${coverage.percentage}%`}</Text>
            </View>
            <View style={styles.coverageTrack}>
              <View style={[styles.coverageFill, { width: `${coverage.percentage}%` }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Technique outlook</Text>
        <View style={styles.techniqueWrap}>
          {insights.techniqueInsights.map((technique) => (
            <View key={technique.techniqueId} style={[styles.techniqueCard, getTechniqueTone(technique.status)]}>
              <Text style={styles.techniqueLabel}>{technique.label}</Text>
              <Text style={styles.techniqueMeta}>{`${technique.validItemCount} prompts`}</Text>
              <Text style={styles.techniqueMessage}>{technique.message}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.m
  },
  headerRow: {
    gap: spacing.s
  },
  headerTextWrap: {
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  supportText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.s
  },
  metricCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.s
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  section: {
    gap: spacing.s
  },
  subsectionTitle: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  coverageRow: {
    gap: spacing.xs
  },
  coverageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.s
  },
  coverageLabel: {
    color: colors.text,
    flex: 1,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  coverageMeta: {
    color: colors.muted,
    fontSize: 12
  },
  coverageTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden'
  },
  coverageFill: {
    backgroundColor: colors.primary,
    height: '100%'
  },
  techniqueWrap: {
    gap: spacing.s
  },
  techniqueCard: {
    borderRadius: 12,
    gap: spacing.xs,
    padding: spacing.s
  },
  techniqueReady: {
    backgroundColor: '#dcfce7'
  },
  techniqueLimited: {
    backgroundColor: '#fef3c7'
  },
  techniqueUnavailable: {
    backgroundColor: '#fee2e2'
  },
  techniqueLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  techniqueMeta: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  techniqueMessage: {
    color: colors.muted,
    fontSize: typography.caption
  }
});
