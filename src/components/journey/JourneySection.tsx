import { motion } from 'framer-motion';

interface Chapter {
  num: string;
  title: string;
  date: string;
  desc: string;
}

const chapters: Chapter[] = [
  {
    num: '01',
    title: 'Understanding Systems',
    date: '[DATE — VERIFY]',
    desc: 'Began exploring how computers, networks, and operating systems work. Developed curiosity about what happens beneath the interface.',
  },
  {
    num: '02',
    title: 'Entering Cybersecurity',
    date: '[DATE — VERIFY]',
    desc: 'Discovered cybersecurity through research and experimentation. Started learning about threats, defenses, and security operations.',
  },
  {
    num: '03',
    title: 'Building Software',
    date: '[DATE — VERIFY]',
    desc: 'Expanded from analysis to building. Learned web development, APIs, databases, and application architecture.',
  },
  {
    num: '04',
    title: 'Security Operations',
    date: '[DATE — VERIFY]',
    desc: 'Gained practical experience in monitoring, log analysis, detection engineering, and incident investigation.',
  },
  {
    num: '05',
    title: 'AI & Automation',
    date: '[DATE — VERIFY]',
    desc: 'Began exploring how AI and local language models can assist engineering and security workflows.',
  },
  {
    num: '06',
    title: 'Pentesting & Security Research',
    date: '[DATE — VERIFY]',
    desc: 'Started conducting authorized security assessments, vulnerability research, and CTF challenges.',
  },
  {
    num: '07',
    title: 'Building in Public',
    date: '[DATE — VERIFY]',
    desc: 'Creating this portfolio, documenting investigations, sharing knowledge, and learning through teaching.',
  },
];

export default function JourneySection() {
  return (
    <section id="journey" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 md:mb-20"
      >
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
          My Journey
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-text-primary tracking-tight">
          How I got here.
        </h2>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline vertical line */}
        <div
          className="absolute left-8 top-8 bottom-8 w-px bg-border-subtle hidden md:block"
          aria-hidden="true"
        />

        <div className="space-y-10 md:space-y-12">
          {chapters.map((ch, i) => (
            <motion.div
              key={ch.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start group"
            >
              {/* Circle Marker */}
              <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-bg-tertiary border border-border-subtle items-center justify-center z-10 group-hover:border-border-hover transition-colors">
                <span className="font-mono text-base font-semibold text-text-secondary group-hover:text-accent transition-colors">
                  {ch.num}
                </span>
              </div>

              {/* Chapter Card */}
              <div className="flex-1 w-full bg-bg-secondary border border-border-subtle rounded-2xl p-8 hover:border-border-hover transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono text-accent uppercase tracking-widest">
                    {ch.date}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest md:hidden">
                    Chapter {ch.num}
                  </span>
                </div>
                <h3 className="font-sans text-xl md:text-2xl font-bold text-text-primary mb-3">
                  {ch.title}
                </h3>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  {ch.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
