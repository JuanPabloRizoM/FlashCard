import { StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

export function ImportHubFilePlaceholder() {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <View style={styles.fileCard}>
        <Text style={styles.fileTitle}>{strings.importHub.fileTitle}</Text>
        <Text style={styles.fileSupport}>{strings.importHub.fileSupport}</Text>
        <Text style={styles.fileNotice}>{strings.importHub.fileNotice}</Text>
      </View>

      <View style={styles.fileButtonDisabled}>
        <Text style={styles.fileButtonDisabledLabel}>{strings.importHub.fileAction}</Text>
      </View>
    </>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    fileCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    fileTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    fileSupport: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    fileNotice: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '600',
      lineHeight: 18
    },
    fileButtonDisabled: {
      alignItems: 'center',
      backgroundColor: colors.borderStrong,
      borderRadius: 14,
      paddingHorizontal: spacing.m,
      paddingVertical: 14
    },
    fileButtonDisabledLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    }
  });
