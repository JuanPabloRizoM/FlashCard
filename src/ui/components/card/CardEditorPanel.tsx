import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CardEditorBasicSection } from './CardEditorBasicSection';
import { CardEditorDetailsSection } from './CardEditorDetailsSection';
import { colors, spacing, typography } from '../../theme';

type CardEditorPanelProps = {
  mode: 'create' | 'edit';
  draftFront: string;
  draftBack: string;
  draftDescription: string;
  draftApplication: string;
  draftImageUri: string;
  formError: string | null;
  saveFeedbackMessage: string | null;
  canSubmit: boolean;
  isSubmitting: boolean;
  onDraftFrontChange: (value: string) => void;
  onDraftBackChange: (value: string) => void;
  onDraftDescriptionChange: (value: string) => void;
  onDraftApplicationChange: (value: string) => void;
  onDraftImageUriChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onCancelEditing?: () => void;
};

export function CardEditorPanel({
  mode,
  draftFront,
  draftBack,
  draftDescription,
  draftApplication,
  draftImageUri,
  formError,
  saveFeedbackMessage,
  canSubmit,
  isSubmitting,
  onDraftFrontChange,
  onDraftBackChange,
  onDraftDescriptionChange,
  onDraftApplicationChange,
  onDraftImageUriChange,
  onSubmit,
  onCancelEditing
}: CardEditorPanelProps) {
  const isEditing = mode === 'edit';
  const hasOptionalContent =
    draftDescription.trim().length > 0 ||
    draftApplication.trim().length > 0 ||
    draftImageUri.trim().length > 0;
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(isEditing || hasOptionalContent);

  useEffect(() => {
    if (isEditing || hasOptionalContent) {
      setIsDetailsExpanded(true);
      return;
    }

    setIsDetailsExpanded(false);
  }, [hasOptionalContent, isEditing]);

  return (
    <View style={styles.formCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>{isEditing ? 'Edit card' : 'New card'}</Text>
          <Text style={styles.sectionText}>
            {isEditing
              ? 'Update the front, back, or optional details.'
              : 'Add a front and back, then fill in details only if you need them.'}
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

      <CardEditorBasicSection
        draftFront={draftFront}
        draftBack={draftBack}
        hasError={formError != null}
        onDraftFrontChange={onDraftFrontChange}
        onDraftBackChange={onDraftBackChange}
      />

      <CardEditorDetailsSection
        draftApplication={draftApplication}
        draftDescription={draftDescription}
        draftImageUri={draftImageUri}
        isExpanded={isDetailsExpanded}
        onDraftApplicationChange={onDraftApplicationChange}
        onDraftDescriptionChange={onDraftDescriptionChange}
        onDraftImageUriChange={onDraftImageUriChange}
        onToggleExpanded={() => {
          setIsDetailsExpanded((value) => !value);
        }}
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
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.m,
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
