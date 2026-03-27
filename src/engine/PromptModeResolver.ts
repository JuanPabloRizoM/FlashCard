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
    isSupported: (card) => card.front.length > 0 && card.back.length > 0,
    buildPrompt: (card) => ({ kind: 'text', label: 'Front', value: card.front }),
    buildResponse: (card) => ({ label: 'Back', value: card.back })
  },
  {
    mode: 'translation_to_title',
    isSupported: (card) => card.back.length > 0 && card.front.length > 0,
    buildPrompt: (card) => ({ kind: 'text', label: 'Back', value: card.back }),
    buildResponse: (card) => ({ label: 'Front', value: card.front })
  },
  {
    mode: 'image_to_title',
    isSupported: (card) => card.imageUri != null && card.front.length > 0,
    buildPrompt: (card) => ({ kind: 'image', label: 'Image', value: card.imageUri ?? '' }),
    buildResponse: (card) => ({ label: 'Front', value: card.front })
  },
  {
    mode: 'title_to_definition',
    isSupported: (card) => card.front.length > 0 && card.description != null,
    buildPrompt: (card) => ({ kind: 'text', label: 'Front', value: card.front }),
    buildResponse: (card) => ({ label: 'Description', value: card.description ?? '' })
  },
  {
    mode: 'title_to_application',
    isSupported: (card) => card.front.length > 0 && card.application != null,
    buildPrompt: (card) => ({ kind: 'text', label: 'Front', value: card.front }),
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
