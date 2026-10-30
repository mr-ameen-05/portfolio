import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, X, Shield, Server, Database, Activity, Sparkles, Layers } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

interface Project {
  id: string;
  num: string;
  title: string;
  category: string;
  categoryTag: string;
  tagline: string;
  desc: string;
  tech: string[];
  focusAreas: string[];
  ctaLabel: string;
  isServiceOriented?: boolean;
  demoUrl?: string;
  architectureDetails?: string;
}

const projects: Project[] = [
  {
    id: 'observability-pipeline',
    num: '01',
    title: 'Host & Container Observability Pipeline',
    category: 'Infrastructure & Security',
    categoryTag: 'Infrastructure Engineering · Observability · Security Monitoring',
    tagline: 'Centralized infrastructure metrics and security log aggregation.',
    desc: 'A self-hosted observability environment designed to centralize infrastructure metrics and logs across host and container workloads. The project explores telemetry collection, resource monitoring, log aggregation, and operational visibility using a combination of open-source infrastructure tools.',
    tech: ['Rocky Linux', 'Prometheus', 'Grafana', 'Loki', 'Promtail', 'cAdvisor', 'Podman'],
    focusAreas: [
      'Infrastructure and container monitoring.',
      'Centralized log collection.',
      'Metrics visualization.',
      'Observability architecture.',
      'Operational troubleshooting.',
    ],
    ctaLabel: 'Explore Project',
  },
  {
    id: 'db-replication-engine',
    num: '02',
    title: 'Cross-Platform Database Replication Engine',
    category: 'Database & Systems',
    categoryTag: 'Database Engineering · Systems Reliability',
    tagline: 'Logical replication across heterogeneous Windows Server and Rocky Linux.',
    desc: 'A database synchronization project exploring logical replication between Windows Server and Rocky Linux environments, with an emphasis on data consistency and operational continuity. The implementation addresses the challenges of coordinating database systems across different operating system environments.',
    tech: ['PostgreSQL', 'Windows Server', 'Rocky Linux', 'Bash', 'PowerShell'],
    focusAreas: [
      'Cross-platform database integration.',
      'Replication architecture.',
      'Data consistency verification.',
      'Operational troubleshooting.',
      'Recovery and reliability considerations.',
    ],
    ctaLabel: 'View Architecture',
  },
  {
    id: 'banihal-orb',
    num: '03',
    title: 'Banihal Orb',
    category: 'Full-Stack Platform',
    categoryTag: 'Full-Stack Engineering · Business Operations',
    tagline: 'Unified ticketing, client management, and engineering dispatches.',
    desc: 'A multi-tenant business operations and client support platform designed to bring ticketing, client management, and engineering workflows into a unified environment. The project explores how software can reduce operational friction by connecting business processes with structured issue tracking and workflow automation.',
    tech: ['Python', 'Node.js', 'PostgreSQL', 'Podman', 'systemd', 'NGINX', 'Slack Bolt'],
    focusAreas: [
      'Business workflow design.',
      'Client and issue management.',
      'Backend systems.',
      'Infrastructure deployment.',
      'Engineering workflow integration.',
    ],
    ctaLabel: 'Explore Platform',
  },
  {
    id: 'doctorsloom',
    num: '04',
    title: 'DoctorsLoom',
    category: 'Healthcare Systems',
    categoryTag: 'Full-Stack Engineering · Healthcare Applications',
    tagline: 'Lightweight clinical PWA for outpatient and therapy check-ins.',
    desc: 'A progressive web application concept for outpatient clinics and physiotherapy centers, supporting workflows such as check-ins, electronic health records, and follow-ups. The project focuses on organizing routine operational activities within an accessible web-based platform.',
    tech: ['Node.js', 'Python', 'PostgreSQL', 'NGINX', 'Progressive Web Applications'],
    focusAreas: [
      'Application architecture.',
      'Database-backed workflows.',
      'Web application development.',
      'Healthcare workflow support.',
      'Usability and accessibility.',
    ],
    ctaLabel: 'Explore Project',
  },
  {
    id: 'security-vapt-research',
    num: '05',
    title: 'Security Assessment & Vulnerability Research',
    category: 'Offensive Security',
    categoryTag: 'Application Security · VAPT · Security Research',
    tagline: 'Authorized attack surface analysis and evidence-based remediation.',
    desc: 'Security assessment work focused on understanding application attack surfaces, identifying potential weaknesses, validating findings, and translating technical observations into actionable remediation guidance. Each assessment is conducted within an explicitly authorized scope.',
    tech: ['Burp Suite', 'Nmap', 'Nuclei', 'Wireshark', 'OWASP Top 10', 'Linux CLI'],
    focusAreas: [
      'Application security testing.',
      'Vulnerability validation.',
      'Risk assessment.',
      'Technical evidence collection.',
      'Remediation recommendations.',
      'Retesting and verification.',
    ],
    ctaLabel: 'View Security Research',
    isServiceOriented: true,
  },
  {
    id: 'ai-automation-agents',
    num: '06',
    title: 'AI Engineering & Intelligent Automation',
    category: 'AI & Automation',
    categoryTag: 'AI Engineering · Workflow Automation · Systems Integration',
    tagline: 'Contextual reasoning, permission boundaries, and reliable evaluation.',
    desc: 'Exploring how AI-powered applications and agents can support technical workflows through structured tool integration, contextual reasoning, and controlled execution. The emphasis is on developing useful systems while accounting for unreliable outputs, permission boundaries, and the need for validation.',
    tech: ['LLM APIs', 'Local LLMs', 'Agent Workflows', 'Python', 'Vector Stores', 'Guardrails'],
    focusAreas: [
      'AI application development.',
      'LLM integration.',
      'Agent workflow design.',
      'Tool permissions.',
      'Output evaluation.',
      'Human oversight and reliability.',
    ],
    ctaLabel: 'Explore AI Projects',
    isServiceOriented: true,
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  '01': Activity,
  '02': Database,
  '03': Server,
  '04': Layers,
  '05': Shield,
  '06': Sparkles,
};

const categoryColors: Record<string, string> = {
  '01': '#00D2FF',
  '02': '#4169E1',
  '03': '#22C55E',
  '04': '#EC4899',
  '05': '#EF4444',
  '06': '#A855F7',
};

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          02 — Selected Work
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Selected Work
        </h2>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mt-3 font-sans">
          Proven implementations across telemetry infrastructure, cross-platform replication, business operational software, and rigorous security testing.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, idx) => {
          const IconComponent = categoryIcons[project.num] || Layers;
          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.45, delay: Math.min(idx * 0.06, 0.24), ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/40 transition-all duration-300 group transform-gpu"
            >
              <div>
                {/* Header row: Number and tag */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Icon3D icon={IconComponent} size="sm" glowColor={categoryColors[project.num] || '#C8FF00'} />
                    <span className="font-mono text-xs text-accent font-semibold tracking-wider">
                      {project.num} — {project.category}
                    </span>
                  </div>
                  {project.isServiceOriented ? (
                    <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded border border-border-subtle bg-bg-primary">
                      Service Research
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-accent border border-accent/30 bg-accent/10 px-2 py-0.5 rounded">
                      Production / Lab
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-text-primary group-hover:text-accent transition-colors duration-200 mb-2">
                  {project.title}
                </h3>

                {/* Subtag line */}
                <p className="text-xs font-mono text-text-muted mb-4">
                  {project.categoryTag}
                </p>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                  {project.desc}
                </p>

                {/* Focus Areas List */}
                <div className="mb-6 p-4 rounded-xl bg-bg-primary/70 border border-border-subtle">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-text-primary font-semibold mb-2.5 flex items-center gap-1.5">
                    <IconComponent className="w-3.5 h-3.5 text-accent" /> Focus Areas
                  </p>
                  <ul className="space-y-1.5 text-xs text-text-secondary font-sans">
                    {project.focusAreas.map((area) => (
                      <li key={area} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom: Tech tags & Action */}
              <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] sm:text-[11px] font-mono text-text-muted px-2 py-0.5 rounded bg-bg-primary border border-border-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-text-primary group-hover:text-accent transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <span>{project.ctaLabel}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Note indicator below projects */}
      <div className="mt-8 p-4 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs text-text-muted font-sans leading-relaxed">
        <span className="text-text-primary font-mono font-bold mr-1.5">Project Scope Note:</span>
        The first four entries reflect deployed platforms and lab infrastructure. Security assessment and AI engineering entries are service-oriented portfolios delivered under custom authorizations and NDAs.
      </div>

      {/* Interactive Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overscroll-contain"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-bg-secondary border border-border-hover rounded-2xl p-5 sm:p-8 max-h-[88vh] overflow-y-auto overscroll-contain"
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors touch-manipulation cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <Icon3D
                  icon={categoryIcons[selectedProject.num] || Layers}
                  size="md"
                  glowColor={categoryColors[selectedProject.num] || '#C8FF00'}
                />
                <div>
                  <span className="font-mono text-xs text-accent font-semibold">
                    {selectedProject.num} — {selectedProject.categoryTag}
                  </span>
                  <h3 className="text-2xl font-bold font-sans text-text-primary mt-0.5">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                {selectedProject.desc}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-bold mb-3">
                  Key Architectural &amp; Engineering Focus Areas
                </h4>
                <div className="space-y-2">
                  {selectedProject.focusAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-bg-primary border border-border-subtle text-xs text-text-secondary">
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-primary font-bold mb-2">
                  Technologies Utilized
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded bg-bg-primary border border-border-subtle font-mono text-xs text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-text-muted font-mono">
                  Want architecture details or a live walkthrough?
                </p>
                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded bg-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors text-center"
                >
                  Discuss Project Requirements
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
