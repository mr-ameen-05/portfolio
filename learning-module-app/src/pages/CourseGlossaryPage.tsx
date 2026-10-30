import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { GLOSSARY_ITEMS } from '../data/glossaryData';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { Track } from '../types/course.types';
import { StateEmpty } from '../components/common/CourseStates';
import { getLessonBySlug } from '../data/modulesManifest';

export const CourseGlossaryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const trackBadges: Record<Track, string> = {
    core: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  // Alphabet letters available
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    GLOSSARY_ITEMS.forEach(t => {
      const first = t.term[0].toUpperCase();
      if (/[A-Z]/.test(first)) letters.add(first);
    });
    return Array.from(letters).sort();
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_ITEMS.filter(item => {
      const matchTrack = selectedTrack === 'all' || item.track === selectedTrack;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.term.toLowerCase().includes(q) ||
        (item.acronym && item.acronym.toLowerCase().includes(q)) ||
        item.definition.toLowerCase().includes(q);

      return matchTrack && matchQuery;
    });
  }, [searchQuery, selectedTrack]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <CourseBreadcrumb
          items={[
            { label: 'Security Glossary' },
          ]}
        />

        {/* Page Header */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-xs font-mono text-accent">
            <span>📖 Reference Vocabulary</span>
            <span>•</span>
            <span>{GLOSSARY_ITEMS.length} Industry Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-text-primary">
            Cybersecurity & Teaming Glossary
          </h1>
          <p className="text-sm text-text-secondary max-w-3xl leading-relaxed">
            Standard definitions, acronyms, and practical context across offensive, defensive, and collaborative security domains.
          </p>
        </section>

        {/* Filter and Search Bar */}
        <section className="space-y-4 p-4 rounded-xl border border-border-subtle bg-bg-secondary/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Track Selector */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {['all', 'core', 'red', 'blue', 'purple'].map(track => (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors border ${
                    selectedTrack === track
                      ? 'bg-accent text-black font-bold border-accent'
                      : 'bg-bg-primary text-text-secondary border-border-subtle hover:text-text-primary'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search definitions or acronyms..."
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-2 text-text-muted hover:text-text-primary text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick A-Z Jump Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-subtle/50 text-xs font-mono text-text-muted">
            <span className="text-[10px] uppercase tracking-wider mr-1">Alphabet:</span>
            {availableLetters.map(letter => (
              <button
                key={letter}
                onClick={() => handleSearchChange(letter)}
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded flex items-center justify-center transition-colors text-xs font-mono ${
                  searchQuery.toUpperCase() === letter
                    ? 'bg-accent text-black font-bold'
                    : 'hover:bg-bg-primary hover:text-accent bg-bg-primary/40'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </section>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs font-mono text-text-muted px-1">
          <span>Showing {filteredTerms.length} terms</span>
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="text-accent hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Glossary Terms Grid */}
        {filteredTerms.length === 0 ? (
          <StateEmpty
            title="No Glossary Terms Found"
            description={`No terms matched your query "${searchQuery}".`}
            actionLabel="Reset Search"
            onAction={() => handleSearchChange('')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map(item => {
              const badgeStyle = trackBadges[item.track] || trackBadges.core;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="rounded-xl border border-border-subtle bg-bg-secondary/30 p-5 space-y-3 hover:border-accent/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-sans text-text-primary">
                          {item.term}
                        </h3>
                        {item.acronym && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-primary text-accent border border-border-subtle">
                            {item.acronym}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${badgeStyle}`}>
                        {item.track}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {item.definition}
                    </p>
                  </div>

                  {/* Related Lessons */}
                  {item.relatedLessonSlugs && item.relatedLessonSlugs.length > 0 && (
                    <div className="pt-2 border-t border-border-subtle/50 flex flex-wrap items-center gap-1.5 text-xs font-mono">
                      <span className="text-[10px] text-text-muted uppercase">Related Lessons:</span>
                      {item.relatedLessonSlugs.map(slug => {
                        const found = getLessonBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            to={`/courses/teaming/lessons/${slug}`}
                            className="text-[11px] px-2 py-0.5 rounded bg-bg-primary hover:bg-accent/10 hover:text-accent text-text-secondary border border-border-subtle transition-colors truncate max-w-xs"
                          >
                            ↳ {found?.lesson.title || slug}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
