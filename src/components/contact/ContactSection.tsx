import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function ContactSection() {
  const subjects = ['Technical collaboration', 'Cybersecurity and research', 'Community and workshops', 'Something else'];
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState('');
  
  // UI State
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    if (!name || !email || !message) {
      setStatus('error');
      setFeedback('Please fill out all required fields.');
      return;
    }

    try {
      // Sends the request to your PHP backend API
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        setFeedback('Message sent successfully. I will get back to you soon!');
        setName('');
        setEmail('');
        setMessage('');
        setSubject(subjects[0]);
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setFeedback('A network error occurred. Ensure the PHP backend is running and accessible.');
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">Open a Connection</p>
          <h2 className="font-display text-5xl md:text-6xl mb-4 text-text-primary">Have something interesting</h2>
          <h2 className="font-display text-5xl md:text-6xl text-text-muted mb-8">to build or investigate?</h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            I'm open to meaningful technical discussions, collaboration, cybersecurity education, and projects that challenge how I think about engineering.
          </p>

          <div className="flex gap-4">
            <a href="https://github.com/mr-ameen-05" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 border border-border-subtle hover:border-accent hover:text-accent transition-colors">
              <Github size={18} /> <span className="text-sm font-mono">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/al-ameen05" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 border border-border-subtle hover:border-accent hover:text-accent transition-colors">
              <Linkedin size={18} /> <span className="text-sm font-mono">LinkedIn</span>
            </a>
            <a href="mailto:26alameen2005@gmail.com" className="flex items-center gap-2 px-4 py-3 border border-border-subtle hover:border-accent hover:text-accent transition-colors">
              <Mail size={18} /> <span className="text-sm font-mono">Email</span>
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name" 
                  className="w-full bg-bg-secondary border border-border-subtle p-3 text-sm focus:outline-none focus:border-accent transition-colors text-text-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" 
                  className="w-full bg-bg-secondary border border-border-subtle p-3 text-sm focus:outline-none focus:border-accent transition-colors text-text-primary" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted mb-3 uppercase tracking-wider">What would you like to discuss?</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <button key={s} type="button" onClick={() => setSubject(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${subject === s ? 'border-accent text-bg-primary bg-accent' : 'border-border-subtle text-text-muted hover:border-text-secondary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Message</label>
              <textarea 
                rows={5} 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to discuss?" 
                className="w-full bg-bg-secondary border border-border-subtle p-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none text-text-primary" 
              />
            </div>

            {feedback && (
              <div className={`p-3 text-sm font-mono border ${status === 'success' ? 'border-accent/50 text-accent bg-accent/10' : 'border-red-500/50 text-red-500 bg-red-500/10'}`}>
                {feedback}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full p-4 bg-accent text-bg-primary font-sans font-bold text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
