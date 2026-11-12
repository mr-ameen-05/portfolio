import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Terminal, 
  Crosshair, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Flame, 
  Filter, 
  Bell, 
  Youtube, 
  Instagram, 
  Github, 
  Linkedin,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { LEARNING_PATHS, COURSES_CATALOG, CourseItem, LearningPath } from '../data/learningPathsData';
import { SITE } from '../config/site.config';
import LaserInterlockDivider from '../components/scroll/LaserInterlockDivider';

export default function LearnAndGrowPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [expandedPathId, setExpandedPathId] = useState<string | null>(LEARNING_PATHS[0].id);
  const [notifyName, setNotifyName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyExperience, setNotifyExperience] = useState('Beginner');
  const [notifyGoals, setNotifyGoals] = useState('');
  const [notifyCourse, setNotifyCourse] = useState(COURSES_CATALOG[1]?.title || 'All Courses');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredCourses = selectedTrack === 'all' 
    ? COURSES_CATALOG 
    : COURSES_CATALOG.filter(c => c.primaryTrack.toLowerCase().includes(selectedTrack.toLowerCase()));

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim() || !notifyName.trim()) {
      setErrorMessage('Please provide both your name and email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/course-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: notifyName.trim(),
          email: notifyEmail.trim(),
          course: notifyCourse,
          track: selectedTrack !== 'all' ? selectedTrack : 'Cybersecurity & Engineering',
          experience: notifyExperience,
          goals: notifyGoals.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setReferenceId(data.reference || 'CRS-QUEUED');
      setNotifySuccess(true);
      setNotifyEmail('');
      setNotifyName('');
      setNotifyGoals('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPathIcon = (name: LearningPath['iconName']) => {
    switch (name) {
      case 'Shield': return Shield;
      case 'Terminal': return Terminal;
      case 'Crosshair': return Crosshair;
      case 'Sparkles': return Sparkles;
      case 'Layers': return Layers;
      default: return Cpu;
    }
  };

  return (
    <div className="relative min-h-screen text-text-primary">
      {/* 01. Hero & Philosophy Header */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-8 pb-16 max-w-7xl mx-auto">
        {/* Glow ambient background aura */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-accent/10 via-cyan-500/10 to-accent/5 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(200,255,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>LEARN &amp; GROW PLATFORM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-white/80 font-normal">OPERATIVE ACADEMY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-white leading-[1.1]">
            Engineering &amp; Security Mastery,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-300 to-cyan-400">
              Forged in Production.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed max-w-3xl">
            The bridge between theory and battle-tested operational capability. Explore structured role-based 
            roadmaps—from <strong className="text-text-primary">Cybersecurity Analyst</strong>, <strong className="text-text-primary">SOC Operations</strong>, and <strong className="text-text-primary">VAPT</strong> to revolutionary <strong className="text-accent">Vibe Coding</strong> and <strong className="text-text-primary">Forward Deployed Engineering (FDE)</strong>.
          </p>

          {/* Social Channels Uplink Bar (UI/UX Placeholders for Future) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted mr-1">
              Social Uplinks:
            </span>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-mono cursor-default"
              title="YouTube Channel (Coming Soon)"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Channel</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 uppercase text-text-muted">
                Soon
              </span>
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30 text-xs font-mono cursor-default"
              title="Instagram Profile (Coming Soon)"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram Profile</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 uppercase text-text-muted">
                Soon
              </span>
            </div>
            <a
              href={SITE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/10 text-xs font-mono transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono transition-all"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* 02. Interactive Role-Based Learning Paths */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>STRUCTURED CAREER ROADMAPS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white">
              Targeted Learning Paths
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-text-muted max-w-md">
            Click any career path below to inspect its multi-stage syllabus, technical skill requirements, and curriculum milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Path Selector Tabs (Left Col) */}
          <div className="lg:col-span-5 space-y-3">
            {LEARNING_PATHS.map((path) => {
              const IconComp = getPathIcon(path.iconName);
              const isSelected = expandedPathId === path.id;

              return (
                <button
                  key={path.id}
                  onClick={() => setExpandedPathId(path.id)}
                  type="button"
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#121218] border-accent/60 shadow-[0_0_20px_rgba(200,255,0,0.15)] ring-1 ring-accent/30'
                      : 'bg-bg-secondary/40 border-border-subtle hover:border-white/20 hover:bg-bg-secondary/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-accent/15 border-accent text-accent' : 'bg-white/5 border-white/10 text-text-muted'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-sans font-bold text-sm text-text-primary truncate">
                            {path.title}
                          </h3>
                        </div>
                        <p className="font-mono text-[11px] text-text-muted truncate">
                          {path.role}
                        </p>
                      </div>
                    </div>

                    <span 
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                        path.status === 'Active Track'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {path.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-text-muted border-t border-white/5 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-text-muted" />
                      {path.estimatedDuration}
                    </span>
                    <span className="text-text-secondary">
                      {path.totalCourses} Courses Included
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Path Syllabus Display (Right Col) */}
          <div className="lg:col-span-7">
            {(() => {
              const activePath = LEARNING_PATHS.find(p => p.id === expandedPathId) || LEARNING_PATHS[0];
              const IconComp = getPathIcon(activePath.iconName);

              return (
                <div className="h-full rounded-2xl border border-border-subtle bg-[#0D0D12]/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/40 text-accent flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(200,255,0,0.2)]">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold block">
                            {activePath.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-sans font-bold text-white">
                            {activePath.title}
                          </h3>
                        </div>
                      </div>

                      <div className="font-mono text-xs text-text-muted">
                        <span>Target: </span>
                        <span className="text-accent font-semibold">{activePath.estimatedDuration}</span>
                      </div>
                    </div>

                    <p className="text-sm font-sans text-text-secondary leading-relaxed">
                      {activePath.summary}
                    </p>

                    {/* Core Pillars */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                        Core Competency Pillars:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activePath.corePillars.map((pillar, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-text-primary"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="truncate">{pillar}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Roadmap Stages */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                        Progression Stages:
                      </h4>
                      <div className="space-y-3">
                        {activePath.roadmapStages.map((stage) => (
                          <div 
                            key={stage.stage}
                            className="p-3.5 rounded-xl bg-bg-secondary/60 border border-border-subtle space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-accent text-black font-mono text-[10px] font-bold flex items-center justify-center">
                                  {stage.stage}
                                </span>
                                <h5 className="font-sans font-bold text-xs text-text-primary">
                                  {stage.title}
                                </h5>
                              </div>
                              {stage.courseRef && (
                                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">
                                  Course Live
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-sans text-text-muted leading-relaxed pl-7">
                              {stage.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                              {stage.skills.map((skill, sIdx) => (
                                <span 
                                  key={sIdx}
                                  className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-text-secondary border border-white/5"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-mono text-text-muted">
                      Targeted Audience: <span className="text-text-primary">{activePath.targetAudience}</span>
                    </div>

                    {activePath.id === 'path-cyber-analyst' ? (
                      <a
                        href={SITE.coursesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(200,255,0,0.3)] active:scale-95"
                      >
                        <span>Launch Live Interactive Course</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <a
                        href="#course-notify"
                        onClick={() => setNotifyCourse(activePath.title)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-accent hover:text-black text-text-primary font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Join Development Priority List</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 03. All Courses Catalog (Live & In Development) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>CURRICULUM REPOSITORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white">
              Courses &amp; Interactive Solutions
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-bg-secondary/60 border border-border-subtle">
            {['all', 'cybersecurity', 'vibe-coding', 'engineering'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTrack(cat)}
                className={`px-3 py-1 rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  selectedTrack === cat
                    ? 'bg-accent text-black font-bold shadow-[0_0_10px_rgba(200,255,0,0.3)]'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {cat === 'all' ? 'All Modules' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isLive = course.status === 'live';

            return (
              <div
                key={course.id}
                className="rounded-2xl border border-border-subtle bg-[#0D0D12]/90 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-accent/40 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] group"
              >
                <div className="space-y-4">
                  {/* Status & Category Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span 
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border flex items-center gap-1.5 ${
                        isLive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      {isLive ? 'Live & Interactive' : `In Development (${course.progressPercent}%)`}
                    </span>

                    <span className="text-[10px] font-mono text-text-muted uppercase">
                      {course.level}
                    </span>
                  </div>

                  {/* Course Title & Tagline */}
                  <div>
                    <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
                      {course.primaryTrack}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-white group-hover:text-accent transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs font-sans text-text-muted mt-2 line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Progress bar if in development */}
                  {!isLive && course.progressPercent && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-text-muted">
                        <span>Curriculum Development</span>
                        <span className="text-amber-400">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-accent rounded-full transition-all duration-500"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Highlights list */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {course.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] font-sans text-text-secondary">
                        <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Deliverables Pills */}
                  {course.deliverables && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {course.deliverables.slice(0, 2).map((del, dIdx) => (
                        <span 
                          key={dIdx}
                          className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-text-muted border border-white/5"
                        >
                          {del}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 border-t border-white/10 mt-6">
                  {isLive ? (
                    <a
                      href={course.externalUrl || SITE.coursesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-accent hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(200,255,0,0.25)]"
                    >
                      <span>Start Learning (11 Modules)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href="#course-notify"
                      onClick={() => setNotifyCourse(course.title)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary font-mono text-xs font-semibold uppercase tracking-wider transition-all border border-white/10"
                    >
                      <Bell className="w-3.5 h-3.5 text-accent" />
                      <span>Notify on Release</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 04. Early Access & Course Notification Banner */}
      <section id="course-notify" className="px-4 sm:px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-accent/30 bg-gradient-to-b from-[#13131A] to-[#0A0A0F] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs">
              <Bell className="w-3.5 h-3.5" />
              <span>EARLY ACCESS INVITATION</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-sans font-bold text-white">
              Get Notified When Next-Gen Courses Drop.
            </h2>

            <p className="text-sm font-sans text-text-secondary leading-relaxed">
              New modules in <strong className="text-text-primary">Vibe Coding for Security</strong>, <strong className="text-text-primary">SOC Incident Triage</strong>, and <strong className="text-text-primary">Modern VAPT</strong> are rolling out iteratively with contained sandboxes and free starter guides.
            </p>

            {notifySuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs space-y-3">
                <div className="flex items-center gap-2.5 font-bold text-sm text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Course Enquiry & Priority Access Queued!</span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Thank you! An operational confirmation receipt has been dispatched to your email. You will receive release milestones, early lab invites, and syllabus updates for <strong className="text-white">{notifyCourse}</strong>.
                </p>
                {referenceId && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-emerald-500/30 text-[11px]">
                    <span className="text-text-muted">REFERENCE TICKET:</span>
                    <span className="text-accent font-bold tracking-widest">{referenceId}</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="pt-2 space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={notifyName}
                      onChange={(e) => setNotifyName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">Target Course</label>
                    <select
                      value={notifyCourse}
                      onChange={(e) => setNotifyCourse(e.target.value)}
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono cursor-pointer"
                    >
                      {COURSES_CATALOG.map((c) => (
                        <option key={c.id} value={c.title} className="bg-[#121218] text-white">
                          {c.title}
                        </option>
                      ))}
                      <option value="All Future Courses & Paths" className="bg-[#121218] text-white">
                        All Future Courses &amp; Paths
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">Experience Level</label>
                    <select
                      value={notifyExperience}
                      onChange={(e) => setNotifyExperience(e.target.value)}
                      className="w-full bg-black/60 border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono cursor-pointer"
                    >
                      <option value="Beginner / Student" className="bg-[#121218] text-white">Beginner / Student</option>
                      <option value="Mid-Level Practitioner (1-3 yrs)" className="bg-[#121218] text-white">Mid-Level Practitioner (1-3 yrs)</option>
                      <option value="Senior Engineer / Lead (4+ yrs)" className="bg-[#121218] text-white">Senior Engineer / Lead (4+ yrs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-muted uppercase mb-1">Learning Goals / Background (Optional)</label>
                  <input
                    type="text"
                    value={notifyGoals}
                    onChange={(e) => setNotifyGoals(e.target.value)}
                    placeholder="e.g. Preparing for SOC Analyst transition, want hands-on labs..."
                    className="w-full bg-black/60 border border-border-subtle rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(200,255,0,0.3)] shrink-0 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Submit Course Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <p className="text-[11px] font-mono text-text-muted">
              Zero spam policy. Only high-signal course curriculum updates and lab releases.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
