import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type ImportHubStepHeaderProps = {
  eyebrow: string;
  title: string;
  support: string;
};

export function ImportHubStepHeader({
  eyebrow,
  title,
  support
}: ImportHubStepHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.headerBlock}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.support}>{support}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    headerBlock: {
      gap: spacing.xs
    },
    eyebrow: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
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
    }
  });
