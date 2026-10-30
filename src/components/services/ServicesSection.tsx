import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radar, Cpu, Code2, Bot, ArrowRight, Check, FileText } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

interface ServiceItem {
  id: string;
  num: string;
  title: string;
  tagline: string;
  overview: string;
  icon: React.ElementType;
  services: string[];
  deliverables: string[];
  note?: string;
  ctaText: string;
  serviceCategory: string;
}

const servicesData: ServiceItem[] = [
  {
    id: 'vapt',
    num: '01',
    title: 'Vulnerability Assessment & Penetration Testing',
    tagline: 'Find weaknesses. Understand the risk. Improve security.',
    overview: 'I assess applications and infrastructure to identify security weaknesses, validate findings, and provide practical recommendations for remediation.',
    icon: ShieldCheck,
    services: [
      'Web application penetration testing.',
      'API security testing.',
      'Network vulnerability assessment.',
      'Infrastructure security assessment.',
      'Vulnerability validation and prioritization.',
      'Remediation guidance.',
      'Retesting of resolved findings.',
    ],
    deliverables: [
      'Defined assessment scope.',
      'Technical findings with supporting evidence.',
      'Risk-based prioritization.',
      'Remediation recommendations.',
      'Assessment report.',
      'Retesting results, where included in scope.',
    ],
    ctaText: 'Enquire About Security Testing',
    serviceCategory: 'Security Assessment / VAPT',
  },
  {
    id: 'soc',
    num: '02',
    title: 'SOC & Security Operations Engineering',
    tagline: 'Better visibility. Meaningful detections. Structured investigations.',
    overview: 'I help improve security monitoring through log integration, SIEM configuration, detection engineering, and investigation workflows.',
    icon: Radar,
    services: [
      'SIEM deployment and configuration.',
      'Log collection and normalization.',
      'Detection rule development.',
      'Alert tuning.',
      'Security dashboards.',
      'Investigation workflow development.',
      'Incident analysis and response playbooks.',
    ],
    deliverables: [
      'Monitoring architecture.',
      'Configured integrations.',
      'Detection rules and tuning recommendations.',
      'Dashboards and investigation workflows.',
      'Technical documentation.',
      'Knowledge transfer.',
    ],
    note: 'Ongoing monitoring and incident response are provided only where the engagement explicitly includes those operational commitments.',
    ctaText: 'Enquire About Security Operations',
    serviceCategory: 'SOC / Detection Engineering',
  },
  {
    id: 'fde',
    num: '03',
    title: 'Forward Deployed Engineering',
    tagline: 'From operational challenges to working systems.',
    overview: 'I work with teams to understand technical and business problems, integrate existing systems, and develop solutions that fit real-world workflows.',
    icon: Cpu,
    services: [
      'Technical discovery and requirements analysis.',
      'Internal tools and business applications.',
      'API development and integration.',
      'Workflow automation.',
      'Backend engineering.',
      'Database integration.',
      'Deployment and infrastructure integration.',
      'Production troubleshooting.',
    ],
    deliverables: [
      'Technical requirements.',
      'Solution architecture.',
      'Working software.',
      'Integration and validation.',
      'Deployment documentation.',
      'Handover and knowledge transfer.',
    ],
    note: 'Each engagement is shaped around the problem, existing environment, and agreed acceptance criteria.',
    ctaText: 'Discuss an Engineering Project',
    serviceCategory: 'Forward Deployed Engineering',
  },
  {
    id: 'fullstack',
    num: '04',
    title: 'Full-Stack Development',
    tagline: 'Reliable applications designed around real requirements.',
    overview: 'I develop web applications and backend systems with a focus on maintainable architecture, practical usability, and reliable operation.',
    icon: Code2,
    services: [
      'Web application development.',
      'Backend and API engineering.',
      'Database design and integration.',
      'Internal business platforms.',
      'Authentication and authorization implementation.',
      'Application deployment.',
      'Performance and reliability improvements.',
    ],
    deliverables: [
      'Requirements and architecture.',
      'Application implementation.',
      'Database and API integration.',
      'Testing and validation.',
      'Deployment support.',
      'Technical documentation.',
    ],
    ctaText: 'Discuss an Application',
    serviceCategory: 'Full-Stack Development',
  },
  {
    id: 'ai',
    num: '05',
    title: 'AI Engineering & Automation',
    tagline: 'Make AI useful, integrated, and easier to control.',
    overview: 'I develop AI-powered applications and automation workflows designed around defined business or engineering problems.',
    icon: Bot,
    services: [
      'LLM application development.',
      'AI-powered internal tools.',
      'Retrieval-augmented generation (RAG).',
      'API and tool integrations.',
      'AI-assisted workflow automation.',
      'Agent workflow development.',
      'Evaluation and reliability improvements.',
      'Access controls and human approval mechanisms.',
    ],
    deliverables: [
      'AI solution architecture.',
      'Working application or workflow.',
      'Integration with agreed systems.',
      'Evaluation and validation.',
      'Operational safeguards.',
      'Deployment documentation.',
    ],
    note: 'AI-generated outputs are treated according to the risk of the workflow. Critical actions should use appropriate permissions, validation, and human approval where required.',
    ctaText: 'Discuss an AI Project',
    serviceCategory: 'AI Engineering / Automation',
  },
];

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<string>('vapt');

  const selectedService = servicesData.find((s) => s.id === activeTab) || servicesData[0];
  const Icon = selectedService.icon;

  return (
    <section id="services" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          03 — Engineering Services
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Technical Expertise. Practical Solutions.
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-3xl mt-4 leading-relaxed font-sans">
          I work with businesses and engineering teams to address security challenges, improve infrastructure, and build software that supports real operational needs.
        </p>
      </motion.div>

      {/* Service Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-border-subtle">
        {servicesData.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-2 border ${
              activeTab === item.id
                ? 'bg-accent text-black border-accent font-bold shadow-md'
                : 'bg-bg-secondary text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-hover'
            }`}
          >
            <span className="opacity-75">{item.num}</span>
            <span>{item.title.split('&')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Selected Service Detailed View */}
      <motion.div
        key={selectedService.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-8 md:p-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
          <div className="max-w-2xl flex flex-col sm:flex-row items-start gap-5">
            <Icon3D icon={Icon} size="xl" glowColor="#C8FF00" className="shrink-0" />
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="font-mono text-xs text-accent font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                  Service {selectedService.num}
                </span>
                <span className="text-xs font-mono text-text-muted">Structured Engagement</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-text-primary mb-3">
                {selectedService.title}
              </h3>
              <p className="font-mono text-sm text-accent mb-4 font-medium">
                "{selectedService.tagline}"
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
                {selectedService.overview}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="#contact"
              className="px-6 py-3.5 bg-accent text-black font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all text-center inline-flex items-center justify-center gap-2"
            >
              <span>{selectedService.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 2-Column: Services vs Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-subtle/80">
          {/* Services Column */}
          <div className="p-6 rounded-xl bg-bg-primary/80 border border-border-subtle">
            <div className="flex items-center gap-3 mb-4 text-text-primary font-mono text-xs uppercase tracking-wider font-bold">
              <Icon3D icon={Icon} size="sm" glowColor="#C8FF00" />
              <span>Services Scope</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-secondary font-sans">
              {selectedService.services.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables Column */}
          <div className="p-6 rounded-xl bg-bg-primary/80 border border-border-subtle">
            <div className="flex items-center gap-3 mb-4 text-text-primary font-mono text-xs uppercase tracking-wider font-bold">
              <Icon3D icon={FileText} size="sm" glowColor="#C8FF00" />
              <span>Agreed Deliverables</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-secondary font-sans">
              {selectedService.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Note if available */}
        {selectedService.note && (
          <div className="mt-8 p-4 rounded-xl border border-border-subtle bg-bg-primary/50 text-xs text-text-muted font-sans flex items-start gap-2.5">
            <span className="font-mono text-accent font-bold shrink-0">Note:</span>
            <span>{selectedService.note}</span>
          </div>
        )}
      </motion.div>
    </section>
  );
}
