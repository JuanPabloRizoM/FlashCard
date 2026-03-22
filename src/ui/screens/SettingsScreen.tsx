import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  APP_NAME,
  APP_VERSION_LABEL
} from '../../core/types/settings';
import {
  STUDY_SESSION_MODE_LABELS,
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZE_LABELS,
  STUDY_SESSION_SIZES
} from '../../core/types/study';
import { useAppSettings } from '../../features/settings/AppSettingsProvider';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { colors, spacing, typography } from '../theme';

const FUTURE_TOOLS = [
  'Import cards from file',
  'Image-based card creation',
  'AI-assisted card creation'
] as const;

export function SettingsScreen() {
  const { settings, saveError, setDefaultStudyMode, setDefaultSessionSize, resetStudyDefaults } = useAppSettings();
  const isDefaultsModified =
    settings.defaultStudyMode !== 'mixed' || settings.defaultSessionSize !== 10;

  return (
    <ScreenContainer
      title="Settings"
      subtitle="Useful defaults and product context only. Everything shown here has a real effect or clear informational value."
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Study defaults</Text>
          <Text style={styles.supportText}>
            These defaults apply when the Study screen is idle and when you start a new session.
            They are saved on this device and restored after restart.
          </Text>
          {saveError != null ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Default study mode</Text>
            <View style={styles.choiceRow}>
              {STUDY_SESSION_MODES.map((mode) => (
                <Pressable
                  key={mode}
                  onPress={() => {
                    setDefaultStudyMode(mode);
                  }}
                  style={[
                    styles.choiceChip,
                    settings.defaultStudyMode === mode ? styles.choiceChipActive : null
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      settings.defaultStudyMode === mode ? styles.choiceLabelActive : null
                    ]}
                  >
                    {STUDY_SESSION_MODE_LABELS[mode]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Default session size</Text>
            <View style={styles.choiceRow}>
              {STUDY_SESSION_SIZES.map((size) => (
                <Pressable
                  key={size.toString()}
                  onPress={() => {
                    setDefaultSessionSize(size);
                  }}
                  style={[
                    styles.choiceChip,
                    settings.defaultSessionSize === size ? styles.choiceChipActive : null
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      settings.defaultSessionSize === size ? styles.choiceLabelActive : null
                    ]}
                  >
                    {STUDY_SESSION_SIZE_LABELS[size]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inlineRow}>
            <View style={styles.defaultSummary}>
              <Text style={styles.settingLabel}>Current defaults</Text>
              <Text style={styles.supportText}>
                {`${STUDY_SESSION_MODE_LABELS[settings.defaultStudyMode]} • ${STUDY_SESSION_SIZE_LABELS[settings.defaultSessionSize] === 'All' ? 'All items' : `${STUDY_SESSION_SIZE_LABELS[settings.defaultSessionSize]} items`}`}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={!isDefaultsModified}
              onPress={resetStudyDefaults}
              style={[
                styles.secondaryButton,
                !isDefaultsModified ? styles.secondaryButtonDisabled : null
              ]}
            >
              <Text style={styles.secondaryButtonLabel}>Reset defaults</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App</Text>
            <Text style={styles.infoValue}>{APP_NAME}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION_LABEL}</Text>
          </View>
          <Text style={styles.supportText}>
            This build focuses on local deck management, structured card creation, and adaptive study
            sessions. Cloud sync, imports, and AI-assisted authoring are not part of the current scope.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Coming later</Text>
          <Text style={styles.supportText}>
            These are roadmap items, not active settings. They appear here so the tab remains useful
            without implying unfinished features already exist.
          </Text>
          <View style={styles.roadmapList}>
            {FUTURE_TOOLS.map((item) => (
              <View key={item} style={styles.roadmapItem}>
                <Text style={styles.roadmapTitle}>{item}</Text>
                <Text style={styles.roadmapStatus}>Planned, not available in this build</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.m,
    paddingBottom: spacing.xl
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.m
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  supportText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption
  },
  settingGroup: {
    gap: spacing.s
  },
  settingLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  choiceChip: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  choiceChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  choiceLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  choiceLabelActive: {
    color: colors.surface
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.m,
    justifyContent: 'space-between'
  },
  defaultSummary: {
    flex: 1,
    gap: spacing.xs
  },
  secondaryButton: {
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  secondaryButtonDisabled: {
    opacity: 0.5
  },
  secondaryButtonLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  infoValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600'
  },
  roadmapList: {
    gap: spacing.s
  },
  roadmapItem: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.m
  },
  roadmapTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600'
  },
  roadmapStatus: {
    color: colors.muted,
    fontSize: typography.caption
  }
});
