export type TrackType = 'core' | 'red' | 'blue' | 'purple';
export type Track = TrackType;

export interface CourseMetadata {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  version: string;
  status: 'published' | 'draft';
  audience: string;
  prerequisites: string[];
  estimatedWeeks: string;
  estimatedHoursPerWeek: string;
  totalEstimatedMinutes: number;
  outcomes: string[];
  author: {
    name: string;
    role: string;
    credentials: string;
  };
  safetyStatement: string;
  publishedAt: string;
  lastUpdated: string;
}

export interface KeyTerm {
  term: string;
  acronym?: string;
  definition: string;
}

export interface LessonReference {
  title: string;
  publisher: string;
  url: string;
  lastReviewed: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex?: number; // Kept optional on client if server-verified
  explanation: string;
  isCriticalSafety?: boolean; // Must be correct for Module 0 pass
}

export interface QuizData {
  id: string;
  title: string;
  passingScore: number; // e.g. 70
  requiresSafetyPass?: boolean;
  questions: QuizQuestion[];
}

export interface WorkedExample {
  title: string;
  datasetName: string;
  scenario: string;
  syntheticData: string;
  analysisWalkthrough: string[];
  keyInsight: string;
}

export interface ContainedLab {
  id: string;
  title: string;
  environmentName: string;
  scopeNotice: string;
  allowedActions: string[];
  prohibitedActions: string[];
  stopConditions: string[];
  initialState: Record<string, unknown>;
  instructions: string[];
  expectedResult: string;
  labType: 'scope_review' | 'log_analysis' | 'threat_model' | 'code_review' | 'test_plan' | 'finding_card' | 'report_review' | 'timeline_triage' | 'tabletop_decision' | 'remediation_prioritization' | 'purple_capstone';
}

export interface LessonSection {
  type: 'explanation' | 'diagram' | 'example' | 'lab' | 'quiz';
  title?: string;
  content?: string;
  diagramAscii?: string;
  diagramAltText?: string;
  exampleData?: WorkedExample;
  labData?: ContainedLab;
  quizData?: QuizData;
}

export interface Lesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  orderIndex: number;
  estimatedMinutes: {
    reading: number;
    practice: number;
    total: number;
  };
  level: 'beginner' | 'intermediate';
  required: boolean;
  whyThisMatters: string;
  objectives: string[];
  prerequisites: string[]; // lesson IDs
  sections: LessonSection[];
  keyTerms: KeyTerm[];
  summaryTakeaways: string[];
  references: LessonReference[];
  publishedAt: string;
  version: string;
}

export interface ModuleData {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  track: TrackType;
  summary: string;
  orderIndex: number;
  required: boolean;
  objectives: string[];
  lessons: Lesson[];
  moduleQuiz?: QuizData;
  onePageCheatSheet: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  acronym?: string;
  definition: string;
  track: TrackType;
  relatedLessonSlugs: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'worksheet' | 'checklist' | 'template' | 'glossary' | 'rubric' | 'guide';
  fileFormat: string;
  fileSize: string;
  version: string;
  lastUpdated: string;
  license: string;
  accessibilityNotes: string;
  downloadFileName: string;
  contentMarkdown: string;
}

export interface LearnerProgress {
  learnerId: string;
  completedLessonIds: string[];
  quizAttempts: Record<string, {
    score: number;
    passed: boolean;
    timestamp: number;
    attemptsCount: number;
    verificationToken?: string;
  }>;
  labStates: Record<string, {
    completed: boolean;
    lastSaved: number;
    userDraft?: Record<string, unknown>;
  }>;
  lastVisitedLessonSlug: string | null;
  enrolledAt: number;
  lastActiveAt: number;
  isServerSynced: boolean;
}

export interface CapstoneDeliverable {
  scopeConfirmed: boolean;
  targetObservation: string;
  vulnerabilityValidation: string;
  telemetryHypothesis: string;
  correctiveControlPlan: string;
  executiveSummary: string;
  technicalFinding: string;
  limitationsReflection: string;
}
