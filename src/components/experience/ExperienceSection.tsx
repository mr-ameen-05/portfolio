import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Terminal, Lock } from 'lucide-react';

const experiences = [
  {
    role: "Senior Security Analyst",
    company: "CyberDefend Inc.",
    date: "2024 - Present",
    desc: "Led the Red Team operations, discovering 30+ critical CVEs in enterprise systems."
  },
  {
    role: "Backend Systems Engineer",
    company: "SaaS Scale",
    date: "2022 - 2024",
    desc: "Architected containerized microservices scaling to 1M+ DAU."
  },
  {
    role: "Junior Developer",
    company: "Tech Start",
    date: "2020 - 2022",
    desc: "Maintained full-stack React applications and PostgreSQL databases."
  }
];

export default function ExperienceSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Sticky Left Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-6xl mb-8">EXPERIENCE TIMELINE</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-text-secondary"><Shield className="text-accent-red" size={20}/> Offensive Security</div>
              <div className="flex items-center gap-3 text-text-secondary"><Lock className="text-accent-emerald" size={20}/> Defensive SIEM</div>
              <div className="flex items-center gap-3 text-text-secondary"><Server className="text-accent-cyan" size={20}/> Systems Engineering</div>
              <div className="flex items-center gap-3 text-text-secondary"><Terminal className="text-accent-amber" size={20}/> Observability</div>
            </div>

            <button className="px-6 py-3 bg-text-primary text-bg-primary font-mono text-sm hover:bg-accent-amber transition-colors">
              DOWNLOAD_CV.ASC
            </button>
          </motion.div>
        </div>

        {/* Scrollable Right Column */}
        <div className="lg:col-span-8 space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-8 rounded-2xl bg-bg-secondary border border-border-subtle"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                <div>
                  <h3 className="font-sans text-2xl font-bold text-text-primary">{exp.role}</h3>
                  <p className="text-accent-cyan font-mono text-sm mt-1">{exp.company}</p>
                </div>
                <div className="text-text-muted font-mono text-xs mt-4 md:mt-0">
                  {exp.date}
                </div>
              </div>
              <p className="text-text-secondary">
                {exp.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
