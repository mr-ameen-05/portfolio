import { QuizData } from '../types/course.types';
import { progressService } from './progressService';

/**
 * Quiz evaluation endpoint. Point this at an external API service if configured with
 * VITE_QUIZ_ENDPOINT. When unset, quizzes evaluate locally in the browser.
 */
const QUIZ_ENDPOINT: string | undefined = import.meta.env.VITE_QUIZ_ENDPOINT;

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

  static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  async submitQuiz(
    quiz: QuizData,
    answers: Record<string, number>
  ): Promise<QuizEvaluationResult> {
    const progress = progressService.getProgress();
    const payload = {
      quiz_id: quiz.id,
      answers,
      learner_id: progress.learnerId
    };

    // 1. Try server-side validation endpoint if configured
    if (QUIZ_ENDPOINT) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(QUIZ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const feedbackMap: Record<string, { isCorrect: boolean; explanation: string }> = {};
          if (data.feedback) {
            for (const [qId, f] of Object.entries(data.feedback as Record<string, { is_correct: boolean; explanation: string }>)) {
              feedbackMap[qId] = {
                isCorrect: f.is_correct,
                explanation: f.explanation
              };
            }
          }

          const result: QuizEvaluationResult = {
            quizId: quiz.id,
            score: data.score,
            passed: data.passed,
            safetyFailed: data.safety_failed || false,
            totalQuestions: data.total_questions,
            correctCount: data.correct_count,
            feedback: feedbackMap,
            verificationToken: data.verification_token,
            storageMode: 'server_verified'
          };

          // Record in progress
          progressService.recordQuizAttempt(quiz.id, {
            score: result.score,
            passed: result.passed,
            verificationToken: result.verificationToken
          });

          return result;
        }
      }
      } catch {
        // Server unreachable, fallback transparently to device-local evaluation
      }
    }

    // 2. Client-side fallback evaluation
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
