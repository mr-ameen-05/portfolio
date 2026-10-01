import { useState, useEffect } from 'react';

export interface AdvancedOSINT {
  gpu: string;
  os: string;
  browser: string;
  time: string;
  locationGuess: string;
}

export function useAdvancedOSINT() {
  const [data, setData] = useState<AdvancedOSINT | null>(null);

  useEffect(() => {
    let gpu = 'Integrated Graphics';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpu = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {}

    // Guess browser
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    // Guess OS
    let os = 'Unknown OS';
    if (navigator.platform.includes('Win')) os = 'Windows';
    else if (navigator.platform.includes('Mac')) os = 'MacOS';
    else if (navigator.platform.includes('Linux')) os = 'Linux';
    else if (/Android|iPhone|iPad/i.test(navigator.userAgent)) os = 'Mobile Device';

    // Time & Location
    const time = new Date().toLocaleTimeString();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locationGuess = tz ? tz.split('/')[1]?.replace('_', ' ') || tz : 'Planet Earth';

    setData({
      gpu: gpu.split('Direct')[0].trim(),
      os,
      browser,
      time,
      locationGuess
    });
  }, []);

  return data;
}
