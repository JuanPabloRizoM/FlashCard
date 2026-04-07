import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type ImportHubInfoCardProps = {
  title: string;
  support: string;
  bullets?: string[];
};

export function ImportHubInfoCard({
  title,
  support,
  bullets = []
}: ImportHubInfoCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.support}>{support}</Text>
      {bullets.length > 0 ? (
        <View style={styles.bulletList}>
          {bullets.map((bullet) => (
            <Text key={bullet} style={styles.bulletText}>
              • {bullet}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.xs,
      padding: spacing.m
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    bulletList: {
      gap: spacing.xs,
      paddingTop: spacing.xs
    },
    bulletText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    }
  });
