import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Layers, Bookmark, ArrowRight } from 'lucide-react';
import { searchCourseContent } from '../../data/modulesManifest';
import { GLOSSARY_ITEMS } from '../../data/glossaryData';

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseSearchModal: React.FC<CourseSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = searchCourseContent(query);
  const matchingGlossary = query.trim().length >= 2
    ? GLOSSARY_ITEMS.filter(g => 
        g.term.toLowerCase().includes(query.toLowerCase()) || 
        g.definition.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelect = (link: string) => {
    navigate(link);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-bg-secondary border border-border-subtle rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-bg-primary">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            id="search-modal-title"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lessons, topics, tools, glossary terms..."
            className="w-full bg-transparent text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none"
            aria-label="Search course content"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-primary transition-colors font-mono text-xs"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4">
          {query.trim().length < 2 && (
            <div className="text-center py-8 text-text-muted font-mono text-xs">
              Type at least 2 characters to search across all 11 modules and 40+ glossary terms.
            </div>
          )}

          {query.trim().length >= 2 && results.length === 0 && matchingGlossary.length === 0 && (
            <div className="text-center py-8 text-text-muted font-mono text-xs">
              No matching lessons or terms found for "{query}".
            </div>
          )}

          {/* Lesson & Module matches */}
          {results.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Lessons & Modules ({results.length})
              </p>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r.link)}
                    className="w-full text-left p-3 rounded-lg bg-bg-primary/60 border border-border-subtle hover:border-cyan-500/40 hover:bg-bg-primary transition-all flex items-start justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {r.type === 'module' ? (
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span className="font-display font-medium text-sm text-text-primary group-hover:text-cyan-400 transition-colors">
                          {r.title}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {r.snippet}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted shrink-0 ml-3 bg-bg-secondary px-2 py-0.5 rounded border border-border-subtle">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Glossary Matches */}
          {matchingGlossary.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Glossary Terms ({matchingGlossary.length})
              </p>
              <div className="space-y-2">
                {matchingGlossary.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSelect(`/courses/teaming/glossary?term=${encodeURIComponent(g.term)}`)}
                    className="w-full text-left p-3 rounded-lg bg-bg-primary/60 border border-border-subtle hover:border-accent/40 hover:bg-bg-primary transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Bookmark className="w-3.5 h-3.5 text-accent" />
                        <span className="font-display font-medium text-sm text-text-primary group-hover:text-accent transition-colors">
                          {g.term} {g.acronym ? `(${g.acronym})` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {g.definition}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent shrink-0 ml-3 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-bg-primary border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Press ESC to close</span>
          <span>Practical Cybersecurity: Red, Blue & Purple Teaming</span>
        </div>
      </div>
    </div>
  );
};
