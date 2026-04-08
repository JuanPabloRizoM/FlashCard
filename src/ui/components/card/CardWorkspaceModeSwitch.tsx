import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

export type CardWorkspaceMode = 'create' | 'import';

type CardWorkspaceModeSwitchProps = {
  activeMode: CardWorkspaceMode;
  onChangeMode: (mode: CardWorkspaceMode) => void;
  isDisabled: boolean;
};

export function CardWorkspaceModeSwitch({
  activeMode,
  onChangeMode,
  isDisabled
}: CardWorkspaceModeSwitchProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const workspaceModes: Array<{ mode: CardWorkspaceMode; label: string }> = [
    { mode: 'create', label: strings.cardsWorkspace.modeLabels.create },
    { mode: 'import', label: strings.cardsWorkspace.modeLabels.import }
  ];
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{strings.cardsWorkspace.workspaceLabel}</Text>
      <View style={styles.track}>
        {workspaceModes.map((item) => (
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
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
    backgroundColor: colors.surface
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
    color: colors.textPrimary
  }
});
