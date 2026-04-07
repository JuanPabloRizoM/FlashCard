import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

import { useAppStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type CardImageInputProps = {
  value: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
};

function buildImageUriFromPickerAsset(asset: ImagePicker.ImagePickerAsset): string | null {
  if (asset.base64 != null) {
    const mimeType = asset.mimeType ?? 'image/jpeg';
    return `data:${mimeType};base64,${asset.base64}`;
  }

  return asset.uri ?? null;
}

export function CardImageInput({ value, isDisabled, onChange }: CardImageInputProps) {
  const inputRef = useRef<TextInput | null>(null);
  const strings = useAppStrings();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  async function onUploadImage() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setFeedbackMessage(strings.cardEditor.imagePermissionRequired);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 0.7,
        base64: true
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const firstAsset = result.assets[0];

      if (firstAsset == null) {
        setFeedbackMessage(strings.cardEditor.imageUploadFailed);
        return;
      }

      const imageUri = buildImageUriFromPickerAsset(firstAsset);

      if (imageUri == null) {
        setFeedbackMessage(strings.cardEditor.imageUploadFailed);
        return;
      }

      onChange(imageUri);
      setFeedbackMessage(strings.cardEditor.imageSelected);
    } catch {
      setFeedbackMessage(strings.cardEditor.imageUploadFailed);
    }
  }

  async function onPasteImage() {
    try {
      const hasImage = await Clipboard.hasImageAsync();

      if (!hasImage) {
        setFeedbackMessage(strings.cardEditor.noClipboardImage);
        return;
      }

      const image = await Clipboard.getImageAsync({ format: 'png' });

      if (image == null) {
        setFeedbackMessage(strings.cardEditor.noClipboardImage);
        return;
      }

      onChange(image.data);
      setFeedbackMessage(strings.cardEditor.imagePasted);
    } catch {
      setFeedbackMessage(strings.cardEditor.imagePasteFailed);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.label}>{strings.cardEditor.imageLabel}</Text>
          <Text style={styles.supportText}>{strings.cardEditor.imageSupport}</Text>
        </View>
        {value.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            disabled={isDisabled}
            onPress={() => {
              onChange('');
              setFeedbackMessage(null);
            }}
            style={({ pressed }) => [styles.removeButton, pressed ? styles.removeButtonPressed : null]}
          >
            <Text style={styles.removeButtonLabel}>{strings.cardEditor.removeImage}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={() => {
            void onUploadImage();
          }}
          style={({ pressed }) => [
            styles.actionChip,
            isDisabled ? styles.actionChipDisabled : null,
            pressed && !isDisabled ? styles.actionChipPressed : null
          ]}
        >
          <Text style={styles.actionChipLabel}>{strings.cardEditor.uploadImage}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={() => {
            void onPasteImage();
          }}
          style={({ pressed }) => [
            styles.actionChip,
            isDisabled ? styles.actionChipDisabled : null,
            pressed && !isDisabled ? styles.actionChipPressed : null
          ]}
        >
          <Text style={styles.actionChipLabel}>{strings.cardEditor.pasteImage}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={() => {
            inputRef.current?.focus();
          }}
          style={({ pressed }) => [
            styles.actionChip,
            isDisabled ? styles.actionChipDisabled : null,
            pressed && !isDisabled ? styles.actionChipPressed : null
          ]}
        >
          <Text style={styles.actionChipLabel}>{strings.cardEditor.useImageUrl}</Text>
        </Pressable>
      </View>

      {value.length > 0 ? (
        <View style={styles.previewCard}>
          <Image resizeMode="cover" source={{ uri: value }} style={styles.previewImage} />
        </View>
      ) : null}

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isDisabled}
        keyboardType="url"
        onChangeText={(nextValue) => {
          onChange(nextValue);
          setFeedbackMessage(null);
        }}
        placeholder={strings.cardEditor.imageUrlPlaceholder}
        placeholderTextColor={colors.textMuted}
        ref={inputRef}
        style={styles.input}
        value={value}
      />

      {feedbackMessage != null ? <Text style={styles.feedbackText}>{feedbackMessage}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: spacing.s
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
    label: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    },
    supportText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    actionChip: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    actionChipDisabled: {
      opacity: 0.5
    },
    actionChipPressed: {
      borderColor: colors.primary
    },
    actionChipLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    previewCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden'
    },
    previewImage: {
      aspectRatio: 16 / 9,
      width: '100%'
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
    feedbackText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    removeButton: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    removeButtonPressed: {
      opacity: 0.75
    },
    removeButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    }
  });
