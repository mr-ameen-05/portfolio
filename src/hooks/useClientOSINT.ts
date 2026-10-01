import { useState, useEffect } from 'react';

export interface OSINTData {
  gpu: string;
  cores: number;
  memory: number;
  platform: string;
  battery: string;
  screen: string;
}

export function useClientOSINT() {
  const [data, setData] = useState<OSINTData | null>(null);

  useEffect(() => {
    const gatherData = async () => {
      let gpu = 'Unknown GPU';
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

      let batteryLevel = 'Unknown';
      try {
        if ('getBattery' in navigator) {
          const bat: any = await (navigator as any).getBattery();
          batteryLevel = `${Math.round(bat.level * 100)}%${bat.charging ? ' (Charging)' : ''}`;
        }
      } catch (e) {}

      setData({
        gpu: gpu.split('Direct')[0].trim(), // Clean up string
        cores: navigator.hardwareConcurrency || 0,
        memory: (navigator as any).deviceMemory || 0,
        platform: navigator.platform || 'Unknown OS',
        battery: batteryLevel,
        screen: `${window.screen.width}x${window.screen.height}`
      });
    };

    gatherData();
  }, []);

  return data;
}
