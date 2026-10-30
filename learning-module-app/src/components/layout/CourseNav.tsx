import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Shield, BookOpen, FileText, Bookmark, Award, Menu, X, ArrowLeft, LogOut, User } from 'lucide-react';
import { StorageBadge } from './StorageBadge';
import { CourseSearchModal } from '../search/CourseSearchModal';
import { progressService } from '../../services/progressService';
import { useLearner } from '../../context/LearnerContext';
import { PORTFOLIO_URL } from '../../config/site.config';

export const CourseNav: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useLearner();

  const stats = progressService.getCourseCompletionStats();

  const navLinks = [
    { label: 'Overview', path: '/courses/teaming', icon: BookOpen },
    { label: 'Orientation', path: '/courses/teaming/start', icon: Shield },
    { label: 'Resources', path: '/courses/teaming/resources', icon: FileText },
    { label: 'Glossary', path: '/courses/teaming/glossary', icon: Bookmark },
    { label: 'Capstone', path: '/courses/teaming/capstone', icon: Award },
    { label: 'My Progress', path: '/courses/teaming/progress', icon: null },
  ];

  const isActive = (path: string) => {
    if (path === '/courses/teaming') {
      return location.pathname === '/courses/teaming';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-primary/95 backdrop-blur-md">
        {/* Top bar */}
        <div className="h-16 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Back to portfolio & course title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a 
              href={PORTFOLIO_URL}
              className="text-text-muted hover:text-text-primary p-2 rounded hover:bg-white/5 transition-colors shrink-0"
              title="Return to main portfolio"
              aria-label="Return to main portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div className="h-4 w-px bg-border-subtle shrink-0" aria-hidden="true" />
            <Link to="/courses/teaming" className="flex items-center gap-2 min-w-0 group">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:animate-ping shrink-0" />
              <div className="truncate">
                <span className="font-display font-bold text-sm text-text-primary group-hover:text-cyan-400 transition-colors block truncate">
                  Practical Cybersecurity
                </span>
                <span className="font-mono text-[10px] text-text-muted block truncate">
                  Red, Blue & Purple Teaming
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Course section navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-mono uppercase tracking-wider transition-colors py-1 border-b-2 ${
                    active
                      ? 'border-cyan-400 text-cyan-400 font-semibold'
                      : 'border-transparent text-text-muted hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="/privacy.html"
              className="text-xs font-mono uppercase tracking-wider transition-colors py-1 border-b-2 border-transparent text-text-muted hover:text-text-primary"
            >
              Privacy
            </a>
            <a
              href="/terms.html"
              className="text-xs font-mono uppercase tracking-wider transition-colors py-1 border-b-2 border-transparent text-text-muted hover:text-text-primary"
            >
              Terms
            </a>
            <a
              href="https://buymeacoffee.com/aiameen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider transition-colors py-1 border-b-2 border-transparent text-text-muted hover:text-text-primary"
            >
              ☕ Support
            </a>
          </nav>

          {/* Right: Search, Storage badge & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-subtle hover:border-cyan-500/40 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
              aria-label="Open course search dialog"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search...</span>
              <kbd className="text-[10px] bg-bg-primary px-1.5 py-0.5 rounded border border-border-subtle text-text-muted">
                /
              </kbd>
            </button>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded text-text-muted hover:text-text-primary"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Learner identity + sign out */}
            {profile && (
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-bg-secondary border border-border-subtle text-[11px] font-mono">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-text-secondary max-w-[140px] truncate" title={profile.name}>
                  {profile.name}
                </span>
                <button
                  onClick={signOut}
                  className="p-1 -mr-1 rounded hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                  title="Sign out / switch learner"
                  aria-label="Sign out or switch learner"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Storage status badge */}
            <StorageBadge isServerSynced={profile?.source === 'server'} className="hidden md:inline-flex" />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-text-muted hover:text-text-primary"
              aria-label={mobileMenuOpen ? 'Close course menu' : 'Open course menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Global Progress Bar Strip */}
        <div 
          className="w-full bg-bg-secondary h-1 overflow-hidden" 
          role="progressbar" 
          aria-valuenow={stats.percentage} 
          aria-valuemin={0} 
          aria-valuemax={100}
          aria-label={`Course progress: ${stats.completedRequired} of ${stats.totalRequired} lessons completed (${stats.percentage}%)`}
        >
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-bg-primary border-b border-border-subtle px-5 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
            {/* Top link to portfolio */}
            <a
              href={PORTFOLIO_URL}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-bg-secondary border border-border-subtle text-xs font-mono text-accent hover:border-accent transition-colors font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main Portfolio</span>
            </a>

            <div className="flex flex-col gap-2 py-3 border-y border-border-subtle">
              {profile && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-text-secondary">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="max-w-[180px] truncate">{profile.name}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="p-1.5 rounded hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                    title="Sign out / switch learner"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-text-muted">
                  Progress: {stats.completedRequired}/{stats.totalRequired} Lessons ({stats.percentage}%)
                </span>
                <StorageBadge isServerSynced={profile?.source === 'server'} />
              </div>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] px-3 rounded-lg text-sm font-mono uppercase tracking-wider transition-colors ${
                  isActive(link.path)
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold border-l-2 border-cyan-400'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border-subtle space-y-1">
              <a
                href="/privacy.html"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[40px] px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors text-text-muted hover:text-text-primary"
              >
                Privacy Policy
              </a>
              <a
                href="/terms.html"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[40px] px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors text-text-muted hover:text-text-primary"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="https://buymeacoffee.com/aiameen"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[40px] px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors text-accent hover:underline font-semibold"
              >
                ☕ Buy me a coffee
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <CourseSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
