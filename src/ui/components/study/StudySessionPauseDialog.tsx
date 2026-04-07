import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionPauseDialogProps = {
  visible: boolean;
  onResume: () => void;
  onLeave: () => void;
};

export function StudySessionPauseDialog({
  visible,
  onResume,
  onLeave
}: StudySessionPauseDialogProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <Modal animationType="fade" onRequestClose={onResume} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable onPress={onResume} style={StyleSheet.absoluteFill} />
        <View style={styles.card}>
          <Text style={styles.title}>{strings.studyStats.pauseTitle}</Text>
          <Text style={styles.support}>{strings.studyStats.pauseSupport}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onResume} style={styles.primaryButton}>
              <Text style={styles.primaryButtonLabel}>{strings.studyStats.resumeSession}</Text>
            </Pressable>
            <Pressable onPress={onLeave} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonLabel}>{strings.studyStats.stopSession}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(7, 12, 21, 0.76)',
      flex: 1,
      justifyContent: 'center',
      padding: spacing.l
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 24,
      borderWidth: 1,
      gap: spacing.m,
      maxWidth: 420,
      padding: spacing.l,
      width: '100%'
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22
    },
    actions: {
      gap: spacing.s
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: spacing.m,
      paddingVertical: 14
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: 14
    },
    secondaryButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    }
  });
