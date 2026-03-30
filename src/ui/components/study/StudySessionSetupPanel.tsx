import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  STUDY_SESSION_MODE_LABELS,
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZE_LABELS,
  STUDY_SESSION_SIZES,
  STUDY_TECHNIQUE_IDS,
  STUDY_TECHNIQUE_LABELS,
  type StudySessionMode,
  type StudySessionSize,
  type StudyTechniqueId
} from '../../../core/types/study';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionSetupPanelProps = {
  selectedTechniqueId: StudyTechniqueId;
  selectedSessionMode: StudySessionMode;
  selectedSessionSize: StudySessionSize;
  isDisabled: boolean;
  isSessionActive: boolean;
  isStartingSession: boolean;
  canStartSession: boolean;
  onSelectTechnique: (techniqueId: StudyTechniqueId) => void;
  onSelectSessionMode: (mode: StudySessionMode) => void;
  onSelectSessionSize: (size: StudySessionSize) => void;
  onStartSession: () => Promise<void>;
};

export function StudySessionSetupPanel({
  selectedTechniqueId,
  selectedSessionMode,
  selectedSessionSize,
  isDisabled,
  isSessionActive,
  isStartingSession,
  canStartSession,
  onSelectTechnique,
  onSelectSessionMode,
  onSelectSessionSize,
  onStartSession
}: StudySessionSetupPanelProps) {
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.panel}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{strings.studySetup.techniqueTitle}</Text>
        <View style={styles.choiceRow}>
          {STUDY_TECHNIQUE_IDS.map((techniqueId) => (
            <Pressable
              disabled={isDisabled}
              key={techniqueId}
              onPress={() => {
                onSelectTechnique(techniqueId);
              }}
              style={[
                styles.choiceChip,
                techniqueId === selectedTechniqueId ? styles.choiceChipActive : null,
                isDisabled ? styles.choiceChipDisabled : null
              ]}
            >
              <Text
                style={[
                  styles.choiceLabel,
                  techniqueId === selectedTechniqueId ? styles.choiceLabelActive : null
                ]}
              >
                {strings.studyTechniqueLabels[techniqueId]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{strings.studySetup.modeTitle}</Text>
        <Text style={styles.supportText}>{strings.studySetup.modeSupport}</Text>
        {isSessionActive ? (
          <Text style={styles.inlineNotice}>{strings.studySetup.finishSessionToChange}</Text>
        ) : null}
        <View style={styles.choiceRow}>
          {STUDY_SESSION_MODES.map((mode) => (
            <Pressable
              disabled={isDisabled}
              key={mode}
              onPress={() => {
                onSelectSessionMode(mode);
              }}
              style={[
                styles.choiceChip,
                mode === selectedSessionMode ? styles.choiceChipActive : null,
                isDisabled ? styles.choiceChipDisabled : null
              ]}
            >
              <Text
                style={[
                  styles.choiceLabel,
                  mode === selectedSessionMode ? styles.choiceLabelActive : null
                ]}
              >
                {strings.studySessionModeLabels[mode]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{strings.studySetup.sizeTitle}</Text>
        <View style={styles.choiceRow}>
          {STUDY_SESSION_SIZES.map((size) => (
            <Pressable
              disabled={isDisabled}
              key={size.toString()}
              onPress={() => {
                onSelectSessionSize(size);
              }}
              style={[
                styles.choiceChip,
                size === selectedSessionSize ? styles.choiceChipActive : null,
                isDisabled ? styles.choiceChipDisabled : null
              ]}
            >
              <Text
                style={[
                  styles.choiceLabel,
                  size === selectedSessionSize ? styles.choiceLabelActive : null
                ]}
              >
                {strings.studySessionSizeLabels[size]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        disabled={!canStartSession || isDisabled}
        onPress={() => {
          void onStartSession();
        }}
        style={[
          styles.primaryButton,
          !canStartSession || isDisabled ? styles.primaryButtonDisabled : null
        ]}
      >
        <Text style={styles.primaryButtonLabel}>
          {isStartingSession ? strings.studySetup.startingSession : strings.studySetup.startSession}
        </Text>
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
  section: {
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
  inlineNotice: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  choiceChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  choiceChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  choiceChipDisabled: {
    opacity: 0.5
  },
  choiceLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  choiceLabelActive: {
    color: colors.primary
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
  }
});
