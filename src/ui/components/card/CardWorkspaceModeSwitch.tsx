import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export type CardWorkspaceMode = 'create' | 'import_cards' | 'import_deck';

type CardWorkspaceModeSwitchProps = {
  activeMode: CardWorkspaceMode;
  onChangeMode: (mode: CardWorkspaceMode) => void;
  isDisabled: boolean;
};

const WORKSPACE_MODES: Array<{ mode: CardWorkspaceMode; label: string }> = [
  { mode: 'create', label: 'Create card' },
  { mode: 'import_cards', label: 'Import cards' },
  { mode: 'import_deck', label: 'Import deck' }
];

export function CardWorkspaceModeSwitch({
  activeMode,
  onChangeMode,
  isDisabled
}: CardWorkspaceModeSwitchProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Workspace</Text>
      <View style={styles.track}>
        {WORKSPACE_MODES.map((item) => (
          <Pressable
            disabled={isDisabled}
            key={item.mode}
            onPress={() => {
              onChangeMode(item.mode);
            }}
            style={[
              styles.option,
              item.mode === activeMode ? styles.optionActive : null,
              isDisabled ? styles.optionDisabled : null
            ]}
          >
            <Text style={[styles.optionLabel, item.mode === activeMode ? styles.optionLabelActive : null]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.s
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  track: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs
  },
  option: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s
  },
  optionActive: {
    backgroundColor: colors.primarySoft
  },
  optionDisabled: {
    opacity: 0.55
  },
  optionLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
    textAlign: 'center'
  },
  optionLabelActive: {
    color: colors.primary
  }
});
