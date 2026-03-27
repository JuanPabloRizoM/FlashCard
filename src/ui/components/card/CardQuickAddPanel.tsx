import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type CardQuickAddPanelProps = {
  draftTitle: string;
  draftTranslation: string;
  formError: string | null;
  saveFeedbackMessage: string | null;
  saveFeedbackTick: number;
  canSubmit: boolean;
  isSubmitting: boolean;
  onDraftTitleChange: (value: string) => void;
  onDraftTranslationChange: (value: string) => void;
  onOpenFullEditor: () => void;
  onSubmit: () => Promise<void>;
};

export function CardQuickAddPanel({
  draftTitle,
  draftTranslation,
  formError,
  saveFeedbackMessage,
  saveFeedbackTick,
  canSubmit,
  isSubmitting,
  onDraftTitleChange,
  onDraftTranslationChange,
  onOpenFullEditor,
  onSubmit
}: CardQuickAddPanelProps) {
  const titleInputRef = useRef<TextInput | null>(null);
  const translationInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (saveFeedbackTick === 0) {
      return;
    }

    titleInputRef.current?.focus();
  }, [saveFeedbackTick]);

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>Quick add</Text>
          <Text style={styles.sectionText}>Front, back, save.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenFullEditor}
          style={({ pressed }) => [styles.secondaryButton, pressed ? styles.secondaryButtonPressed : null]}
        >
          <Text style={styles.secondaryButtonLabel}>Full editor</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Front</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        ref={titleInputRef}
        onChangeText={onDraftTitleChange}
        onSubmitEditing={() => {
          translationInputRef.current?.focus();
        }}
        placeholder="Question or prompt"
        placeholderTextColor={colors.muted}
        returnKeyType="next"
        style={[styles.input, formError != null ? styles.inputError : null]}
        value={draftTitle}
      />

      <Text style={styles.label}>Back</Text>
      <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        ref={translationInputRef}
        onChangeText={onDraftTranslationChange}
        onSubmitEditing={() => {
          void onSubmit();
        }}
        placeholder="Answer"
        placeholderTextColor={colors.muted}
        returnKeyType="done"
        style={styles.input}
        value={draftTranslation}
      />

      {formError != null ? <Text style={styles.formError}>{formError}</Text> : null}
      {formError == null && saveFeedbackMessage != null ? (
        <Text style={styles.saveFeedback}>{saveFeedbackMessage}</Text>
      ) : null}

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
        <Text style={styles.submitButtonLabel}>{isSubmitting ? 'Saving card...' : 'Save card'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.l
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
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  sectionText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: '600'
  },
  input: {
    backgroundColor: colors.surfaceMuted,
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
  },
  formError: {
    color: colors.error,
    fontSize: typography.caption
  },
  saveFeedback: {
    color: colors.success,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  submitButtonDisabled: {
    backgroundColor: colors.borderStrong
  },
  submitButtonPressed: {
    backgroundColor: colors.primaryPressed
  },
  submitButtonLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700'
  },
  secondaryButton: {
    backgroundColor: colors.surfaceMuted,
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
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
