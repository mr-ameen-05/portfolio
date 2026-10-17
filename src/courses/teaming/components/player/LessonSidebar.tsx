import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { ALL_MODULES } from '../../data/modulesManifest';
import { progressService } from '../../services/progressService';
import { Track } from '../../types/course.types';

interface LessonSidebarProps {
  currentLessonSlug?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const trackColors: Record<Track, { badge: string; border: string }> = {
  core: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', border: 'border-l-emerald-500' },
  red: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', border: 'border-l-rose-500' },
  blue: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', border: 'border-l-blue-500' },
  purple: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', border: 'border-l-purple-500' },
};

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  currentLessonSlug,
  mobileOpen = false,
  onMobileClose,
}) => {
  // Find which module contains the current lesson to expand it by default
  const defaultOpenModuleId = useMemo(() => {
    if (!currentLessonSlug) return ALL_MODULES[0]?.id;
    const found = ALL_MODULES.find(m => m.lessons.some(l => l.slug === currentLessonSlug));
    return found ? found.id : ALL_MODULES[0]?.id;
  }, [currentLessonSlug]);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (defaultOpenModuleId) {
      init[defaultOpenModuleId] = true;
    }
    return init;
  });

  const [filterQuery, setFilterQuery] = useState('');

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    ALL_MODULES.forEach(m => { all[m.id] = true; });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  const completedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    ALL_MODULES.forEach(m => {
      m.lessons.forEach(l => {
        map.set(l.slug, progressService.isLessonCompleted(l.id));
      });
    });
    return map;
  }, [currentLessonSlug]);

  // Filter modules/lessons based on search query
  const filteredModules = useMemo(() => {
    if (!filterQuery.trim()) return ALL_MODULES;
    const q = filterQuery.toLowerCase();
    return ALL_MODULES.map(module => {
      const matchingLessons = module.lessons.filter(
        l => l.title.toLowerCase().includes(q) || l.whyThisMatters.toLowerCase().includes(q)
      );
      const moduleMatch = module.title.toLowerCase().includes(q) || module.id.toLowerCase().includes(q);
      if (moduleMatch) {
        return module;
      }
      if (matchingLessons.length > 0) {
        return {
          ...module,
          lessons: matchingLessons,
        };
      }
      return null;
    }).filter(Boolean) as typeof ALL_MODULES;
  }, [filterQuery]);

  const sidebarContent = (
    <div className="flex flex-col h-full glass-panel border-r border-white/10 text-text-primary backdrop-blur-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
            Curriculum
          </span>
          <h2 className="text-sm font-bold text-text-primary">Course Navigation</h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={expandAll}
            className="px-2 py-0.5 rounded bg-bg-primary hover:text-accent transition-colors border border-border-subtle"
            title="Expand All"
          >
            All
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-0.5 rounded bg-bg-primary hover:text-accent transition-colors border border-border-subtle"
            title="Collapse All"
          >
            Min
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div className="p-3 border-b border-border-subtle bg-bg-primary/40">
        <div className="relative">
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Filter lessons..."
            className="w-full bg-bg-primary border border-border-subtle rounded px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1.5 text-text-muted hover:text-text-primary text-xs"
              aria-label="Clear filter"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Modules List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar" aria-label="Curriculum Navigation">
        {filteredModules.map(module => {
          const isOpen = filterQuery.trim() ? true : Boolean(expandedModules[module.id]);
          const trackStyle = trackColors[module.track] || trackColors.core;
          const completedCount = module.lessons.filter(l => completedMap.get(l.slug)).length;
          const totalCount = module.lessons.length;
          const isModuleComplete = totalCount > 0 && completedCount === totalCount;

          return (
            <div
              key={module.id}
              className="rounded border border-border-subtle/70 bg-bg-primary/30 overflow-hidden"
            >
              {/* Module Header / Toggle */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-2.5 text-left hover:bg-bg-primary/60 transition-colors group focus:outline-none focus:bg-bg-primary/80"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-6 rounded-sm ${
                      module.track === 'red'
                        ? 'bg-rose-500'
                        : module.track === 'blue'
                        ? 'bg-blue-500'
                        : module.track === 'purple'
                        ? 'bg-purple-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                        M{module.orderIndex}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${trackStyle.badge}`}
                      >
                        {module.track}
                      </span>
                      {module.locked === true && (
                        <Lock className="w-2.5 h-2.5 text-amber-500" aria-hidden="true" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-text-primary group-hover:text-accent truncate transition-colors">
                      {module.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-mono ${
                      isModuleComplete ? 'text-emerald-400 font-bold' : 'text-text-muted'
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Lessons Sublist */}
              {isOpen && (
                <div className="border-t border-border-subtle/50 bg-bg-secondary/40 py-1 pl-3 pr-1.5 space-y-0.5">
                  {/* Module link */}
                  <Link
                    to={`/courses/teaming/modules/${module.slug}`}
                    onClick={onMobileClose}
                    className="block px-2 py-1 text-[11px] font-mono text-text-muted hover:text-accent hover:underline mb-1"
                  >
                    ↳ View Module Overview & Cheat Sheet →
                  </Link>

                  {module.lessons.map(lesson => {
                    const isActive = lesson.slug === currentLessonSlug;
                    const isCompleted = completedMap.get(lesson.slug);
                    const hasLab = lesson.sections.some(s => s.type === 'lab');
                    const hasQuiz = lesson.sections.some(s => s.type === 'quiz');
                    const lessonLocked = lesson.locked === true;

                    return (
                      <Link
                        key={lesson.slug}
                        to={`/courses/teaming/lessons/${lesson.slug}`}
                        onClick={onMobileClose}
                        className={`group flex items-start gap-2 p-1.5 rounded text-xs transition-colors ${
                          isActive
                            ? 'bg-accent/15 text-accent font-semibold border-l-2 border-accent'
                            : lessonLocked
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
                        }`}
                        aria-disabled={lessonLocked}
                      >
                        {/* Checkbox/lock icon */}
                        <span
                          className={`mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                            isCompleted
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : lessonLocked
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                              : 'border-border-subtle text-transparent group-hover:border-text-muted'
                          }`}
                          title={isCompleted ? 'Completed' : lessonLocked ? 'Locked' : 'Not completed'}
                        >
                          {isCompleted ? '✓' : lessonLocked ? (
                            <Lock className="w-3 h-3" aria-hidden="true" />
                          ) : ''}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            {lessonLocked && <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" aria-hidden="true" />}
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-text-muted">
                            <span>{lesson.estimatedMinutes.total}m</span>
                            {hasLab && (
                              <span className="text-cyan-400 font-semibold">LAB</span>
                            )}
                            {hasQuiz && (
                              <span className="text-amber-400 font-semibold">QUIZ</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Quick Links */}
      <div className="p-3 border-t border-border-subtle bg-bg-primary/50 space-y-1 text-xs font-mono">
        <Link
          to="/courses/teaming/resources"
          onClick={onMobileClose}
          className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg-primary text-text-secondary hover:text-accent transition-colors"
        >
          <span>📁 Resource Library</span>
          <span className="text-text-muted text-[10px]">Templates</span>
        </Link>
        <Link
          to="/courses/teaming/glossary"
          onClick={onMobileClose}
          className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg-primary text-text-secondary hover:text-accent transition-colors"
        >
          <span>📖 Course Glossary</span>
          <span className="text-text-muted text-[10px]">40+ Terms</span>
        </Link>
        <Link
          to="/courses/teaming/capstone"
          onClick={onMobileClose}
          className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg-primary text-text-secondary hover:text-accent transition-colors"
        >
          <span>🎯 Capstone Project</span>
          <span className="text-accent text-[10px]">Meridian</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative w-4/5 max-w-xs h-full bg-bg-secondary z-10 shadow-2xl flex flex-col">
            <div className="p-3 border-b border-border-subtle flex justify-end bg-bg-primary">
              <button
                onClick={onMobileClose}
                className="text-text-muted hover:text-text-primary p-1 text-sm font-mono"
                aria-label="Close menu"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
