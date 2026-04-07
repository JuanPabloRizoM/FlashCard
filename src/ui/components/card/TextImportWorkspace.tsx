import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type TextImportWorkspaceProps = {
  topSlot?: ReactNode;
  introSlot?: ReactNode;
  isEmbedded?: boolean;
  title: string;
  subtitle: string;
  exampleText: string;
  importText: string;
  isSubmitting: boolean;
  onImportTextChange: (value: string) => void;
  onClearImport: () => void;
  actionLabel: string;
  isActionDisabled: boolean;
  onAction: () => void;
  minInputHeight?: number;
  children?: ReactNode;
};

export function TextImportWorkspace({
  topSlot,
  introSlot,
  isEmbedded = false,
  title,
  subtitle,
  exampleText,
  importText,
  isSubmitting,
  onImportTextChange,
  onClearImport,
  actionLabel,
  isActionDisabled,
  onAction,
  minInputHeight = 140,
  children
}: TextImportWorkspaceProps) {
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [isExampleVisible, setIsExampleVisible] = useState(false);

  return (
    <View style={[styles.panel, isEmbedded ? styles.panelEmbedded : null]}>
      {topSlot}
      {introSlot}
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.supportText}>{subtitle}</Text>
        </View>
        <View style={styles.actionsRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setIsExampleVisible((value) => !value);
            }}
            style={styles.linkButton}
          >
            <Text style={styles.linkButtonLabel}>
              {isExampleVisible ? strings.common.hideExample : strings.common.example}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={importText.length === 0 || isSubmitting}
            onPress={onClearImport}
            style={[
              styles.secondaryButton,
              importText.length === 0 || isSubmitting ? styles.secondaryButtonDisabled : null
            ]}
          >
            <Text style={styles.secondaryButtonLabel}>{strings.common.clear}</Text>
          </Pressable>
        </View>
      </View>

      {isExampleVisible ? (
        <View style={styles.exampleCard}>
          <Text style={styles.exampleText}>{exampleText}</Text>
        </View>
      ) : null}

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
        multiline
        onChangeText={onImportTextChange}
        placeholder={exampleText}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { minHeight: minInputHeight }]}
        textAlignVertical="top"
        value={importText}
      />

      {children}

      <Pressable
        accessibilityRole="button"
        disabled={isActionDisabled}
        onPress={onAction}
        style={[styles.primaryButton, isActionDisabled ? styles.primaryButtonDisabled : null]}
      >
        <Text style={styles.primaryButtonLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.l
  },
  panelEmbedded: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    padding: 0
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'space-between'
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs
  },
  actionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  linkButton: {
    paddingVertical: spacing.xs
  },
  linkButtonLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  exampleCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.m
  },
  exampleText: {
    color: colors.textPrimary,
    fontFamily: 'Courier',
    fontSize: typography.caption,
    lineHeight: 20
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  primaryButtonDisabled: {
    backgroundColor: colors.borderStrong
  },
  primaryButtonLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700'
  },
  secondaryButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  secondaryButtonDisabled: {
    opacity: 0.5
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
