import { useState, useEffect } from 'react';

export default function TypewriterText({ text, onComplete }: { text: string, onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 30); // 30ms per character

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}
