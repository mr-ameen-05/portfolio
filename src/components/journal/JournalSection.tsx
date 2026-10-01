import { motion } from 'framer-motion';

interface Article {
  id: string;
  series: string;
  title: string;
  tag: string;
  readTime: string;
  excerpt: string;
}

const articles: Article[] = [
  {
    id: 'approach-security-investigation',
    series: 'Beyond the Alert',
    title: 'How I Approach a Security Investigation',
    tag: 'Security Operations',
    readTime: '8 min',
    excerpt: 'A practical look at gathering evidence, testing hypotheses, and distinguishing an alert from a confirmed incident.',
  },
  {
    id: 'trusting-ai-agent-actions',
    series: 'AI Under Investigation',
    title: 'Building an AI Agent Is Easy. Trusting Its Actions Is Harder.',
    tag: 'AI Engineering',
    readTime: '12 min',
    excerpt: 'Exploring tool permissions, untrusted input, evaluation, and human oversight in AI-assisted workflows.',
  },
  {
    id: 'worked-locally-changed-deployment',
    series: 'Build. Break. Understand.',
    title: 'It Worked Locally. What Changed After Deployment?',
    tag: 'Software Engineering',
    readTime: '6 min',
    excerpt: 'Reproducing a failure, identifying root cause, and validating the fix in a real deployment scenario.',
  },
  {
    id: 'failed-security-lab-lessons',
    series: 'CTF Field Notes',
    title: 'What a Failed Security Lab Taught Me',
    tag: 'Learning & Research',
    readTime: '5 min',
    excerpt: 'A mistaken assumption, the evidence that challenged it, and the new understanding that emerged.',
  },
  {
    id: 'network-path-web-application',
    series: 'Under the Hood',
    title: 'Understanding the Network Path Behind a Web Application',
    tag: 'Infrastructure',
    readTime: '7 min',
    excerpt: 'DNS, TLS, HTTP, servers — tracing how a request actually reaches your browser.',
  },
  {
    id: 'ai-automation-human-judgment',
    series: 'Learning in Public',
    title: 'Where AI Automation Needs Human Judgment',
    tag: 'AI & Automation',
    readTime: '10 min',
    excerpt: 'When should an AI system act autonomously, and when does it need a human decision?',
  },
];

export default function JournalSection() {
  return (
    <section id="field-notes" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
          Field Notes / Lab Notes
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
          <span className="block text-text-primary">Notes from building, breaking,</span>
          <span className="block text-text-muted">and understanding systems.</span>
        </h2>
      </motion.div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/30 transition-all duration-300"
          >
            <div>
              {/* Series Label */}
              <div className="mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-accent">
                  {article.series}
                </span>
              </div>

              {/* Tag Pill & Read Time */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono bg-bg-tertiary text-text-secondary border border-border-subtle">
                  {article.tag}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-sans text-xl font-bold text-text-primary mb-3 leading-snug">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                {article.excerpt}
              </p>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 border-t border-border-subtle/60 flex items-center justify-between">
              <a
                href="#field-notes"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent transition-colors"
              >
                Read note &rarr;
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Note at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <p className="text-xs font-mono text-text-muted tracking-wide">
          These are planned article topics. Published content will appear here as it is completed.
        </p>
      </motion.div>
    </section>
  );
}
