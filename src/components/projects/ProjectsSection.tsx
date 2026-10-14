import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type ProjectCategory = 'healthcare' | 'infrastructure' | 'database' | 'observability';

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

const FILTER_BUTTONS = ['ALL', 'HEALTHCARE', 'INFRASTRUCTURE', 'DATABASE', 'OBSERVABILITY'] as const;
type FilterButton = (typeof FILTER_BUTTONS)[number];

const projects: Project[] = [
  {
    id: 'doctorsloom',
    title: 'DoctorsLoom',
    category: 'healthcare',
    status: 'LIVE',
    access: 'Live demo',
    desc: 'A lightweight Progressive Web App tailored for outpatient clinics and physiotherapy centers to manage check-ins, EHR, and follow-ups.',
    tech: ['Node.js', 'Python', 'PostgreSQL', 'NGINX', 'PWA'],
    flagship: true,
  },
  {
    id: 'banihal-orb',
    title: 'Banihal Orb (orb.banihal.in)',
    category: 'infrastructure',
    status: 'LIVE',
    access: 'Live demo',
    desc: 'Multi-tenant business operations and client support platform combining issue ticketing, client management, and automated engineering dispatches.',
    tech: ['Podman', 'systemd', 'NGINX', 'Python', 'Node.js', 'PostgreSQL', 'Slack Bolt'],
    flagship: true,
  },
  {
    id: 'db-replication-engine',
    title: 'Cross-Platform DB Logical Replication Engine',
    category: 'database',
    status: 'CASE STUDY',
    access: 'Architecture diagram',
    desc: 'Fault-tolerant database synchronization pipeline establishing logical replication between heterogeneous Windows Server and Rocky Linux environments with minimal downtime.',
    tech: ['PostgreSQL', 'Windows Server', 'Rocky Linux', 'Bash', 'PowerShell'],
  },
  {
    id: 'observability-pipeline',
    title: 'Host & Container Observability Pipeline',
    category: 'observability',
    status: 'LIVE',
    access: 'Live demo',
    desc: 'Lightweight, self-hosted telemetry cluster providing container resource monitoring and centralized security log aggregation.',
    tech: ['Rocky Linux', 'Prometheus', 'Grafana', 'Promtail', 'Loki', 'cAdvisor', 'Podman'],
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
