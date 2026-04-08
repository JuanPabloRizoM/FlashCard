import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZES,
  STUDY_TECHNIQUE_IDS,
  type StudySessionMode,
  type StudySessionSize,
  type StudyTechniqueId
} from '../../../core/types/study';
import type { Deck } from '../../../core/models/Deck';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySetupCompactPanelProps = {
  decks: Deck[];
  selectedDeckId: number | null;
  selectedTechniqueId: StudyTechniqueId;
  selectedSessionMode: StudySessionMode;
  selectedSessionSize: StudySessionSize;
  isDisabled: boolean;
  onSelectDeck: (deckId: number) => void;
  onSelectTechnique: (techniqueId: StudyTechniqueId) => void;
  onSelectSessionMode: (mode: StudySessionMode) => void;
  onSelectSessionSize: (size: StudySessionSize) => void;
};

export function StudySetupCompactPanel({
  decks,
  selectedDeckId,
  selectedTechniqueId,
  selectedSessionMode,
  selectedSessionSize,
  isDisabled,
  onSelectDeck,
  onSelectTechnique,
  onSelectSessionMode,
  onSelectSessionSize
}: StudySetupCompactPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.panel}>
      <View style={styles.headerCopy}>
        <Text style={styles.sectionTitle}>{strings.screens.study.setupTitle}</Text>
        <Text style={styles.supportText}>{strings.screens.study.chooseDeckSupport}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{strings.screens.study.deckSectionLabel}</Text>
        <View style={styles.choiceRow}>
          {decks.map((deck) => (
            <Pressable
              disabled={isDisabled}
              key={deck.id}
              onPress={() => {
                onSelectDeck(deck.id);
              }}
              style={[
                styles.choiceChip,
                deck.id === selectedDeckId ? styles.choiceChipActive : null,
                isDisabled ? styles.choiceChipDisabled : null
              ]}
            >
              <Text style={[styles.choiceLabel, deck.id === selectedDeckId ? styles.choiceLabelActive : null]}>
                {deck.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{strings.studySetup.techniqueTitle}</Text>
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

      <View style={styles.inlineGrid}>
        <View style={styles.inlineSection}>
          <Text style={styles.sectionLabel}>{strings.studySetup.modeTitle}</Text>
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
                <Text style={[styles.choiceLabel, mode === selectedSessionMode ? styles.choiceLabelActive : null]}>
                  {strings.studySessionModeLabels[mode]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inlineSection}>
          <Text style={styles.sectionLabel}>{strings.studySetup.sizeTitle}</Text>
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
                <Text style={[styles.choiceLabel, size === selectedSessionSize ? styles.choiceLabelActive : null]}>
                  {strings.studySessionSizeLabels[size]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    panel: {
      gap: spacing.m
    },
    headerCopy: {
      gap: spacing.xs
    },
    section: {
      gap: spacing.s
    },
    inlineGrid: {
      gap: spacing.m
    },
    inlineSection: {
      gap: spacing.s
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    sectionLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    supportText: {
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
      backgroundColor: colors.surface,
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
    }
  });
