import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type GuestUpgradeModalProps = {
  actionLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  support: string;
  title: string;
  visible: boolean;
};

export function GuestUpgradeModal({
  actionLabel,
  onClose,
  onConfirm,
  support,
  title,
  visible
}: GuestUpgradeModalProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSupport}>{support}</Text>
          <View style={styles.modalActions}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalSecondaryAction}>
              <Text style={styles.modalSecondaryActionLabel}>{strings.common.cancel}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.modalPrimaryAction}>
              <Text style={styles.modalPrimaryActionLabel}>{actionLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    modalBackdrop: {
      alignItems: 'center',
      backgroundColor: 'rgba(7, 12, 21, 0.7)',
      flex: 1,
      justifyContent: 'center',
      padding: spacing.l
    },
    modalCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 24,
      borderWidth: 1,
      gap: spacing.m,
      maxWidth: 420,
      padding: spacing.l,
      width: '100%'
    },
    modalTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    modalSupport: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22
    },
    modalActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      justifyContent: 'flex-end'
    },
    modalSecondaryAction: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    modalSecondaryActionLabel: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    modalPrimaryAction: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 999,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    modalPrimaryActionLabel: {
      color: colors.surface,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    }
  });
