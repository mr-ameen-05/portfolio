import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Icon3D from '../ui/Icon3D';

const serviceOptions = [
  'Security Assessment / VAPT',
  'SOC / Detection Engineering',
  'Forward Deployed Engineering',
  'Full-Stack Development',
  'AI Engineering / Automation',
  'Technical Consultation',
  'Other',
];

const CONTACT_ENDPOINT: string =
  import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(serviceOptions[0]);
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCompany = company.trim();
    const cleanDescription = description.trim();

    if (!cleanName || !cleanEmail || !cleanCompany || !cleanDescription) {
      setStatus('error');
      setFeedback('Anonymous submissions are blocked. Please provide your real name, work email, organization, and project description.');
      return;
    }

    const lowerName = cleanName.toLowerCase();
    const lowerCompany = cleanCompany.toLowerCase();
    if (['anonymous', 'anon', 'unknown', 'n/a', 'none', 'test', 'fake'].includes(lowerName) || cleanName.length < 2) {
      setStatus('error');
      setFeedback('Anonymous submissions are not accepted. Please provide your real full name.');
      return;
    }

    if (['anonymous', 'anon', 'unknown', 'n/a', 'none', 'test'].includes(lowerCompany) || cleanCompany.length < 2) {
      setStatus('error');
      setFeedback('Please provide your real organization, company, or domain name. Anonymous requests are blocked.');
      return;
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          service,
          description: cleanDescription,
          timeline: timeline.trim() || 'Flexible',
          budget: budget.trim() || 'To be scoped',
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setStatus('success');
        setFeedback(
          result.message ||
            `Enquiry logged and confirmation receipt transmitted to ${cleanEmail}. Al Ameen will review and respond within 24–48 hours.`
        );
        // Clear form fields
        setName('');
        setEmail('');
        setCompany('');
        setDescription('');
        setTimeline('');
        setBudget('');
      } else {
        const errorMsg = result?.error || (response.status === 404 
          ? 'API endpoint returned 404. Please run "sudo ./deploy.sh config" on your server to update Nginx.'
          : `Server returned HTTP ${response.status}. Please check your inputs.`);
        setStatus('error');
        setFeedback(errorMsg);
      }
    } catch (err: unknown) {
      // True network fetch failure (e.g. offline or DNS failure)
      setStatus('error');
      setFeedback(
        'Unable to reach server directly. Please check your internet connection and try submitting again.'
      );
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16"
      >
        <p className="text-[11px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
          06.2 — Project Enquiry
        </p>
        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Have a Technical Problem Worth Solving?
        </h2>
        <div className="max-w-3xl space-y-3 mt-4 text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-sans">
          <p>
            Whether you need to assess an application's security, improve security visibility, integrate existing systems, or build an AI-powered workflow, let's start with the problem.
          </p>
          <p>
            Tell me what you are trying to achieve, what challenges you are facing, and what a successful outcome would look like. I'll review the requirements and determine whether I can help.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Direct Connect & Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-text-primary mb-3">
              Start a Conversation
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed font-sans mb-6">
              I prioritize clear scopes, transparent expectations, and measurable engineering outcomes. Reach out directly or submit the enquiry form.
            </p>

            <div className="space-y-3 mb-8">
              <a
                href="mailto:26alameen2005@gmail.com"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-bg-secondary border border-border-subtle hover:border-accent hover:text-accent transition-all text-xs sm:text-sm font-mono text-text-primary group"
              >
                <Icon3D icon={Mail} size="sm" />
                <span>26alameen2005@gmail.com</span>
              </a>

              <a
                href="https://www.linkedin.com/in/al-ameen05"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-bg-secondary border border-border-subtle hover:border-accent hover:text-accent transition-all text-xs sm:text-sm font-mono text-text-primary group"
              >
                <Icon3D icon={Linkedin} size="sm" glowColor="#0077B5" />
                <span>LinkedIn Profile</span>
              </a>

              <a
                href="https://github.com/mr-ameen-05"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-bg-secondary border border-border-subtle hover:border-accent hover:text-accent transition-all text-xs sm:text-sm font-mono text-text-primary group"
              >
                <Icon3D icon={Github} size="sm" />
                <span>GitHub Repositories</span>
              </a>
            </div>
          </div>

          {/* Confidentiality Reminder Card */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle flex items-start gap-3.5 text-xs text-text-muted font-sans">
            <div className="shrink-0 mt-0.5">
              <Icon3D icon={ShieldAlert} size="sm" glowColor="#EF4444" />
            </div>
            <p className="leading-relaxed">
              <strong className="text-text-primary font-mono block mb-0.5">Security Notice:</strong>
              Please do not include passwords, production credentials, sensitive logs, or confidential vulnerability details in this form.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Structured Project Enquiry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-bg-primary border border-border-subtle rounded-lg p-3 text-base sm:text-sm focus:outline-none focus:border-accent transition-colors text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">
                  Work Email <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-bg-primary border border-border-subtle rounded-lg p-3 text-base sm:text-sm focus:outline-none focus:border-accent transition-colors text-text-primary"
                />
              </div>
            </div>

            {/* Company or Organization */}
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">
                Company or Organization <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp / Enterprise / Studio"
                className="w-full bg-bg-primary border border-border-subtle rounded-lg p-3 text-base sm:text-sm focus:outline-none focus:border-accent transition-colors text-text-primary"
              />
            </div>

            {/* What do you need help with? */}
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2.5 uppercase tracking-wider">
                What do you need help with?
              </label>
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setService(opt)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border active:scale-95 touch-manipulation ${
                      service === opt
                        ? 'bg-accent text-black border-accent font-bold shadow-sm'
                        : 'bg-bg-primary text-text-secondary border-border-subtle hover:border-border-hover'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">
                Project Description <span className="text-accent">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, desired outcome, existing environment, and relevant constraints."
                className="w-full bg-bg-primary border border-border-subtle rounded-lg p-3 text-base sm:text-sm focus:outline-none focus:border-accent transition-colors text-text-primary resize-y"
              />
            </div>

            {/* Expected Timeline & Estimated Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">
                  Expected Timeline
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. 2-4 weeks / Q4"
                  className="w-full bg-bg-primary border border-border-subtle rounded-lg p-3 text-base sm:text-sm focus:outline-none focus:border-accent transition-colors text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">
                  Estimated Budget (Optional)
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. Fixed scope / Hourly"
                  className="w-full bg-bg-primary border border-border-subtle rounded-lg p-3 text-base sm:text-sm focus:outline-none focus:border-accent transition-colors text-text-primary"
                />
              </div>
            </div>

            {/* Submit Button & Feedback */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3.5 bg-accent text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Project Enquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/40 text-red-300 text-xs font-mono">
                  {feedback}
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}