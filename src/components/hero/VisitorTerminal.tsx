import React, { useEffect, useState } from 'react';
import { Terminal, Copy, Check, Minimize2, Maximize2, ShieldCheck, Wifi, Cpu, Monitor, Globe, Clock } from 'lucide-react';

interface VisitorData {
  gpu: string;
  os: string;
  device: string;
  cores: string;
  ram: string;
  screen: string;
  browser: string;
  engine: string;
  ip: string;
  location: string;
  isp: string;
  network: string;
  timezone: string;
  localTime: string;
  battery: string | null;
}

export default function VisitorTerminal() {
  const [data, setData] = useState<VisitorData | null>(null);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'raw'>('specs');

  useEffect(() => {
    // 1. Detect GPU via WebGL unmasked renderer
    let gpu = 'Hardware Accelerated GPU';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const rawGpu = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (rawGpu) {
            let s = String(rawGpu);
            const angleMatch = s.match(/ANGLE \([^,]+,\s*([^,]+?)(?:\sDirect3D|\sOpenGL|\svs_|\sps_|,)/i);
            if (angleMatch && angleMatch[1]) {
              s = angleMatch[1];
            }
            s = s.replace(/Apple Metal Renderer:\s*/i, '');
            s = s.replace(/^ANGLE\s*\(/i, '');
            s = s.replace(/\s*(Direct3D|vs_\d|ps_\d|D3D11).*$/i, '');
            s = s.trim();
            if (s.endsWith(',') || s.endsWith('(')) s = s.slice(0, -1).trim();
            const openCount = (s.match(/\(/g) || []).length;
            const closeCount = (s.match(/\)/g) || []).length;
            if (openCount > closeCount) s += ')'.repeat(openCount - closeCount);
            gpu = s;
          }
        }
      }
    } catch {
      gpu = 'Standard Display Adapter';
    }

    // 2. Detect OS & Device
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let device = 'Desktop / PC';

    if (/Android/i.test(ua)) {
      const match = ua.match(/Android\s+([\d.]+)/);
      os = match ? `Android ${match[1]}` : 'Android';
      device = 'Mobile Device';
    } else if (/iPhone/i.test(ua)) {
      const match = ua.match(/OS\s+([\d_]+)/);
      os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS (iPhone)';
      device = 'Apple iPhone';
    } else if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      os = 'iPadOS';
      device = 'Apple iPad';
    } else if (/Windows NT 10.0/i.test(ua)) {
      os = 'Windows 10/11';
      device = 'PC / Workstation';
    } else if (/Windows/i.test(ua)) {
      os = 'Windows';
      device = 'PC / Workstation';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      const match = ua.match(/Mac OS X\s+([\d_]+)/);
      os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
      device = 'Apple Mac';
    } else if (/Linux/i.test(ua)) {
      if (/Ubuntu/i.test(ua)) os = 'Ubuntu Linux';
      else if (/Fedora/i.test(ua)) os = 'Fedora Linux';
      else if (/Debian/i.test(ua)) os = 'Debian Linux';
      else os = 'Linux x86_64';
      device = 'Linux Workstation';
    }

    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Multi-Core';
    const ram = (navigator as unknown as { deviceMemory?: number }).deviceMemory 
      ? `~${(navigator as unknown as { deviceMemory?: number }).deviceMemory} GB RAM` 
      : 'Hardware Managed';
    const screen = `${window.screen.width}×${window.screen.height} (${window.devicePixelRatio || 1}x)`;

    // 3. Detect Browser
    let browser = 'Modern Browser';
    let engine = 'Blink';

    if (/Edg\/([\d.]+)/i.test(ua)) {
      const v = ua.match(/Edg\/([\d.]+)/)?.[1];
      browser = `Edge ${v ? v.split('.')[0] : ''}`;
      engine = 'Blink';
    } else if (/OPR\/([\d.]+)/i.test(ua)) {
      const v = ua.match(/OPR\/([\d.]+)/)?.[1];
      browser = `Opera ${v ? v.split('.')[0] : ''}`;
      engine = 'Blink';
    } else if (/Chrome\/([\d.]+)/i.test(ua)) {
      const v = ua.match(/Chrome\/([\d.]+)/)?.[1];
      browser = `Chrome ${v ? v.split('.')[0] : ''}`;
      engine = 'Blink';
    } else if (/Firefox\/([\d.]+)/i.test(ua)) {
      const v = ua.match(/Firefox\/([\d.]+)/)?.[1];
      browser = `Firefox ${v ? v.split('.')[0] : ''}`;
      engine = 'Gecko';
    } else if (/Version\/([\d.]+).*Safari/i.test(ua)) {
      const v = ua.match(/Version\/([\d.]+)/)?.[1];
      browser = `Safari ${v ? v.split('.')[0] : ''}`;
      engine = 'WebKit';
    }

    // 4. Timezone & Local Time
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const initialTime = new Date().toLocaleTimeString();

    // 5. Network connection
    const navConn = (navigator as unknown as { connection?: { effectiveType?: string; rtt?: number } }).connection;
    const network = navConn?.effectiveType 
      ? `${navConn.effectiveType.toUpperCase()} (${navConn.rtt ? navConn.rtt + 'ms' : 'fast'})` 
      : 'Broadband / WiFi';

    // Set initial baseline immediately
    const baselineData: VisitorData = {
      gpu,
      os,
      device,
      cores,
      ram,
      screen,
      browser,
      engine,
      ip: 'Detecting...',
      location: tz.replace('_', ' ').split('/')[1] || tz,
      isp: 'Resolving ISP...',
      network,
      timezone: tz,
      localTime: initialTime,
      battery: null,
    };

    setData(baselineData);

    // 6. Battery API
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean }> })
        .getBattery()
        .then(bat => {
          const batteryStr = `${Math.round(bat.level * 100)}%${bat.charging ? ' ⚡ (Charging)' : ''}`;
          setData(prev => prev ? { ...prev, battery: batteryStr } : null);
        })
        .catch(() => {});
    }

    // 7. Fetch Geolocation & IP from ipwho.is (fast, free, CORS-enabled)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    fetch('https://ipwho.is/', { signal: controller.signal })
      .then(res => res.json())
      .then(geo => {
        clearTimeout(timeoutId);
        if (geo && geo.success) {
          const locStr = [geo.city, geo.region, geo.country].filter(Boolean).join(', ') + 
            (geo.flag?.emoji ? ` ${geo.flag.emoji}` : '');
          
          setData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              ip: geo.ip || prev.ip,
              location: locStr || prev.location,
              isp: geo.connection?.isp || geo.connection?.org || 'Broadband ISP',
            };
          });
        }
      })
      .catch(() => {
        // Fallback gracefully on timeout/adblocker
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            ip: 'Protected / Masked',
            isp: 'Private Network Route',
          };
        });
      })
      .finally(() => {
        setScanning(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => prev ? { ...prev, localTime: new Date().toLocaleTimeString() } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    if (!data) return;
    const text = [
      '─── CLIENT TELEMETRY ───',
      `GPU      : ${data.gpu}`,
      `OS/DEV   : ${data.os} (${data.cores}, ${data.ram})`,
      `BROWSER  : ${data.browser} (${data.engine}) @ ${data.screen}`,
      `LOCATION : ${data.location}`,
      `IP / ISP : ${data.ip} (${data.isp})`,
      `NETWORK  : ${data.network}`,
      `TIME     : ${data.localTime} [${data.timezone}]`,
      data.battery ? `BATTERY  : ${data.battery}` : '',
      '─────────────────────────'
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-7 pointer-events-auto transition-all duration-300">
      <div className="relative rounded-xl overflow-hidden bg-bg-secondary/90 backdrop-blur-md border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-cyan-500/40 transition-colors">
        
        {/* Terminal Title Bar */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-bg-primary/80 border-b border-border-subtle flex items-center justify-between select-none gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 inline-block shrink-0" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80 inline-block shrink-0" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80 inline-block shrink-0" />
            <span className="ml-1 sm:ml-2 font-mono text-[10px] sm:text-[11px] text-text-muted flex items-center gap-1.5 truncate">
              <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">guest@recon:~$ ./telemetry.sh</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Status Pulse */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${scanning ? 'animate-ping' : 'animate-pulse'}`} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">
                {scanning ? 'SCAN' : 'ONLINE'}
              </span>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-cyan-400 transition-colors"
              title="Copy telemetry specs"
              aria-label="Copy telemetry specs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Collapse / Expand */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
              title={collapsed ? 'Expand terminal' : 'Minimize terminal'}
              aria-label={collapsed ? 'Expand terminal' : 'Minimize terminal'}
            >
              {collapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {!collapsed && (
          <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs text-text-secondary leading-relaxed">
            {/* Command Header */}
            <div className="flex items-center justify-between border-b border-border-subtle/50 pb-2 mb-3">
              <div className="text-text-muted text-[10px]">
                <span className="text-cyan-400 font-semibold">[SYS_RECON]</span> Active client session fingerprint
              </div>
              <div className="flex gap-2 text-[10px]">
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${activeTab === 'specs' ? 'text-cyan-400 bg-cyan-500/10' : 'text-text-muted hover:text-text-primary'}`}
                >
                  SPECS
                </button>
                <button 
                  onClick={() => setActiveTab('raw')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${activeTab === 'raw' ? 'text-cyan-400 bg-cyan-500/10' : 'text-text-muted hover:text-text-primary'}`}
                >
                  RAW_JSON
                </button>
              </div>
            </div>

            {activeTab === 'specs' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {/* GPU */}
                <div className="flex items-start gap-2">
                  <Monitor className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-text-muted block text-[10px] uppercase tracking-wider">GPU / Renderer</span>
                    <span className="text-text-primary font-medium truncate block" title={data?.gpu}>
                      {data?.gpu || 'Detecting GPU...'}
                    </span>
                  </div>
                </div>

                {/* Device & OS */}
                <div className="flex items-start gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-text-muted block text-[10px] uppercase tracking-wider">Device & System</span>
                    <span className="text-text-primary font-medium truncate block">
                      {data ? `${data.os} · ${data.cores}` : 'Analyzing OS...'}
                    </span>
                  </div>
                </div>

                {/* Browser & Display */}
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-text-muted block text-[10px] uppercase tracking-wider">Browser & Display</span>
                    <span className="text-text-primary font-medium truncate block">
                      {data ? `${data.browser} (${data.engine}) · ${data.screen}` : 'Parsing UA...'}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-text-muted block text-[10px] uppercase tracking-wider">Location / Origin</span>
                    <span className="text-text-primary font-medium truncate block" title={data?.location}>
                      {data?.location || 'Locating origin...'}
                    </span>
                  </div>
                </div>

                {/* Network & ISP */}
                <div className="flex items-start gap-2">
                  <Wifi className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-text-muted block text-[10px] uppercase tracking-wider">Network & Route</span>
                    <span className="text-text-primary font-medium truncate block" title={`${data?.ip} - ${data?.isp}`}>
                      {data ? `${data.ip} · ${data.isp}` : 'Establishing route...'}
                    </span>
                  </div>
                </div>

                {/* Local Time & Timezone */}
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-pink-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-text-muted block text-[10px] uppercase tracking-wider">Local Time & Clock</span>
                    <span className="text-text-primary font-medium truncate block">
                      {data ? `${data.localTime} [${data.timezone}]` : 'Syncing time...'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <pre className="text-[10px] text-cyan-300/90 overflow-x-auto p-2 bg-black/40 rounded border border-white/5 font-mono">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}

            {/* Bottom prompt line */}
            <div className="mt-3 pt-2.5 border-t border-border-subtle/50 flex items-center justify-between text-[10px] text-text-muted">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="text-text-muted">status:</span> telemetry_stream_active
                <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse ml-1" />
              </span>
              <span className="text-text-muted hidden sm:inline">
                {data?.battery ? `⚡ ${data.battery}` : 'client_node_authorized'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
