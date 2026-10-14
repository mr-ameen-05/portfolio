import React from 'react';

export const StateLoading: React.FC<{ message?: string }> = ({ message = 'Loading course content...' }) => (
  <div 
    className="py-16 px-6 flex flex-col items-center justify-center text-center"
    role="status"
    aria-live="polite"
  >
    <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
    <p className="font-mono text-sm text-text-muted animate-pulse">{message}</p>
    <span className="sr-only">Loading content, please wait.</span>
  </div>
);

export const StateEmpty: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({
  title = 'No items found',
  description = 'Try adjusting your search criteria or filter options.',
  actionLabel,
  onAction
}) => (
  <div 
    className="py-16 px-6 bg-bg-secondary/40 border border-border-subtle rounded-xl text-center max-w-xl mx-auto my-8"
    role="region"
    aria-label="Empty search state"
  >
    <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-border-subtle flex items-center justify-center text-text-muted mb-4 font-mono text-xl">
      Ø
    </div>
    <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{title}</h3>
    <p className="text-sm text-text-secondary leading-relaxed mb-6">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-bg-tertiary border border-border-subtle hover:border-cyan-400/50 text-xs font-mono text-text-primary uppercase tracking-wider rounded transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const StateLocked: React.FC<{
  lessonTitle: string;
  prerequisiteNames: string[];
  onUnlockClick?: () => void;
}> = ({ lessonTitle, prerequisiteNames }) => (
  <div 
    className="p-6 md:p-8 bg-amber-500/5 border border-amber-500/20 rounded-xl my-6"
    role="alert"
    aria-labelledby="locked-title"
  >
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-mono text-lg">
        🔒
      </div>
      <div>
        <h3 id="locked-title" className="font-display font-semibold text-base text-text-primary mb-1">
          Lesson Locked: Prerequisite Required
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          To ensure safe progression, <strong>{lessonTitle}</strong> requires foundational understanding from prior lessons.
        </p>
        <div className="bg-bg-primary/80 border border-border-subtle p-3 rounded text-xs font-mono text-text-muted mb-4">
          <span className="text-amber-400 font-semibold block mb-1">Complete these required prerequisites first:</span>
          <ul className="list-disc list-inside space-y-1">
            {prerequisiteNames.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export const StateError: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry
}) => (
  <div 
    className="p-6 md:p-8 bg-red-500/5 border border-red-500/20 rounded-xl text-center max-w-xl mx-auto my-8"
    role="alert"
  >
    <div className="w-10 h-10 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 font-mono text-lg font-bold">
      !
    </div>
    <h3 className="font-display font-semibold text-base text-text-primary mb-1">{title}</h3>
    <p className="text-sm text-text-secondary leading-relaxed mb-5">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-red-500/20 border border-red-500/40 text-xs font-mono text-red-200 uppercase tracking-wider rounded hover:bg-red-500/30 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);
