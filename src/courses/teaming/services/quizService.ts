import { QuizData } from '../types/course.types';
import { progressService } from './progressService';
import { post, ApiError } from '../../../platform/api/client';

/**
 * Quiz evaluation service. Supports:
 *  - Server-side grading via /api/content-quiz-submit.php (requires quiz.scope + quiz.scopeId + auth)
 *  - Device-local fallback (for offline / local content / public quizzes)
 */
const LOCAL_QUIZ_ENDPOINT: string =
  import.meta.env.VITE_QUIZ_ENDPOINT || '/api/course-quiz.php';

export interface QuizEvaluationResult {
  quizId: string;
  score: number;
  passed: boolean;
  safetyFailed: boolean;
  totalQuestions: number;
  correctCount: number;
  feedback: Record<string, {
    isCorrect: boolean;
    explanation: string;
  }>;
  verificationToken?: string;
  storageMode: 'server_verified' | 'device_local';
  error?: string;
}

export class QuizService {
  private static instance: QuizService;
  private authConfig: { csrf: string | null } = { csrf: null };

  static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  /** Configure with current CSRF token for server writes. */
  configure(cfg: { csrf: string | null }): void {
    this.authConfig = cfg;
  }

  async submitQuiz(
    quiz: QuizData,
    answers: Record<string, number>
  ): Promise<QuizEvaluationResult> {
    const progress = progressService.getProgress();

    // If quiz has API scope/scopeId and we have CSRF (authenticated), use server grading
    const isApiQuiz = quiz.scope && quiz.scopeId;
    if (isApiQuiz && this.authConfig.csrf) {
      try {
        const res = await post<{
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
          results: { key: string; correct: boolean; submitted: number; correct_index: number; explanation: string }[];
        }>('content-quiz-submit.php', {
          scope: quiz.scope,
          scope_id: quiz.scopeId,
          answers,
        }, this.authConfig.csrf);

        const feedbackMap: Record<string, { isCorrect: boolean; explanation: string }> = {};
        for (const r of res.results) {
          feedbackMap[r.key] = { isCorrect: r.correct, explanation: r.explanation };
        }

        const result: QuizEvaluationResult = {
          quizId: quiz.id,
          score: res.score,
          passed: res.passed,
          safetyFailed: res.safety_failed,
          totalQuestions: res.total_questions,
          correctCount: res.correct_count,
          feedback: feedbackMap,
          verificationToken: res.verification_token,
          storageMode: 'server_verified',
        };

        progressService.recordQuizAttempt(quiz.id, {
          score: result.score,
          passed: result.passed,
          verificationToken: result.verificationToken,
        });

        return result;
      } catch (e) {
        const err = e as Error | ApiError;
        if (!(err instanceof ApiError && err.isNetwork)) {
          // Non-network error (e.g. 403 locked, 401 auth) -> return error
          return {
            quizId: quiz.id,
            score: 0,
            passed: false,
            safetyFailed: false,
            totalQuestions: quiz.questions.length,
            correctCount: 0,
            feedback: {},
            storageMode: 'device_local',
            error: err instanceof Error ? err.message : 'Quiz submission failed',
          };
        }
        // Network error -> fall through to local grading
      }
    }

    // Fallback: local grading (works for local content, public quizzes, offline)
    return this.evaluateLocally(quiz, answers);
  }

  evaluateLocally(
    quiz: QuizData,
    answers: Record<string, number>
  ): QuizEvaluationResult {
    let correctCount = 0;
    let safetyFailed = false;
    const feedbackMap: Record<string, { isCorrect: boolean; explanation: string }> = {};

    for (const q of quiz.questions) {
      const userChoice = answers[q.id];
      const isCorrect = userChoice === q.correctIndex;

      if (isCorrect) {
        correctCount++;
      } else {
        if (q.isCriticalSafety) {
          safetyFailed = true;
        }
      }

      feedbackMap[q.id] = {
        isCorrect,
        explanation: q.explanation
      };
    }

    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    let passed = score >= quiz.passingScore;

    if (quiz.requiresSafetyPass && safetyFailed) {
      passed = false;
    }

    const result: QuizEvaluationResult = {
      quizId: quiz.id,
      score,
      passed,
      safetyFailed,
      totalQuestions,
      correctCount,
      feedback: feedbackMap,
      storageMode: 'device_local'
    };

    progressService.recordQuizAttempt(quiz.id, {
      score: result.score,
      passed: result.passed
    });

    return result;
  }
}

export const quizService = QuizService.getInstance();
