import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Sparkles, BookOpen, Clock } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

interface FieldNoteTopic {
  title: string;
  category: 'Security Engineering' | 'Systems Engineering' | 'AI Engineering';
  categoryKey: 'security' | 'systems' | 'ai';
  summary: string;
}

const categories = [
  {
    key: 'security',
    label: 'Security Engineering',
    desc: 'Practical observations on vulnerability assessment, application security, security research, and defensive engineering.',
    icon: Shield,
  },
  {
    key: 'systems',
    label: 'Systems Engineering',
    desc: 'Technical notes on infrastructure, deployment, databases, observability, and application reliability.',
    icon: Server,
  },
  {
    key: 'ai',
    label: 'AI Engineering',
    desc: 'Research and practical lessons on AI applications, agent workflows, and responsible automation.',
    icon: Sparkles,
  },
] as const;

const fieldNotesList: FieldNoteTopic[] = [
  // Security Engineering
  {
    title: 'From Scanner Output to a Validated Security Finding',
    category: 'Security Engineering',
    categoryKey: 'security',
    summary: 'Moving beyond automated tool noise to confirm reachability, test business logic, and document verified risk with repeatable reproduction steps.',
  },
  {
    title: 'How I Approach an Application Security Assessment',
    category: 'Security Engineering',
    categoryKey: 'security',
    summary: 'A methodical playbook for mapping authorization boundaries, inspecting API endpoints, and evaluating trust assumptions in client-server apps.',
  },
  {
    title: 'Understanding Vulnerability Severity Beyond the Score',
    category: 'Security Engineering',
    categoryKey: 'security',
    summary: 'Why generic CVSS numbers often fail to capture contextual business impact, network access preconditions, and defense-in-depth mitigations.',
  },
  {
    title: 'Building Useful Detection Rules',
    category: 'Security Engineering',
    categoryKey: 'security',
    summary: 'Tuning SIEM logic and Sigma rules against adversary techniques while aggressively filtering benign administrative telemetry.',
  },
  {
    title: 'Lessons from Security Testing in Controlled Environments',
    category: 'Security Engineering',
    categoryKey: 'security',
    summary: 'Observing exploit execution in sandboxed environments to verify containment, assess blast radius, and refine blue-team detections.',
  },

  // Systems Engineering
  {
    title: 'Understanding the Network Path Behind a Web Application',
    category: 'Systems Engineering',
    categoryKey: 'systems',
    summary: 'Traces through DNS resolution, reverse proxy termination, systemd socket activation, and packet routing down to the container namespace.',
  },
  {
    title: 'Designing a Cross-Platform Database Replication Workflow',
    category: 'Systems Engineering',
    categoryKey: 'systems',
    summary: 'Handling collation discrepancies, WAL configuration, and automated failover scripts across heterogeneous Windows Server and Rocky Linux hosts.',
  },
  {
    title: 'Debugging a Deployment That Works Locally',
    category: 'Systems Engineering',
    categoryKey: 'systems',
    summary: 'Isolating subtle environment mismatches: cgroup differences, permission boundaries, missing environment variables, and network bridge policies.',
  },
  {
    title: 'Building Observability for Self-Hosted Systems',
    category: 'Systems Engineering',
    categoryKey: 'systems',
    summary: 'Setting up Prometheus, Loki, Promtail, and cAdvisor with resource ceilings that avoid exhausting the monitored workloads.',
  },
  {
    title: 'What Reliable Internal Tools Need Beyond Working Code',
    category: 'Systems Engineering',
    categoryKey: 'systems',
    summary: 'Audit logging, graceful degradation, sane retry backoffs, and role-based access control for tools that operations teams depend on daily.',
  },

  // AI Engineering
  {
    title: 'Building an AI Agent Is Easy. Trusting Its Actions Is Harder.',
    category: 'AI Engineering',
    categoryKey: 'ai',
    summary: 'Engineering defensive runtime wrappers, tool calling privilege sandboxes, and verification layers to prevent runaway autonomous executions.',
  },
  {
    title: 'Evaluating AI Systems Beyond Successful Demonstrations',
    category: 'AI Engineering',
    categoryKey: 'ai',
    summary: 'Benchmarking edge-case hallucinations, adversarial prompts, deterministic reproducibility, and latency metrics across production workflows.',
  },
  {
    title: 'Designing Permission Boundaries for AI Agents',
    category: 'AI Engineering',
    categoryKey: 'ai',
    summary: 'Applying the principle of least privilege to LLM tool execution: read-only tokens, human-in-the-loop gates, and rate-limited API keys.',
  },
  {
    title: 'Where AI Automation Needs Human Judgment',
    category: 'AI Engineering',
    categoryKey: 'ai',
    summary: 'Categorizing tasks into high-confidence automations versus high-consequence interventions that require deliberate human sign-off.',
  },
  {
    title: 'Reducing Unverified Claims in AI-Assisted Workflows',
    category: 'AI Engineering',
    categoryKey: 'ai',
    summary: 'Grounding LLM outputs in verified vector context, source attribution, and strict JSON schema enforcement.',
  },
];

export default function JournalSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredNotes = activeCategory === 'all'
    ? fieldNotesList
    : fieldNotesList.filter((note) => note.categoryKey === activeCategory);

  return (
    <section id="field-notes" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          10 — Field Notes
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Field Notes
        </h2>
        <p className="font-mono text-sm text-accent mt-2 font-medium">
          Build. Break. Understand. Document. Improve.
        </p>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-3xl mt-4 leading-relaxed font-sans">
          These notes represent an ongoing practice of learning through implementation, investigation, and technical experimentation across security, systems, and AI.
        </p>
      </motion.div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(isSelected ? 'all' : cat.key)}
              className={`p-5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-accent/10 border-accent text-text-primary shadow-sm'
                  : 'bg-bg-secondary border-border-subtle text-text-secondary hover:border-border-hover'
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <Icon3D icon={Icon} size="sm" glowColor="#C8FF00" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {cat.label}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed font-sans">
                {cat.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter indicator */}
      <div className="flex items-center justify-between gap-4 mb-6 text-xs font-mono text-text-muted">
        <span>Showing {filteredNotes.length} research topics</span>
        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="text-accent underline hover:text-white"
          >
            Show all topics
          </button>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note, idx) => (
          <motion.article
            key={note.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }}
            className="p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-bg-primary border border-border-subtle">
                  {note.category}
                </span>
                <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Planned Topic
                </span>
              </div>

              <h3 className="font-sans font-bold text-base text-text-primary group-hover:text-accent transition-colors duration-200 mb-2.5 leading-snug">
                {note.title}
              </h3>

              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                {note.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-border-subtle/60 flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                <span>Field Documentation</span>
              </span>
              <span className="text-[10px] uppercase text-text-muted">Research In Progress</span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Ethos notice */}
      <div className="mt-10 p-5 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs font-sans text-text-muted leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p>
          <span className="font-mono text-text-primary font-bold mr-1.5">Publication Integrity:</span>
          Articles are published only after thorough lab replication, peer validation, or live deployment.
        </p>
        <span className="font-mono text-accent text-[11px] shrink-0">
          Build. Break. Understand. Document. Improve.
        </span>
      </div>
    </section>
  );
}
