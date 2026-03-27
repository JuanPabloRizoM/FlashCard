import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CardEditorStudyPreview as CardEditorStudyPreviewType } from '../../../features/study/cardStudyPreview';
import { CardEditorBasicSection } from './CardEditorBasicSection';
import { CardEditorDetailsSection } from './CardEditorDetailsSection';
import { CardQuickAddPanel } from './CardQuickAddPanel';
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
  saveFeedbackMessage: string | null;
  saveFeedbackTick: number;
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
  saveFeedbackMessage,
  saveFeedbackTick,
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
  const [editorVariant, setEditorVariant] = useState<'quick' | 'full'>(isEditing ? 'full' : 'quick');
  const hasOptionalContent = useMemo(
    () =>
      draftDefinition.trim().length > 0 ||
      draftApplication.trim().length > 0 ||
      draftImageUri.trim().length > 0,
    [draftApplication, draftDefinition, draftImageUri]
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(isEditing || hasOptionalContent);

  useEffect(() => {
    setEditorVariant(isEditing ? 'full' : 'quick');
  }, [isEditing]);

  useEffect(() => {
    if (isEditing || hasOptionalContent) {
      setIsDetailsExpanded(true);
      setEditorVariant('full');
      return;
    }

    setIsDetailsExpanded(false);
  }, [hasOptionalContent, isEditing]);

  if (!isEditing && editorVariant === 'quick') {
    return (
      <CardQuickAddPanel
        canSubmit={canSubmit}
        draftTitle={draftTitle}
        draftTranslation={draftTranslation}
        formError={formError}
        isSubmitting={isSubmitting}
        onDraftTitleChange={onDraftTitleChange}
        onDraftTranslationChange={onDraftTranslationChange}
        onOpenFullEditor={() => {
          setEditorVariant('full');
        }}
        saveFeedbackMessage={saveFeedbackMessage}
        saveFeedbackTick={saveFeedbackTick}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <View style={styles.formCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>{isEditing ? 'Edit card' : 'Create card'}</Text>
          <Text style={styles.sectionText}>
            {isEditing ? 'Update the card details.' : 'Add details when you need more than a basic card.'}
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
        ) : !isEditing ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setEditorVariant('quick');
            }}
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.secondaryButtonPressed : null]}
          >
            <Text style={styles.secondaryButtonLabel}>Quick add</Text>
          </Pressable>
        ) : null}
      </View>

      <CardEditorBasicSection
        draftTitle={draftTitle}
        draftTranslation={draftTranslation}
        hasError={formError != null}
        onDraftTitleChange={onDraftTitleChange}
        onDraftTranslationChange={onDraftTranslationChange}
        onSubmit={onSubmit}
      />

      <CardEditorDetailsSection
        draftApplication={draftApplication}
        draftDefinition={draftDefinition}
        draftImageUri={draftImageUri}
        isExpanded={isDetailsExpanded}
        onDraftApplicationChange={onDraftApplicationChange}
        onDraftDefinitionChange={onDraftDefinitionChange}
        onDraftImageUriChange={onDraftImageUriChange}
        onToggleExpanded={() => {
          setIsDetailsExpanded((value) => !value);
        }}
      />

      <CardEditorStudyPreview preview={preview} />

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
