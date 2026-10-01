import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type ProjectCategory = 'ai' | 'software' | 'pentest' | 'labs' | 'security' | 'research';

interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: string;
  access: string;
  desc: string;
  tech: string[];
  flagship?: boolean;
}

const FILTER_BUTTONS = ['ALL', 'SECURITY', 'AI', 'SOFTWARE', 'PENTEST', 'LABS', 'RESEARCH'] as const;
type FilterButton = (typeof FILTER_BUTTONS)[number];

const projects: Project[] = [
  {
    id: 'ai-soc-analyst',
    title: 'AI-Assisted SOC Analyst',
    category: 'ai',
    status: 'RESEARCH',
    access: 'Case study',
    desc: 'Exploring how a locally hosted language model can assist security operations workflows — from alert triage to investigation.',
    tech: ['Local LLM', 'SOC', 'Wazuh', 'Python'],
    flagship: true,
  },
  {
    id: 'saas-application-engineering',
    title: 'SaaS Application Engineering',
    category: 'software',
    status: 'IN PROGRESS',
    access: 'Live demo',
    desc: 'Building functional applications with architecture, security controls, testing, and deployment considerations.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'security-assessment-methodology',
    title: 'Security Assessment Methodology',
    category: 'pentest',
    status: 'CASE STUDY',
    access: 'Sanitized report',
    desc: 'Web application and network security assessments with structured methodology, findings, and remediation.',
    tech: ['Burp Suite', 'Nmap', 'Nuclei', 'Linux'],
  },
  {
    id: 'security-labs-ctf-research',
    title: 'Security Labs & CTF Research',
    category: 'labs',
    status: 'OPEN SOURCE',
    access: 'Write-ups',
    desc: 'Understanding security through investigation. Failed hypotheses, evidence collection, and technical discovery.',
    tech: ['Kali Linux', 'Wireshark', 'MITRE ATT&CK'],
  },
  {
    id: 'infrastructure-deployment',
    title: 'Infrastructure & Deployment',
    category: 'security',
    status: 'PRIVATE',
    access: 'Architecture only',
    desc: 'Configuration, deployment pipelines, monitoring, and operational reliability for production systems.',
    tech: ['Docker', 'Linux', 'AWS', 'Git'],
  },
  {
    id: 'ai-agent-security-research',
    title: 'AI Agent Security Research',
    category: 'research',
    status: 'RESEARCH',
    access: 'Field notes',
    desc: 'Investigating AI agent permissions, tool access, prompt injection risks, and human oversight requirements.',
    tech: ['Ollama', 'LLMs', 'Agent Tools'],
  },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterButton>('ALL');

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'ALL') return true;
    return project.category.toUpperCase() === activeFilter;
  });

  return (
    <section id="projects" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-16"
      >
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
          Selected Work / Experiments / Research
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Ideas are interesting.
        </h2>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-muted leading-tight mt-1">
          Working systems are better.
        </h2>
      </motion.div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-12">
        {FILTER_BUTTONS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-200 border ${
                isActive
                  ? 'bg-accent text-bg-primary border-accent font-semibold shadow-sm'
                  : 'bg-bg-secondary text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => {
          const isLive = project.status.toUpperCase() === 'LIVE';

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className={`group flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 ${
                project.flagship ? 'md:col-span-2' : ''
              }`}
            >
              <div>
                {/* Header row: category top-left, status badge top-right */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                    {project.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                      isLive
                        ? 'text-accent border-accent/40 bg-accent/10'
                        : 'text-text-muted border-border-subtle bg-bg-primary'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-sans text-text-primary group-hover:text-accent transition-colors duration-200 mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                  {project.desc}
                </p>
              </div>

              {/* Bottom: Tech tags & Access label */}
              <div className="mt-auto pt-6 border-t border-border-subtle/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-text-muted px-2.5 py-1 rounded bg-bg-primary border border-border-subtle"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary group-hover:text-accent transition-colors duration-200 shrink-0">
                  <span>{project.access}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
