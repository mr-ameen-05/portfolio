import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const CourseBreadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className="py-2.5 px-4 sm:px-6 glass-panel-subtle border-b border-white/5 text-xs font-mono text-text-muted flex items-center gap-2 overflow-x-auto whitespace-nowrap backdrop-blur-md"
    >
      <Link 
        to="/" 
        className="hover:text-text-primary transition-colors flex items-center gap-1 shrink-0"
        title="Return to portfolio home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Portfolio Home</span>
      </Link>

      <ChevronRight className="w-3 h-3 text-border-subtle shrink-0" aria-hidden="true" />

      <Link 
        to="/courses/teaming" 
        className="hover:text-cyan-400 transition-colors shrink-0"
      >
        Teaming Course
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-border-subtle shrink-0" aria-hidden="true" />
            {isLast || !item.path ? (
              <span className="text-text-primary font-medium truncate max-w-[220px] sm:max-w-xs" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="hover:text-cyan-400 transition-colors truncate max-w-[150px] sm:max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
