import type { Card } from '../../core/models/Card';
import { PromptModeResolver } from '../../engine/PromptModeResolver';
import { PROMPT_MODES, PROMPT_MODE_LABELS, type PromptMode } from '../../core/types/study';

export type StudyInsightCardInput = Pick<
  Card,
  'front' | 'back' | 'description' | 'application' | 'imageUri'
>;

export type CardStudyFeedback = {
  isStudyable: boolean;
  supportedPromptModes: PromptMode[];
  supportedPromptCount: number;
  readiness: 'poor' | 'needs_improvement' | 'good';
  readinessLabel: string;
  readinessMessage: string;
  missingFieldBadges: string[];
};

export type CardPromptSupportPreview = {
  mode: PromptMode;
  label: string;
  isSupported: boolean;
  guidance: string;
};

export type CardEditorStudyPreview = {
  feedback: CardStudyFeedback;
  promptSupport: CardPromptSupportPreview[];
};

const promptModeResolver = new PromptModeResolver();

function toResolverCard(card: StudyInsightCardInput): Card {
  return {
    id: 0,
    deckId: 0,
    front: card.front,
    back: card.back,
    description: card.description,
    application: card.application,
    imageUri: card.imageUri,
    createdAt: '',
    updatedAt: ''
  };
}

function getMissingFieldBadges(card: StudyInsightCardInput): string[] {
  const badges: string[] = [];

  if (card.back.length === 0) {
    badges.push('Missing back');
  }

  if (card.description == null) {
    badges.push('Missing description');
  }

  if (card.application == null) {
    badges.push('Missing application');
  }

  if (card.imageUri == null && badges.length < 3) {
    badges.push('No image prompt');
  }

  return badges;
}

function getPromptSupportGuidance(
  card: StudyInsightCardInput,
  mode: PromptMode,
  isSupported: boolean
): string {
  if (isSupported) {
    return 'Supported now';
  }

  if (card.front.length === 0) {
    return 'Add front';
  }

  switch (mode) {
    case 'title_to_translation':
    case 'translation_to_title':
      return 'Add back';
    case 'title_to_definition':
      return 'Add description';
    case 'title_to_application':
      return 'Add application';
    case 'image_to_title':
      return 'Add image URL';
    default:
      return 'Complete more fields';
  }
}

export function buildCardStudyFeedback(card: StudyInsightCardInput): CardStudyFeedback {
  const supportedPromptModes = promptModeResolver.resolveSupportedPromptModes(toResolverCard(card));
  const supportedPromptCount = supportedPromptModes.length;

  if (supportedPromptCount >= 2) {
    return {
      isStudyable: true,
      supportedPromptModes,
      supportedPromptCount,
      readiness: 'good',
      readinessLabel: 'Ready',
      readinessMessage: 'This card already supports multiple prompt modes.',
      missingFieldBadges: getMissingFieldBadges(card)
    };
  }

  if (supportedPromptCount === 1) {
    return {
      isStudyable: true,
      supportedPromptModes,
      supportedPromptCount,
      readiness: 'needs_improvement',
      readinessLabel: 'Limited',
      readinessMessage: 'This card is studyable, but it only supports a narrow prompt range.',
      missingFieldBadges: getMissingFieldBadges(card)
    };
  }

  return {
    isStudyable: false,
    supportedPromptModes,
    supportedPromptCount,
    readiness: 'poor',
    readinessLabel: 'Not ready',
    readinessMessage: 'Add a back, description, application, or image to make this card studyable.',
    missingFieldBadges: getMissingFieldBadges(card)
  };
}

export function buildCardEditorStudyPreview(card: StudyInsightCardInput): CardEditorStudyPreview {
  const feedback = buildCardStudyFeedback(card);

  return {
    feedback,
    promptSupport: PROMPT_MODES.map((mode) => ({
      mode,
      label: PROMPT_MODE_LABELS[mode],
      isSupported: feedback.supportedPromptModes.includes(mode),
      guidance: getPromptSupportGuidance(
        card,
        mode,
        feedback.supportedPromptModes.includes(mode)
      )
    }))
  };
}
