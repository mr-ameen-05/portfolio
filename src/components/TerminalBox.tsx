import { useEffect, useState } from 'react';

type OSInfo = {
  platform: string;
  userAgent: string;
  language: string;
  viewport: string;
};

const TerminalBox = () => {
  const [osInfo, setOsInfo] = useState<OSInfo | null>(null);

  useEffect(() => {
    const handleLoad = () => {
      const platform = navigator.platform || 'unknown';
      const ua = navigator.userAgent || 'unknown';
      const lang = navigator.language || 'unknown';
      const width = window.innerWidth;
      const height = window.innerHeight;
      const viewport = `${width}×${height}`;
      setOsInfo({ platform, userAgent: ua, language: lang, viewport });
    };

    // On load
    handleLoad();

    // On resize
    window.addEventListener('resize', handleLoad);

    return () => window.removeEventListener('resize', handleLoad);
  }, []);

  return (
    <section id="terminal-box" className="py-12 md:py-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden max-w-full">
          <div className="bg-bg-primary px-6 py-3 flex items-center justify-between border-b border-border-subtle">
            <h2 className="font-sans font-medium text-text-primary text-sm tracking-wider">
              OSINT Visitor Details
            </h2>
            <button
              onClick={() => navigator.clipboard.writeText(
                `OS: ${osInfo?.platform}\nUA: ${osInfo?.userAgent}\nLang: ${osInfo?.language}\nView: ${osInfo?.viewport}`
              )}
              className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Copy OSINT details"
            >
              Copy
            </button>
          </div>

          <div className="p-6 h-[300px] overflow-y-auto">
            {osInfo ? (
              <pre className="font-mono text-sm text-text-secondary whitespace-pre-wrap">
                ── OSINT DETAILS ──────────────────────────────────────
                OS: {osInfo.platform}
                User Agent: {osInfo.userAgent}
                Language: {osInfo.language}
                Viewport: {osInfo.viewport}
                ─────────────────────────────────────────────────────
              </pre>
            ) : (
              <p className="text-text-secondary text-center py-12">Loading visitor information…</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalBox;