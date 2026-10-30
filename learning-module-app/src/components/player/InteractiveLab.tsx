import React, { useState } from 'react';
import { ContainedLab } from '../../types/course.types';
import { progressService } from '../../services/progressService';
import { ShieldAlert, RotateCcw, CheckCircle2, AlertTriangle, Terminal, Play, Lock } from 'lucide-react';

interface InteractiveLabProps {
  lab: ContainedLab;
  onLabCompleted?: () => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ lab, onLabCompleted }) => {
  const [scopeAccepted, setScopeAccepted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() => {
    const p = progressService.getProgress();
    return p.labStates[lab.id]?.completed || false;
  });

  // State for interactive labs
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleScopeAccept = () => {
    setScopeAccepted(true);
  };

  const handleReset = () => {
    if (window.confirm('Reset this contained lab sandbox to its initial baseline? Any unsaved edits will be cleared.')) {
      setAnswers({});
      setIsCompleted(false);
      setFeedbackMessage(null);
      progressService.recordLabState(lab.id, false, {});
    }
  };

  const handleCompleteLab = () => {
    setIsCompleted(true);
    setFeedbackMessage('Lab verified! All simulation criteria successfully fulfilled in the isolated target.');
    progressService.recordLabState(lab.id, true, answers);
    if (onLabCompleted) onLabCompleted();
  };

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-secondary/70 overflow-hidden shadow-xl">
      {/* Top Header */}
      <div className="p-4 bg-bg-primary border-b border-border-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
            {lab.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {lab.environmentName}
          </span>
          {isCompleted && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          )}
        </div>
      </div>

      {/* Scope & Authorization Warning Gate (Mandatory before entry) */}
      {!scopeAccepted && !isCompleted ? (
        <div className="p-6 md:p-8 bg-amber-500/5 text-center max-w-xl mx-auto my-6">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h4 className="font-display font-semibold text-lg text-text-primary mb-2">
            Contained Sandbox Scope & Rules of Engagement
          </h4>
          <p className="text-xs font-sans text-text-secondary leading-relaxed mb-4 text-left bg-bg-primary/80 p-4 rounded border border-border-subtle">
            {lab.scopeNotice}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6 text-xs font-mono">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded">
              <span className="text-emerald-400 font-semibold block mb-1">ALLOWED ACTIONS:</span>
              <ul className="list-disc list-inside text-text-muted space-y-1">
                {lab.allowedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 p-3 rounded">
              <span className="text-red-400 font-semibold block mb-1">PROHIBITED ACTIONS:</span>
              <ul className="list-disc list-inside text-text-muted space-y-1">
                {lab.prohibitedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>

          <button
            onClick={handleScopeAccept}
            className="w-full sm:w-auto px-6 py-2.5 bg-accent text-black font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-colors"
          >
            I Acknowledge Scope & Agree to Rules of Engagement
          </button>
        </div>
      ) : (
        /* Unlocked Lab Workbench */
        <div className="p-5 md:p-6 space-y-6">
          {/* Instructions banner */}
          <div className="p-4 bg-bg-primary/60 border border-border-subtle rounded-lg">
            <h5 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
              Laboratory Instructions & Objectives:
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-text-secondary leading-relaxed">
              {lab.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ol>
            <div className="mt-3 pt-3 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
              <strong>Expected Validation Outcome:</strong> {lab.expectedResult}
            </div>
          </div>

          {/* Interactive Simulation Area based on Lab Type */}
          <div className="p-4 sm:p-5 bg-black/40 border border-cyan-500/20 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-border-subtle/50 gap-2">
              <span className="font-mono text-xs text-text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Simulation Terminal // Isolated Sandbox</span>
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Zero external connectivity · Ephemeral container state
              </span>
            </div>

            {/* Render tailored simulation widgets */}
            <div className="space-y-4">
              <p className="text-xs text-text-secondary font-mono">
                [SYSTEM READY] Synthetic target online. Execute the required analysis below:
              </p>

              {/* Sample generic interactive selector for lab tasks */}
              <div className="p-3.5 sm:p-4 bg-bg-secondary/60 rounded border border-border-subtle text-xs font-mono space-y-3">
                <label className="block text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  Primary Analytical Finding / Target Value:
                </label>
                <input
                  type="text"
                  placeholder="Enter target IP, vulnerability identifier, or mitigation..."
                  value={answers['finding'] || ''}
                  onChange={(e) => setAnswers({ ...answers, finding: e.target.value })}
                  className="w-full bg-bg-primary border border-border-subtle rounded px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan-400"
                />

                <label className="block text-text-muted uppercase text-[10px] tracking-wider font-semibold mt-3">
                  Verification Notes / Evidence Summary:
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize evidence observed during this contained exercise..."
                  value={answers['notes'] || ''}
                  onChange={(e) => setAnswers({ ...answers, notes: e.target.value })}
                  className="w-full bg-bg-primary border border-border-subtle rounded px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan-400"
                />
              </div>

              {feedbackMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedbackMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto justify-center px-4 py-2.5 bg-bg-secondary border border-border-subtle hover:border-red-500/40 text-text-muted hover:text-red-400 text-xs font-mono rounded flex items-center gap-1.5 transition-colors"
              title="Reset sandbox state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>

            <button
              onClick={handleCompleteLab}
              className="w-full sm:w-auto justify-center px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-wider rounded hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validate & Record Lab Completion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
