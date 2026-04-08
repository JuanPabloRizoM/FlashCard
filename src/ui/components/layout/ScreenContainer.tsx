import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type ScreenContainerProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function ScreenContainer({ title, subtitle, children }: ScreenContainerProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    gap: spacing.l
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.xs
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.hero,
    fontWeight: '700'
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
    lineHeight: 22,
    maxWidth: 520
  }
});
