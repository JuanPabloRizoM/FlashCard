export const PROMPT_MODES = [
  'title_to_translation',
  'translation_to_title',
  'image_to_title',
  'title_to_definition',
  'title_to_application'
] as const;

export type PromptMode = (typeof PROMPT_MODES)[number];

export const PROMPT_MODE_LABELS: Record<PromptMode, string> = {
  title_to_translation: 'Front -> Back',
  translation_to_title: 'Back -> Front',
  image_to_title: 'Image -> Front',
  title_to_definition: 'Front -> Description',
  title_to_application: 'Front -> Application'
};

export const STUDY_TECHNIQUE_IDS = [
  'basic_review',
  'reverse_review',
  'mixed_recall'
] as const;

export type StudyTechniqueId = (typeof STUDY_TECHNIQUE_IDS)[number];

export const STUDY_TECHNIQUE_LABELS: Record<StudyTechniqueId, string> = {
  basic_review: 'Basic Review',
  reverse_review: 'Reverse Review',
  mixed_recall: 'Mixed Recall'
};

export const STUDY_SESSION_MODES = ['mixed', 'weak_focus', 'fresh_focus'] as const;

export type StudySessionMode = (typeof STUDY_SESSION_MODES)[number];

export const STUDY_SESSION_MODE_LABELS: Record<StudySessionMode, string> = {
  mixed: 'Mixed',
  weak_focus: 'Weak Focus',
  fresh_focus: 'Fresh Focus'
};

export const STUDY_SESSION_SIZES = [10, 20, 'all'] as const;

export type StudySessionSize = (typeof STUDY_SESSION_SIZES)[number];

export const STUDY_SESSION_SIZE_LABELS: Record<StudySessionSize, string> = {
  10: '10',
  20: '20',
  all: 'All'
};

export type StudyAnswer = {
  isCorrect: boolean;
};
