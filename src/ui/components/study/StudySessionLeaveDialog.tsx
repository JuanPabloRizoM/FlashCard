import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionLeaveDialogProps = {
  visible: boolean;
  onContinue: () => void;
  onLeave: () => void;
};

export function StudySessionLeaveDialog({
  visible,
  onContinue,
  onLeave
}: StudySessionLeaveDialogProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <Modal animationType="fade" onRequestClose={onContinue} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable onPress={onContinue} style={StyleSheet.absoluteFill} />
        <View style={styles.card}>
          <Text style={styles.title}>{strings.screens.study.leaveSessionTitle}</Text>
          <Text style={styles.support}>{strings.screens.study.leaveSessionSupport}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onContinue} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonLabel}>{strings.screens.study.continueSession}</Text>
            </Pressable>
            <Pressable onPress={onLeave} style={styles.primaryButton}>
              <Text style={styles.primaryButtonLabel}>{strings.screens.study.leaveSessionAction}</Text>
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
      backgroundColor: colors.error,
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
