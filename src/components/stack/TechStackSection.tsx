import { motion } from 'framer-motion';
import { Shield, Radar, Server, Code2, LineChart, Sparkles } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

const stackCategories = [
  {
    title: 'Security Engineering',
    icon: Shield,
    tools: ['Burp Suite', 'Nmap', 'Nuclei', 'Wireshark', 'MITRE ATT&CK'],
  },
  {
    title: 'Security Operations',
    icon: Radar,
    tools: ['Wazuh', 'SIEM Workflows', 'Log Analysis', 'Detection Engineering', 'Incident Investigation'],
  },
  {
    title: 'Systems & Infrastructure',
    icon: Server,
    tools: ['Linux', 'Docker', 'Podman', 'NGINX', 'systemd', 'AWS Security', 'GitOps', 'CI/CD'],
  },
  {
    title: 'Full-Stack Development',
    icon: Code2,
    tools: ['React', 'TypeScript', 'Node.js', 'Python', 'REST APIs', 'PostgreSQL'],
  },
  {
    title: 'Observability',
    icon: LineChart,
    tools: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'cAdvisor'],
  },
  {
    title: 'AI Engineering',
    icon: Sparkles,
    tools: ['LLM Integration', 'Local LLMs', 'AI Agents', 'Tool Integration', 'Workflow Automation', 'AI Evaluation'],
  },
];

export default function TechStackSection() {
  return (
    <section id="stack" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          09 — Technical Stack
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Tools I Work With
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-sans">
          My technology choices depend on the requirements, constraints, and existing architecture of each project.
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stackCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Icon3D icon={Icon} size="md" glowColor={['#EF4444', '#00D2FF', '#22C55E', '#3B82F6', '#F59E0B', '#A855F7'][idx]} />
                  <h3 className="font-sans font-bold text-base text-text-primary">
                    {cat.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded bg-bg-primary border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stack Philosophy Note */}
      <div className="mt-8 p-4 rounded-xl border border-border-subtle bg-bg-secondary/40 text-xs font-mono text-text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p>
          "The tools are part of the process. Understanding the problem is what determines how they are used."
        </p>
        <span className="text-accent shrink-0">100% Demonstrable &amp; Battle-Tested</span>
      </div>
    </section>
  );
}
