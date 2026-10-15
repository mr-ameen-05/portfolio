/**
 * API payload types returned by /api/content-bundle.php and related endpoints.
 * Field names are snake_case per the PHP contract.
 */
export interface ApiCourse {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  version: string;
  status: string;
  audience: string;
  estimated_weeks: string;
  hours_per_week: string;
  total_estimated_minutes: number;
  author: {
    name: string;
    role: string;
    credentials: string;
  };
  last_updated: string | null;
  prerequisites: string[];
  outcomes: string[];
  safety_statement: string;
  published_at: string | null;
  modules: ApiModule[];
  resources: ApiResource[];
  glossary: ApiGlossaryItem[];
  access: 'guest' | 'registered' | 'enrolled';
}

export interface ApiModule {
  id: number;
  slug: string;
  title: string;
  summary: string;
  objectives: string[];
  track: 'core' | 'red' | 'blue' | 'purple';
  access_tier: 'public' | 'registered' | 'enrolled';
  sort_order: number;
  required: boolean;
  one_page_cheat_sheet: string | null;
  lesson_count: number;
  total_minutes: number;
  locked: boolean;
  lessons: (ApiLessonFull | ApiLessonMeta)[];
  quiz?: ApiQuiz;
}

export interface ApiLessonMeta {
  slug: string;
  title: string;
  sort_order: number;
  required: boolean;
  estimated_minutes: number;
  minutes_reading: number;
  minutes_practice: number;
  access_tier: 'public' | 'registered' | 'enrolled';
  level: string;
  version: string;
  why_this_matters: string;
  objectives: string[];
  has_lab: boolean;
  has_quiz: boolean;
  locked: boolean;
}

export interface ApiLessonFull extends ApiLessonMeta {
  module: {
    slug: string;
    title: string;
    track: 'core' | 'red' | 'blue' | 'purple';
  };
  course_slug: string;
  course_title: string;
  module_order: number;
  why_this_matters: string;
  objectives: string[];
  key_terms: { term: string; acronym?: string; definition: string }[];
  sections: ApiLessonSection[];
  summary_takeaways: string[];
  prerequisites: string[];
  references: { title: string; publisher: string; url: string; last_reviewed: string }[];
  last_reviewed_at: string | null;
  published_at: string | null;
}

export interface ApiLessonSection {
  type: 'explanation' | 'diagram' | 'example' | 'lab' | 'quiz';
  title?: string;
  content?: string;
  diagram_ascii?: string;
  diagram_alt_text?: string;
  example_data?: {
    title: string;
    dataset_name: string;
    scenario: string;
    synthetic_data: string;
    analysis_walkthrough: string[];
    key_insight: string;
  };
  lab_data?: {
    id: string;
    title: string;
    environment_name: string;
    scope_notice: string;
    allowed_actions: string[];
    prohibited_actions: string[];
    stop_conditions: string[];
    initial_state: Record<string, unknown>;
    instructions: string[];
    expected_result: string;
    lab_type: string;
  };
  quiz_data?: {
    id: string;
    title: string;
    passing_score: number;
    requires_safety_pass?: boolean;
    questions: ApiQuizQuestion[];
  };
}

export interface ApiQuiz {
  scope: 'module';
  scope_id: string;
  title: string;
  passing_score: number;
  requires_safety_pass: boolean;
  access_tier: 'public' | 'registered' | 'enrolled';
  questions: ApiQuizQuestion[];
}

export interface ApiQuizQuestion {
  key: string;
  prompt: string;
  choices: string[];
  critical: boolean;
}

export interface ApiResource {
  key: string;
  title: string;
  description: string;
  type: string;
  file_format: string;
  version: string;
  license: string;
  access_tier: 'public' | 'registered' | 'enrolled';
  locked: boolean;
  content_md: string;
}

export interface ApiGlossaryItem {
  key: string;
  term: string;
  acronym?: string;
  definition: string;
  track: 'core' | 'red' | 'blue' | 'purple';
  related_slugs: string[];
}

export interface ApiProgress {
  completed_lessons: string[];
  quizzes: Record<string, {
    scope: string;
    attempts: number;
    best_score: number;
    passed: boolean;
    last_attempt: number;
  }>;
  labs: Record<string, {
    completed: boolean;
    draft: Record<string, unknown>;
    updated_at: number;
  }>;
  last_active_at: number;
}

export interface ApiQuizSubmitResult {
  success: boolean;
  scope: string;
  scope_id: string;
  recorded: boolean;
  verification_token: string;
  score: number;
  passed: boolean;
  safety_failed: boolean;
  total_questions: number;
  correct_count: number;
  results: {
    key: string;
    correct: boolean;
    submitted: number;
    correct_index: number;
    explanation: string;
  }[];
}