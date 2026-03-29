import { StyleSheet, View } from 'react-native';

import { useThemedStyles, type ThemeColors } from '../../theme';

type TabBarIconName = 'decks' | 'cards' | 'study' | 'settings';

type TabBarIconProps = {
  name: TabBarIconName;
  color: string;
  focused: boolean;
};

type IconShapeProps = {
  color: string;
  styles: ReturnType<typeof createStyles>;
};

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.iconWrap, focused ? styles.iconWrapFocused : null]}>
      <View style={styles.iconCanvas}>
        {name === 'decks' ? <DecksIcon color={color} styles={styles} /> : null}
        {name === 'cards' ? <CardsIcon color={color} styles={styles} /> : null}
        {name === 'study' ? <StudyIcon color={color} styles={styles} /> : null}
        {name === 'settings' ? <SettingsIcon color={color} styles={styles} /> : null}
      </View>
    </View>
  );
}

function DecksIcon({ color, styles }: IconShapeProps) {
  return (
    <View style={styles.layersRoot}>
      <View style={[styles.layerBack, { borderColor: color }]} />
      <View style={[styles.layerMid, { borderColor: color }]} />
      <View style={[styles.layerFront, { borderColor: color }]} />
    </View>
  );
}

function CardsIcon({ color, styles }: IconShapeProps) {
  return (
    <View style={[styles.cardBody, { borderColor: color }]}>
      <View style={[styles.cardLineShort, { backgroundColor: color }]} />
      <View style={[styles.cardLineLong, { backgroundColor: color }]} />
    </View>
  );
}

function StudyIcon({ color, styles }: IconShapeProps) {
  return (
    <View style={styles.bookRoot}>
      <View style={[styles.bookPage, styles.bookPageLeft, { borderColor: color }]} />
      <View style={[styles.bookPage, styles.bookPageRight, { borderColor: color }]} />
      <View style={[styles.bookSpine, { backgroundColor: color }]} />
    </View>
  );
}

function SettingsIcon({ color, styles }: IconShapeProps) {
  return (
    <View style={styles.slidersRoot}>
      <View style={[styles.sliderTrack, styles.sliderTrackTop, { backgroundColor: color }]} />
      <View style={[styles.sliderTrack, styles.sliderTrackMiddle, { backgroundColor: color }]} />
      <View style={[styles.sliderTrack, styles.sliderTrackBottom, { backgroundColor: color }]} />
      <View style={[styles.sliderKnob, styles.sliderKnobTop, { backgroundColor: color }]} />
      <View style={[styles.sliderKnob, styles.sliderKnobMiddle, { backgroundColor: color }]} />
      <View style={[styles.sliderKnob, styles.sliderKnobBottom, { backgroundColor: color }]} />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconWrap: {
      alignItems: 'center',
      borderRadius: 999,
      height: 32,
      justifyContent: 'center',
      width: 40
    },
    iconWrapFocused: {
      backgroundColor: colors.primarySoft
    },
    iconCanvas: {
      height: 18,
      width: 18
    },
    layersRoot: {
      flex: 1
    },
    layerBack: {
      borderRadius: 4,
      borderWidth: 1.6,
      height: 9,
      left: 1,
      opacity: 0.35,
      position: 'absolute',
      top: 1,
      width: 11
    },
    layerMid: {
      borderRadius: 4,
      borderWidth: 1.6,
      height: 9,
      left: 3,
      opacity: 0.65,
      position: 'absolute',
      top: 4,
      width: 12
    },
    layerFront: {
      borderRadius: 4,
      borderWidth: 1.8,
      height: 10,
      left: 5,
      position: 'absolute',
      top: 7,
      width: 12
    },
    cardBody: {
      borderRadius: 4,
      borderWidth: 1.8,
      height: 14,
      justifyContent: 'center',
      paddingHorizontal: 3,
      paddingVertical: 3,
      width: 18
    },
    cardLineShort: {
      borderRadius: 999,
      height: 1.8,
      marginBottom: 3,
      width: 6
    },
    cardLineLong: {
      borderRadius: 999,
      height: 1.8,
      width: 10
    },
    bookRoot: {
      flex: 1,
      position: 'relative'
    },
    bookPage: {
      backgroundColor: 'transparent',
      borderRadius: 3,
      borderWidth: 1.7,
      bottom: 1,
      position: 'absolute',
      top: 1,
      width: 8
    },
    bookPageLeft: {
      left: 0
    },
    bookPageRight: {
      right: 0
    },
    bookSpine: {
      borderRadius: 999,
      bottom: 2,
      left: 8,
      position: 'absolute',
      top: 2,
      width: 1.8
    },
    slidersRoot: {
      flex: 1,
      position: 'relative'
    },
    sliderTrack: {
      borderRadius: 999,
      height: 1.8,
      left: 1,
      position: 'absolute',
      width: 16
    },
    sliderTrackTop: {
      top: 3
    },
    sliderTrackMiddle: {
      top: 8
    },
    sliderTrackBottom: {
      top: 13
    },
    sliderKnob: {
      borderRadius: 999,
      height: 5,
      position: 'absolute',
      width: 5
    },
    sliderKnobTop: {
      left: 10,
      top: 1.4
    },
    sliderKnobMiddle: {
      left: 4,
      top: 6.4
    },
    sliderKnobBottom: {
      left: 12,
      top: 11.4
    }
  });
