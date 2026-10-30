import React, { useState, useMemo } from 'react';
import { COURSE_RESOURCES } from '../data/resourcesData';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { ResourceItem } from '../types/course.types';
import { StateEmpty } from '../components/common/CourseStates';

export const CourseResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const resourceTypes = useMemo(() => {
    const types = new Set<string>();
    COURSE_RESOURCES.forEach(r => types.add(r.type));
    return ['all', ...Array.from(types)];
  }, []);

  const filteredResources = useMemo(() => {
    return COURSE_RESOURCES.filter(r => {
      const matchType = selectedType === 'all' || r.type === selectedType;
      const matchQuery =
        !searchQuery.trim() ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    });
  }, [searchQuery, selectedType]);

  const handleCopy = (res: ResourceItem) => {
    navigator.clipboard.writeText(res.contentMarkdown);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (res: ResourceItem) => {
    const blob = new Blob([res.contentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.downloadFileName || `${res.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <CourseBreadcrumb
          items={[
            { label: 'Resource Library' },
          ]}
        />

        {/* Page Header */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-xs font-mono text-accent">
            <span>📁 Downloadable Assets</span>
            <span>•</span>
            <span>{COURSE_RESOURCES.length} Production Documents</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-text-primary">
            Security Resource Library & Templates
          </h1>
          <p className="text-sm text-text-secondary max-w-3xl leading-relaxed">
            Standard operating procedures, threat modeling worksheets, finding report templates, incident triage cards, and evaluation rubrics used throughout the course. Free to download, copy, and adapt.
          </p>
        </section>

        {/* Filter and Search Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border-subtle bg-bg-secondary/40">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {resourceTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors border ${
                  selectedType === type
                    ? 'bg-accent text-black font-bold border-accent'
                    : 'bg-bg-primary text-text-secondary border-border-subtle hover:text-text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates & worksheets..."
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-text-muted hover:text-text-primary text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <StateEmpty
            title="No Resources Found"
            description={`No templates or documents matched your search "${searchQuery}".`}
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedType('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(res => (
              <div
                key={res.id}
                className="rounded-xl border border-border-subtle bg-bg-secondary/30 p-5 flex flex-col justify-between hover:border-accent/40 transition-colors space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/10 text-accent border border-accent/30 font-semibold">
                      {res.type}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted">
                      {res.fileFormat} • {res.fileSize}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-sans text-text-primary">
                    {res.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {res.description}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle/50 font-mono text-xs">
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="flex-1 min-w-[80px] min-h-[38px] py-1.5 px-3 rounded bg-bg-primary hover:bg-bg-primary/80 border border-border-subtle hover:border-accent text-text-secondary hover:text-text-primary text-center transition-colors flex items-center justify-center"
                  >
                    👁 Preview
                  </button>
                  <button
                    onClick={() => handleCopy(res)}
                    className="flex-1 min-w-[70px] min-h-[38px] py-1.5 px-3 rounded bg-bg-primary hover:bg-bg-primary/80 border border-border-subtle hover:border-accent text-text-secondary hover:text-accent transition-colors flex items-center justify-center"
                    title="Copy to clipboard"
                  >
                    {copiedId === res.id ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button
                    onClick={() => handleDownload(res)}
                    className="flex-1 min-w-[85px] min-h-[38px] py-1.5 px-3 rounded bg-accent/15 hover:bg-accent/25 border border-accent/40 text-accent font-semibold transition-colors flex items-center justify-center"
                    title="Download document file"
                  >
                    💾 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Preview */}
        {previewResource && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewResource(null)}
          >
            <div
              className="bg-bg-secondary border border-border-subtle rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-bg-primary">
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-bold">
                    {previewResource.type} • {previewResource.downloadFileName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-text-primary">
                    {previewResource.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(previewResource)}
                    className="px-2.5 py-1 rounded bg-bg-secondary border border-border-subtle hover:border-accent text-xs font-mono text-text-secondary hover:text-accent"
                  >
                    {copiedId === previewResource.id ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDownload(previewResource)}
                    className="px-2.5 py-1 rounded bg-accent text-black font-bold text-xs font-mono hover:bg-accent/90"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewResource(null)}
                    className="p-1 text-text-muted hover:text-text-primary font-mono text-sm"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 flex-1 overflow-y-auto font-mono text-xs text-text-secondary whitespace-pre-wrap leading-relaxed bg-bg-primary/50">
                {previewResource.contentMarkdown}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
