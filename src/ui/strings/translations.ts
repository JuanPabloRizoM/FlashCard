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
      setupEyebrow: string;
      chooseDeckTitle: string;
      chooseDeckSupport: string;
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
      billingEyebrow: string;
      billingTitle: string;
      billingSupport: string;
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
      importCards: string;
      importDeck: string;
    };
    creatingIn: string;
    editingIn: string;
    importNoDecksMessage: string;
    importNoDecksTitle: string;
    editCardAction: string;
    listEmptyTitle: string;
    listEmptyMessage: string;
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
    imageUrlLabel: string;
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
  deckExport: {
    title: string;
    support: string;
    hideExport: string;
    actionLabel: string;
    summaryText: string;
  };
  preview: {
    emptyValidDetail: string;
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
  studyAnswers: {
    needsReview: string;
    correct: string;
  };
  deckList: {
    studyableCards: (studyableCount: number, totalCount: number) => string;
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
    noValidCardLines: string;
    importedCards: (createdCount: number, invalidCount: number) => string;
    couldNotImportCards: string;
    pasteExportedDeck: string;
    deckImportNotReady: string;
    importedDeck: (deckName: string, createdCount: number, invalidCount: number) => string;
    couldNotImportDeck: string;
    couldNotLoadStudyDecks: string;
    createDeckBeforeStudy: string;
    couldNotSaveStudyProgress: string;
    noIncorrectAnswersToRetry: string;
    couldNotStartStudy: string;
  };
  importValidation: {
    useFormat: string;
    frontRequired: string;
    backRequired: string;
    lineEmpty: string;
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
      subtitle: 'Crea un mazo y empieza a agregar tarjetas.',
      newDeckEyebrow: 'Nuevo mazo',
      newDeckTitle: 'Crear un mazo',
      newDeckHelper: 'Elige un nombre claro.',
      deckNameLabel: 'Nombre del mazo',
      deckNamePlaceholder: 'Verbos en español',
      createDeck: 'Crear mazo',
      savingDeck: 'Guardando mazo...',
      savedDecksTitle: 'Mazos guardados',
      savedDecksSubtitle: 'Abre un mazo para gestionarlo.',
      noDecksTitle: 'Aún no hay mazos',
      noDecksMessage: 'Crea un mazo para empezar.'
    },
    deckDetail: {
      summaryEyebrow: 'Resumen del mazo',
      backToDecks: 'Volver a mazos',
      cardsSectionTitle: 'Tarjetas',
      cardsSectionText: 'Agrega o edita tarjetas en la pestaña Tarjetas.',
      createCards: 'Crear tarjetas',
      openCards: 'Abrir tarjetas',
      studyDeck: 'Estudiar',
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
      subtitle: 'Elige un mazo y empieza una sesión.',
      setupEyebrow: 'Preparación',
      chooseDeckTitle: 'Elige un mazo',
      chooseDeckSupport: 'Ajusta modo, tamaño y técnica antes de empezar.',
      noStudyTitle: 'Aún no hay nada para estudiar',
      noStudyMessage: 'Crea un mazo y tarjetas primero.',
      sessionUnavailable: 'Sesión no disponible'
    },
    settings: {
      title: 'Ajustes',
      subtitle: 'Controla cómo se ve y se lee la app.',
      appearanceEyebrow: 'Apariencia',
      appearanceTitle: 'Tema',
      appearanceSupport: 'Guardado en este dispositivo.',
      languageEyebrow: 'Idioma',
      languageTitle: 'Idioma de la app',
      languageSupport: 'Se aplica a toda la interfaz.',
      accountEyebrow: 'Cuenta',
      accountTitle: 'Configuración de cuenta',
      accountSupport: 'Las herramientas de cuenta aún no están disponibles.',
      billingEyebrow: 'Facturación',
      billingTitle: 'Facturación',
      billingSupport: 'La facturación aún no está disponible en esta versión.',
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
      }
    }
  },
  auth: {
    landing: {
      title: 'Tu estudio, a tu ritmo',
      subtitle: 'Crea mazos, repasa tarjetas y guarda tu avance local.',
      googleButton: 'Continuar con Google',
      googleSupport: 'Google llegará cuando conectemos el acceso.',
      googleRedirecting: 'Redirigiendo a Google...',
      googleCancelled: 'Se canceló el acceso con Google.',
      googleCallbackFailed: 'No se pudo completar el acceso con Google.',
      googleNotAvailable: 'Google aún no está disponible para este proyecto.',
      emailButton: 'Iniciar sesión con correo',
      createAccount: 'Crear cuenta',
      guestButton: 'Continuar como invitado',
      guestSupport: 'Empieza ahora y usa la app localmente.',
      footer: 'Términos y privacidad aparecerán aquí cuando el acceso esté disponible.'
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
      subtitle: 'Entra con tu correo cuando el acceso esté listo.',
      submit: 'Iniciar sesión',
      forgotPassword: 'Olvidé mi contraseña',
      invalidCredentials: 'Correo o contraseña incorrectos.',
      emailNotConfirmed: 'Confirma tu correo antes de iniciar sesión.'
    },
    createAccount: {
      title: 'Crear cuenta',
      subtitle: 'Deja tu cuenta lista para cuando la sincronización esté disponible.',
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
      subtitle: 'Escribe tu correo y te mostraremos el siguiente paso.',
      submit: 'Enviar enlace',
      confirmationTitle: 'Reinicio preparado',
      confirmationMessage: (email) =>
        `Cuando el acceso esté listo, enviaremos el enlace a ${email}.`,
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
      importCards: 'Importar tarjetas',
      importDeck: 'Importar mazo'
    },
    creatingIn: 'Creando en',
    editingIn: 'Editando en',
    importNoDecksMessage: 'Importa un mazo aquí o crea uno en Mazos.',
    importNoDecksTitle: 'Sin mazos',
    editCardAction: 'Editar tarjeta',
    listEmptyTitle: 'Aún no hay tarjetas',
    listEmptyMessage: 'Agrega una tarjeta o importa varias.'
  },
  cardEditor: {
    newCardTitle: 'Nueva tarjeta',
    editCardTitle: 'Editar tarjeta',
    newCardSupport: 'Agrega un frente y un reverso. Completa los detalles solo si los necesitas.',
    editCardSupport: 'Actualiza el frente, el reverso o los detalles opcionales.',
    frontLabel: 'Frente',
    backLabel: 'Reverso',
    descriptionLabel: 'Descripción (opcional)',
    applicationLabel: 'Aplicación / Notas (opcional)',
    imageUrlLabel: 'URL de imagen (opcional)',
    frontPlaceholder: 'Pregunta o pista',
    backPlaceholder: 'Respuesta',
    descriptionPlaceholder: 'Agrega una descripción',
    applicationPlaceholder: 'Agrega notas o contexto',
    imageUrlPlaceholder: 'Agrega una URL de imagen',
    saveCreating: 'Guardando tarjeta...',
    createCard: 'Crear tarjeta',
    saveChanges: 'Guardar cambios'
  },
  cardImport: {
    title: 'Importar tarjetas',
    subtitleForDeck: (deckName) => `Pega líneas frente | reverso para ${deckName}.`,
    subtitleNoDeck: 'Elige un mazo primero.',
    exampleText:
      'hola | hello\nperro | dog | animal doméstico\ncorrer | run | moverse rápido | usado en deportes',
    actionLabel: 'Importar tarjetas',
    importing: 'Importando...',
    validReady: (count) => `${count} listas`,
    fixInvalidLines: 'Corrige las líneas inválidas para importar'
  },
  deckImport: {
    title: 'Importar mazo',
    subtitle: 'Pega una exportación de mazo.',
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
  deckExport: {
    title: 'Exportar mazo',
    support: 'Copia este mazo como texto.',
    hideExport: 'Ocultar exportación',
    actionLabel: 'Exportar mazo',
    summaryText: 'Encabezado más una tarjeta por línea.'
  },
  preview: {
    emptyValidDetail: 'Solo frente y reverso'
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
    answerHint: 'Marca si la recordaste o si necesitas repasarla.'
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
  studyAnswers: {
    needsReview: 'Necesita repaso',
    correct: 'Correcta'
  },
  deckList: {
    studyableCards: (studyableCount, totalCount) => `${studyableCount} / ${totalCount} tarjetas estudiables`,
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
    invalidCardImageUri: 'Escribe una URL de imagen válida.',
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
    noValidCardLines: 'Todavía no hay líneas válidas listas para importar.',
    importedCards: (createdCount, invalidCount) =>
      `Se importaron ${createdCount} tarjeta${createdCount === 1 ? '' : 's'}. Se omitieron ${invalidCount} línea${invalidCount === 1 ? '' : 's'} inválida${invalidCount === 1 ? '' : 's'}.`,
    couldNotImportCards: 'No se pudieron importar las tarjetas ahora mismo. Inténtalo de nuevo.',
    pasteExportedDeck: 'Pega un mazo exportado antes de importarlo.',
    deckImportNotReady: 'Esta importación de mazo aún no está lista.',
    importedDeck: (deckName, createdCount, invalidCount) =>
      `Se importó ${deckName} con ${createdCount} tarjeta${createdCount === 1 ? '' : 's'}. Se omitieron ${invalidCount} línea${invalidCount === 1 ? '' : 's'} inválida${invalidCount === 1 ? '' : 's'}.`,
    couldNotImportDeck: 'No se pudo importar el mazo ahora mismo. Inténtalo de nuevo.',
    couldNotLoadStudyDecks: 'No se pudieron cargar los mazos para estudiar ahora mismo.',
    createDeckBeforeStudy: 'Crea un mazo antes de iniciar una sesión de estudio.',
    couldNotSaveStudyProgress: 'No se pudo guardar el progreso ahora mismo. Intenta responder de nuevo.',
    noIncorrectAnswersToRetry: 'No hay respuestas incorrectas para repetir en esta sesión.',
    couldNotStartStudy: 'No se pudo iniciar la sesión de estudio ahora mismo.'
  },
  importValidation: {
    useFormat:
      'Usa `frente | reverso`, con `descripción | aplicación` opcionales, manteniendo los campos vacíos en orden cuando haga falta.',
    frontRequired: 'El frente es obligatorio.',
    backRequired: 'El reverso es obligatorio.',
    lineEmpty: 'La línea está vacía.',
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
      subtitle: 'Create a deck and start adding cards.',
      newDeckEyebrow: 'New deck',
      newDeckTitle: 'Create a deck',
      newDeckHelper: 'Pick a clear name.',
      deckNameLabel: 'Deck name',
      deckNamePlaceholder: 'Spanish verbs',
      createDeck: 'Create deck',
      savingDeck: 'Saving deck...',
      savedDecksTitle: 'Saved decks',
      savedDecksSubtitle: 'Open a deck to manage it.',
      noDecksTitle: 'No decks yet',
      noDecksMessage: 'Create a deck to get started.'
    },
    deckDetail: {
      summaryEyebrow: 'Deck summary',
      backToDecks: 'Back to decks',
      cardsSectionTitle: 'Cards',
      cardsSectionText: 'Add or edit cards in the Cards tab.',
      createCards: 'Create cards',
      openCards: 'Open cards',
      studyDeck: 'Study',
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
      subtitle: 'Choose a deck and start a session.',
      setupEyebrow: 'Setup',
      chooseDeckTitle: 'Choose a deck',
      chooseDeckSupport: 'Adjust mode, size, and technique before you start.',
      noStudyTitle: 'Nothing to study yet',
      noStudyMessage: 'Create a deck and cards first.',
      sessionUnavailable: 'Session unavailable'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Control how the app looks and reads.',
      appearanceEyebrow: 'Appearance',
      appearanceTitle: 'Theme',
      appearanceSupport: 'Saved on this device.',
      languageEyebrow: 'Language',
      languageTitle: 'App language',
      languageSupport: 'Applies across the interface.',
      accountEyebrow: 'Account',
      accountTitle: 'Account settings',
      accountSupport: 'Account tools are not available yet.',
      billingEyebrow: 'Billing',
      billingTitle: 'Billing',
      billingSupport: 'Billing is not available in this build yet.',
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
      }
    }
  },
  auth: {
    landing: {
      title: 'Study at your pace',
      subtitle: 'Build decks, review cards, and keep your progress local.',
      googleButton: 'Continue with Google',
      googleSupport: 'Google will appear once sign-in is connected.',
      googleRedirecting: 'Redirecting to Google...',
      googleCancelled: 'Google sign-in was cancelled.',
      googleCallbackFailed: 'Could not complete Google sign-in.',
      googleNotAvailable: 'Google sign-in is not available for this project yet.',
      emailButton: 'Sign in with email',
      createAccount: 'Create account',
      guestButton: 'Continue as guest',
      guestSupport: 'Start now and keep everything on this device.',
      footer: 'Terms and Privacy will appear here once account access is available.'
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
      subtitle: 'Use your email once sign-in is ready.',
      submit: 'Sign in',
      forgotPassword: 'Forgot password',
      invalidCredentials: 'Email or password is incorrect.',
      emailNotConfirmed: 'Confirm your email before signing in.'
    },
    createAccount: {
      title: 'Create account',
      subtitle: 'Get your account ready for when sync is available.',
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
      subtitle: 'Enter your email and we’ll show the next step.',
      submit: 'Send reset link',
      confirmationTitle: 'Reset prepared',
      confirmationMessage: (email) =>
        `Once sign-in is ready, the reset link will be sent to ${email}.`,
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
      importCards: 'Import cards',
      importDeck: 'Import deck'
    },
    creatingIn: 'Creating in',
    editingIn: 'Editing in',
    importNoDecksMessage: 'Import a deck here or create one in Decks.',
    importNoDecksTitle: 'No decks',
    editCardAction: 'Edit card',
    listEmptyTitle: 'No cards yet',
    listEmptyMessage: 'Add a card or import a few.'
  },
  cardEditor: {
    newCardTitle: 'New card',
    editCardTitle: 'Edit card',
    newCardSupport: 'Add a front and back. Fill in details only if you need them.',
    editCardSupport: 'Update the front, back, or optional details.',
    frontLabel: 'Front',
    backLabel: 'Back',
    descriptionLabel: 'Description (optional)',
    applicationLabel: 'Application / Notes (optional)',
    imageUrlLabel: 'Image URL (optional)',
    frontPlaceholder: 'Question or prompt',
    backPlaceholder: 'Answer',
    descriptionPlaceholder: 'Add a description',
    applicationPlaceholder: 'Add notes or context',
    imageUrlPlaceholder: 'Add an image URL',
    saveCreating: 'Saving card...',
    createCard: 'Create card',
    saveChanges: 'Save changes'
  },
  cardImport: {
    title: 'Import cards',
    subtitleForDeck: (deckName) => `Paste front | back lines for ${deckName}.`,
    subtitleNoDeck: 'Choose a deck first.',
    exampleText: 'hola | hello\nperro | dog | domestic animal\ncorrer | run | move quickly | used in sports',
    actionLabel: 'Import cards',
    importing: 'Importing...',
    validReady: (count) => `${count} ready`,
    fixInvalidLines: 'Fix invalid lines to import'
  },
  deckImport: {
    title: 'Import deck',
    subtitle: 'Paste a deck export.',
    exampleText: '# Deck: Spanish Basics\nhola | hello\nperro | dog | domestic animal\ncorrer | run | move quickly | used in sports',
    importing: 'Importing...',
    actionLabel: 'Import deck',
    cardsReady: (count) => `${count} cards ready`,
    deckReady: 'Deck ready',
    fixInvalidLines: 'Fix invalid lines to import',
    deckNameNotReady: 'Deck name not ready',
    frontBackOnly: 'Front and back only'
  },
  deckExport: {
    title: 'Export deck',
    support: 'Copy this deck as text.',
    hideExport: 'Hide export',
    actionLabel: 'Export deck',
    summaryText: 'Header plus one card per line.'
  },
  preview: {
    emptyValidDetail: 'Front and back only'
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
    answerHint: 'Mark whether you recalled it or need to review it again.'
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
  studyAnswers: {
    needsReview: 'Needs review',
    correct: 'Correct'
  },
  deckList: {
    studyableCards: (studyableCount, totalCount) => `${studyableCount} / ${totalCount} studyable cards`,
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
    invalidCardImageUri: 'Enter a valid image URL.',
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
    noValidCardLines: 'No valid lines are ready to import yet.',
    importedCards: (createdCount, invalidCount) =>
      `Imported ${createdCount} card${createdCount === 1 ? '' : 's'}. Skipped ${invalidCount} invalid line${invalidCount === 1 ? '' : 's'}.`,
    couldNotImportCards: 'Could not import cards right now. Please try again.',
    pasteExportedDeck: 'Paste an exported deck before importing.',
    deckImportNotReady: 'This deck import is not ready yet.',
    importedDeck: (deckName, createdCount, invalidCount) =>
      `Imported ${deckName} with ${createdCount} card${createdCount === 1 ? '' : 's'}. Skipped ${invalidCount} invalid line${invalidCount === 1 ? '' : 's'}.`,
    couldNotImportDeck: 'Could not import the deck right now. Please try again.',
    couldNotLoadStudyDecks: 'Could not load decks for study right now.',
    createDeckBeforeStudy: 'Create a deck before starting a study session.',
    couldNotSaveStudyProgress: 'Could not save study progress right now. Try that answer again.',
    noIncorrectAnswersToRetry: 'There are no incorrect answers to retry in this session.',
    couldNotStartStudy: 'Could not start the study session right now.'
  },
  importValidation: {
    useFormat:
      'Use `front | back`, with optional `description | application`, keeping empty fields in order when needed.',
    frontRequired: 'Front is required.',
    backRequired: 'Back is required.',
    lineEmpty: 'Line is empty.',
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
