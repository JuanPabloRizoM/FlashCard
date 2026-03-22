import type { Card } from '../core/models/Card';
import type { StudyPrompt, StudyQueueItem, StudyResponse } from '../core/models/StudySession';
import type { PromptMode } from '../core/types/study';

type PromptFactory = {
  mode: PromptMode;
  isSupported: (card: Card) => boolean;
  buildPrompt: (card: Card) => StudyPrompt;
  buildResponse: (card: Card) => StudyResponse;
};

const PROMPT_FACTORIES: PromptFactory[] = [
  {
    mode: 'title_to_translation',
    isSupported: (card) => card.title.length > 0 && card.translation != null,
    buildPrompt: (card) => ({ kind: 'text', label: 'Title', value: card.title }),
    buildResponse: (card) => ({ label: 'Translation', value: card.translation ?? '' })
  },
  {
    mode: 'translation_to_title',
    isSupported: (card) => card.translation != null && card.title.length > 0,
    buildPrompt: (card) => ({ kind: 'text', label: 'Translation', value: card.translation ?? '' }),
    buildResponse: (card) => ({ label: 'Title', value: card.title })
  },
  {
    mode: 'image_to_title',
    isSupported: (card) => card.imageUri != null && card.title.length > 0,
    buildPrompt: (card) => ({ kind: 'image', label: 'Image', value: card.imageUri ?? '' }),
    buildResponse: (card) => ({ label: 'Title', value: card.title })
  },
  {
    mode: 'title_to_definition',
    isSupported: (card) => card.title.length > 0 && card.definition != null,
    buildPrompt: (card) => ({ kind: 'text', label: 'Title', value: card.title }),
    buildResponse: (card) => ({ label: 'Definition', value: card.definition ?? '' })
  },
  {
    mode: 'title_to_application',
    isSupported: (card) => card.title.length > 0 && card.application != null,
    buildPrompt: (card) => ({ kind: 'text', label: 'Title', value: card.title }),
    buildResponse: (card) => ({ label: 'Application', value: card.application ?? '' })
  }
];

export class PromptModeResolver {
  resolveSupportedPromptModes(card: Card): PromptMode[] {
    return PROMPT_FACTORIES.filter((factory) => factory.isSupported(card)).map((factory) => factory.mode);
  }

  resolveQueueItem(card: Card, promptMode: PromptMode): StudyQueueItem | null {
    const factory = PROMPT_FACTORIES.find((candidate) => candidate.mode === promptMode);

    if (factory == null || !factory.isSupported(card)) {
      return null;
    }

    return {
      card,
      promptMode,
      prompt: factory.buildPrompt(card),
      response: factory.buildResponse(card)
    };
  }
}
