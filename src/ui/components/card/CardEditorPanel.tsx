import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CardEditorStudyPreview as CardEditorStudyPreviewType } from '../../../features/study/cardStudyPreview';
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
          style={[styles.input, formError != null ? styles.inputError : null]}
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
  },
  formError: {
    color: colors.error,
    fontSize: typography.caption
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
