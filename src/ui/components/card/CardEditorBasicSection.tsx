import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type CardEditorBasicSectionProps = {
  draftFront: string;
  draftBack: string;
  hasError: boolean;
  onDraftFrontChange: (value: string) => void;
  onDraftBackChange: (value: string) => void;
};

export function CardEditorBasicSection({
  draftFront,
  draftBack,
  hasError,
  onDraftFrontChange,
  onDraftBackChange
}: CardEditorBasicSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Basic</Text>
        <Text style={styles.sectionHint}>Front and back</Text>
      </View>

      <Text style={styles.label}>Front</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        onChangeText={onDraftFrontChange}
        placeholder="Question or prompt"
        placeholderTextColor={colors.muted}
        returnKeyType="next"
        style={[styles.input, hasError ? styles.inputError : null]}
        value={draftFront}
      />

      <Text style={styles.label}>Back</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        onChangeText={onDraftBackChange}
        placeholder="Answer"
        placeholderTextColor={colors.muted}
        returnKeyType="done"
        style={styles.input}
        value={draftBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionEyebrow: {
    color: colors.textPrimary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: typography.caption
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: '600'
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  inputError: {
    borderColor: colors.error
  }
});
