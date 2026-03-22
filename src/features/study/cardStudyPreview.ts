import type { Card } from '../../core/models/Card';
import { PromptModeResolver } from '../../engine/PromptModeResolver';
import {
  PROMPT_MODES,
  PROMPT_MODE_LABELS,
  STUDY_TECHNIQUE_LABELS,
  type PromptMode,
  type StudyTechniqueId
} from '../../core/types/study';

export type StudyInsightCardInput = Pick<
  Card,
  'title' | 'translation' | 'definition' | 'application' | 'imageUri'
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

export type CardTechniquePreview = {
  techniqueId: StudyTechniqueId;
  label: string;
  status: 'ready' | 'limited' | 'unavailable';
  message: string;
};

export type CardEditorStudyPreview = {
  feedback: CardStudyFeedback;
  promptSupport: CardPromptSupportPreview[];
  techniqueSupport: CardTechniquePreview[];
};

const promptModeResolver = new PromptModeResolver();

const TECHNIQUE_PROMPT_MODES: Record<StudyTechniqueId, PromptMode[]> = {
  basic_review: ['title_to_translation', 'title_to_definition', 'title_to_application'],
  reverse_review: ['translation_to_title', 'image_to_title'],
  mixed_recall: [...PROMPT_MODES]
};

function toResolverCard(card: StudyInsightCardInput): Card {
  return {
    id: 0,
    deckId: 0,
    title: card.title,
    translation: card.translation,
    definition: card.definition,
    example: null,
    application: card.application,
    imageUri: card.imageUri,
    createdAt: '',
    updatedAt: ''
  };
}

function getMissingFieldBadges(card: StudyInsightCardInput): string[] {
  const badges: string[] = [];

  if (card.translation == null) {
    badges.push('Missing translation');
  }

  if (card.definition == null) {
    badges.push('Missing definition');
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

  if (card.title.length === 0) {
    return 'Add title';
  }

  switch (mode) {
    case 'title_to_translation':
    case 'translation_to_title':
      return 'Add translation';
    case 'title_to_definition':
      return 'Add definition';
    case 'title_to_application':
      return 'Add application';
    case 'image_to_title':
      return 'Add image URL';
    default:
      return 'Complete more fields';
  }
}

function getCardTechniquePreview(
  techniqueId: StudyTechniqueId,
  supportedPromptModes: PromptMode[]
): CardTechniquePreview {
  const supportedTechniqueModes = TECHNIQUE_PROMPT_MODES[techniqueId].filter((mode) =>
    supportedPromptModes.includes(mode)
  );

  if (supportedTechniqueModes.length === 0) {
    return {
      techniqueId,
      label: STUDY_TECHNIQUE_LABELS[techniqueId],
      status: 'unavailable',
      message: 'Not supported yet'
    };
  }

  if (supportedTechniqueModes.length === 1) {
    return {
      techniqueId,
      label: STUDY_TECHNIQUE_LABELS[techniqueId],
      status: 'limited',
      message: 'Only one prompt path'
    };
  }

  return {
    techniqueId,
    label: STUDY_TECHNIQUE_LABELS[techniqueId],
    status: 'ready',
    message: 'Useful variety'
  };
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
    readinessMessage: 'Add a translation, definition, application, or image to make this card studyable.',
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
    })),
    techniqueSupport: (Object.keys(TECHNIQUE_PROMPT_MODES) as StudyTechniqueId[]).map((techniqueId) =>
      getCardTechniquePreview(techniqueId, feedback.supportedPromptModes)
    )
  };
}
