import type { DeckType } from '../../core/types/deck';
import type {
  PromptMode,
  StudySessionMode,
  StudySessionSize,
  StudyTechniqueId
} from '../../core/types/study';

export type AppStrings = {
  locale: string;
  tabs: {
    decks: string;
    cards: string;
    study: string;
    settings: string;
  };
  common: {
    savedOnDevice: string;
    savedLocally: string;
    created: string;
    updated: string;
    total: (count: number) => string;
    valid: (count: number) => string;
    invalid: (count: number) => string;
    moreLines: (count: number) => string;
    ready: (count: number) => string;
    example: string;
    hideExample: string;
    clear: string;
    preview: string;
    line: (lineNumber: number) => string;
    emptyLine: string;
    copyText: string;
    cancel: string;
    editing: string;
    create: string;
    update: string;
    importInProgress: string;
    loadingDecks: string;
    loadingCards: string;
    loadingStudy: string;
    noDecks: string;
    chooseDeck: string;
    appInfoScope: string;
    decksLoadedButInsightsFailed: string;
  };
  deckTypeLabels: Record<DeckType, string>;
  promptModeLabels: Record<PromptMode, string>;
  studyTechniqueLabels: Record<StudyTechniqueId, string>;
  studySessionModeLabels: Record<StudySessionMode, string>;
  studySessionSizeLabels: Record<StudySessionSize, string>;
  screens: {
    decks: {
      title: string;
      subtitle: string;
      collectionEyebrow: string;
      collectionTitle: string;
      collectionSubtitle: string;
      readyDecksStat: string;
      studyableCardsStat: string;
      newDeckEyebrow: string;
      newDeckTitle: string;
      newDeckHelper: string;
      deckNameLabel: string;
      deckNamePlaceholder: string;
      createDeck: string;
      savingDeck: string;
      savedDecksTitle: string;
      savedDecksSubtitle: string;
      noDecksTitle: string;
      noDecksMessage: string;
    };
    deckDetail: {
      summaryEyebrow: string;
      backToDecks: string;
      cardsSectionTitle: string;
      cardsSectionText: string;
      createCards: string;
      openCards: string;
      studyDeck: string;
      closeSummary: string;
      noCardsTitle: string;
      noCardsMessage: string;
      exportCopied: string;
      exportCopyFallback: string;
      deckSuffix: (deckTypeLabel: string) => string;
      cardsCount: (count: number) => string;
      cardCreatedOn: (dateLabel: string) => string;
    };
    cards: {
      title: string;
      subtitle: string;
      loadingDecks: string;
      noDecksSubtitle: string;
      cardsSectionTitle: string;
      filteredCount: (visibleCount: number, totalCount: number) => string;
    };
    study: {
      title: string;
      subtitle: string;
      homeEyebrow: string;
      contextLine: (deckName: string) => string;
      launchEyebrow: string;
      launchTitleEmpty: string;
      launchTitleSelected: (deckName: string) => string;
      launchSupportEmpty: string;
      setupTitle: string;
      deckSectionLabel: string;
      setupEyebrow: string;
      chooseDeckTitle: string;
      chooseDeckSupport: string;
      overviewEyebrow: string;
      overviewSupport: string;
      studyableNow: string;
      reviewCount: string;
      lastStudied: string;
      neverStudied: string;
      sessionEyebrow: string;
      pauseSession: string;
      returnToStudy: string;
      leaveSessionTitle: string;
      leaveSessionSupport: string;
      continueSession: string;
      leaveSessionAction: string;
      noStudyTitle: string;
      noStudyMessage: string;
      sessionUnavailable: string;
    };
    settings: {
      title: string;
      subtitle: string;
      appearanceEyebrow: string;
      appearanceTitle: string;
      appearanceSupport: string;
      languageEyebrow: string;
      languageTitle: string;
      languageSupport: string;
      accountEyebrow: string;
      accountTitle: string;
      accountSupport: string;
      accountSupportGuest: string;
      accountSupportAuthenticated: string;
      accountStatusLabel: string;
      accountProviderLabel: string;
      accountNameLabel: string;
      accountEmailLabel: string;
      accountStateSignedOut: string;
      accountStateGuest: string;
      accountStateAuthenticated: string;
      billingEyebrow: string;
      billingTitle: string;
      billingSupport: string;
      unavailableBadge: string;
      signOutEyebrow: string;
      signOutTitle: string;
      signOutSupportGuest: string;
      signOutSupportAuthenticated: string;
      signOutAction: string;
      signOutActionGuest: string;
      signingOutAction: string;
      signOutError: string;
      aboutEyebrow: string;
      aboutTitle: string;
      appLabel: string;
      versionLabel: string;
      themeTitle: string;
      languageLabels: {
        es: string;
        en: string;
      };
      themeLabels: {
        system: string;
        light: string;
        dark: string;
      };
      providerLabels: {
        guest: string;
        email: string;
        google: string;
      };
    };
  };
  auth: {
    landing: {
      title: string;
      subtitle: string;
      googleButton: string;
      googleSupport: string;
      googleRedirecting: string;
      googleCancelled: string;
      googleCallbackFailed: string;
      googleNotAvailable: string;
      emailButton: string;
      createAccount: string;
      guestButton: string;
      guestSupport: string;
      footer: string;
    };
    common: {
      back: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      configMissing: string;
      genericError: string;
    };
    signIn: {
      title: string;
      subtitle: string;
      submit: string;
      forgotPassword: string;
      invalidCredentials: string;
      emailNotConfirmed: string;
    };
    createAccount: {
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submit: string;
      confirmEmailNotice: (email: string) => string;
      emailInUse: string;
      weakPassword: string;
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      submit: string;
      confirmationTitle: string;
      confirmationMessage: (email: string) => string;
      sendAnother: string;
    };
    validation: {
      invalidEmail: string;
      passwordRequired: string;
      confirmPasswordRequired: string;
      passwordsDoNotMatch: string;
    };
  };
  cardsWorkspace: {
    workspaceLabel: string;
    modeLabels: {
      create: string;
      import: string;
    };
    creatingIn: string;
    editingIn: string;
    importNoDecksMessage: string;
    importNoDecksTitle: string;
    editCardAction: string;
    listEmptyTitle: string;
    listEmptyMessage: string;
  };
  importHub: {
    title: string;
    subtitle: string;
    stepLabel: (stepNumber: number) => string;
    guidedTitle: string;
    guidedSupport: string;
    intentTitle: string;
    intentSupport: string;
    intentLabels: {
      cardsIntoDeck: string;
      newDeck: string;
    };
    intentDescriptions: {
      cardsIntoDeck: (deckName: string) => string;
      cardsIntoDeckDisabled: string;
      newDeck: string;
    };
    sourceTitle: string;
    sourceSupportCards: string;
    sourceSupportDeck: string;
    featuredSourcesTitle: string;
    otherSourcesTitle: string;
    sourceLabels: {
      pasteNotes: string;
      notebooklm: string;
      csvExcel: string;
      notion: string;
      googleDocs: string;
      structuredDeck: string;
    };
    sourceDescriptions: {
      pasteNotesCards: string;
      pasteNotesDeck: string;
      notebookLmCards: string;
      notebookLmDeck: string;
      csvExcelCards: string;
      notionCards: string;
      notionDeck: string;
      googleDocsCards: string;
      googleDocsDeck: string;
      structuredDeck: string;
    };
    inputTitle: string;
    inputSupportText: string;
    inputSupportNotebookLm: string;
    inputSupportFile: string;
    inputSupportNotion: string;
    inputSupportDocument: string;
    inputSupportStructuredDeck: string;
    reviewTitle: string;
    reviewSupport: string;
    futureSourcesTitle: string;
    futureSourcesSupport: string;
    notionFutureNote: string;
    structuredDeckShortcutTitle: string;
    structuredDeckSupport: string;
    structuredDeckShortcutBullet: string;
    structuredDeckShortcutAction: string;
    targetDeck: (deckName: string) => string;
    targetDeckMissing: string;
    targetNewDeck: string;
    notebookLm: {
      guideTitle: string;
      cardsTitle: string;
      cardsSubtitleForDeck: (deckName: string) => string;
      cardsSupport: string;
      cardsExample: string;
      deckTitle: string;
      deckSubtitle: string;
      deckSupport: string;
      deckExample: string;
      tipQa: string;
      tipNotes: string;
      tipCsv: string;
    };
    notion: {
      guideTitle: string;
      cardsTitle: string;
      cardsSubtitleForDeck: (deckName: string) => string;
      cardsSupport: string;
      cardsExample: string;
      deckTitle: string;
      deckSubtitle: string;
      deckSupport: string;
      deckExample: string;
      tipPaste: string;
      tipCsv: string;
    };
    googleDocs: {
      guideTitle: string;
      cardsTitle: string;
      cardsSubtitleForDeck: (deckName: string) => string;
      cardsSupport: string;
      cardsExample: string;
      deckTitle: string;
      deckSubtitle: string;
      deckSupport: string;
      deckExample: string;
      tipStructure: string;
      tipHeader: string;
    };
    pasteNotes: {
      cardsTitle: string;
      cardsSubtitleForDeck: (deckName: string) => string;
      cardsSupport: string;
      deckTitle: string;
      deckSubtitle: string;
      deckSupport: string;
    };
    structuredDeck: {
      guideTitle: string;
      title: string;
      subtitle: string;
      support: string;
      example: string;
      tipFormat: string;
      tipPower: string;
    };
  };
  cardEditor: {
    newCardTitle: string;
    editCardTitle: string;
    newCardSupport: string;
    editCardSupport: string;
    frontLabel: string;
    backLabel: string;
    descriptionLabel: string;
    applicationLabel: string;
    imageLabel: string;
    imageSupport: string;
    uploadImage: string;
    pasteImage: string;
    useImageUrl: string;
    removeImage: string;
    imageSelected: string;
    imagePasted: string;
    imageUploadFailed: string;
    imagePasteFailed: string;
    noClipboardImage: string;
    imagePermissionRequired: string;
    frontPlaceholder: string;
    backPlaceholder: string;
    descriptionPlaceholder: string;
    applicationPlaceholder: string;
    imageUrlPlaceholder: string;
    saveCreating: string;
    createCard: string;
    saveChanges: string;
  };
  cardImport: {
    title: string;
    subtitleForDeck: (deckName: string) => string;
    subtitleNoDeck: string;
    exampleText: string;
    actionLabel: string;
    importing: string;
    validReady: (count: number) => string;
    fixInvalidLines: string;
  };
  deckImport: {
    title: string;
    subtitle: string;
    exampleText: string;
    importing: string;
    actionLabel: string;
    cardsReady: (count: number) => string;
    deckReady: string;
    fixInvalidLines: string;
    deckNameNotReady: string;
    frontBackOnly: string;
  };
  csvImport: {
    chooseFile: string;
    replaceFile: string;
    selectedFile: (fileName: string) => string;
    mappingTitle: string;
    mappingSupport: string;
    notUsed: string;
    imageLabel: string;
    actionLabel: string;
    importing: string;
    validReady: (count: number) => string;
    fixInvalidRows: string;
  };
  deckExport: {
    title: string;
    support: string;
    hideExport: string;
    actionLabel: string;
    summaryText: string;
  };
  preview: {
    emptyValidDetail: string;
    imageAttached: string;
  };
  studySetup: {
    techniqueTitle: string;
    modeTitle: string;
    modeSupport: string;
    sizeTitle: string;
    finishSessionToChange: string;
    startSession: string;
    startingSession: string;
  };
  studyBanner: {
    currentSession: string;
    mode: string;
    size: string;
    technique: string;
    allItems: string;
    items: (count: string) => string;
  };
  studyCard: {
    imagePrompt: string;
    revealAnswer: string;
    answerLabel: string;
    answerHint: string;
    tapToReveal: string;
    spaceToReveal: string;
    swipeUpCorrect: string;
    swipeDownIncorrect: string;
  };
  studyProgress: {
    remaining: (count: number) => string;
    promptOfTotal: (current: number, total: number) => string;
    current: string;
    remainingLabel: string;
    stageReady: string;
    stageAnswering: string;
    stageReviewing: string;
    lastResult: string;
    correct: string;
    needsReview: string;
  };
  studySummary: {
    title: string;
    badge: string;
    noMisses: string;
    restartOrRetry: string;
    answered: string;
    correct: string;
    incorrect: string;
    accuracy: string;
    restart: string;
    restarting: string;
    retryMisses: string;
    noMissedPrompts: string;
  };
  studyStats: {
    pauseTitle: string;
    pauseSupport: string;
    resumeSession: string;
    stopSession: string;
    savingSession: string;
    savingSessionAnswer: string;
    continueToStudy: string;
    viewDetailedStatistics: string;
    detailEyebrow: string;
    detailTitle: string;
    detailSupport: string;
    shareAction: string;
    shareTitle: string;
    bestStreak: string;
    sessionTime: string;
    promptDistribution: string;
    failedCards: string;
    correctCards: string;
    historyEyebrow: string;
    historyTitle: string;
    historySupport: string;
    sessions: string;
    totalReviewed: string;
    emptyHistoryTitle: string;
    emptyHistorySupport: string;
    emptyDetailTitle: string;
    emptyDetailSupport: string;
    summaryReadySupport: string;
    viewStatisticsShort: string;
    sessionRowSupport: (answeredCount: number, accuracyPercentage: number, durationLabel: string) => string;
    durationSeconds: (seconds: number) => string;
    durationMinutes: (minutes: number) => string;
    durationMinutesSeconds: (minutes: number, seconds: number) => string;
  };
  studyAnswers: {
    needsReview: string;
    correct: string;
  };
  deckList: {
    cardsCount: (count: number) => string;
    studyableCards: (studyableCount: number, totalCount: number) => string;
    readyToStudy: (count: number) => string;
    promptItems: (count: number) => string;
  };
  deckInsights: {
    title: string;
    promptCoverage: string;
    techniqueOutlook: string;
    cards: string;
    studyable: string;
    promptItems: string;
    cardCoverageMeta: (count: number, percentage: number) => string;
    readinessEmpty: string;
    readinessPoor: string;
    readinessNeedsImprovement: string;
    readinessGood: string;
    readinessMessageEmpty: string;
    readinessMessageNoPrompts: string;
    readinessMessageGood: string;
    readinessMessageNeedsImprovement: string;
    readinessMessagePoor: string;
    techniqueUnavailable: string;
    techniqueLimited: string;
    techniqueReady: string;
  };
  cardFeedback: {
    basic: string;
    expanded: string;
    detailed: string;
    promptsReady: (count: number) => string;
  };
  validation: {
    duplicateDeckName: string;
    invalidDeckName: string;
    invalidDeckType: string;
    invalidDeckColor: string;
    invalidCardDeck: string;
    invalidCardId: string;
    invalidCardFront: string;
    invalidCardBack: string;
    invalidCardDescription: string;
    invalidCardApplication: string;
    invalidCardImageUri: string;
    invalidStudyProgressCard: string;
    invalidStudyProgressDeck: string;
    invalidStudyProgressPromptMode: string;
    invalidStudyProgressResult: string;
    invalidStudyProgressTimestamp: string;
  };
  featureMessages: {
    couldNotLoadDecks: string;
    couldNotSaveDeck: string;
    couldNotLoadCards: string;
    chooseDeckBeforeCreatingCards: string;
    cardAdded: string;
    cardUpdated: string;
    couldNotSaveCard: string;
    chooseDeckBeforeImportingCards: string;
    chooseCsvFile: string;
    noValidCardLines: string;
    importedCards: (createdCount: number, invalidCount: number) => string;
    couldNotReadCsvFile: string;
    couldNotImportCards: string;
    pasteExportedDeck: string;
    deckImportNotReady: string;
    importedDeck: (deckName: string, createdCount: number, invalidCount: number) => string;
    couldNotImportDeck: string;
    couldNotLoadStudyDecks: string;
    createDeckBeforeStudy: string;
    couldNotSaveStudyProgress: string;
    couldNotSaveStudySession: string;
    couldNotLoadStudySessionDetail: string;
    noIncorrectAnswersToRetry: string;
    couldNotStartStudy: string;
    couldNotStartStudySession: string;
  };
  importValidation: {
    useFormat: string;
    frontRequired: string;
    backRequired: string;
    frontColumnRequired: string;
    backColumnRequired: string;
    lineEmpty: string;
    csvEmpty: string;
    csvHeaderRequired: string;
    csvDataRequired: string;
    csvQuoteError: string;
    deckHeaderRequired: string;
    fixInvalidDeckLines: string;
    missingBack: string;
    missingDescription: string;
    missingApplication: string;
    noImagePrompt: string;
    supportedNow: string;
    addFront: string;
    addBack: string;
    addDescription: string;
    addApplication: string;
    addImageUrl: string;
    completeMoreFields: string;
    ready: string;
    limited: string;
    notReady: string;
    cardReadyMessage: string;
    cardLimitedMessage: string;
    cardNotReadyMessage: string;
  };
};

const es: AppStrings = {
  locale: 'es-MX',
  tabs: {
    decks: 'Mazos',
    cards: 'Tarjetas',
    study: 'Estudiar',
    settings: 'Ajustes'
  },
  common: {
    savedOnDevice: 'Guardado en este dispositivo.',
    savedLocally: 'Guardado localmente',
    created: 'Creado',
    updated: 'Actualizado',
    total: (count) => `${count} en total`,
    valid: (count) => `${count} válidas`,
    invalid: (count) => `${count} inválidas`,
    moreLines: (count) => `${count} líneas más.`,
    ready: (count) => `${count} listas`,
    example: 'Ejemplo',
    hideExample: 'Ocultar ejemplo',
    clear: 'Limpiar',
    preview: 'Vista previa',
    line: (lineNumber) => `Línea ${lineNumber}`,
    emptyLine: 'Línea vacía',
    copyText: 'Copiar texto',
    cancel: 'Cancelar',
    editing: 'Editando',
    create: 'Crear',
    update: 'Actualizar',
    importInProgress: 'Importando...',
    loadingDecks: 'Cargando mazos...',
    loadingCards: 'Cargando tarjetas...',
    loadingStudy: 'Cargando estudio...',
    noDecks: 'Sin mazos',
    chooseDeck: 'Elige un mazo',
    appInfoScope: 'Mazos, tarjetas y sesiones de estudio locales.',
    decksLoadedButInsightsFailed: 'Los mazos cargaron, pero no se pudieron actualizar los indicadores de estudio.'
  },
  deckTypeLabels: {
    general: 'General',
    language: 'Idiomas',
    medicine: 'Medicina',
    programming: 'Programación',
    science: 'Ciencia'
  },
  promptModeLabels: {
    title_to_translation: 'Frente -> Reverso',
    translation_to_title: 'Reverso -> Frente',
    image_to_title: 'Imagen -> Frente',
    title_to_definition: 'Frente -> Descripción',
    title_to_application: 'Frente -> Aplicación'
  },
  studyTechniqueLabels: {
    basic_review: 'Repaso básico',
    reverse_review: 'Repaso inverso',
    mixed_recall: 'Recuerdo mixto'
  },
  studySessionModeLabels: {
    mixed: 'Mixto',
    weak_focus: 'Enfocar débiles',
    fresh_focus: 'Enfocar nuevas'
  },
  studySessionSizeLabels: {
    10: '10',
    20: '20',
    all: 'Todas'
  },
  screens: {
    decks: {
      title: 'Mazos',
      subtitle: 'Organiza tu material y entra rápido a tarjetas o estudio.',
      collectionEyebrow: 'Biblioteca',
      collectionTitle: 'Tus mazos activos',
      collectionSubtitle: 'Abre un mazo para revisar su estado y continuar sin perder contexto.',
      readyDecksStat: 'Mazos con contenido estudiable',
      studyableCardsStat: 'Tarjetas listas para estudiar',
      newDeckEyebrow: 'Nuevo mazo',
      newDeckTitle: 'Crear un mazo',
      newDeckHelper: 'Usa un nombre corto y claro para encontrarlo rápido.',
      deckNameLabel: 'Nombre del mazo',
      deckNamePlaceholder: 'Verbos en español',
      createDeck: 'Crear mazo',
      savingDeck: 'Guardando mazo...',
      savedDecksTitle: 'Mazos guardados',
      savedDecksSubtitle: 'Toca un mazo para ver un resumen rápido y seguir.',
      noDecksTitle: 'Aún no hay mazos',
      noDecksMessage: 'Crea un mazo para empezar.'
    },
    deckDetail: {
      summaryEyebrow: 'Vista rápida',
      backToDecks: 'Volver a mazos',
      cardsSectionTitle: 'Tarjetas',
      cardsSectionText: 'Agrega o edita tarjetas en la pestaña Tarjetas.',
      createCards: 'Crear tarjetas',
      openCards: 'Abrir tarjetas',
      studyDeck: 'Estudiar este mazo',
      closeSummary: 'Cerrar',
      noCardsTitle: 'Aún no hay tarjetas',
      noCardsMessage: 'Abre Tarjetas para agregar la primera.',
      exportCopied: 'El texto exportado se copió al portapapeles.',
      exportCopyFallback: 'No se pudo copiar automáticamente. Selecciona y copia el texto manualmente.',
      deckSuffix: (deckTypeLabel) => `Mazo de ${deckTypeLabel.toLowerCase()}`,
      cardsCount: (count) => `${count} tarjetas`,
      cardCreatedOn: (dateLabel) => `Creada ${dateLabel}`
    },
    cards: {
      title: 'Tarjetas',
      subtitle: 'Construye tu mazo de estudio.',
      loadingDecks: 'Cargando mazos...',
      noDecksSubtitle: 'Importa un mazo para empezar.',
      cardsSectionTitle: 'Tarjetas',
      filteredCount: (visibleCount, totalCount) =>
        visibleCount === totalCount ? `${totalCount} en total` : `${visibleCount} de ${totalCount}`
    },
    study: {
      title: 'Estudiar',
      subtitle: 'Prepara la siguiente sesión y vuelve rápido al estudio real.',
      homeEyebrow: 'Enfoque',
      contextLine: (deckName) => `Sesión preparada para: ${deckName}`,
      launchEyebrow: 'Siguiente sesión',
      launchTitleEmpty: 'Elige un mazo para empezar',
      launchTitleSelected: (deckName) => `Listo para estudiar ${deckName}`,
      launchSupportEmpty: 'Selecciona un mazo y ajusta la sesión antes de empezar.',
      setupTitle: 'Ajusta la sesión',
      deckSectionLabel: 'Mazo',
      setupEyebrow: 'Preparación',
      chooseDeckTitle: 'Elige un mazo',
      chooseDeckSupport: 'Ajusta modo, tamaño y técnica antes de empezar.',
      overviewEyebrow: 'Resumen del mazo',
      overviewSupport: 'Confirma qué tan listo está este mazo y entra a una sesión enfocada cuando quieras.',
      studyableNow: 'Listas ahora',
      reviewCount: 'Respuestas guardadas',
      lastStudied: 'Último estudio',
      neverStudied: 'Aún sin estudio',
      sessionEyebrow: 'Sesión activa',
      pauseSession: 'Pausar',
      returnToStudy: 'Volver a estudiar',
      leaveSessionTitle: '¿Salir de esta sesión?',
      leaveSessionSupport: 'Si sales ahora, la sesión actual se cerrará aunque todavía no la hayas terminado.',
      continueSession: 'Seguir estudiando',
      leaveSessionAction: 'Salir de la sesión',
      noStudyTitle: 'Aún no hay nada para estudiar',
      noStudyMessage: 'Crea un mazo y tarjetas primero.',
      sessionUnavailable: 'Sesión no disponible'
    },
    settings: {
      title: 'Ajustes',
      subtitle: 'Ajusta la apariencia, el idioma y el acceso de tu cuenta desde un solo lugar.',
      appearanceEyebrow: 'Apariencia',
      appearanceTitle: 'Tema',
      appearanceSupport: 'Elige cómo quieres ver FlashCards en este dispositivo.',
      languageEyebrow: 'Idioma',
      languageTitle: 'Idioma de la app',
      languageSupport: 'Se aplica a toda la interfaz y cambia al momento.',
      accountEyebrow: 'Cuenta',
      accountTitle: 'Configuración de cuenta',
      accountSupport: 'Consulta tu acceso actual. Las herramientas de cuenta llegarán más adelante.',
      accountSupportGuest: 'Estás usando FlashCards como invitado. Puedes salir de este modo en cualquier momento.',
      accountSupportAuthenticated: 'Esta sección muestra la sesión activa de FlashCards sin fingir controles que todavía no existen.',
      accountStatusLabel: 'Acceso',
      accountProviderLabel: 'Proveedor',
      accountNameLabel: 'Nombre',
      accountEmailLabel: 'Correo',
      accountStateSignedOut: 'Sin sesión',
      accountStateGuest: 'Modo invitado',
      accountStateAuthenticated: 'Sesión activa',
      billingEyebrow: 'Facturación',
      billingTitle: 'Facturación',
      billingSupport: 'Cuando la facturación exista, aparecerá aquí con el mismo nivel de claridad.',
      unavailableBadge: 'Aún no disponible',
      signOutEyebrow: 'Acceso',
      signOutTitle: 'Cerrar sesión',
      signOutSupportGuest: 'Saldrás del modo invitado y volverás a la pantalla de acceso.',
      signOutSupportAuthenticated: 'Cerraremos esta sesión y volverás a la pantalla de acceso.',
      signOutAction: 'Cerrar sesión',
      signOutActionGuest: 'Salir del modo invitado',
      signingOutAction: 'Cerrando sesión...',
      signOutError: 'No se pudo cerrar la sesión en este momento.',
      aboutEyebrow: 'Información',
      aboutTitle: 'Información de la app',
      appLabel: 'App',
      versionLabel: 'Versión',
      themeTitle: 'Tema',
      languageLabels: {
        es: 'Español',
        en: 'English'
      },
      themeLabels: {
        system: 'Sistema',
        light: 'Claro',
        dark: 'Oscuro'
      },
      providerLabels: {
        guest: 'Invitado',
        email: 'Correo',
        google: 'Google'
      }
    }
  },
  auth: {
    landing: {
      title: 'Entra a tu espacio de estudio',
      subtitle: 'Crea mazos, importa material y estudia sin perder el contexto.',
      googleButton: 'Continuar con Google',
      googleSupport: 'La forma más rápida de continuar.',
      googleRedirecting: 'Redirigiendo a Google...',
      googleCancelled: 'Se canceló el acceso con Google.',
      googleCallbackFailed: 'No se pudo completar el acceso con Google.',
      googleNotAvailable: 'Google aún no está disponible para este proyecto.',
      emailButton: 'Iniciar sesión con correo',
      createAccount: 'Crear cuenta',
      guestButton: 'Continuar como invitado',
      guestSupport: 'Empieza en local ahora y decide más tarde si quieres usar una cuenta.',
      footer: 'Términos y privacidad aparecerán aquí cuando el acceso esté completamente disponible.'
    },
    common: {
      back: 'Volver',
      emailLabel: 'Correo',
      emailPlaceholder: 'tu@correo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Escribe tu contraseña',
      configMissing: 'Faltan los ajustes de Supabase en este entorno.',
      genericError: 'No se pudo completar la acción ahora mismo.'
    },
    signIn: {
      title: 'Iniciar sesión',
      subtitle: 'Usa tu correo para volver a FlashCards sin fricción.',
      submit: 'Iniciar sesión',
      forgotPassword: 'Olvidé mi contraseña',
      invalidCredentials: 'Correo o contraseña incorrectos.',
      emailNotConfirmed: 'Confirma tu correo antes de iniciar sesión.'
    },
    createAccount: {
      title: 'Crear cuenta',
      subtitle: 'Crea tu acceso en menos de un minuto.',
      nameLabel: 'Nombre (opcional)',
      namePlaceholder: 'Tu nombre',
      confirmPasswordLabel: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Vuelve a escribir la contraseña',
      submit: 'Crear cuenta',
      confirmEmailNotice: (email) => `Revisa ${email} para confirmar tu cuenta.`,
      emailInUse: 'Ya existe una cuenta con ese correo.',
      weakPassword: 'Usa una contraseña más segura.'
    },
    forgotPassword: {
      title: 'Recuperar contraseña',
      subtitle: 'Escribe tu correo y te enviaremos el siguiente paso.',
      submit: 'Enviar enlace',
      confirmationTitle: 'Revisa tu correo',
      confirmationMessage: (email) =>
        `Si existe una cuenta para ${email}, enviaremos ahí el enlace para restablecer la contraseña.`,
      sendAnother: 'Usar otro correo'
    },
    validation: {
      invalidEmail: 'Escribe un correo válido.',
      passwordRequired: 'Escribe una contraseña.',
      confirmPasswordRequired: 'Confirma la contraseña.',
      passwordsDoNotMatch: 'Las contraseñas no coinciden.'
    }
  },
  cardsWorkspace: {
    workspaceLabel: 'Espacio de trabajo',
    modeLabels: {
      create: 'Crear tarjeta',
      import: 'Importar'
    },
    creatingIn: 'Creando en',
    editingIn: 'Editando en',
    importNoDecksMessage: 'Importa un mazo aquí o crea uno en Mazos.',
    importNoDecksTitle: 'Sin mazos',
    editCardAction: 'Editar tarjeta',
    listEmptyTitle: 'Aún no hay tarjetas',
    listEmptyMessage: 'Agrega una tarjeta o importa varias.'
  },
  importHub: {
    title: 'Trae tu contenido',
    subtitle: 'Elige la ruta más útil, pega o sube el contenido y revísalo antes de importarlo.',
    stepLabel: (stepNumber) => `Paso ${stepNumber}`,
    guidedTitle: '¿Qué quieres traer?',
    guidedSupport: 'Empieza por la forma más rápida para el material que ya tienes.',
    intentTitle: '¿Qué quieres importar?',
    intentSupport: 'Empieza por el resultado que quieres obtener.',
    intentLabels: {
      cardsIntoDeck: 'Tarjetas en este mazo',
      newDeck: 'Un mazo nuevo'
    },
    intentDescriptions: {
      cardsIntoDeck: (deckName) => `Agregar tarjetas nuevas a ${deckName}.`,
      cardsIntoDeckDisabled: 'Elige o crea un mazo antes de importar tarjetas.',
      newDeck: 'Crear un mazo nuevo a partir del contenido importado.'
    },
    sourceTitle: '¿De dónde viene?',
    sourceSupportCards: 'Empieza por las fuentes de estudio que ya usas y deja las rutas más técnicas para cuando las necesites.',
    sourceSupportDeck: 'Empieza por las fuentes que ya contienen tu material de estudio y usa las rutas avanzadas solo cuando convenga.',
    featuredSourcesTitle: 'Fuentes destacadas',
    otherSourcesTitle: 'Otras rutas',
    sourceLabels: {
      pasteNotes: 'Tarjetas rápidas',
      notebooklm: 'NotebookLM',
      csvExcel: 'Archivo',
      notion: 'Notion',
      googleDocs: 'Google Docs / documento',
      structuredDeck: 'Texto de mazo estructurado'
    },
    sourceDescriptions: {
      pasteNotesCards: 'Pega notas, conceptos o pares simples para convertirlos rápido en tarjetas.',
      pasteNotesDeck: 'Pega notas estructuradas y crea un mazo nuevo con ellas.',
      notebookLmCards: 'Ideal para Q&A, resúmenes y notas de estudio generadas en NotebookLM.',
      notebookLmDeck: 'Convierte una sesión de NotebookLM en un mazo nuevo con una revisión rápida antes de importar.',
      csvExcelCards: 'Sube un CSV y asigna solo las columnas que de verdad necesitas.',
      notionCards: 'Trae notas de páginas o contenido exportado desde Notion sin depender de una integración directa.',
      notionDeck: 'Convierte notas o contenido exportado desde Notion en un mazo nuevo.',
      googleDocsCards: 'Perfecto para apuntes, guías y documentos de estudio que ya puedes copiar y pegar.',
      googleDocsDeck: 'Usa notas o bloques de un documento para crear un mazo nuevo con contexto.',
      structuredDeck: 'La ruta avanzada para exportaciones o texto que ya viene en formato de mazo.'
    },
    inputTitle: 'Agrega el contenido',
    inputSupportText: 'Solo verás la entrada necesaria para esta fuente.',
    inputSupportNotebookLm: 'Pega la salida de NotebookLM con formato claro para obtener mejores resultados.',
    inputSupportFile: 'Sube el archivo, revisa las columnas y deja listo lo que sí quieres importar.',
    inputSupportNotion: 'Pega notas copiadas o usa un CSV exportado desde Notion si tienes una base de datos.',
    inputSupportDocument: 'Pega el contenido más útil del documento y revísalo antes de importarlo.',
    inputSupportStructuredDeck: 'Este formato funciona mejor cuando ya tienes el texto del mazo preparado.',
    reviewTitle: 'Revisa antes de importar',
    reviewSupport: 'Importaremos solo lo que esté listo y dejaremos visibles los elementos que necesiten ajustes.',
    futureSourcesTitle: 'Próximamente',
    futureSourcesSupport: 'Mostramos solo las fuentes que ya funcionan de verdad. Las siguientes aparecerán cuando el flujo sea útil y honesto.',
    notionFutureNote: 'Notion llegará como una ruta guiada para pegar o importar contenido exportado, no como una integración falsa.',
    structuredDeckShortcutTitle: '¿Quieres crear un mazo completo?',
    structuredDeckSupport: 'Si ya tienes un bloque en formato de mazo, usa la ruta avanzada solo cuando realmente la necesites.',
    structuredDeckShortcutBullet: 'Funciona mejor con `# Deck:` en la primera línea y luego `frente | reverso`.',
    structuredDeckShortcutAction: 'Usar texto de mazo estructurado',
    targetDeck: (deckName) => `Destino: ${deckName}`,
    targetDeckMissing: 'Destino: elige un mazo',
    targetNewDeck: 'Destino: crear un mazo nuevo',
    notebookLm: {
      guideTitle: 'Guía rápida para NotebookLM',
      cardsTitle: 'Pega tu salida de NotebookLM',
      cardsSubtitleForDeck: (deckName) => `Pega preguntas y respuestas de NotebookLM para agregarlas a ${deckName}.`,
      cardsSupport: 'Pega Q:/A:, pregunta/respuesta o notas cortas. Convertiremos la estructura simple antes de mostrar la vista previa.',
      cardsExample:
        'What is photosynthesis? | Process plants use to turn light into energy\nCell membrane | Controls what enters and leaves the cell',
      deckTitle: 'Crea un mazo desde NotebookLM',
      deckSubtitle: 'Pega contenido de NotebookLM y empieza con `# Deck: Nombre del mazo`.',
      deckSupport: 'Añade el encabezado del mazo primero y luego pega Q:/A:, pares claros o notas estructuradas. Normalizaremos lo simple antes de la vista previa.',
      deckExample:
        '# Deck: Biology Notes\nWhat is photosynthesis? | Process plants use to turn light into energy\nCell membrane | Controls what enters and leaves the cell',
      tipQa: 'Usa pares claros de pregunta | respuesta para una importación rápida.',
      tipNotes: 'Si NotebookLM te dio notas, conviértelas a `frente | reverso | descripción` antes de pegar.',
      tipCsv: 'Si preparaste una tabla con NotebookLM, usa la opción de CSV para mapear columnas.'
    },
    notion: {
      guideTitle: 'Cómo traer contenido desde Notion',
      cardsTitle: 'Pega notas desde Notion',
      cardsSubtitleForDeck: (deckName) => `Copia contenido desde Notion para convertirlo en tarjetas dentro de ${deckName}.`,
      cardsSupport: 'Funciona mejor con una idea por línea o con pares claros de frente y reverso.',
      cardsExample:
        'Mitosis | Cell division that creates two identical daughter cells\nDNA | Molecule that stores genetic information',
      deckTitle: 'Crea un mazo desde Notion',
      deckSubtitle: 'Empieza con `# Deck: Nombre del mazo` y luego pega las notas o pares clave.',
      deckSupport: 'Si tu contenido viene de una base de datos, exportarlo a CSV suele ser el camino más limpio.',
      deckExample:
        '# Deck: Biology from Notion\nMitosis | Cell division that creates two identical daughter cells\nDNA | Molecule that stores genetic information',
      tipPaste: 'Copia solo lo importante: una idea o una pregunta por línea da mejores resultados.',
      tipCsv: 'Si exportaste una base de datos, usa CSV / Excel para mapear columnas con más control.'
    },
    googleDocs: {
      guideTitle: 'Cómo traer notas desde un documento',
      cardsTitle: 'Pega notas desde un documento',
      cardsSubtitleForDeck: (deckName) => `Pega notas o preguntas desde tu documento para agregarlas a ${deckName}.`,
      cardsSupport: 'Recorta primero el contenido menos útil. Una línea clara por tarjeta suele funcionar mejor.',
      cardsExample:
        'Main cause of the French Revolution | Social inequality and financial crisis\nPhotosynthesis | Process plants use to convert light into energy',
      deckTitle: 'Crea un mazo desde un documento',
      deckSubtitle: 'Pon primero `# Deck: Nombre del mazo` y luego pega las líneas que quieras convertir en tarjetas.',
      deckSupport: 'Este camino sirve bien para apuntes limpios o resúmenes que ya puedes copiar y pegar.',
      deckExample:
        '# Deck: Lecture Notes\nMain cause of the French Revolution | Social inequality and financial crisis\nPhotosynthesis | Process plants use to convert light into energy',
      tipStructure: 'Si puedes, conviértelo a `frente | reverso | descripción` antes de pegar.',
      tipHeader: 'Para crear un mazo nuevo, añade el encabezado del mazo en la primera línea.'
    },
    pasteNotes: {
      cardsTitle: 'Pega tus notas o preguntas',
      cardsSubtitleForDeck: (deckName) => `Pega notas, conceptos o preguntas para sumarlas a ${deckName}.`,
      cardsSupport: 'Lo más rápido es una línea por tarjeta. Si puedes, usa `frente | reverso`.',
      deckTitle: 'Crea un mazo desde notas',
      deckSubtitle: 'Empieza con `# Deck: Nombre del mazo` y después pega el contenido que quieres convertir.',
      deckSupport: 'Puedes pegar preguntas, respuestas o notas breves. La vista previa te mostrará qué sí quedó listo.'
    },
    structuredDeck: {
      guideTitle: 'Camino para texto estructurado',
      title: 'Pega texto de mazo estructurado',
      subtitle: 'Usa este camino si ya tienes una exportación o un bloque con formato de mazo.',
      support: 'Es la ruta más directa para usuarios avanzados o para contenido ya preparado.',
      example:
        '# Deck: Spanish Basics\nhola | hello\nperro | dog | animal doméstico\ncorrer | run | moverse rápido | usado en deportes',
      tipFormat: 'La primera línea debe empezar con `# Deck:` para nombrar el mazo.',
      tipPower: 'Este formato es útil cuando ya vienes con el contenido listo y solo quieres revisarlo antes de importarlo.'
    }
  },
  cardEditor: {
    newCardTitle: 'Nueva tarjeta',
    editCardTitle: 'Editar tarjeta',
    newCardSupport: 'Empieza con un frente y un reverso. Añade detalles solo cuando ayuden.',
    editCardSupport: 'Ajusta el contenido principal o los detalles opcionales.',
    frontLabel: 'Frente',
    backLabel: 'Reverso',
    descriptionLabel: 'Descripción (opcional)',
    applicationLabel: 'Aplicación / Notas (opcional)',
    imageLabel: 'Imagen (opcional)',
    imageSupport: 'Sube una imagen, pégala desde el portapapeles o usa una URL cuando la necesites.',
    uploadImage: 'Subir',
    pasteImage: 'Pegar',
    useImageUrl: 'URL',
    removeImage: 'Quitar',
    imageSelected: 'Imagen lista. Puedes subir o pegar otra para reemplazarla.',
    imagePasted: 'Imagen pegada. Puedes subir o pegar otra para reemplazarla.',
    imageUploadFailed: 'No se pudo cargar la imagen.',
    imagePasteFailed: 'No se pudo pegar la imagen.',
    noClipboardImage: 'No hay una imagen en el portapapeles.',
    imagePermissionRequired: 'Activa el acceso a fotos para elegir una imagen.',
    frontPlaceholder: 'Pregunta, pista o prompt',
    backPlaceholder: 'Respuesta',
    descriptionPlaceholder: 'Agrega una descripción',
    applicationPlaceholder: 'Agrega notas o contexto',
    imageUrlPlaceholder: 'Agrega una URL de imagen',
    saveCreating: 'Guardando tarjeta...',
    createCard: 'Crear tarjeta',
    saveChanges: 'Guardar cambios'
  },
  cardImport: {
    title: 'Pega tus tarjetas',
    subtitleForDeck: (deckName) => `Pega líneas frente | reverso para agregarlas a ${deckName}.`,
    subtitleNoDeck: 'Elige un mazo primero.',
    exampleText:
      'hola | hello\nperro | dog | animal doméstico\ncorrer | run | moverse rápido | usado en deportes',
    actionLabel: 'Importar tarjetas',
    importing: 'Importando...',
    validReady: (count) => `${count} listas`,
    fixInvalidLines: 'Corrige las líneas inválidas para importar'
  },
  deckImport: {
    title: 'Pega el texto del mazo',
    subtitle: 'Pega una exportación con el encabezado del mazo en la primera línea.',
    exampleText:
      '# Deck: Spanish Basics\nhola | hello\nperro | dog | animal doméstico\ncorrer | run | moverse rápido | usado en deportes',
    importing: 'Importando...',
    actionLabel: 'Importar mazo',
    cardsReady: (count) => `${count} tarjetas listas`,
    deckReady: 'Mazo listo',
    fixInvalidLines: 'Corrige las líneas inválidas para importar',
    deckNameNotReady: 'Nombre del mazo no listo',
    frontBackOnly: 'Solo frente y reverso'
  },
  csvImport: {
    chooseFile: 'Elegir CSV',
    replaceFile: 'Cambiar archivo',
    selectedFile: (fileName) => `Archivo: ${fileName}`,
    mappingTitle: 'Asignar columnas',
    mappingSupport: 'Relaciona cada columna con el campo correcto y luego revisa las filas.',
    notUsed: 'No usar',
    imageLabel: 'Imagen (opcional)',
    actionLabel: 'Importar CSV',
    importing: 'Importando CSV...',
    validReady: (count) => `${count} filas listas`,
    fixInvalidRows: 'Corrige las filas o columnas inválidas para importar'
  },
  deckExport: {
    title: 'Exportar mazo',
    support: 'Copia este mazo como texto.',
    hideExport: 'Ocultar exportación',
    actionLabel: 'Exportar mazo',
    summaryText: 'Encabezado más una tarjeta por línea.'
  },
  preview: {
    emptyValidDetail: 'Solo frente y reverso',
    imageAttached: 'Imagen'
  },
  studySetup: {
    techniqueTitle: 'Elige una técnica',
    modeTitle: 'Modo de estudio',
    modeSupport: 'Mixto equilibra el repaso. Débiles y Nuevas enfocan la cola.',
    sizeTitle: 'Tamaño de la sesión',
    finishSessionToChange: 'Termina esta sesión para cambiar la configuración.',
    startSession: 'Iniciar sesión',
    startingSession: 'Iniciando...'
  },
  studyBanner: {
    currentSession: 'Sesión actual',
    mode: 'Modo',
    size: 'Tamaño',
    technique: 'Técnica',
    allItems: 'Todas las tarjetas',
    items: (count) => `${count} tarjetas`
  },
  studyCard: {
    imagePrompt: 'Pista de imagen',
    revealAnswer: 'Mostrar respuesta',
    answerLabel: 'Respuesta',
    answerHint: 'Marca si la recordaste o si necesitas repasarla.',
    tapToReveal: 'Toca para revelar la respuesta.',
    spaceToReveal: 'Presiona Espacio para revelar.',
    swipeUpCorrect: 'Desliza hacia arriba si la recordaste.',
    swipeDownIncorrect: 'Desliza hacia abajo si fallaste.'
  },
  studyProgress: {
    remaining: (count) => `${count} restantes`,
    promptOfTotal: (current, total) => `Prompt ${current} de ${total}`,
    current: 'Actual',
    remainingLabel: 'Restantes',
    stageReady: 'Lista',
    stageAnswering: 'Respondiendo',
    stageReviewing: 'Revisando',
    lastResult: 'Último resultado',
    correct: 'Correcta',
    needsReview: 'Necesita repaso'
  },
  studySummary: {
    title: 'Sesión completada',
    badge: 'Lista para repaso',
    noMisses: 'No fallaste prompts en esta ronda.',
    restartOrRetry: 'Reinicia o repite los prompts fallados.',
    answered: 'Respondidas',
    correct: 'Correctas',
    incorrect: 'Incorrectas',
    accuracy: 'Precisión',
    restart: 'Reiniciar',
    restarting: 'Reiniciando...',
    retryMisses: 'Repetir fallos',
    noMissedPrompts: 'No hay prompts fallados.'
  },
  studyStats: {
    pauseTitle: 'Sesión en pausa',
    pauseSupport: 'Puedes volver a esta sesión o salir sin perder el contexto de dónde te quedaste.',
    resumeSession: 'Reanudar sesión',
    stopSession: 'Salir de la sesión',
    savingSession: 'Guardando el resumen de esta sesión...',
    savingSessionAnswer: 'Guardando tu resultado y preparando la siguiente tarjeta...',
    continueToStudy: 'Continuar',
    viewDetailedStatistics: 'Ver estadísticas detalladas',
    detailEyebrow: 'Estadísticas',
    detailTitle: 'Detalle de la sesión',
    detailSupport: 'Revisa qué salió bien y qué tarjetas necesitan más repaso.',
    shareAction: 'Compartir',
    shareTitle: 'Resumen de estudio',
    bestStreak: 'Mejor racha',
    sessionTime: 'Tiempo de sesión',
    promptDistribution: 'Distribución de prompts',
    failedCards: 'Tarjetas falladas',
    correctCards: 'Tarjetas acertadas',
    historyEyebrow: 'Historial',
    historyTitle: 'Sesiones recientes',
    historySupport: 'Mantén a la vista el rendimiento real de este mazo a lo largo del tiempo.',
    sessions: 'Sesiones',
    totalReviewed: 'Revisadas',
    emptyHistoryTitle: 'Aún no hay sesiones guardadas',
    emptyHistorySupport: 'Completa una sesión para empezar a ver el historial de este mazo.',
    emptyDetailTitle: 'No se pudo abrir esta sesión',
    emptyDetailSupport: 'Vuelve al panel de estudio e intenta abrir otra sesión guardada.',
    summaryReadySupport: 'La sesión se guardó correctamente. Puedes volver al panel o abrir el detalle.',
    viewStatisticsShort: 'Ver detalle',
    sessionRowSupport: (answeredCount, accuracyPercentage, durationLabel) =>
      `${answeredCount} revisadas · ${accuracyPercentage}% · ${durationLabel}`,
    durationSeconds: (seconds) => `${seconds}s`,
    durationMinutes: (minutes) => `${minutes} min`,
    durationMinutesSeconds: (minutes, seconds) => `${minutes} min ${seconds}s`
  },
  studyAnswers: {
    needsReview: 'Necesita repaso',
    correct: 'Correcta'
  },
  deckList: {
    cardsCount: (count) => `${count} tarjetas`,
    studyableCards: (studyableCount, totalCount) => `${studyableCount} / ${totalCount} tarjetas estudiables`,
    readyToStudy: (count) => `${count} listas para estudiar`,
    promptItems: (count) => `${count} prompts`
  },
  deckInsights: {
    title: 'Preparación para estudiar',
    promptCoverage: 'Cobertura de prompts',
    techniqueOutlook: 'Panorama por técnica',
    cards: 'Tarjetas',
    studyable: 'Estudiables',
    promptItems: 'Prompts',
    cardCoverageMeta: (count, percentage) => `${count} tarjetas · ${percentage}%`,
    readinessEmpty: 'Sin tarjetas',
    readinessPoor: 'Baja',
    readinessNeedsImprovement: 'Mejorable',
    readinessGood: 'Buena',
    readinessMessageEmpty: 'Agrega tarjetas antes de que este mazo pueda sostener una sesión de estudio.',
    readinessMessageNoPrompts: 'Estas tarjetas aún no exponen prompts válidos de estudio.',
    readinessMessageGood: 'Este mazo debería producir una sesión sólida con buena variedad de prompts.',
    readinessMessageNeedsImprovement: 'Algunas tarjetas ya sirven para estudiar, pero aún faltan campos para ampliar la cobertura.',
    readinessMessagePoor: 'Solo una parte pequeña de este mazo puede usarse para estudiar ahora mismo.',
    techniqueUnavailable: 'Aún no hay prompts válidos',
    techniqueLimited: 'Pocos prompts válidos',
    techniqueReady: 'Lista para estudiar'
  },
  cardFeedback: {
    basic: 'Básica',
    expanded: 'Ampliada',
    detailed: 'Detallada',
    promptsReady: (count) => `${count} prompt${count === 1 ? '' : 's'} listos`
  },
  validation: {
    duplicateDeckName: 'Ya existe un mazo con ese nombre.',
    invalidDeckName: 'Escribe un nombre para el mazo.',
    invalidDeckType: 'Elige un tipo de mazo válido.',
    invalidDeckColor: 'Elige un color de mazo válido.',
    invalidCardDeck: 'Elige un mazo válido antes de crear tarjetas.',
    invalidCardId: 'Elige una tarjeta válida antes de guardar cambios.',
    invalidCardFront: 'Escribe el frente de la tarjeta.',
    invalidCardBack: 'Escribe el reverso de la tarjeta.',
    invalidCardDescription: 'La descripción es demasiado larga.',
    invalidCardApplication: 'La aplicación es demasiado larga.',
    invalidCardImageUri: 'Escribe un valor de imagen válido.',
    invalidStudyProgressCard: 'El progreso requiere una tarjeta válida.',
    invalidStudyProgressDeck: 'El progreso requiere un mazo válido.',
    invalidStudyProgressPromptMode: 'El progreso requiere un modo de prompt válido.',
    invalidStudyProgressResult: 'El progreso requiere un resultado válido.',
    invalidStudyProgressTimestamp: 'El progreso requiere una fecha válida.'
  },
  featureMessages: {
    couldNotLoadDecks: 'No se pudieron cargar los mazos ahora mismo.',
    couldNotSaveDeck: 'No se pudo guardar el mazo. Inténtalo de nuevo.',
    couldNotLoadCards: 'No se pudieron cargar las tarjetas ahora mismo.',
    chooseDeckBeforeCreatingCards: 'Elige un mazo antes de crear tarjetas.',
    cardAdded: 'Tarjeta agregada',
    cardUpdated: 'Tarjeta actualizada',
    couldNotSaveCard: 'No se pudo guardar la tarjeta. Inténtalo de nuevo.',
    chooseDeckBeforeImportingCards: 'Elige un mazo antes de importar tarjetas.',
    chooseCsvFile: 'Elige un archivo CSV antes de importarlo.',
    noValidCardLines: 'Todavía no hay líneas válidas listas para importar.',
    importedCards: (createdCount, invalidCount) =>
      `Se importaron ${createdCount} tarjeta${createdCount === 1 ? '' : 's'}. Se omitieron ${invalidCount} línea${invalidCount === 1 ? '' : 's'} inválida${invalidCount === 1 ? '' : 's'}.`,
    couldNotReadCsvFile: 'No se pudo leer este archivo CSV.',
    couldNotImportCards: 'No se pudieron importar las tarjetas ahora mismo. Inténtalo de nuevo.',
    pasteExportedDeck: 'Pega un mazo exportado antes de importarlo.',
    deckImportNotReady: 'Esta importación de mazo aún no está lista.',
    importedDeck: (deckName, createdCount, invalidCount) =>
      `Se importó ${deckName} con ${createdCount} tarjeta${createdCount === 1 ? '' : 's'}. Se omitieron ${invalidCount} línea${invalidCount === 1 ? '' : 's'} inválida${invalidCount === 1 ? '' : 's'}.`,
    couldNotImportDeck: 'No se pudo importar el mazo ahora mismo. Inténtalo de nuevo.',
    couldNotLoadStudyDecks: 'No se pudieron cargar los mazos para estudiar ahora mismo.',
    createDeckBeforeStudy: 'Crea un mazo antes de iniciar una sesión de estudio.',
    couldNotSaveStudyProgress: 'No se pudo guardar el progreso ahora mismo. Intenta responder de nuevo.',
    couldNotSaveStudySession: 'No se pudo guardar el resumen de la sesión ahora mismo.',
    couldNotLoadStudySessionDetail: 'No se pudo cargar el detalle de esta sesión.',
    noIncorrectAnswersToRetry: 'No hay respuestas incorrectas para repetir en esta sesión.',
    couldNotStartStudy: 'No se pudo iniciar la sesión de estudio ahora mismo.',
    couldNotStartStudySession: 'No se pudo iniciar la sesión de estudio ahora mismo.'
  },
  importValidation: {
    useFormat:
      'Usa `frente | reverso`, con `descripción | aplicación` opcionales, manteniendo los campos vacíos en orden cuando haga falta.',
    frontRequired: 'El frente es obligatorio.',
    backRequired: 'El reverso es obligatorio.',
    frontColumnRequired: 'Asigna una columna al frente.',
    backColumnRequired: 'Asigna una columna al reverso.',
    lineEmpty: 'La línea está vacía.',
    csvEmpty: 'El archivo CSV está vacío.',
    csvHeaderRequired: 'El CSV necesita una fila de encabezados.',
    csvDataRequired: 'El CSV necesita al menos una fila de datos.',
    csvQuoteError: 'El CSV tiene comillas sin cerrar.',
    deckHeaderRequired: 'Empieza la importación con `# Deck: Nombre del mazo` en la primera línea con contenido.',
    fixInvalidDeckLines: 'Corrige las líneas inválidas o elimínalas antes de importar este mazo.',
    missingBack: 'Falta reverso',
    missingDescription: 'Falta descripción',
    missingApplication: 'Falta aplicación',
    noImagePrompt: 'Falta prompt de imagen',
    supportedNow: 'Disponible ahora',
    addFront: 'Agrega frente',
    addBack: 'Agrega reverso',
    addDescription: 'Agrega descripción',
    addApplication: 'Agrega aplicación',
    addImageUrl: 'Agrega URL de imagen',
    completeMoreFields: 'Completa más campos',
    ready: 'Lista',
    limited: 'Limitada',
    notReady: 'No lista',
    cardReadyMessage: 'Esta tarjeta ya admite varios modos de prompt.',
    cardLimitedMessage: 'Esta tarjeta puede estudiarse, pero solo cubre un rango limitado de prompts.',
    cardNotReadyMessage: 'Agrega reverso, descripción, aplicación o imagen para que esta tarjeta se pueda estudiar.'
  }
};

const en: AppStrings = {
  locale: 'en-US',
  tabs: {
    decks: 'Decks',
    cards: 'Cards',
    study: 'Study',
    settings: 'Settings'
  },
  common: {
    savedOnDevice: 'Saved on this device.',
    savedLocally: 'Saved locally',
    created: 'Created',
    updated: 'Updated',
    total: (count) => `${count} total`,
    valid: (count) => `${count} valid`,
    invalid: (count) => `${count} invalid`,
    moreLines: (count) => `${count} more lines.`,
    ready: (count) => `${count} ready`,
    example: 'Example',
    hideExample: 'Hide example',
    clear: 'Clear',
    preview: 'Preview',
    line: (lineNumber) => `Line ${lineNumber}`,
    emptyLine: 'Empty line',
    copyText: 'Copy text',
    cancel: 'Cancel',
    editing: 'Editing',
    create: 'Create',
    update: 'Update',
    importInProgress: 'Importing...',
    loadingDecks: 'Loading decks...',
    loadingCards: 'Loading cards...',
    loadingStudy: 'Loading study...',
    noDecks: 'No decks',
    chooseDeck: 'Choose a deck',
    appInfoScope: 'Local-first decks, cards, and study sessions.',
    decksLoadedButInsightsFailed: 'Decks loaded, but study readiness insights could not be refreshed.'
  },
  deckTypeLabels: {
    general: 'General',
    language: 'Language',
    medicine: 'Medicine',
    programming: 'Programming',
    science: 'Science'
  },
  promptModeLabels: {
    title_to_translation: 'Front -> Back',
    translation_to_title: 'Back -> Front',
    image_to_title: 'Image -> Front',
    title_to_definition: 'Front -> Description',
    title_to_application: 'Front -> Application'
  },
  studyTechniqueLabels: {
    basic_review: 'Basic Review',
    reverse_review: 'Reverse Review',
    mixed_recall: 'Mixed Recall'
  },
  studySessionModeLabels: {
    mixed: 'Mixed',
    weak_focus: 'Weak Focus',
    fresh_focus: 'Fresh Focus'
  },
  studySessionSizeLabels: {
    10: '10',
    20: '20',
    all: 'All'
  },
  screens: {
    decks: {
      title: 'Decks',
      subtitle: 'Organize your material and move quickly into cards or study.',
      collectionEyebrow: 'Library',
      collectionTitle: 'Your active decks',
      collectionSubtitle: 'Open a deck to check its status and move into the next action without losing context.',
      readyDecksStat: 'Decks ready for study',
      studyableCardsStat: 'Cards ready to study',
      newDeckEyebrow: 'New deck',
      newDeckTitle: 'Create a deck',
      newDeckHelper: 'Use a short, clear name so it stays easy to scan later.',
      deckNameLabel: 'Deck name',
      deckNamePlaceholder: 'Spanish verbs',
      createDeck: 'Create deck',
      savingDeck: 'Saving deck...',
      savedDecksTitle: 'Saved decks',
      savedDecksSubtitle: 'Tap a deck to open a quick summary and keep moving.',
      noDecksTitle: 'No decks yet',
      noDecksMessage: 'Create a deck to get started.'
    },
    deckDetail: {
      summaryEyebrow: 'Quick overview',
      backToDecks: 'Back to decks',
      cardsSectionTitle: 'Cards',
      cardsSectionText: 'Add or edit cards in the Cards tab.',
      createCards: 'Create cards',
      openCards: 'Open cards',
      studyDeck: 'Study this deck',
      closeSummary: 'Close',
      noCardsTitle: 'No cards yet',
      noCardsMessage: 'Open Cards to add the first card.',
      exportCopied: 'Export text copied to the clipboard.',
      exportCopyFallback: 'Could not copy automatically. Select and copy the export text manually.',
      deckSuffix: (deckTypeLabel) => `${deckTypeLabel} deck`,
      cardsCount: (count) => `${count} cards`,
      cardCreatedOn: (dateLabel) => `Created ${dateLabel}`
    },
    cards: {
      title: 'Cards',
      subtitle: 'Build your study deck.',
      loadingDecks: 'Loading decks...',
      noDecksSubtitle: 'Import a deck to start.',
      cardsSectionTitle: 'Cards',
      filteredCount: (visibleCount, totalCount) =>
        visibleCount === totalCount ? `${totalCount} total` : `${visibleCount} of ${totalCount}`
    },
    study: {
      title: 'Study',
      subtitle: 'Prepare the next session and get back into studying quickly.',
      homeEyebrow: 'Focus',
      contextLine: (deckName) => `Session ready for: ${deckName}`,
      launchEyebrow: 'Next session',
      launchTitleEmpty: 'Choose a deck to begin',
      launchTitleSelected: (deckName) => `Ready to study ${deckName}`,
      launchSupportEmpty: 'Select a deck and shape the session before you start.',
      setupTitle: 'Shape the session',
      deckSectionLabel: 'Deck',
      setupEyebrow: 'Setup',
      chooseDeckTitle: 'Choose a deck',
      chooseDeckSupport: 'Adjust mode, size, and technique before you start.',
      overviewEyebrow: 'Deck overview',
      overviewSupport: 'Check how ready this deck is, then move into a focused session when you are ready.',
      studyableNow: 'Ready now',
      reviewCount: 'Saved answers',
      lastStudied: 'Last studied',
      neverStudied: 'Not studied yet',
      sessionEyebrow: 'Active session',
      pauseSession: 'Pause',
      returnToStudy: 'Back to study',
      leaveSessionTitle: 'Leave this session?',
      leaveSessionSupport: 'Leaving now will close the current session even if you have not finished it yet.',
      continueSession: 'Continue studying',
      leaveSessionAction: 'Leave session',
      noStudyTitle: 'Nothing to study yet',
      noStudyMessage: 'Create a deck and cards first.',
      sessionUnavailable: 'Session unavailable'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Adjust appearance, language, and account access from one place.',
      appearanceEyebrow: 'Appearance',
      appearanceTitle: 'Theme',
      appearanceSupport: 'Choose how FlashCards should look on this device.',
      languageEyebrow: 'Language',
      languageTitle: 'App language',
      languageSupport: 'Applies across the interface and updates right away.',
      accountEyebrow: 'Account',
      accountTitle: 'Account settings',
      accountSupport: 'See your current access state here. Full account tools can arrive later.',
      accountSupportGuest: 'You are using FlashCards in guest mode. You can leave this mode at any time.',
      accountSupportAuthenticated:
        'This section shows the current FlashCards session without pretending full account controls already exist.',
      accountStatusLabel: 'Access',
      accountProviderLabel: 'Provider',
      accountNameLabel: 'Name',
      accountEmailLabel: 'Email',
      accountStateSignedOut: 'Signed out',
      accountStateGuest: 'Guest mode',
      accountStateAuthenticated: 'Signed in',
      billingEyebrow: 'Billing',
      billingTitle: 'Billing',
      billingSupport: 'When billing exists, it should appear here with the same level of clarity.',
      unavailableBadge: 'Not available yet',
      signOutEyebrow: 'Access',
      signOutTitle: 'Sign out',
      signOutSupportGuest: 'Leave guest mode and return to the sign-in screen.',
      signOutSupportAuthenticated: 'End this session and return to the sign-in screen.',
      signOutAction: 'Sign out',
      signOutActionGuest: 'Leave guest mode',
      signingOutAction: 'Signing out...',
      signOutError: 'Could not sign out right now.',
      aboutEyebrow: 'About',
      aboutTitle: 'App information',
      appLabel: 'App',
      versionLabel: 'Version',
      themeTitle: 'Theme',
      languageLabels: {
        es: 'Español',
        en: 'English'
      },
      themeLabels: {
        system: 'System',
        light: 'Light',
        dark: 'Dark'
      },
      providerLabels: {
        guest: 'Guest',
        email: 'Email',
        google: 'Google'
      }
    }
  },
  auth: {
    landing: {
      title: 'Step back into your study flow',
      subtitle: 'Build decks, import material, and study without losing context.',
      googleButton: 'Continue with Google',
      googleSupport: 'The fastest way to continue.',
      googleRedirecting: 'Redirecting to Google...',
      googleCancelled: 'Google sign-in was cancelled.',
      googleCallbackFailed: 'Could not complete Google sign-in.',
      googleNotAvailable: 'Google sign-in is not available for this project yet.',
      emailButton: 'Sign in with email',
      createAccount: 'Create account',
      guestButton: 'Continue as guest',
      guestSupport: 'Start locally now and decide later whether you want to use an account.',
      footer: 'Terms and Privacy will appear here once account access is fully available.'
    },
    common: {
      back: 'Back',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      configMissing: 'Supabase configuration is missing in this environment.',
      genericError: 'Could not complete that action right now.'
    },
    signIn: {
      title: 'Sign in',
      subtitle: 'Use your email to get back into FlashCards quickly.',
      submit: 'Sign in',
      forgotPassword: 'Forgot password',
      invalidCredentials: 'Email or password is incorrect.',
      emailNotConfirmed: 'Confirm your email before signing in.'
    },
    createAccount: {
      title: 'Create account',
      subtitle: 'Create your access in under a minute.',
      nameLabel: 'Name (optional)',
      namePlaceholder: 'Your name',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      submit: 'Create account',
      confirmEmailNotice: (email) => `Check ${email} to confirm your account.`,
      emailInUse: 'An account with that email already exists.',
      weakPassword: 'Use a stronger password.'
    },
    forgotPassword: {
      title: 'Reset password',
      subtitle: 'Enter your email and we’ll send the next step.',
      submit: 'Send reset link',
      confirmationTitle: 'Check your email',
      confirmationMessage: (email) =>
        `If an account exists for ${email}, we’ll send the reset link there.`,
      sendAnother: 'Use another email'
    },
    validation: {
      invalidEmail: 'Enter a valid email.',
      passwordRequired: 'Enter a password.',
      confirmPasswordRequired: 'Confirm your password.',
      passwordsDoNotMatch: 'Passwords do not match.'
    }
  },
  cardsWorkspace: {
    workspaceLabel: 'Workspace',
    modeLabels: {
      create: 'Create card',
      import: 'Import'
    },
    creatingIn: 'Creating in',
    editingIn: 'Editing in',
    importNoDecksMessage: 'Import a deck here or create one in Decks.',
    importNoDecksTitle: 'No decks',
    editCardAction: 'Edit card',
    listEmptyTitle: 'No cards yet',
    listEmptyMessage: 'Add a card or import a few.'
  },
  importHub: {
    title: 'Bring in your content',
    subtitle: 'Choose the most useful path, paste or upload the content, then review it before importing.',
    stepLabel: (stepNumber) => `Step ${stepNumber}`,
    guidedTitle: 'What are you bringing in?',
    guidedSupport: 'Start with the fastest path for the material you already have.',
    intentTitle: 'What do you want to import?',
    intentSupport: 'Start with the result you want.',
    intentLabels: {
      cardsIntoDeck: 'Cards into this deck',
      newDeck: 'A new deck'
    },
    intentDescriptions: {
      cardsIntoDeck: (deckName) => `Add new cards to ${deckName}.`,
      cardsIntoDeckDisabled: 'Choose or create a deck before importing cards.',
      newDeck: 'Create a new deck from the imported content.'
    },
    sourceTitle: 'Where is it coming from?',
    sourceSupportCards: 'Start with the study sources you already use, then fall back to the more technical paths only when you need them.',
    sourceSupportDeck: 'Start with the sources that already hold your study material, then use advanced paths only when they fit better.',
    featuredSourcesTitle: 'Featured sources',
    otherSourcesTitle: 'Other paths',
    sourceLabels: {
      pasteNotes: 'Quick cards',
      notebooklm: 'NotebookLM',
      csvExcel: 'File',
      notion: 'Notion',
      googleDocs: 'Google Docs / document',
      structuredDeck: 'Structured deck text'
    },
    sourceDescriptions: {
      pasteNotesCards: 'Paste notes, concepts, or simple pairs to turn them into cards quickly.',
      pasteNotesDeck: 'Paste structured notes and turn them into a new deck.',
      notebookLmCards: 'Best for Q&A, summaries, and study notes generated in NotebookLM.',
      notebookLmDeck: 'Turn a NotebookLM session into a new deck with one guided review before import.',
      csvExcelCards: 'Upload a CSV and map only the columns you actually need.',
      notionCards: 'Bring in pasted page notes or exported content from Notion without pretending there is direct sync.',
      notionDeck: 'Turn Notion notes or exported content into a new deck.',
      googleDocsCards: 'Ideal for lecture notes, study guides, and pasted document content.',
      googleDocsDeck: 'Use document notes or copied sections to create a new deck.',
      structuredDeck: 'The advanced path for exports or text that is already in FlashCards deck format.'
    },
    inputTitle: 'Add the content',
    inputSupportText: 'Only the input needed for this source is shown here.',
    inputSupportNotebookLm: 'Paste NotebookLM output in a clear structure for the best results.',
    inputSupportFile: 'Upload the file, review the columns, and keep only what you want to import.',
    inputSupportNotion: 'Paste copied notes or use a CSV export from Notion if you have a database.',
    inputSupportDocument: 'Paste the most useful part of the document and review it before importing.',
    inputSupportStructuredDeck: 'This path works best when your deck text is already prepared.',
    reviewTitle: 'Review before importing',
    reviewSupport: 'We’ll import only what is ready and keep anything that needs fixing visible here.',
    futureSourcesTitle: 'Coming next',
    futureSourcesSupport: 'Only sources that already work well stay live here. The next ones should arrive as honest workflows, not fake integrations.',
    notionFutureNote: 'Notion will arrive as a guided paste or export path, not as pretend direct sync.',
    structuredDeckShortcutTitle: 'Need to create a full deck?',
    structuredDeckSupport: 'Use the advanced path only when you already have deck-formatted content ready to paste.',
    structuredDeckShortcutBullet: 'It works best with `# Deck:` on the first line and then `front | back` rows.',
    structuredDeckShortcutAction: 'Use structured deck text',
    targetDeck: (deckName) => `Target: ${deckName}`,
    targetDeckMissing: 'Target: choose a deck',
    targetNewDeck: 'Target: create a new deck',
    notebookLm: {
      guideTitle: 'NotebookLM quick guide',
      cardsTitle: 'Paste your NotebookLM output',
      cardsSubtitleForDeck: (deckName) => `Paste NotebookLM questions and answers to add them to ${deckName}.`,
      cardsSupport: 'Paste Q:/A:, question/answer pairs, or short notes. We will normalize the simple structure before preview.',
      cardsExample:
        'What is photosynthesis? | Process plants use to turn light into energy\nCell membrane | Controls what enters and leaves the cell',
      deckTitle: 'Create a deck from NotebookLM',
      deckSubtitle: 'Paste NotebookLM content and start with `# Deck: Deck name`.',
      deckSupport: 'Add the deck header first, then paste Q:/A:, clear pairs, or short notes. We will normalize the simple structure before preview.',
      deckExample:
        '# Deck: Biology Notes\nWhat is photosynthesis? | Process plants use to turn light into energy\nCell membrane | Controls what enters and leaves the cell',
      tipQa: 'Use clear question | answer pairs for the fastest import.',
      tipNotes: 'If NotebookLM gave you notes, reshape them into `front | back | description` before pasting.',
      tipCsv: 'If you prepared a table from NotebookLM, use the CSV option to map columns.'
    },
    notion: {
      guideTitle: 'Bringing content from Notion',
      cardsTitle: 'Paste notes from Notion',
      cardsSubtitleForDeck: (deckName) => `Copy content from Notion to turn it into cards in ${deckName}.`,
      cardsSupport: 'This works best with one idea per line or with clear front-and-back pairs.',
      cardsExample:
        'Mitosis | Cell division that creates two identical daughter cells\nDNA | Molecule that stores genetic information',
      deckTitle: 'Create a deck from Notion',
      deckSubtitle: 'Start with `# Deck: Deck name`, then paste the notes or key pairs you want to import.',
      deckSupport: 'If your content comes from a database, exporting it to CSV is usually the cleanest path.',
      deckExample:
        '# Deck: Biology from Notion\nMitosis | Cell division that creates two identical daughter cells\nDNA | Molecule that stores genetic information',
      tipPaste: 'Copy only the useful lines. One idea or question per line leads to better previews.',
      tipCsv: 'If you exported a database, use CSV / Excel for cleaner column mapping.'
    },
    googleDocs: {
      guideTitle: 'Bringing notes from a document',
      cardsTitle: 'Paste notes from a document',
      cardsSubtitleForDeck: (deckName) => `Paste notes or questions from your document to add them to ${deckName}.`,
      cardsSupport: 'Trim the less useful text first. One clear line per card usually works best.',
      cardsExample:
        'Main cause of the French Revolution | Social inequality and financial crisis\nPhotosynthesis | Process plants use to convert light into energy',
      deckTitle: 'Create a deck from a document',
      deckSubtitle: 'Start with `# Deck: Deck name`, then paste the lines you want to turn into cards.',
      deckSupport: 'This path works well for clean notes or summaries you can already copy and paste.',
      deckExample:
        '# Deck: Lecture Notes\nMain cause of the French Revolution | Social inequality and financial crisis\nPhotosynthesis | Process plants use to convert light into energy',
      tipStructure: 'If you can, reshape the content into `front | back | description` before pasting.',
      tipHeader: 'To create a new deck, add the deck header on the first line.'
    },
    pasteNotes: {
      cardsTitle: 'Paste your notes or Q&A',
      cardsSubtitleForDeck: (deckName) => `Paste notes, concepts, or questions to add them to ${deckName}.`,
      cardsSupport: 'The fastest path is one line per card. If you can, use `front | back`.',
      deckTitle: 'Create a deck from notes',
      deckSubtitle: 'Start with `# Deck: Deck name`, then paste the content you want to convert.',
      deckSupport: 'You can paste questions, answers, or short notes. The preview will show what is ready.'
    },
    structuredDeck: {
      guideTitle: 'Path for structured deck text',
      title: 'Paste structured deck text',
      subtitle: 'Use this when you already have a deck export or a block prepared in deck format.',
      support: 'This is the most direct path for power users or already-structured content.',
      example:
        '# Deck: Spanish Basics\nhola | hello\nperro | dog | domestic animal\ncorrer | run | move quickly | used in sports',
      tipFormat: 'The first line must start with `# Deck:` to name the deck.',
      tipPower: 'Use this when the content is already ready and you mainly want to review it before importing.'
    }
  },
  cardEditor: {
    newCardTitle: 'New card',
    editCardTitle: 'Edit card',
    newCardSupport: 'Start with a front and back. Add details only when they help.',
    editCardSupport: 'Adjust the main content or any optional details.',
    frontLabel: 'Front',
    backLabel: 'Back',
    descriptionLabel: 'Description (optional)',
    applicationLabel: 'Application / Notes (optional)',
    imageLabel: 'Image (optional)',
    imageSupport: 'Upload an image, paste one from the clipboard, or use a URL when you need it.',
    uploadImage: 'Upload',
    pasteImage: 'Paste',
    useImageUrl: 'URL',
    removeImage: 'Remove',
    imageSelected: 'Image ready. Upload or paste again to replace it.',
    imagePasted: 'Image pasted. Upload or paste again to replace it.',
    imageUploadFailed: 'Could not load the image.',
    imagePasteFailed: 'Could not paste the image.',
    noClipboardImage: 'There is no image in the clipboard.',
    imagePermissionRequired: 'Allow photo access to choose an image.',
    frontPlaceholder: 'Question, cue, or prompt',
    backPlaceholder: 'Answer',
    descriptionPlaceholder: 'Add a description',
    applicationPlaceholder: 'Add notes or context',
    imageUrlPlaceholder: 'Add an image URL',
    saveCreating: 'Saving card...',
    createCard: 'Create card',
    saveChanges: 'Save changes'
  },
  cardImport: {
    title: 'Paste your cards',
    subtitleForDeck: (deckName) => `Paste front | back lines to add them to ${deckName}.`,
    subtitleNoDeck: 'Choose a deck first.',
    exampleText: 'hola | hello\nperro | dog | domestic animal\ncorrer | run | move quickly | used in sports',
    actionLabel: 'Import cards',
    importing: 'Importing...',
    validReady: (count) => `${count} ready`,
    fixInvalidLines: 'Fix invalid lines to import'
  },
  deckImport: {
    title: 'Paste the deck text',
    subtitle: 'Paste a deck export with the deck header on the first line.',
    exampleText: '# Deck: Spanish Basics\nhola | hello\nperro | dog | domestic animal\ncorrer | run | move quickly | used in sports',
    importing: 'Importing...',
    actionLabel: 'Import deck',
    cardsReady: (count) => `${count} cards ready`,
    deckReady: 'Deck ready',
    fixInvalidLines: 'Fix invalid lines to import',
    deckNameNotReady: 'Deck name not ready',
    frontBackOnly: 'Front and back only'
  },
  csvImport: {
    chooseFile: 'Choose CSV',
    replaceFile: 'Replace file',
    selectedFile: (fileName) => `File: ${fileName}`,
    mappingTitle: 'Map columns',
    mappingSupport: 'Match each column to the right field, then review the rows.',
    notUsed: 'Not used',
    imageLabel: 'Image (optional)',
    actionLabel: 'Import CSV',
    importing: 'Importing CSV...',
    validReady: (count) => `${count} rows ready`,
    fixInvalidRows: 'Fix invalid rows or mappings to import'
  },
  deckExport: {
    title: 'Export deck',
    support: 'Copy this deck as text.',
    hideExport: 'Hide export',
    actionLabel: 'Export deck',
    summaryText: 'Header plus one card per line.'
  },
  preview: {
    emptyValidDetail: 'Front and back only',
    imageAttached: 'Image'
  },
  studySetup: {
    techniqueTitle: 'Choose a technique',
    modeTitle: 'Study mode',
    modeSupport: 'Mixed balances review. Weak and Fresh focus the queue.',
    sizeTitle: 'Session size',
    finishSessionToChange: 'Finish this session to change setup.',
    startSession: 'Start session',
    startingSession: 'Starting...'
  },
  studyBanner: {
    currentSession: 'Current session',
    mode: 'Mode',
    size: 'Size',
    technique: 'Technique',
    allItems: 'All cards',
    items: (count) => `${count} cards`
  },
  studyCard: {
    imagePrompt: 'Image prompt',
    revealAnswer: 'Reveal answer',
    answerLabel: 'Answer',
    answerHint: 'Mark whether you recalled it or need to review it again.',
    tapToReveal: 'Tap to reveal the answer.',
    spaceToReveal: 'Press Space to reveal.',
    swipeUpCorrect: 'Swipe up if you got it right.',
    swipeDownIncorrect: 'Swipe down if you missed it.'
  },
  studyProgress: {
    remaining: (count) => `${count} remaining`,
    promptOfTotal: (current, total) => `Prompt ${current} of ${total}`,
    current: 'Current',
    remainingLabel: 'Remaining',
    stageReady: 'Ready',
    stageAnswering: 'Answering',
    stageReviewing: 'Reviewing',
    lastResult: 'Last result',
    correct: 'Correct',
    needsReview: 'Needs review'
  },
  studySummary: {
    title: 'Session complete',
    badge: 'Ready for review',
    noMisses: 'No missed prompts this round.',
    restartOrRetry: 'Restart or retry missed prompts.',
    answered: 'Answered',
    correct: 'Correct',
    incorrect: 'Incorrect',
    accuracy: 'Accuracy',
    restart: 'Restart',
    restarting: 'Restarting...',
    retryMisses: 'Retry misses',
    noMissedPrompts: 'No missed prompts.'
  },
  studyStats: {
    pauseTitle: 'Session paused',
    pauseSupport: 'Take a moment. You can resume this session or leave it from here.',
    resumeSession: 'Resume session',
    stopSession: 'Leave session',
    savingSession: 'Saving this session summary...',
    savingSessionAnswer: 'Saving your answer and loading the next card...',
    continueToStudy: 'Continue',
    viewDetailedStatistics: 'View detailed statistics',
    detailEyebrow: 'Statistics',
    detailTitle: 'Session detail',
    detailSupport: 'Review what went well and which cards still need attention.',
    shareAction: 'Share',
    shareTitle: 'Study summary',
    bestStreak: 'Best streak',
    sessionTime: 'Session time',
    promptDistribution: 'Prompt distribution',
    failedCards: 'Missed cards',
    correctCards: 'Correct cards',
    historyEyebrow: 'History',
    historyTitle: 'Recent sessions',
    historySupport: 'Keep real study performance in view for this deck.',
    sessions: 'Sessions',
    totalReviewed: 'Reviewed',
    emptyHistoryTitle: 'No saved sessions yet',
    emptyHistorySupport: 'Complete a session to start building study history for this deck.',
    emptyDetailTitle: 'Could not open this session',
    emptyDetailSupport: 'Go back to Study and try another saved session.',
    summaryReadySupport: 'This session is saved. You can head back or open the full detail view.',
    viewStatisticsShort: 'View detail',
    sessionRowSupport: (answeredCount, accuracyPercentage, durationLabel) =>
      `${answeredCount} reviewed · ${accuracyPercentage}% · ${durationLabel}`,
    durationSeconds: (seconds) => `${seconds}s`,
    durationMinutes: (minutes) => `${minutes} min`,
    durationMinutesSeconds: (minutes, seconds) => `${minutes} min ${seconds}s`
  },
  studyAnswers: {
    needsReview: 'Needs review',
    correct: 'Correct'
  },
  deckList: {
    cardsCount: (count) => `${count} cards`,
    studyableCards: (studyableCount, totalCount) => `${studyableCount} / ${totalCount} studyable cards`,
    readyToStudy: (count) => `${count} ready to study`,
    promptItems: (count) => `${count} prompt items`
  },
  deckInsights: {
    title: 'Study readiness',
    promptCoverage: 'Prompt coverage',
    techniqueOutlook: 'Technique outlook',
    cards: 'Cards',
    studyable: 'Studyable',
    promptItems: 'Prompt items',
    cardCoverageMeta: (count, percentage) => `${count} cards · ${percentage}%`,
    readinessEmpty: 'No cards',
    readinessPoor: 'Poor',
    readinessNeedsImprovement: 'Needs improvement',
    readinessGood: 'Good',
    readinessMessageEmpty: 'Add cards before this deck can support a study session.',
    readinessMessageNoPrompts: 'These cards do not expose any valid study prompts yet.',
    readinessMessageGood: 'This deck should produce a solid study session with useful prompt variety.',
    readinessMessageNeedsImprovement: 'Some cards are studyable, but missing fields still limit prompt coverage.',
    readinessMessagePoor: 'Only a small portion of this deck can be used for study right now.',
    techniqueUnavailable: 'No valid prompts yet',
    techniqueLimited: 'Few valid prompts',
    techniqueReady: 'Ready to study'
  },
  cardFeedback: {
    basic: 'Basic',
    expanded: 'Expanded',
    detailed: 'Detailed',
    promptsReady: (count) => `${count} prompt${count === 1 ? '' : 's'} ready`
  },
  validation: {
    duplicateDeckName: 'A deck with that name already exists.',
    invalidDeckName: 'Enter a deck name.',
    invalidDeckType: 'Choose a valid deck type.',
    invalidDeckColor: 'Choose a valid deck color.',
    invalidCardDeck: 'Choose a valid deck before creating cards.',
    invalidCardId: 'Choose a valid card before saving changes.',
    invalidCardFront: 'Enter the front of the card.',
    invalidCardBack: 'Enter the back of the card.',
    invalidCardDescription: 'Description is too long.',
    invalidCardApplication: 'Application is too long.',
    invalidCardImageUri: 'Enter a valid image value.',
    invalidStudyProgressCard: 'Study progress requires a valid card.',
    invalidStudyProgressDeck: 'Study progress requires a valid deck.',
    invalidStudyProgressPromptMode: 'Study progress requires a supported prompt mode.',
    invalidStudyProgressResult: 'Study progress requires a supported study result.',
    invalidStudyProgressTimestamp: 'Study progress requires a valid study timestamp.'
  },
  featureMessages: {
    couldNotLoadDecks: 'Could not load decks right now.',
    couldNotSaveDeck: 'Could not save the deck. Please try again.',
    couldNotLoadCards: 'Could not load cards right now.',
    chooseDeckBeforeCreatingCards: 'Choose a deck before creating cards.',
    cardAdded: 'Card added',
    cardUpdated: 'Card updated',
    couldNotSaveCard: 'Could not save the card. Please try again.',
    chooseDeckBeforeImportingCards: 'Choose a deck before importing cards.',
    chooseCsvFile: 'Choose a CSV file before importing.',
    noValidCardLines: 'No valid lines are ready to import yet.',
    importedCards: (createdCount, invalidCount) =>
      `Imported ${createdCount} card${createdCount === 1 ? '' : 's'}. Skipped ${invalidCount} invalid line${invalidCount === 1 ? '' : 's'}.`,
    couldNotReadCsvFile: 'Could not read this CSV file.',
    couldNotImportCards: 'Could not import cards right now. Please try again.',
    pasteExportedDeck: 'Paste an exported deck before importing.',
    deckImportNotReady: 'This deck import is not ready yet.',
    importedDeck: (deckName, createdCount, invalidCount) =>
      `Imported ${deckName} with ${createdCount} card${createdCount === 1 ? '' : 's'}. Skipped ${invalidCount} invalid line${invalidCount === 1 ? '' : 's'}.`,
    couldNotImportDeck: 'Could not import the deck right now. Please try again.',
    couldNotLoadStudyDecks: 'Could not load decks for study right now.',
    createDeckBeforeStudy: 'Create a deck before starting a study session.',
    couldNotSaveStudyProgress: 'Could not save study progress right now. Try that answer again.',
    couldNotSaveStudySession: 'Could not save the session summary right now.',
    couldNotLoadStudySessionDetail: 'Could not load this saved session.',
    noIncorrectAnswersToRetry: 'There are no incorrect answers to retry in this session.',
    couldNotStartStudy: 'Could not start the study session right now.',
    couldNotStartStudySession: 'Could not start the study session right now.'
  },
  importValidation: {
    useFormat:
      'Use `front | back`, with optional `description | application`, keeping empty fields in order when needed.',
    frontRequired: 'Front is required.',
    backRequired: 'Back is required.',
    frontColumnRequired: 'Map a column to Front.',
    backColumnRequired: 'Map a column to Back.',
    lineEmpty: 'Line is empty.',
    csvEmpty: 'The CSV file is empty.',
    csvHeaderRequired: 'The CSV file needs a header row.',
    csvDataRequired: 'The CSV file needs at least one data row.',
    csvQuoteError: 'The CSV file has an unclosed quoted value.',
    deckHeaderRequired: 'Start the import with `# Deck: Deck name` on the first non-empty line.',
    fixInvalidDeckLines: 'Fix invalid card lines or remove them before importing this deck.',
    missingBack: 'Missing back',
    missingDescription: 'Missing description',
    missingApplication: 'Missing application',
    noImagePrompt: 'No image prompt',
    supportedNow: 'Supported now',
    addFront: 'Add front',
    addBack: 'Add back',
    addDescription: 'Add description',
    addApplication: 'Add application',
    addImageUrl: 'Add image URL',
    completeMoreFields: 'Complete more fields',
    ready: 'Ready',
    limited: 'Limited',
    notReady: 'Not ready',
    cardReadyMessage: 'This card already supports multiple prompt modes.',
    cardLimitedMessage: 'This card is studyable, but it only supports a narrow prompt range.',
    cardNotReadyMessage: 'Add a back, description, application, or image to make this card studyable.'
  }
};

export const appStrings = {
  es,
  en
} as const;
