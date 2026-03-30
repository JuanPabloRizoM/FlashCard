import type { Card } from '../../core/models/Card';
import { PromptModeResolver } from '../../engine/PromptModeResolver';
import { PROMPT_MODES, type PromptMode } from '../../core/types/study';
import { getRuntimeStrings } from '../../ui/strings';

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
  const strings = getRuntimeStrings();
  const badges: string[] = [];

  if (card.back.length === 0) {
    badges.push(strings.importValidation.missingBack);
  }

  if (card.description == null) {
    badges.push(strings.importValidation.missingDescription);
  }

  if (card.application == null) {
    badges.push(strings.importValidation.missingApplication);
  }

  if (card.imageUri == null && badges.length < 3) {
    badges.push(strings.importValidation.noImagePrompt);
  }

  return badges;
}

function getPromptSupportGuidance(
  card: StudyInsightCardInput,
  mode: PromptMode,
  isSupported: boolean
): string {
  const strings = getRuntimeStrings();

  if (isSupported) {
    return strings.importValidation.supportedNow;
  }

  if (card.front.length === 0) {
    return strings.importValidation.addFront;
  }

  switch (mode) {
    case 'title_to_translation':
    case 'translation_to_title':
      return strings.importValidation.addBack;
    case 'title_to_definition':
      return strings.importValidation.addDescription;
    case 'title_to_application':
      return strings.importValidation.addApplication;
    case 'image_to_title':
      return strings.importValidation.addImageUrl;
    default:
      return strings.importValidation.completeMoreFields;
  }
}

export function buildCardStudyFeedback(card: StudyInsightCardInput): CardStudyFeedback {
  const strings = getRuntimeStrings();
  const supportedPromptModes = promptModeResolver.resolveSupportedPromptModes(toResolverCard(card));
  const supportedPromptCount = supportedPromptModes.length;

  if (supportedPromptCount >= 2) {
    return {
      isStudyable: true,
      supportedPromptModes,
      supportedPromptCount,
      readiness: 'good',
      readinessLabel: strings.importValidation.ready,
      readinessMessage: strings.importValidation.cardReadyMessage,
      missingFieldBadges: getMissingFieldBadges(card)
    };
  }

  if (supportedPromptCount === 1) {
    return {
      isStudyable: true,
      supportedPromptModes,
      supportedPromptCount,
      readiness: 'needs_improvement',
      readinessLabel: strings.importValidation.limited,
      readinessMessage: strings.importValidation.cardLimitedMessage,
      missingFieldBadges: getMissingFieldBadges(card)
    };
  }

  return {
    isStudyable: false,
    supportedPromptModes,
    supportedPromptCount,
    readiness: 'poor',
    readinessLabel: strings.importValidation.notReady,
    readinessMessage: strings.importValidation.cardNotReadyMessage,
    missingFieldBadges: getMissingFieldBadges(card)
  };
}

export function buildCardEditorStudyPreview(card: StudyInsightCardInput): CardEditorStudyPreview {
  const strings = getRuntimeStrings();
  const feedback = buildCardStudyFeedback(card);

  return {
    feedback,
    promptSupport: PROMPT_MODES.map((mode) => ({
      mode,
      label: strings.promptModeLabels[mode],
      isSupported: feedback.supportedPromptModes.includes(mode),
      guidance: getPromptSupportGuidance(
        card,
        mode,
        feedback.supportedPromptModes.includes(mode)
      )
    }))
  };
}
