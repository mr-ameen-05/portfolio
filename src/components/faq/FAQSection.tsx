import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What types of projects do you accept?',
    answer: 'I consider projects involving security assessments, security operations engineering, full-stack development, infrastructure integration, and AI-powered applications. Suitability depends on the requirements, timeline, and available resources.',
  },
  {
    question: 'Do you work with existing systems?',
    answer: 'Yes. Projects can involve improving existing applications, integrating systems, investigating technical problems, or implementing new functionality within an established environment.',
  },
  {
    question: 'How do security assessments work?',
    answer: 'An assessment begins with authorization, scope definition, and an agreement on testing boundaries. The work then proceeds through testing, evidence collection, finding validation, reporting, and any agreed retesting.',
  },
  {
    question: 'What will I receive at the end of a project?',
    answer: 'Deliverables depend on the engagement and are defined before work begins. They may include software, configuration changes, technical documentation, security findings, recommendations, or validation results.',
  },
  {
    question: 'Do you provide ongoing support?',
    answer: 'Ongoing support can be discussed where the project requirements and operational commitments are appropriate. The scope, availability, and responsibilities must be agreed in advance.',
  },
  {
    question: 'How do we get started?',
    answer: 'Submit a project enquiry describing the problem, desired outcome, and relevant constraints. I can then review the requirements and discuss whether the engagement is a suitable fit.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          14 — Frequently Asked Questions
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-sans">
          Common queries regarding project scoping, security assessment boundaries, delivery timelines, and technical integration.
        </p>
      </motion.div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-2xl bg-bg-secondary border border-border-subtle overflow-hidden transition-colors hover:border-border-hover"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-sans font-bold text-base sm:text-lg text-text-primary focus:outline-none"
              >
                <span className="flex items-center gap-3.5">
                  <Icon3D icon={HelpCircle} size="sm" glowColor="#C8FF00" className="hidden sm:inline-flex shrink-0" />
                  <span>{faq.question}</span>
                </span>
                <span className="p-1 rounded-md bg-bg-primary border border-border-subtle text-text-muted shrink-0">
                  {isOpen ? <Minus className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-6 sm:px-6 pt-0 text-sm sm:text-base text-text-secondary leading-relaxed font-sans border-t border-border-subtle/50 mt-1">
                      <div className="pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
