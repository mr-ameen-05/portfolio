import { useState, useEffect } from 'react';

export default function TypewriterText({ 
  text, 
  onComplete, 
  speed = 25 
}: { 
  text: string; 
  onComplete?: () => void; 
  speed?: number; 
}) {
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
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayed}</span>;
}
