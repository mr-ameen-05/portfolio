export interface VisitorTelemetry {
  gpu: string;
  os: string;
  device: string;
  cores: string;
  coresNum: number;
  ram: string;
  screen: string;
  browser: string;
  engine: string;
  ip: string;
  location: string;
  city: string;
  region: string;
  country: string;
  countryFlag: string;
  isp: string;
  network: string;
  timezone: string;
  localTime: string;
  battery: string | null;
  batteryNum: number | null;
  isCharging: boolean | null;
  dnt: boolean;
  touchPoints: number;
  canvasHash: string;
  loading: boolean;
}

// Generate simple canvas fingerprint hash
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '0x7F2A';
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(10, 5, 40, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('OSINT_FINGERPRINT', 2, 8);
    const dataUrl = canvas.toDataURL();
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
      hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  } catch {
    return '0x9E4B';
  }
}

// Clean GPU unmasked renderer string
function detectGPU(): string {
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
          return s || 'Hardware Accelerated GPU';
        }
      }
    }
  } catch {
    // ignore
  }
  return 'Standard Graphics Adapter';
}

function detectOSAndDevice(): { os: string; device: string } {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let device = 'Desktop PC';

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
    device = 'Windows Workstation';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
    device = 'Windows PC';
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

  return { os, device };
}

function detectBrowser(): { browser: string; engine: string } {
  const ua = navigator.userAgent;
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

  return { browser: browser.trim(), engine };
}

// Global cache for instant re-access without re-fetching
let cachedTelemetry: VisitorTelemetry | null = null;
const listeners = new Set<(t: VisitorTelemetry) => void>();

export function getVisitorTelemetrySync(): VisitorTelemetry {
  if (cachedTelemetry) return cachedTelemetry;

  const gpu = detectGPU();
  const { os, device } = detectOSAndDevice();
  const { browser, engine } = detectBrowser();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const initialTime = new Date().toLocaleTimeString();
  const coresNum = navigator.hardwareConcurrency || 4;
  const cores = `${coresNum} Cores`;
  const ramNum = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const ram = ramNum ? `~${ramNum} GB RAM` : 'System Managed';
  const screen = `${window.screen.width}×${window.screen.height} (${window.devicePixelRatio || 1}x)`;
  const navConn = (navigator as unknown as { connection?: { effectiveType?: string; rtt?: number } }).connection;
  const network = navConn?.effectiveType
    ? `${navConn.effectiveType.toUpperCase()}${navConn.rtt ? ` (${navConn.rtt}ms RTT)` : ''}`
    : 'Broadband / WiFi';
  const dnt = navigator.doNotTrack === '1' || (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  const touchPoints = navigator.maxTouchPoints || 0;
  const canvasHash = getCanvasFingerprint();

  cachedTelemetry = {
    gpu,
    os,
    device,
    cores,
    coresNum,
    ram,
    screen,
    browser,
    engine,
    ip: 'Detecting...',
    location: tz.replace('_', ' ').split('/')[1] || tz,
    city: tz.replace('_', ' ').split('/')[1] || 'Earth',
    region: '',
    country: '',
    countryFlag: '🌐',
    isp: 'Resolving ISP...',
    network,
    timezone: tz,
    localTime: initialTime,
    battery: null,
    batteryNum: null,
    isCharging: null,
    dnt,
    touchPoints,
    canvasHash,
    loading: true,
  };

  return cachedTelemetry;
}

export function subscribeVisitorTelemetry(callback: (t: VisitorTelemetry) => void): () => void {
  listeners.add(callback);
  callback(getVisitorTelemetrySync());

  // Initiate background resolution if not already completed
  initBackgroundTelemetry();

  return () => {
    listeners.delete(callback);
  };
}

let initStarted = false;
function initBackgroundTelemetry() {
  if (initStarted) return;
  initStarted = true;

  // 1. Battery status
  if ('getBattery' in navigator) {
    (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean; addEventListener: any }> })
      .getBattery()
      .then(bat => {
        const updateBattery = () => {
          const batteryStr = `${Math.round(bat.level * 100)}%${bat.charging ? ' ⚡ (Charging)' : ''}`;
          if (cachedTelemetry) {
            cachedTelemetry = {
              ...cachedTelemetry,
              battery: batteryStr,
              batteryNum: Math.round(bat.level * 100),
              isCharging: bat.charging,
            };
            listeners.forEach(cb => cb(cachedTelemetry!));
          }
        };
        updateBattery();
        bat.addEventListener?.('levelchange', updateBattery);
        bat.addEventListener?.('chargingchange', updateBattery);
      })
      .catch(() => {});
  }

  // 2. Fetch Geolocation & IP from ipwho.is (fast, CORS-enabled, HTTPS)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  fetch('https://ipwho.is/', { signal: controller.signal })
    .then(res => res.json())
    .then(geo => {
      clearTimeout(timeoutId);
      if (geo && geo.success && cachedTelemetry) {
        const locParts = [geo.city, geo.region, geo.country].filter(Boolean);
        const locStr = locParts.join(', ');
        cachedTelemetry = {
          ...cachedTelemetry,
          ip: geo.ip || 'Masked / VPN',
          city: geo.city || cachedTelemetry.city,
          region: geo.region || '',
          country: geo.country || '',
          countryFlag: geo.flag?.emoji || '🌐',
          location: locStr || cachedTelemetry.location,
          isp: geo.connection?.isp || geo.connection?.org || 'Broadband Provider',
          loading: false,
        };
        listeners.forEach(cb => cb(cachedTelemetry!));
      }
    })
    .catch(() => {
      if (cachedTelemetry) {
        cachedTelemetry = {
          ...cachedTelemetry,
          ip: 'Shielded / Offline',
          isp: 'Local Subnet',
          loading: false,
        };
        listeners.forEach(cb => cb(cachedTelemetry!));
      }
    });
}
