import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lesson, LessonSection } from '../../types/course.types';
import { getAdjacentLessons, ALL_MODULES } from '../../data/modulesManifest';
import { InteractiveLab } from './InteractiveLab';
import { QuizWidget } from './QuizWidget';

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  isCompleted,
  onToggleComplete,
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const adjacent = getAdjacentLessons(lesson.id);
  const currentModule = ALL_MODULES.find(m => m.id === lesson.moduleId);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to parse basic markdown elements (bold, code blocks, lists) safely
  const renderSimpleMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, pIdx) => {
      // Check for bullet list
      if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
        const items = paragraph.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        return (
          <ul key={pIdx} className="list-disc pl-5 my-3 space-y-1 text-text-secondary leading-relaxed text-sm">
            {items.map((item, iIdx) => {
              const cleanItem = item.replace(/^[-*]\s+/, '');
              return <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInline(cleanItem) }} />;
            })}
          </ul>
        );
      }

      // Check for numbered list
      if (/^\d+\.\s/.test(paragraph.trim())) {
        const items = paragraph.split('\n').filter(l => /^\d+\.\s/.test(l.trim()));
        return (
          <ol key={pIdx} className="list-decimal pl-5 my-3 space-y-1 text-text-secondary leading-relaxed text-sm">
            {items.map((item, iIdx) => {
              const cleanItem = item.replace(/^\d+\.\s+/, '');
              return <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInline(cleanItem) }} />;
            })}
          </ol>
        );
      }

      return (
        <p
          key={pIdx}
          className="text-text-secondary leading-relaxed my-3 text-sm"
          dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }}
        />
      );
    });
  };

  // Helper for inline bold, code, links
  const formatInline = (str: string) => {
    return str
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-bg-primary text-accent font-mono text-xs border border-border-subtle">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-text-primary italic">$1</em>');
  };

  const renderSection = (section: LessonSection, idx: number) => {
    switch (section.type) {
      case 'explanation':
        return (
          <section key={idx} className="space-y-3 scroll-mt-20">
            {section.title && (
              <h2 className="text-lg md:text-xl font-bold text-text-primary font-sans flex items-center gap-2">
                <span className="text-xs font-mono text-accent">0{idx + 1}.</span>
                {section.title}
              </h2>
            )}
            {section.content && <div>{renderSimpleMarkdown(section.content)}</div>}
          </section>
        );

      case 'diagram':
        return (
          <section key={idx} className="space-y-3 scroll-mt-20">
            {section.title && (
              <h2 className="text-lg md:text-xl font-bold text-text-primary font-sans flex items-center gap-2">
                <span className="text-xs font-mono text-accent">0{idx + 1}.</span>
                {section.title}
              </h2>
            )}
            {section.diagramAscii && (
              <div className="my-3 rounded-lg border border-border-subtle bg-bg-primary p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-accent leading-relaxed">
                  {section.diagramAscii}
                </pre>
              </div>
            )}
            {section.diagramAltText && (
              <details className="p-3 rounded border border-border-subtle/70 bg-bg-secondary/20 text-xs">
                <summary className="font-mono text-text-muted cursor-pointer hover:text-text-primary select-none">
                  ♿ Accessible Diagram Description
                </summary>
                <p className="mt-2 text-text-secondary font-mono leading-relaxed whitespace-pre-line pl-2 border-l border-accent/40">
                  {section.diagramAltText}
                </p>
              </details>
            )}
          </section>
        );

      case 'example':
        return section.exampleData ? (
          <section key={idx} className="p-5 rounded-xl border border-accent/30 bg-bg-secondary/40 space-y-4 my-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-accent font-bold">
                💡 Worked Case Study: {section.exampleData.datasetName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-primary text-text-muted border border-border-subtle">
                Synthetic Dataset
              </span>
            </div>

            <h3 className="text-base font-bold text-text-primary">
              {section.exampleData.title}
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              {section.exampleData.scenario}
            </p>

            <div className="rounded border border-border-subtle bg-bg-primary p-3">
              <div className="text-[10px] font-mono text-text-muted uppercase mb-1">Raw Telemetry / Payload:</div>
              <pre className="font-mono text-xs text-text-primary overflow-x-auto">
                {section.exampleData.syntheticData}
              </pre>
            </div>

            {section.exampleData.analysisWalkthrough && (
              <div className="space-y-1.5 text-xs text-text-secondary">
                <div className="font-mono text-[11px] text-text-muted uppercase font-semibold">Analysis Steps:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {section.exampleData.analysisWalkthrough.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {section.exampleData.keyInsight && (
              <div className="p-3 rounded bg-accent/10 border border-accent/20 text-xs font-mono text-text-secondary">
                <span className="text-accent font-bold">Key Insight: </span>
                {section.exampleData.keyInsight}
              </div>
            )}
          </section>
        ) : null;

      case 'lab':
        return section.labData ? (
          <section key={idx} className="my-6">
            <InteractiveLab lab={section.labData} />
          </section>
        ) : null;

      case 'quiz':
        return section.quizData ? (
          <section key={idx} className="my-6">
            <QuizWidget quiz={section.quizData} />
          </section>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <article className="space-y-8 max-w-4xl mx-auto">
      {/* Lesson Header */}
      <header className="border-b border-border-subtle pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            {currentModule && (
              <Link
                to={`/courses/teaming/modules/${currentModule.slug}`}
                className="text-xs font-mono px-2 py-0.5 rounded bg-bg-secondary text-text-muted hover:text-accent border border-border-subtle transition-colors"
              >
                Module {currentModule.orderIndex}: {currentModule.title}
              </Link>
            )}
            <span className="text-xs font-mono text-text-muted">
              ⏱ {lesson.estimatedMinutes.total} mins ({lesson.estimatedMinutes.reading}m reading, {lesson.estimatedMinutes.practice}m lab)
            </span>
          </div>

          {/* Mark Complete Button */}
          <button
            type="button"
            onClick={onToggleComplete}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all border ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 hover:bg-emerald-500/30'
                : 'bg-bg-secondary text-text-muted border-border-subtle hover:text-text-primary hover:border-accent'
            }`}
          >
            <span>{isCompleted ? '✓ Completed' : '○ Mark as Complete'}</span>
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold font-sans text-text-primary tracking-tight">
          {lesson.title}
        </h1>

        {/* Why this matters callout */}
        <div className="mt-4 p-4 rounded-xl border border-accent/20 bg-accent/5">
          <span className="text-[10px] font-mono uppercase text-accent font-bold block mb-1">
            Why This Matters
          </span>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {lesson.whyThisMatters}
          </p>
        </div>

        {/* Key Terms Tags */}
        {lesson.keyTerms && lesson.keyTerms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            <span className="text-[11px] font-mono text-text-muted uppercase">Key Terms:</span>
            {lesson.keyTerms.map(term => (
              <Link
                key={term.term}
                to={`/courses/teaming/glossary?q=${encodeURIComponent(term.term)}`}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-primary hover:bg-accent/10 hover:text-accent text-text-secondary border border-border-subtle transition-colors"
                title={term.definition}
              >
                #{term.term}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Lesson Body Sections */}
      <div className="space-y-8">
        {lesson.sections.map((sec, idx) => renderSection(sec, idx))}
      </div>

      {/* Summary Takeaways */}
      {lesson.summaryTakeaways && lesson.summaryTakeaways.length > 0 && (
        <section className="p-5 rounded-lg border border-accent/30 bg-accent/5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📌</span>
            <h3 className="font-sans font-bold text-base text-text-primary">
              Core Takeaways
            </h3>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-text-secondary">
            {lesson.summaryTakeaways.map((takeaway, tIdx) => (
              <li key={tIdx} className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">▸</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* References */}
      {lesson.references && lesson.references.length > 0 && (
        <section className="border-t border-border-subtle pt-6 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted">
            References & Standards Citations
          </h3>
          <ul className="space-y-1.5 text-xs font-mono">
            {lesson.references.map((ref, rIdx) => (
              <li key={rIdx} className="text-text-secondary flex items-baseline gap-2">
                <span className="text-text-muted">[{rIdx + 1}]</span>
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {ref.title}
                  </a>
                ) : (
                  <span className="text-text-primary">{ref.title}</span>
                )}
                {ref.publisher && (
                  <span className="text-text-muted text-[11px]">({ref.publisher})</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom Prev / Next Navigation */}
      <footer className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {adjacent?.prev ? (
          <Link
            to={`/courses/teaming/lessons/${adjacent.prev.slug}`}
            className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded border border-border-subtle bg-bg-secondary hover:border-accent hover:text-accent transition-colors text-xs font-mono group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <div className="text-left">
              <div className="text-[10px] text-text-muted uppercase">Previous Lesson</div>
              <div className="font-semibold text-text-primary group-hover:text-accent truncate max-w-xs">
                {adjacent.prev.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {adjacent?.next ? (
          <Link
            to={`/courses/teaming/lessons/${adjacent.next.slug}`}
            className="w-full sm:w-auto flex items-center justify-end gap-2 px-4 py-2.5 rounded border border-border-subtle bg-bg-secondary hover:border-accent hover:text-accent transition-colors text-xs font-mono group text-right"
          >
            <div>
              <div className="text-[10px] text-text-muted uppercase">Next Lesson</div>
              <div className="font-semibold text-text-primary group-hover:text-accent truncate max-w-xs">
                {adjacent.next.title}
              </div>
            </div>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ) : (
          <Link
            to="/courses/teaming/capstone"
            className="w-full sm:w-auto flex items-center justify-end gap-2 px-4 py-2.5 rounded border border-accent bg-accent/10 hover:bg-accent/20 text-accent transition-colors text-xs font-mono"
          >
            <span>Proceed to Capstone Scenario →</span>
          </Link>
        )}
      </footer>
    </article>
  );
};
