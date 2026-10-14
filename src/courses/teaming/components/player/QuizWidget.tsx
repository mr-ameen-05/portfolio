import React, { useState } from 'react';
import { QuizData } from '../../types/course.types';
import { quizService, QuizEvaluationResult } from '../../services/quizService';
import { CheckCircle, XCircle, HelpCircle, RotateCcw, ShieldCheck, AlertOctagon } from 'lucide-react';

interface QuizWidgetProps {
  quiz: QuizData;
  onQuizCompleted?: (result: QuizEvaluationResult) => void;
}

export const QuizWidget: React.FC<QuizWidgetProps> = ({ quiz, onQuizCompleted }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizEvaluationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (questionId: string, choiceIndex: number) => {
    if (result) return; // Freeze selection after submission until reset
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceIndex
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const evalResult = await quizService.submitQuiz(quiz, selectedAnswers);
      setResult(evalResult);
      if (onQuizCompleted) onQuizCompleted(evalResult);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setResult(null);
  };

  const allAnswered = quiz.questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-secondary/70 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 bg-bg-primary border-b border-border-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <h4 className="font-display font-semibold text-sm text-text-primary">
            {quiz.title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-secondary border border-border-subtle text-text-muted">
            Passing Score: {quiz.passingScore}%
          </span>
          {result && (
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border flex items-center gap-1 font-semibold ${
              result.passed 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {result.passed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {result.passed ? 'PASSED' : 'RETAKE RECOMMENDED'}
            </span>
          )}
        </div>
      </div>

      {/* Safety Failure Warning (Module 0 / Module 10) */}
      {result && result.safetyFailed && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/30 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs font-mono text-red-200">
            <strong>CRITICAL SAFETY VIOLATION:</strong> You missed one or more mandatory Rules of Engagement / Safety questions. Even if overall percentage is high, 100% compliance on critical boundary questions is strictly required. Please review the explanations and retake.
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="p-5 md:p-6 space-y-8">
        {quiz.questions.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          const feedback = result?.feedback?.[q.id];

          return (
            <div key={q.id} className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs text-cyan-400 font-bold shrink-0 mt-0.5">
                  {qIndex + 1}.
                </span>
                <div>
                  <p className="font-sans text-sm text-text-primary font-medium leading-relaxed">
                    {q.question}
                  </p>
                  {q.isCriticalSafety && (
                    <span className="inline-block mt-1 text-[9px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Mandatory Safety Boundary Question
                    </span>
                  )}
                </div>
              </div>

              {/* Choices */}
              <div className="space-y-2 pl-4 sm:pl-6">
                {q.choices.map((choice, cIndex) => {
                  const isSelected = userChoice === cIndex;
                  let choiceClass = 'bg-bg-primary/50 border-border-subtle text-text-secondary hover:border-cyan-500/40 hover:text-text-primary';

                  if (result) {
                    if (isSelected) {
                      choiceClass = feedback?.isCorrect
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-medium'
                        : 'bg-red-500/15 border-red-500 text-red-300 font-medium';
                    }
                  } else if (isSelected) {
                    choiceClass = 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-medium';
                  }

                  return (
                    <button
                      key={cIndex}
                      type="button"
                      disabled={!!result}
                      onClick={() => handleSelect(q.id, cIndex)}
                      className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-3 ${choiceClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                        {String.fromCharCode(65 + cIndex)}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {result && isSelected && (
                        feedback?.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Question Feedback explanation if evaluated */}
              {result && feedback && (
                <div className={`ml-4 sm:ml-6 p-3 rounded-lg text-xs leading-relaxed border ${
                  feedback.isCorrect 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-text-secondary' 
                    : 'bg-red-500/5 border-red-500/20 text-text-secondary'
                }`}>
                  <strong className={feedback.isCorrect ? 'text-emerald-400 block mb-1 font-mono' : 'text-red-400 block mb-1 font-mono'}>
                    {feedback.isCorrect ? 'Correct Explanation:' : 'Review Context:'}
                  </strong>
                  <p>{feedback.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action / Score bar */}
      <div className="p-4 bg-bg-primary border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
        {result ? (
          <div className="flex flex-wrap items-center gap-4 w-full justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-text-primary">
                Score: {result.score}% ({result.correctCount}/{result.totalQuestions})
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Mode: {result.storageMode === 'server_verified' ? 'Server-Verified' : 'Device-Local'}
              </span>
            </div>

            <button
              onClick={handleRetake}
              className="px-4 py-2 bg-bg-secondary border border-border-subtle hover:border-text-primary text-text-primary text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-mono text-text-muted">
              {Object.keys(selectedAnswers).length} of {quiz.questions.length} answered
            </span>
            <button
              disabled={!allAnswered || submitting}
              onClick={handleSubmit}
              className={`px-6 py-2.5 rounded font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                allAnswered && !submitting
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg cursor-pointer'
                  : 'bg-bg-tertiary text-text-muted cursor-not-allowed opacity-60'
              }`}
            >
              {submitting ? 'Verifying with Server...' : 'Submit Answers'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
