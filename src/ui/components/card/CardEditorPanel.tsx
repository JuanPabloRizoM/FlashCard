import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CardEditorStudyPreview as CardEditorStudyPreviewType } from '../../../features/study/cardStudyPreview';
import { CardEditorStudyPreview } from './CardEditorStudyPreview';
import { colors, spacing, typography } from '../../theme';

type CardEditorPanelProps = {
  mode: 'create' | 'edit';
  draftTitle: string;
  draftTranslation: string;
  draftDefinition: string;
  draftApplication: string;
  draftImageUri: string;
  preview: CardEditorStudyPreviewType;
  formError: string | null;
  canSubmit: boolean;
  isSubmitting: boolean;
  onDraftTitleChange: (value: string) => void;
  onDraftTranslationChange: (value: string) => void;
  onDraftDefinitionChange: (value: string) => void;
  onDraftApplicationChange: (value: string) => void;
  onDraftImageUriChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onCancelEditing?: () => void;
};

export function CardEditorPanel({
  mode,
  draftTitle,
  draftTranslation,
  draftDefinition,
  draftApplication,
  draftImageUri,
  preview,
  formError,
  canSubmit,
  isSubmitting,
  onDraftTitleChange,
  onDraftTranslationChange,
  onDraftDefinitionChange,
  onDraftApplicationChange,
  onDraftImageUriChange,
  onSubmit,
  onCancelEditing
}: CardEditorPanelProps) {
  const isEditing = mode === 'edit';

  return (
    <View style={styles.formCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>{isEditing ? 'Edit card' : 'Create a card'}</Text>
          <Text style={styles.sectionText}>
            {isEditing
              ? 'Update the selected card and keep its study guidance in view.'
              : 'Draft cards here for the selected deck. Study guidance updates as you type.'}
          </Text>
        </View>
        {isEditing && onCancelEditing != null ? (
          <Pressable
            accessibilityRole="button"
            onPress={onCancelEditing}
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.secondaryButtonPressed : null]}
          >
            <Text style={styles.secondaryButtonLabel}>Cancel</Text>
          </Pressable>
        ) : null}
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
        style={[styles.input, formError != null ? styles.inputError : null]}
        value={draftTitle}
        returnKeyType="next"
      />

      <Text style={styles.label}>Translation (optional)</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        onChangeText={onDraftTranslationChange}
        placeholder="Correr"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={draftTranslation}
      />

      <Text style={styles.label}>Definition (optional)</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        multiline
        onChangeText={onDraftDefinitionChange}
        placeholder="Move quickly on foot."
        placeholderTextColor={colors.muted}
        style={[styles.input, styles.definitionInput]}
        textAlignVertical="top"
        value={draftDefinition}
      />

      <Text style={styles.label}>Application (optional)</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        multiline
        onChangeText={onDraftApplicationChange}
        placeholder="Use when describing speed or urgency."
        placeholderTextColor={colors.muted}
        style={[styles.input, styles.definitionInput]}
        textAlignVertical="top"
        value={draftApplication}
      />

      <Text style={styles.label}>Image URL (optional)</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        onChangeText={onDraftImageUriChange}
        placeholder="https://..."
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={draftImageUri}
      />

      <CardEditorStudyPreview preview={preview} />

      {formError != null ? <Text style={styles.formError}>{formError}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={!canSubmit}
        onPress={() => {
          void onSubmit();
        }}
        style={({ pressed }) => [
          styles.submitButton,
          !canSubmit ? styles.submitButtonDisabled : null,
          pressed && canSubmit ? styles.submitButtonPressed : null
        ]}
      >
        <Text style={styles.submitButtonLabel}>
          {isSubmitting ? 'Saving card...' : isEditing ? 'Save changes' : 'Create card'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  sectionText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600'
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  definitionInput: {
    minHeight: 96
  },
  inputError: {
    borderColor: colors.error
  },
  formError: {
    color: colors.error,
    fontSize: typography.caption
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  submitButtonDisabled: {
    backgroundColor: colors.muted
  },
  submitButtonPressed: {
    opacity: 0.9
  },
  submitButtonLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700'
  },
  secondaryButton: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  secondaryButtonPressed: {
    opacity: 0.75
  },
  secondaryButtonLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
