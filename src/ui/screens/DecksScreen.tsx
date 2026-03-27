import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import type { Deck } from '../../core/models/Deck';
import { useDecks } from '../../features/decks/useDecks';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { DeckListItem } from '../components/deck/DeckListItem';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { DeckDetailScreen } from './DeckDetailScreen';
import { colors, spacing, typography } from '../theme';

function formatDeckTimestampLabel(deck: Deck): string {
  const sourceDate = deck.updatedAt !== deck.createdAt ? deck.updatedAt : deck.createdAt;
  const date = new Date(sourceDate);

  if (Number.isNaN(date.getTime())) {
    return 'Saved locally';
  }

  const prefix = deck.updatedAt !== deck.createdAt ? 'Updated' : 'Created';

  return `${prefix} ${date.toLocaleDateString()}`;
}

export function DecksScreen() {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const {
    decks,
    deckInsightsByDeckId,
    draftName,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    canSubmit,
    onDraftNameChange,
    onCreateDeck,
    onRefreshDeckInsights
  } = useDecks();

  if (selectedDeck != null) {
    return (
      <DeckDetailScreen
        deck={selectedDeck}
        onBack={() => {
          setSelectedDeck(null);
          void onRefreshDeckInsights();
        }}
      />
    );
  }

  return (
    <ScreenContainer
      title="Decks"
      subtitle="Start with a clear deck, keep it lightweight, and grow it into a stronger study space over time."
    >
      <View style={styles.layout}>
        <View style={styles.formCard}>
          <Text style={styles.eyebrow}>Start simple</Text>
          <Text style={styles.cardTitle}>Create a new deck</Text>
          <Text style={styles.helperText}>
            Give the deck a clear name now. You can move into cards, import, and study readiness checks right after.
          </Text>

          <Text style={styles.label}>Deck name</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            onChangeText={onDraftNameChange}
            onSubmitEditing={() => {
              void onCreateDeck();
            }}
            placeholder="Spanish verbs"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            style={[styles.input, formError != null ? styles.inputError : null]}
            value={draftName}
          />

          {formError != null ? <Text style={styles.formError}>{formError}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={() => {
              void onCreateDeck();
            }}
            style={({ pressed }) => [
              styles.submitButton,
              !canSubmit ? styles.submitButtonDisabled : null,
              pressed && canSubmit ? styles.submitButtonPressed : null
            ]}
          >
            <Text style={styles.submitButtonLabel}>
              {isSubmitting ? 'Saving deck...' : 'Create deck'}
            </Text>
          </Pressable>
        </View>

        {screenError != null ? <Text style={styles.screenError}>{screenError}</Text> : null}

        <View style={styles.listHeader}>
          <View style={styles.listHeaderCopy}>
            <Text style={styles.listTitle}>Saved decks</Text>
            <Text style={styles.listSubtitle}>
              Open a deck to review cards, readiness, and export options.
            </Text>
          </View>
          <Text style={styles.listCount}>{`${decks.length} total`}</Text>
        </View>

        {isLoading ? (
          <CardWorkspaceFeedbackState isLoading message="Loading decks..." />
        ) : (
          <FlatList
            contentContainerStyle={decks.length === 0 ? styles.emptyListContent : styles.listContent}
            data={decks}
            keyExtractor={(deck) => deck.id.toString()}
            ListEmptyComponent={
              <CardWorkspaceFeedbackState
                message="Create your first deck to start organizing cards for calmer, more focused study sessions."
                title="No decks yet"
              />
            }
            renderItem={({ item }) => {
              const insights = deckInsightsByDeckId[item.id];

              return (
                <DeckListItem
                  deck={item}
                  insights={insights ?? null}
                  onPress={() => {
                    setSelectedDeck(item);
                  }}
                  timestampLabel={formatDeckTimestampLabel(item)}
                />
              );
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    gap: spacing.m
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.l
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
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
  screenError: {
    color: colors.error,
    fontSize: typography.caption
  },
  listHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listHeaderCopy: {
    flex: 1,
    gap: spacing.xs
  },
  listTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  listSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  },
  listCount: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  listContent: {
    gap: spacing.s,
    paddingBottom: spacing.xl
  },
  emptyListContent: {
    flexGrow: 1
  }
});
