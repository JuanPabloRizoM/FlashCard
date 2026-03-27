import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type CardEditorBasicSectionProps = {
  draftTitle: string;
  draftTranslation: string;
  hasError: boolean;
  onDraftTitleChange: (value: string) => void;
  onDraftTranslationChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function CardEditorBasicSection({
  draftTitle,
  draftTranslation,
  hasError,
  onDraftTitleChange,
  onDraftTranslationChange,
  onSubmit
}: CardEditorBasicSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Basic</Text>
        <Text style={styles.sectionHint}>Title and translation</Text>
      </View>

      <Text style={styles.label}>Card title</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        onChangeText={onDraftTitleChange}
        onSubmitEditing={() => {
          void onSubmit();
        }}
        placeholder="Verb: to run"
        placeholderTextColor={colors.muted}
        returnKeyType="next"
        style={[styles.input, hasError ? styles.inputError : null]}
        value={draftTitle}
      />

      <Text style={styles.label}>Translation</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        onChangeText={onDraftTranslationChange}
        placeholder="Correr"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={draftTranslation}
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
