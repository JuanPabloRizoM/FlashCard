import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CardImageInput } from './CardImageInput';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

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
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const isEditing = mode === 'edit';
  const backInputRef = useRef<TextInput | null>(null);

  return (
    <View style={styles.formCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionTitle}>
            {isEditing ? strings.cardEditor.editCardTitle : strings.cardEditor.newCardTitle}
          </Text>
          <Text style={styles.sectionText}>{isEditing ? strings.cardEditor.editCardSupport : strings.cardEditor.newCardSupport}</Text>
        </View>
        {isEditing && onCancelEditing != null ? (
          <Pressable
            accessibilityRole="button"
            onPress={onCancelEditing}
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.secondaryButtonPressed : null]}
          >
            <Text style={styles.secondaryButtonLabel}>{strings.common.cancel}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.fieldGroup}>
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>{strings.cardEditor.frontLabel}</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            blurOnSubmit={false}
            onChangeText={onDraftFrontChange}
            onSubmitEditing={() => backInputRef.current?.focus()}
            placeholder={strings.cardEditor.frontPlaceholder}
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
            style={[styles.input, styles.primaryInput, formError != null ? styles.inputError : null]}
            value={draftFront}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>{strings.cardEditor.backLabel}</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            onChangeText={onDraftBackChange}
            placeholder={strings.cardEditor.backPlaceholder}
            placeholderTextColor={colors.textMuted}
            ref={backInputRef}
            returnKeyType="done"
            style={[styles.input, styles.primaryInput, formError != null ? styles.inputError : null]}
            value={draftBack}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>{strings.cardEditor.descriptionLabel}</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            multiline
            onChangeText={onDraftDescriptionChange}
            placeholder={strings.cardEditor.descriptionPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.multilineInput]}
            textAlignVertical="top"
            value={draftDescription}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>{strings.cardEditor.applicationLabel}</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            multiline
            onChangeText={onDraftApplicationChange}
            placeholder={strings.cardEditor.applicationPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.multilineInput]}
            textAlignVertical="top"
            value={draftApplication}
          />
        </View>

        <CardImageInput
          isDisabled={isSubmitting}
          onChange={onDraftImageUriChange}
          value={draftImageUri}
        />
      </View>

      {formError != null || saveFeedbackMessage != null ? (
        <View style={[styles.feedbackCard, formError != null ? styles.feedbackCardError : styles.feedbackCardSuccess]}>
          <Text style={formError != null ? styles.formError : styles.saveFeedback}>{formError ?? saveFeedbackMessage}</Text>
        </View>
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
          {isSubmitting
            ? strings.cardEditor.saveCreating
            : isEditing
              ? strings.cardEditor.saveChanges
              : strings.cardEditor.createCard}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
  fieldGroup: {
    gap: spacing.m
  },
  fieldBlock: {
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  sectionText: {
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
    lineHeight: 21
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
  primaryInput: {
    minHeight: 58
  },
  inputError: {
    borderColor: colors.error
  },
  multilineInput: {
    minHeight: 104
  },
  feedbackCard: {
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  feedbackCardError: {
    backgroundColor: colors.errorSoft
  },
  feedbackCardSuccess: { backgroundColor: colors.successSoft },
  formError: {
    color: colors.error,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  saveFeedback: {
    color: colors.success,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    paddingVertical: 15
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
