import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useState } from 'react';

import type { Deck } from '../../core/models/Deck';
import { useDecks } from '../../features/decks/useDecks';
import { DeckListItem } from '../components/deck/DeckListItem';
import { DeckDetailScreen } from './DeckDetailScreen';
import { ScreenContainer } from '../components/layout/ScreenContainer';
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
      subtitle="Create a deck now. New decks default to the General type until deck setup expands."
    >
      <View style={styles.layout}>
        <View style={styles.formCard}>
          <Text style={styles.label}>New deck name</Text>
          <TextInput
            autoCapitalize="sentences"
            autoCorrect={false}
            onChangeText={onDraftNameChange}
            onSubmitEditing={() => {
              void onCreateDeck();
            }}
            placeholder="Spanish verbs"
            placeholderTextColor={colors.muted}
            style={[styles.input, formError != null ? styles.inputError : null]}
            value={draftName}
            returnKeyType="done"
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
          <Text style={styles.listTitle}>Saved decks</Text>
          <Text style={styles.listCount}>{`${decks.length} total`}</Text>
        </View>

        {isLoading ? (
          <View style={styles.feedbackState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.feedbackText}>Loading decks...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={decks.length === 0 ? styles.emptyListContent : styles.listContent}
            data={decks}
            keyExtractor={(deck) => deck.id.toString()}
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
            ListEmptyComponent={
              <View style={styles.feedbackState}>
                <Text style={styles.feedbackTitle}>No decks yet</Text>
                <Text style={styles.feedbackText}>
                  Create your first deck to start organizing cards for future study sessions.
                </Text>
              </View>
            }
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
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600'
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
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
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  submitButtonDisabled: {
    backgroundColor: colors.muted
  },
  submitButtonPressed: {
    opacity: 0.9
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  listCount: {
    color: colors.muted,
    fontSize: typography.caption
  },
  listContent: {
    gap: spacing.s,
    paddingBottom: spacing.xl
  },
  emptyListContent: {
    flexGrow: 1
  },
  feedbackState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    justifyContent: 'center',
    minHeight: 160,
    padding: spacing.l
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  feedbackText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center'
  }
});
