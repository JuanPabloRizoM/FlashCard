import type { Card } from '../../core/models/Card';
import { PromptModeResolver } from '../../engine/PromptModeResolver';
import {
  PROMPT_MODES,
  type PromptMode,
  type StudyTechniqueId
} from '../../core/types/study';
import { getRuntimeStrings } from '../../ui/strings';

export type InsightReadiness = 'empty' | 'poor' | 'needs_improvement' | 'good';

export type PromptCoverageMetric = {
  mode: PromptMode;
  label: string;
  count: number;
  percentage: number;
};

export type TechniqueInsight = {
  techniqueId: StudyTechniqueId;
  label: string;
  validItemCount: number;
  status: 'ready' | 'limited' | 'unavailable';
  message: string;
};

export type DeckStudyInsights = {
  totalCards: number;
  studyableCards: number;
  validPromptItemCount: number;
  readiness: InsightReadiness;
  readinessLabel: string;
  readinessMessage: string;
  promptCoverage: PromptCoverageMetric[];
  techniqueInsights: TechniqueInsight[];
};

const promptModeResolver = new PromptModeResolver();

const TECHNIQUE_PROMPT_MODES: Record<StudyTechniqueId, PromptMode[]> = {
  basic_review: ['title_to_translation', 'title_to_definition', 'title_to_application'],
  reverse_review: ['translation_to_title', 'image_to_title'],
  mixed_recall: [...PROMPT_MODES]
};

function calculatePercentage(count: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

function getDeckReadiness(
  totalCards: number,
  studyableCards: number,
  validPromptItemCount: number
): Pick<DeckStudyInsights, 'readiness' | 'readinessLabel' | 'readinessMessage'> {
  const strings = getRuntimeStrings();

  if (totalCards === 0) {
    return {
      readiness: 'empty',
      readinessLabel: strings.deckInsights.readinessEmpty,
      readinessMessage: strings.deckInsights.readinessMessageEmpty
    };
  }

  if (studyableCards === 0) {
    return {
      readiness: 'poor',
      readinessLabel: strings.deckInsights.readinessPoor,
      readinessMessage: strings.deckInsights.readinessMessageNoPrompts
    };
  }

  const studyableRatio = studyableCards / totalCards;
  const averagePromptModes = validPromptItemCount / totalCards;

  if (studyableRatio >= 0.75 && averagePromptModes >= 1.5) {
    return {
      readiness: 'good',
      readinessLabel: strings.deckInsights.readinessGood,
      readinessMessage: strings.deckInsights.readinessMessageGood
    };
  }

  if (studyableRatio >= 0.4 || validPromptItemCount >= 3) {
    return {
      readiness: 'needs_improvement',
      readinessLabel: strings.deckInsights.readinessNeedsImprovement,
      readinessMessage: strings.deckInsights.readinessMessageNeedsImprovement
    };
  }

  return {
    readiness: 'poor',
    readinessLabel: strings.deckInsights.readinessPoor,
    readinessMessage: strings.deckInsights.readinessMessagePoor
  };
}

function getTechniqueInsight(validItemCount: number): Pick<TechniqueInsight, 'status' | 'message'> {
  const strings = getRuntimeStrings();

  if (validItemCount === 0) {
    return {
      status: 'unavailable',
      message: strings.deckInsights.techniqueUnavailable
    };
  }

  if (validItemCount < 3) {
    return {
      status: 'limited',
      message: strings.deckInsights.techniqueLimited
    };
  }

  return {
    status: 'ready',
    message: strings.deckInsights.techniqueReady
  };
}


export function buildDeckStudyInsights(cards: Card[]): DeckStudyInsights {
  const strings = getRuntimeStrings();
  const promptCoverageCounts = PROMPT_MODES.reduce<Record<PromptMode, number>>(
    (coverage, mode) => ({ ...coverage, [mode]: 0 }),
    {} as Record<PromptMode, number>
  );
  const techniqueCounts = {
    basic_review: 0,
    reverse_review: 0,
    mixed_recall: 0
  } satisfies Record<StudyTechniqueId, number>;

  let studyableCards = 0;
  let validPromptItemCount = 0;

  cards.forEach((card) => {
    const supportedPromptModes = promptModeResolver.resolveSupportedPromptModes(card);

    if (supportedPromptModes.length > 0) {
      studyableCards += 1;
    }

    validPromptItemCount += supportedPromptModes.length;

    supportedPromptModes.forEach((mode) => {
      promptCoverageCounts[mode] += 1;
    });

    (Object.keys(TECHNIQUE_PROMPT_MODES) as StudyTechniqueId[]).forEach((techniqueId) => {
      supportedPromptModes.forEach((mode) => {
        if (TECHNIQUE_PROMPT_MODES[techniqueId].includes(mode)) {
          techniqueCounts[techniqueId] += 1;
        }
      });
    });
  });

  const promptCoverage = PROMPT_MODES.map((mode) => ({
    mode,
    label: strings.promptModeLabels[mode],
    count: promptCoverageCounts[mode],
    percentage: calculatePercentage(promptCoverageCounts[mode], cards.length)
  }));

  const techniqueInsights = (Object.keys(TECHNIQUE_PROMPT_MODES) as StudyTechniqueId[]).map(
    (techniqueId) => ({
      techniqueId,
      label: strings.studyTechniqueLabels[techniqueId],
      validItemCount: techniqueCounts[techniqueId],
      ...getTechniqueInsight(techniqueCounts[techniqueId])
    })
  );

  return {
    totalCards: cards.length,
    studyableCards,
    validPromptItemCount,
    ...getDeckReadiness(cards.length, studyableCards, validPromptItemCount),
    promptCoverage,
    techniqueInsights
  };
}
