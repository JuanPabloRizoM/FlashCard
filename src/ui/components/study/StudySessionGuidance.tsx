import { Platform, StyleSheet, Text, View } from 'react-native';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionGuidanceProps = {
  revealAnswer: boolean;
};

export function StudySessionGuidance({ revealAnswer }: StudySessionGuidanceProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.footerGuidance}>
      <Text style={styles.footerGuidanceText}>
        {revealAnswer
          ? `${strings.studyCard.swipeDownIncorrect} · ${strings.studyCard.swipeUpCorrect}`
          : Platform.OS === 'web'
            ? `${strings.studyCard.tapToReveal} ${strings.studyCard.spaceToReveal}`
            : strings.studyCard.tapToReveal}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    footerGuidance: {
      alignItems: 'center',
      paddingTop: spacing.s
    },
    footerGuidanceText: {
      color: colors.textMuted,
      fontSize: typography.caption,
      textAlign: 'center'
    }
  });
