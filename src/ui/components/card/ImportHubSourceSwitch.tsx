import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import type { ImportHubSource } from './ImportHubPanel';

type ImportHubSourceSwitchProps = {
  activeSource: ImportHubSource;
  isDisabled: boolean;
  onChangeSource: (source: ImportHubSource) => void;
};

const SOURCE_ORDER: ImportHubSource[] = ['paste_text', 'import_deck', 'file'];

export function ImportHubSourceSwitch({
  activeSource,
  isDisabled,
  onChangeSource
}: ImportHubSourceSwitchProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const labels = strings.importHub.sourceLabels;

  return (
    <View style={styles.sourceSection}>
      <Text style={styles.sourceLabel}>{strings.importHub.sourceLabel}</Text>
      <View style={styles.sourceTrack}>
        {SOURCE_ORDER.map((source) => (
          <Pressable
            disabled={isDisabled}
            key={source}
            onPress={() => {
              onChangeSource(source);
            }}
            style={[
              styles.sourceOption,
              source === activeSource ? styles.sourceOptionActive : null,
              isDisabled ? styles.sourceOptionDisabled : null
            ]}
          >
            <Text style={[styles.sourceOptionLabel, source === activeSource ? styles.sourceOptionLabelActive : null]}>
              {labels[
                source === 'paste_text' ? 'pasteText' : source === 'import_deck' ? 'importDeck' : 'file'
              ]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sourceSection: {
      gap: spacing.s
    },
    sourceLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    sourceTrack: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.xs,
      padding: spacing.xs
    },
    sourceOption: {
      alignItems: 'center',
      borderRadius: 12,
      flex: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.s
    },
    sourceOptionActive: {
      backgroundColor: colors.primarySoft
    },
    sourceOptionDisabled: {
      opacity: 0.55
    },
    sourceOptionLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600',
      textAlign: 'center'
    },
    sourceOptionLabelActive: {
      color: colors.primary
    }
  });
