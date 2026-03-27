import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type CardEditorDetailsSectionProps = {
  isExpanded: boolean;
  draftDescription: string;
  draftApplication: string;
  draftImageUri: string;
  onToggleExpanded: () => void;
  onDraftDescriptionChange: (value: string) => void;
  onDraftApplicationChange: (value: string) => void;
  onDraftImageUriChange: (value: string) => void;
};

export function CardEditorDetailsSection({
  isExpanded,
  draftDescription,
  draftApplication,
  draftImageUri,
  onToggleExpanded,
  onDraftDescriptionChange,
  onDraftApplicationChange,
  onDraftImageUriChange
}: CardEditorDetailsSectionProps) {
  return (
    <View style={styles.optionalCard}>
      <View style={styles.optionalHeader}>
        <View style={styles.optionalCopy}>
          <Text style={styles.sectionEyebrow}>More details</Text>
          <Text style={styles.sectionHint}>Description, application, and image</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleExpanded}
          style={({ pressed }) => [styles.secondaryButton, pressed ? styles.secondaryButtonPressed : null]}
        >
          <Text style={styles.secondaryButtonLabel}>{isExpanded ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>

      {isExpanded ? (
        <View style={styles.optionalFields}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            multiline
            onChangeText={onDraftDescriptionChange}
            placeholder="Move quickly on foot."
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.definitionInput]}
            textAlignVertical="top"
            value={draftDescription}
          />

          <Text style={styles.label}>Application</Text>
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

          <Text style={styles.label}>Image URL</Text>
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
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  optionalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  optionalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'space-between'
  },
  optionalCopy: {
    flex: 1,
    gap: spacing.xs
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
  optionalFields: {
    gap: spacing.s
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
  definitionInput: {
    minHeight: 80
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
