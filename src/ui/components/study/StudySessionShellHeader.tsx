import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionShellHeaderProps = {
  deckName: string | null;
  isSessionFinished: boolean;
  progressLabel: string;
  progressValue: number;
  returnLabel: string;
  pauseLabel: string;
  onBackPress: () => void;
  onPausePress: () => void;
};

export function StudySessionShellHeader({
  deckName,
  isSessionFinished,
  progressLabel,
  progressValue,
  returnLabel,
  pauseLabel,
  onBackPress,
  onPausePress
}: StudySessionShellHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBackPress} style={styles.iconButton}>
          <Text style={styles.iconLabel}>←</Text>
        </Pressable>

        <View style={styles.headerCopy}>
          <Text numberOfLines={1} style={styles.title}>
            {deckName}
          </Text>
          <Text style={styles.support}>{progressLabel}</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={onPausePress} style={styles.pauseButton}>
          <Text style={styles.pauseButtonLabel}>{isSessionFinished ? returnLabel : pauseLabel}</Text>
        </Pressable>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progressValue * 100))}%` }]} />
      </View>
    </>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.m
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      height: 42,
      justifyContent: 'center',
      width: 42
    },
    iconLabel: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700'
    },
    headerCopy: {
      flex: 1,
      gap: 2
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    support: {
      color: colors.textMuted,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    pauseButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    pauseButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    progressTrack: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 999,
      height: 6,
      overflow: 'hidden'
    },
    progressFill: {
      backgroundColor: colors.primary,
      borderRadius: 999,
      height: '100%'
    }
  });
