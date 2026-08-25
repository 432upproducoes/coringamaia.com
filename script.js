/* ==========================================================================
   PERFORMANCE MANAGER ADAPTATIVO (PRESERVAÇÃO INTEGRAL DE HARDWARE CAPAZ)
   ========================================================================== */
const PerformanceManager = {
  tier: 'FULL', // 'FULL', 'ADAPTIVE', 'LOW'
  fpsHistory: [],
  lastFpsCheck: performance.now(),
  frameCount: 0,
  
  detectTier() {
    const ua = navigator.userAgent;
    const gl = document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl');
    let renderer = '';
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      }
    }

    // 1. WHITELIST ABSOLUTA: iPhone 12+ e iPad 10+
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      const screenHeight = Math.max(window.screen.width, window.screen.height);
      const isAppleModernA14 = /Apple A14|Apple A15|Apple A16|Apple A17|Apple A18|Apple M/.test(renderer);
      const isIPhone12OrHigher = screenHeight >= 844 || isAppleModernA14;
      const isIPad10OrHigher = (navigator.maxTouchPoints > 1 && screenHeight >= 1080) || isAppleModernA14;

      if (isIPhone12OrHigher || isIPad10OrHigher) {
        this.tier = 'FULL';
        return;
      }
    }

    // 2. DETECÇÃO CONSERVADORA PARA DEMAIS DISPOSITIVOS
    const isLowEndGPU = /Mali-G52|Mali-G51|Mali-G31|Mali-T|Adreno 3|Adreno 4|Adreno 505|Adreno 506|PowerVR/i.test(renderer);
    const lowRAM = navigator.deviceMemory && navigator.deviceMemory <= 3;
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (isLowEndGPU || lowRAM || lowCores) {
      this.tier = 'LOW';
    } else {
      this.tier = 'ADAPTIVE';
    }
  },

  monitorFPS(now) {
    if (this.tier === 'FULL') return; // NUNCA faz downgrade em iPhone 12+ / iPad 10+ / GPUs parrudas

    this.frameCount++;
    if (now - this.lastFpsCheck >= 1000) {
      const currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastFpsCheck = now;
      this.fpsHistory.push(currentFPS);

      if (this.fpsHistory.length > 3) {
        this.fpsHistory.shift();
        const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

        // Rebaixamento automático apenas em aparelhos extremamente fracos se mantiverem FPS < 24
        if (avgFPS < 24 && this.tier === 'ADAPTIVE') {
          this.tier = 'LOW';
          this.applyAdaptiveLimits();
        }
      }
    }
  },

  applyAdaptiveLimits() {
    if (this.tier === 'LOW') {
      if (coreParticles.length > 15) coreParticles.length = 15;
      if (chromeOrbitalBelt.length > 12) chromeOrbitalBelt.length = 12;
      if (floatingOrbs.length > 10) floatingOrbs.length = 10;
    }
  }
};

PerformanceManager.detectTier();

/* ==========================================================================
   CREDENCIAIS DIRETAS DE DISPARO (INLINE)
   ========================================================================== */
const TELEGRAM_BOT_TOKEN = "8835958314:AAFGe18Mxm7Z_P_GlRPPRzv8cUWbi7mHX00";
const TELEGRAM_CHAT_ID = "8996965457";

const SUPABASE_URL = "https://paetkspbfejtjjkngqej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZXRrc3BiZmVqdGpqa25ncWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDU2OTgsImV4cCI6MjA4NjQ4MTY5OH0.IiYweZ2g3bP7b0o7VvBW5LLb6d1oHtSNFUZlVkIsdsA";

let supabaseClient = null;
if (typeof supabase !== 'undefined' && window.supabase && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const WORKS_DATA = [
  {
    id: '432up',
    title: '432UP',
    category: 'AUDIOVISUAL & BRANDING',
    tagline: 'Frequência de Elevação Artística',
    description: 'Núcleo de criação audiovisual de alto padrão. Produções autorais, identidade sonora e experiências visuais desenvolvidas para marcar presença e transmitir autenticidade refinada.',
    colorActive: '#f59e0b',
    posDesktop: { x: -32, y: -22, z: 20 },
    posMobile:  { x: -30, y: -32, z: 0 }
  },
  {
    id: 'faco-sites',
    title: 'FAÇO SITES',
    category: 'ARQUITETURA DIGITAL',
    tagline: 'Interfaces Vivas & Alta Performance',
    description: 'Engenharia web sob medida, unindo estética minimalista, neuro-psicologia de navegação e tecnologia fluida para criar experiências digitais memoráveis.',
    colorActive: '#06b6d4',
    posDesktop: { x: 32, y: -20, z: -10 },
    posMobile:  { x: 30, y: -18, z: 0 }
  },
  {
    id: 'humanumah',
    title: 'HUMANUMAH',
    category: 'NEURO-MARKETING & BRANDING',
    tagline: 'Conexões Humanas Autênticas',
    description: 'Estratégias de posicionamento e comunicação fundamentadas em empatia profunda, psicologia comportamental e storytelling de impacto.',
    colorActive: '#a3e635',
    posDesktop: { x: -36, y: 18, z: -20 },
    posMobile:  { x: -32, y: 15, z: 0 }
  },
  {
    id: 'a-quarta-via',
    title: 'A QUARTA VIA',
    category: 'FILOSOFIA & EXPERIMENTOS',
    tagline: 'Caminhos Não Mapeados',
    description: 'O ponto de divergência entre a arte pura, a técnica rigorosa e o mistério. Um espaço de experimentação conceitual sem amarras convencionais.',
    colorActive: '#8b5cf6',
    posDesktop: { x: 36, y: 22, z: 15 },
    posMobile:  { x: 32, y: 32, z: 0 }
  },
  {
    id: 'swing-tropical',
    title: 'SWING TROPICAL',
    category: 'EXPERIÊNCIA SONORA',
    tagline: 'Brasilidade & Energia Autoral',
    description: 'Um conceito musical vivo e vibrante que celebra a riqueza do ritmo brasileiro através de uma fusão sofisticada de axé, samba e energia rock.',
    colorActive: '#ec4899',
    posDesktop: { x: -12, y: -36, z: 30 },
    posMobile:  { x: 0, y: -45, z: 0 }
  },
  {
    id: 'festa-no-condominio',
    title: 'FESTA NO CONDOMÍNIO',
    category: 'ENTRETENIMENTO SOCIAL',
    tagline: 'Vivências Hipertoque & Celebração',
    description: 'Projeto voltado para curadoria de entretenimento e integração em comunidades fechadas, entregando momentos únicos com padrão executivo.',
    colorActive: '#14b8a6',
    posDesktop: { x: 14, y: 36, z: -30 },
    posMobile:  { x: 0, y: 45, z: 0 }
  }
];

const state = {
  isMobile: window.innerWidth <= 768,
  mouseX: 0,
  mouseY: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  
  fluidX: 0,
  fluidY: 0,
  fluidZ: 0,
  targetFluidX: 0,
  targetFluidY: 0,
  targetFluidZ: 0,

  hoveredWork: null,
  selectedWork: null,
  lastViewedWork: 'Geral',
  phraseVisible: false,
  phraseTimer: 0,
  birthProgress: 0,
  isBirthActive: false,
  coreRecoil: 0,
  nextIdleInterval: 900,
  activePointers: new Map(),
  crtAnimating: false
};

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma !== null && e.beta !== null) {
      state.targetFluidX = Math.max(-1, Math.min(1, e.gamma / 35));
      state.targetFluidY = Math.max(-1, Math.min(1, (e.beta - 40) / 35));
      
      if (e.alpha !== null) {
        state.targetFluidZ = Math.sin((e.alpha * Math.PI) / 180);
      }
    }
  });
}

const introScreen = document.getElementById('intro-screen');
const introBox = document.getElementById('intro-box');
const flashOverlay = document.getElementById('flash-overlay');
const universe = document.getElementById('universe');
const viewport = document.getElementById('constellation-viewport');
const centralPhrase = document.getElementById('central-phrase');
const canvas = document.getElementById('core-canvas');
const ctx = canvas.getContext('2d');
const modalOverlay = document.getElementById('modal-overlay');
const modalBox = document.getElementById('modal-box');
const enigmaTrigger = document.getElementById('enigma-trigger');

const crtScreen = document.getElementById('crt-screen');
const crtCanvas = document.getElementById('crt-static-canvas');
const crtCtx = crtCanvas.getContext('2d');
const blackoutOverlay = document.getElementById('blackout-overlay');

let screenCards = [];
let teslaDischarges = [];
let coreParticles = [];
let internalSynapses = [];
let introExplosionParticles = [];
let floatingOrbs = [];
let chromeOrbitalBelt = [];
let shockwaves = [];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  crtCanvas.width = window.innerWidth / 2;
  crtCanvas.height = window.innerHeight / 2;

  state.isMobile = window.innerWidth <= 768;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawCRTStatic() {
  if (!state.crtAnimating) return;
  const w = crtCanvas.width;
  const h = crtCanvas.height;
  const imgData = crtCtx.createImageData(w, h);
  const buffer = new Uint32Array(imgData.data.buffer);

  for (let i = 0; i < buffer.length; i++) {
    if (Math.random() < 0.6) {
      const val = Math.floor(Math.random() * 255);
      buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
    } else {
      buffer[i] = (255 << 24) | (132 << 16) | (204 << 8) | 22;
    }
  }
  crtCtx.putImageData(imgData, 0, 0);
  requestAnimationFrame(drawCRTStatic);
}

const PARTICLE_COUNT = PerformanceManager.tier === 'LOW' ? 12 : (state.isMobile ? 25 : 50);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  coreParticles.push({
    angle: Math.random() * Math.PI * 2,
    radius: 3 + Math.random() * 42,
    speed: (0.01 + Math.random() * 0.025) * (Math.random() < 0.5 ? 1 : -1),
    size: 0.8 + Math.random() * 2.2,
    color: ['255, 255, 255', '217, 70, 239', '192, 132, 252', '132, 204, 22'][i % 4],
    alpha: 0.5 + Math.random() * 0.5
  });
}

const CHROME_BELT_COUNT = PerformanceManager.tier === 'LOW' ? 12 : (state.isMobile ? 18 : 32);
for (let i = 0; i < CHROME_BELT_COUNT; i++) {
  chromeOrbitalBelt.push({
    angle: (i / CHROME_BELT_COUNT) * Math.PI * 2,
    speed: (0.012 + Math.random() * 0.022) * (i % 2 === 0 ? 1 : -1),
    radiusOffset: Math.random() * 16,
    size: 2.2 + Math.random() * 4.5,
    colorRgb: ['255, 255, 255', '232, 121, 249', '192, 132, 252', '132, 204, 22'][i % 4],
    alpha: 0.35 + Math.random() * 0.45
  });
}

const ORB_COUNT = PerformanceManager.tier === 'LOW' ? 10 : (state.isMobile ? 18 : 35);
for (let i = 0; i < ORB_COUNT; i++) {
  floatingOrbs.push({
    angle: Math.random() * Math.PI * 2,
    distance: 70 + Math.random() * 110,
    speed: (0.002 + Math.random() * 0.008) * (Math.random() < 0.5 ? 1 : -1),
    size: 2 + Math.random() * 4.5,
    alpha: 0.25 + Math.random() * 0.65,
    color: ['217, 70, 239', '132, 204, 22', '192, 132, 252', '16, 185, 129'][i % 4],
    wobble: Math.random() * 10
  });
}

const SHOCKWAVE_COUNT = 2;
for (let i = 0; i < SHOCKWAVE_COUNT; i++) {
  shockwaves.push({
    progress: i / SHOCKWAVE_COUNT,
    speed: 0.003 + i * 0.0005
  });
}

function drawSovereignCore3D(time) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  if (state.coreRecoil > 0) state.coreRecoil -= 0.035;
  if (state.coreRecoil < 0) state.coreRecoil = 0;

  const recoilPulse = state.coreRecoil * 16;
  const baseRadius = (state.isMobile ? 65 : 105) + recoilPulse;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.globalCompositeOperation = 'screen';

  const pulse = Math.sin(time * 0.002) * 14;
  const nebulaGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, baseRadius * 2.6 + pulse);
  nebulaGrad.addColorStop(0.0, `rgba(217, 70, 239, ${0.28 + state.coreRecoil * 0.35})`);
  nebulaGrad.addColorStop(0.35, 'rgba(139, 92, 246, 0.18)');
  nebulaGrad.addColorStop(0.70, 'rgba(132, 204, 22, 0.09)');
  nebulaGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = nebulaGrad;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 2.6 + pulse, 0, Math.PI * 2);
  ctx.fill();

  floatingOrbs.forEach(orb => {
    orb.angle += orb.speed;
    orb.wobble += 0.03;
    const currentDist = orb.distance + Math.sin(orb.wobble) * 12;
    const ox = Math.cos(orb.angle) * currentDist;
    const oy = Math.sin(orb.angle) * currentDist;

    const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.size * 2);
    orbGrad.addColorStop(0.0, `rgba(${orb.color}, ${orb.alpha})`);
    orbGrad.addColorStop(0.5, `rgba(${orb.color}, ${orb.alpha * 0.4})`);
    orbGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, orb.size * 2, 0, Math.PI * 2);
    ctx.fill();
  });

  const coreR = baseRadius * 0.42;

  const lightOffX = Math.cos(time * 0.002) * (coreR * 0.15);
  const lightOffY = Math.sin(time * 0.002) * (coreR * 0.15);

  const coreLightGrad = ctx.createRadialGradient(lightOffX, lightOffY, 0, 0, 0, coreR * 1.85);
  coreLightGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
  coreLightGrad.addColorStop(0.20, 'rgba(245, 210, 255, 0.80)');
  coreLightGrad.addColorStop(0.48, 'rgba(217, 70, 239, 0.50)');
  coreLightGrad.addColorStop(0.72, 'rgba(139, 92, 246, 0.18)');
  coreLightGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = coreLightGrad;
  ctx.beginPath();
  ctx.arc(0, 0, coreR * 1.85, 0, Math.PI * 2);
  ctx.fill();

  shockwaves.forEach((ring) => {
    ring.progress += ring.speed;
    if (ring.progress > 1) ring.progress = 0;

    const currentRadius = coreR * (0.3 + ring.progress * 1.5);
    const opacity = (1 - ring.progress) * 0.35;

    ctx.save();
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 12;

    const steps = 60;
    ctx.beginPath();
    let isDrawing = false;

    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const noise1 = Math.sin(a * 7 + time * 0.008) * 3.5;
      const noise2 = Math.cos(a * 13 - time * 0.012) * 2.0;
      const noise3 = Math.sin(a * 23) * 1.5;
      const r = Math.max(0.1, currentRadius + noise1 + noise2 + noise3);

      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;

      const gapCheck = Math.sin(a * 5 + ring.progress * 10) + Math.cos(a * 11);
      if (gapCheck < -1.1) {
        isDrawing = false;
        continue;
      }

      if (!isDrawing) {
        ctx.moveTo(x, y);
        isDrawing = true;
      } else {
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(245, 210, 255, ${opacity * (0.4 + Math.random() * 0.6)})`;
      ctx.lineWidth = (0.5 + Math.random() * 1.8);
    }

    ctx.stroke();
    ctx.restore();
  });

  chromeOrbitalBelt.forEach(orb => {
    orb.angle += orb.speed;
    const r = coreR + orb.radiusOffset + Math.sin(time * 0.003 + orb.angle) * 5;
    const bx = Math.cos(orb.angle) * r;
    const by = Math.sin(orb.angle) * r;

    const sphereGlow = ctx.createRadialGradient(bx, by, 0, bx, by, orb.size * 2.2);
    sphereGlow.addColorStop(0.0, `rgba(${orb.colorRgb}, ${orb.alpha})`);
    sphereGlow.addColorStop(0.35, `rgba(${orb.colorRgb}, ${orb.alpha * 0.45})`);
    sphereGlow.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = sphereGlow;
    ctx.beginPath();
    ctx.arc(bx, by, orb.size * 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  if (Math.random() < 0.45) {
    const baseAngle = Math.random() * Math.PI * 2;
    internalSynapses.push({
      angle: baseAngle,
      curl: (Math.random() - 0.5) * 1.8,
      progress: 0,
      speed: 0.022 + Math.random() * 0.02,
      color: Math.random() < 0.6 ? '#FFFFFF' : '#d946ef',
      maxRadius: coreR * (1.1 + Math.random() * 0.4)
    });
  }

  for (let s = internalSynapses.length - 1; s >= 0; s--) {
    const syn = internalSynapses[s];
    syn.progress += syn.speed;

    if (syn.progress >= 1.0) {
      internalSynapses.splice(s, 1);
      continue;
    }

    const t = syn.progress;
    const easedProgress = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const currentRadius = syn.maxRadius * easedProgress;
    const currentAngle = syn.angle + syn.curl * easedProgress;

    const startX = 0;
    const startY = 0;

    const ctrlDist = currentRadius * 0.55;
    const ctrlAngle = syn.angle + (syn.curl * 0.7);
    const ctrlX = Math.cos(ctrlAngle) * ctrlDist;
    const ctrlY = Math.sin(ctrlAngle) * ctrlDist;

    const endX = Math.cos(currentAngle) * currentRadius;
    const endY = Math.sin(currentAngle) * currentRadius;

    const alpha = Math.sin(t * Math.PI);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);

    ctx.strokeStyle = syn.color;
    ctx.lineWidth = 1.8 * alpha;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = syn.color;
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.8 * alpha;
    ctx.globalAlpha = alpha * 0.9;
    ctx.shadowBlur = 4;
    ctx.stroke();

    ctx.restore();
  }

  coreParticles.forEach(p => {
    p.angle += p.speed;
    const px = Math.cos(p.angle) * p.radius;
    const py = Math.sin(p.angle) * p.radius;

    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function generateTeslaStrands(startX, startY, targetX, targetY, targetCard, mode) {
  let strandCount = 2;
  if (mode === 'card-touch') strandCount = 5;
  else if (mode === 'air-touch') strandCount = Math.floor(Math.random() * 3) + 2;
  else if (mode === 'idle') strandCount = Math.floor(Math.random() * 2) + 1;

  if (PerformanceManager.tier === 'LOW' && mode === 'idle') {
    strandCount = 1;
  }

  const angleToTarget = Math.atan2(targetY - startY, targetX - startX);
  const strands = [];

  for (let s = 0; s < strandCount; s++) {
    const spreadAngle = angleToTarget + (Math.random() - 0.5) * (mode === 'card-touch' ? 0.4 : 0.25);
    const coreBaseRadius = (state.isMobile ? 65 : 105);
    const startOffsetRadius = coreBaseRadius * 0.38 + Math.random() * 10;
    const sx = startX + Math.cos(spreadAngle) * startOffsetRadius;
    const sy = startY + Math.sin(spreadAngle) * startOffsetRadius;

    let ex = targetX;
    let ey = targetY;

    if (targetCard) {
      const rect = targetCard.element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        ex = targetX + (Math.random() - 0.5) * (rect.width * 0.85);
        ey = targetY + (Math.random() - 0.5) * (rect.height * 0.85);
      }
    } else {
      ex = targetX + (Math.random() - 0.5) * 16;
      ey = targetY + (Math.random() - 0.5) * 16;
    }

    const midX = (sx + ex) / 2 + (Math.random() - 0.5) * (mode === 'card-touch' ? 22 : 16);
    const midY = (sy + ey) / 2 + (Math.random() - 0.5) * (mode === 'card-touch' ? 22 : 16);

    function buildBraidedPath(p1X, p1Y, p2X, p2Y, depth, displacement) {
      if (depth <= 0) return [{ x: p1X, y: p1Y }, { x: p2X, y: p2Y }];

      const mx = (p1X + p2X) / 2 + (Math.random() - 0.5) * displacement;
      const my = (p1Y + p2Y) / 2 + (Math.random() - 0.5) * displacement;

      const l = buildBraidedPath(p1X, p1Y, mx, my, depth - 1, displacement * 0.5);
      const r = buildBraidedPath(mx, my, p2X, p2Y, depth - 1, displacement * 0.5);
      return l.concat(r.slice(1));
    }

    const seg1 = buildBraidedPath(sx, sy, midX, midY, 3, mode === 'card-touch' ? 22 : 18);
    const seg2 = buildBraidedPath(midX, midY, ex, ey, 3, mode === 'card-touch' ? 28 : 20);
    const fullPath = seg1.concat(seg2.slice(1));

    const parasiticSparks = [];
    for (let k = 2; k < fullPath.length - 2; k += 2) {
      if (Math.random() < 0.3) {
        const pt = fullPath[k];
        const pAngle = Math.random() * Math.PI * 2;
        const pLen = 8 + Math.random() * 18;
        parasiticSparks.push({ sx: pt.x, sy: pt.y, ex: pt.x + Math.cos(pAngle) * pLen, ey: pt.y + Math.sin(pAngle) * pLen });
      }
    }

    strands.push({ path: fullPath, sparks: parasiticSparks, endX: ex, endY: ey });
  }
  return strands;
}

function createTeslaDischarge(targetX = null, targetY = null, targetCardObj = null, mode = 'idle', isPersistent = false) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  let targetCard = targetCardObj;
  let endX = targetX;
  let endY = targetY;

  if (mode === 'idle') {
    const roll = Math.random();

    if (roll < 0.55 && screenCards.length > 0) {
      targetCard = screenCards[Math.floor(Math.random() * screenCards.length)];
    } else if (roll < 0.85) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDist = 120 + Math.random() * (Math.min(window.innerWidth, window.innerHeight) * 0.38);
      endX = centerX + Math.cos(randomAngle) * randomDist;
      endY = centerY + Math.sin(randomAngle) * randomDist;
    } else if (screenCards.length > 0) {
      const chosenCard = screenCards[Math.floor(Math.random() * screenCards.length)];
      const rect = chosenCard.element.getBoundingClientRect();
      if (rect.left > 10 && rect.top > 10) {
        createTeslaDischarge(null, null, chosenCard, 'idle-card');
        const oppAngle = Math.atan2(rect.top - centerY, rect.left - centerX) + Math.PI + (Math.random() - 0.5);
        const oppDist = 140 + Math.random() * 200;
        createTeslaDischarge(centerX + Math.cos(oppAngle) * oppDist, centerY + Math.sin(oppAngle) * oppDist, null, 'air-touch');
      }
      return;
    }
  }

  if (targetCard) {
    const rect = targetCard.element.getBoundingClientRect();
    if (rect.left < 5 && rect.top < 5 && rect.width === 0) return;
    endX = rect.left + rect.width / 2;
    endY = rect.top + rect.height / 2;
  }

  if (endX === null || endY === null || isNaN(endX) || isNaN(endY) || (endX < 10 && endY < 10)) return;

  if (mode === 'card-touch' || mode === 'air-touch') {
    state.coreRecoil = 0.8;
  }

  const targetColor = targetCard ? targetCard.data.colorActive : ['#c084fc', '#84cc16', '#d946ef', '#10b981'][Math.floor(Math.random() * 4)];
  const strands = generateTeslaStrands(centerX, centerY, endX, endY, targetCard, mode);

  const surfaceWrapPaths = [];
  if (targetCard) {
    const rect = targetCard.element.getBoundingClientRect();
    if (rect.width > 0) {
      const wrapCorners = [
        { x: rect.left + 8, y: rect.top + 8 },
        { x: rect.right - 8, y: rect.top + 8 },
        { x: rect.right - 8, y: rect.bottom - 8 },
        { x: rect.left + 8, y: rect.bottom - 8 }
      ];

      for (let w = 0; w < (mode === 'card-touch' ? 4 : 2); w++) {
        const c1 = wrapCorners[w % 4];
        const c2 = wrapCorners[(w + 1) % 4];
        surfaceWrapPaths.push({ sx: c1.x, sy: c1.y, ex: c2.x, ey: c2.y });
      }

      targetCard.element.classList.add('energy-hit');
      setTimeout(() => targetCard.element.classList.remove('energy-hit'), mode === 'card-touch' ? 900 : 600);
    }
  }

  const discharge = {
    strands,
    surfaceWrapPaths,
    life: 1.0,
    decay: isPersistent ? 0 : (mode === 'card-touch' ? 0.025 : (mode === 'air-touch' ? 0.04 : 0.035)),
    color: targetColor,
    targetCard,
    mode,
    isPersistent,
    targetX: endX,
    targetY: endY
  };

  teslaDischarges.push(discharge);
  return discharge;
}

function updateAndDrawTeslaDischarges() {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = teslaDischarges.length - 1; i >= 0; i--) {
    const discharge = teslaDischarges[i];

    if (discharge.targetX < 10 && discharge.targetY < 10) {
      teslaDischarges.splice(i, 1);
      continue;
    }

    if (discharge.isPersistent) {
      discharge.strands = generateTeslaStrands(centerX, centerY, discharge.targetX, discharge.targetY, discharge.targetCard, discharge.mode);
    } else {
      discharge.life -= discharge.decay;
      if (discharge.life <= 0) {
        teslaDischarges.splice(i, 1);
        continue;
      }
    }

    const life = discharge.life;
    const color = discharge.color;
    const isCardTouch = discharge.mode === 'card-touch';

    discharge.strands.forEach(strand => {
      const isAir = !discharge.targetCard;

      ctx.strokeStyle = color;
      ctx.lineWidth = (isCardTouch ? 10 : (isAir ? 4 : 6)) * life;
      ctx.globalAlpha = (isCardTouch ? 0.2 : 0.12) * life;
      ctx.shadowColor = color;
      ctx.shadowBlur = isCardTouch ? 20 : 10;

      ctx.beginPath();
      for (let j = 0; j < strand.path.length; j++) {
        const pt = strand.path[j];
        if (j === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      ctx.lineWidth = (isCardTouch ? 2.8 : (isAir ? 1.4 : 1.8)) * life;
      ctx.globalAlpha = (isCardTouch ? 0.75 : 0.55) * life;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let j = 0; j < strand.path.length; j++) {
        const pt = strand.path[j];
        if (j === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = (isCardTouch ? 1.2 : 0.8) * life;
      ctx.globalAlpha = (isCardTouch ? 0.95 : 0.85) * life;
      ctx.shadowBlur = 4;

      ctx.beginPath();
      for (let j = 0; j < strand.path.length; j++) {
        const pt = strand.path[j];
        if (j === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      strand.sparks.forEach(spk => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.0 * life;
        ctx.globalAlpha = 0.5 * life;
        ctx.beginPath();
        ctx.moveTo(spk.sx, spk.sy);
        ctx.lineTo(spk.ex, spk.ey);
        ctx.stroke();
      });
    });

    discharge.surfaceWrapPaths.forEach(wrap => {
      ctx.strokeStyle = color;
      ctx.lineWidth = (isCardTouch ? 2.2 : 1.4) * life;
      ctx.globalAlpha = (isCardTouch ? 0.8 : 0.4) * life;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(wrap.sx, wrap.sy);
      ctx.lineTo(wrap.ex, wrap.ey);
      ctx.stroke();
    });

    if (!discharge.targetCard && discharge.strands.length > 0) {
      const terminalPt = discharge.strands[0];
      if (terminalPt) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(terminalPt.endX, terminalPt.endY, 2.2 * life, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

function handlePointerDown(id, clientX, clientY) {
  if (!universe.classList.contains('visible')) return;

  const hitElement = document.elementFromPoint(clientX, clientY);
  const hitCardElement = hitElement ? hitElement.closest('.screen-card') : null;
  let cardObj = null;

  if (hitCardElement) {
    cardObj = screenCards.find(c => c.element === hitCardElement);
  }

  if (state.isMobile || !cardObj) {
    screenCards.forEach(c => {
      if (c !== cardObj) {
        const cdx = c.currentX - clientX;
        const cdy = c.currentY - clientY;
        const dist = Math.hypot(cdx, cdy) || 0.001;
        if (dist < 280) {
          const pushForce = (1 - dist / 280) * 35;
          c.physX += (cdx / dist) * pushForce;
          c.physY += (cdy / dist) * pushForce;
        }
      }
    });
  }

  const mode = cardObj ? 'card-touch' : 'air-touch';
  const discharge = createTeslaDischarge(clientX, clientY, cardObj, mode, true);

  if (discharge) {
    state.activePointers.set(id, { discharge, cardObj });
  }
}

function handlePointerMove(id, clientX, clientY) {
  const active = state.activePointers.get(id);
  if (active && active.discharge) {
    const hitElement = document.elementFromPoint(clientX, clientY);
    const hitCardElement = hitElement ? hitElement.closest('.screen-card') : null;
    const cardObj = hitCardElement ? screenCards.find(c => c.element === hitCardElement) : null;

    active.discharge.targetX = clientX;
    active.discharge.targetY = clientY;
    active.discharge.targetCard = cardObj;
    active.discharge.mode = cardObj ? 'card-touch' : 'air-touch';
    if (cardObj) {
      active.discharge.color = cardObj.data.colorActive;
    }
  }
}

function handlePointerUp(id) {
  const active = state.activePointers.get(id);
  if (active && active.discharge) {
    active.discharge.isPersistent = false;
    active.discharge.decay = active.discharge.mode === 'card-touch' ? 0.03 : 0.05;
  }
  state.activePointers.delete(id);
}

window.addEventListener('pointerdown', (e) => handlePointerDown(e.pointerId, e.clientX, e.clientY));
window.addEventListener('pointermove', (e) => handlePointerMove(e.pointerId, e.clientX, e.clientY));
window.addEventListener('pointerup', (e) => handlePointerUp(e.pointerId));
window.addEventListener('pointercancel', (e) => handlePointerUp(e.pointerId));

function initConstellation() {
  viewport.innerHTML = '';
  screenCards = [];

  const availablePositions = WORKS_DATA.map(w => state.isMobile ? w.posMobile : w.posDesktop);
  const shuffledPositions = availablePositions.sort(() => Math.random() - 0.5);

  WORKS_DATA.forEach((work, index) => {
    const card = document.createElement('div');
    card.className = 'screen-card';
    card.dataset.id = work.id;

    card.style.setProperty('--card-color-glow', work.colorActive + '22');
    card.style.setProperty('--card-color-active', work.colorActive);
    card.style.setProperty('--card-color-shadow', work.colorActive + '66');
    card.style.backgroundImage = `url('imagens/${work.id}.webp')`;

    viewport.appendChild(card);

    const posData = shuffledPositions[index];

    const cardObj = {
      element: card,
      data: work,
      baseX: posData.x,
      baseY: posData.y,
      baseZ: posData.z,
      orbitPhase: Math.random() * Math.PI * 2,
      orbitSpeed: 0.006 + Math.random() * 0.008,
      orbitRadiusX: 10 + Math.random() * 12,
      orbitRadiusY: 14 + Math.random() * 14,
      
      inertiaMass: 0.85 + Math.random() * 0.65,
      driftX: 0,
      driftY: 0,
      driftZ: 0,

      physX: 0,
      physY: 0,
      interRepelX: 0,
      interRepelY: 0,
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2
    };

    card.addEventListener('mouseenter', () => state.hoveredWork = cardObj);
    card.addEventListener('mouseleave', () => { if (state.hoveredWork === cardObj) state.hoveredWork = null; });

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      openWorkModal(work, cardObj);
    });

    screenCards.push(cardObj);
  });
}

function openWorkModal(work, cardObj) {
  state.selectedWork = work;
  state.lastViewedWork = work.title;

  const rect = cardObj.element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 2; i++) {
    setTimeout(() => createTeslaDischarge(cx, cy, cardObj, 'card-touch'), i * 80);
  }

  modalBox.className = 'modal-content';
  modalBox.style.setProperty('--modal-color', work.colorActive);
  modalBox.innerHTML = `
    <div class="modal-category">${work.category}</div>
    <h2 class="modal-title">${work.title}</h2>
    <div class="modal-tagline">${work.tagline}</div>
    <p class="modal-description">${work.description}</p>
    <button id="btn-close-modal" class="btn-return">
      <span>&larr;</span> Voltar à Constelação
    </button>
  `;

  setTimeout(() => {
    modalOverlay.classList.add('active');
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  }, 300);
}

function openEnigmaModal() {
  modalBox.className = 'modal-content enigma-card';
  modalBox.innerHTML = `
    <div class="enigma-question-container" id="enigma-q-container">
      <svg class="enigma-question-svg" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
        <path fill="rgba(132, 204, 22, 0.55)" d="
          M 50 18
          C 33 18 22 30 22 46
          C 22 50 25 54 30 54
          L 38 54
          C 42 54 44 51 44 47
          C 44 37 50 32 58 32
          C 67 32 73 38 73 47
          C 73 55 68 61 58 68
          L 50 73
          C 44 77 42 83 42 92
          L 42 102
          L 58 102
          L 58 94
          C 58 88 60 84 66 80
          L 74 75
          C 86 67 90 58 90 47
          C 90 28 74 18 50 18
          Z
          M 42 118
          L 58 118
          L 58 134
          L 42 134
          Z"/>
      </svg>
    </div>
    <div class="enigma-card-body">
      <div id="enigma-error-msg" style="display:none; opacity:0; transition:opacity 0.6s ease; color:#ef4444; font-size:0.75rem; text-align:center; letter-spacing:0.08em; text-transform:uppercase; font-weight:600;"></div>
      <textarea id="enigma-textarea" class="enigma-input" placeholder=""></textarea>
      <input id="enigma-phone" type="text" class="enigma-input" placeholder="?? ?????-????" />
      <button id="btn-enigma-send" class="enigma-submit-btn"></button>
    </div>
  `;

  modalOverlay.classList.add('active');

  const qContainer = document.getElementById('enigma-q-container');
  const txtArea = document.getElementById('enigma-textarea');
  const phoneInput = document.getElementById('enigma-phone');
  const errorMsg = document.getElementById('enigma-error-msg');
  let errorTimeout = null;

  function hideErrorMessage() {
    if (errorMsg) {
      errorMsg.style.opacity = '0';
      setTimeout(() => {
        errorMsg.style.display = 'none';
      }, 600);
    }
  }

  function showErrorMessage(text) {
    if (errorMsg) {
      if (errorTimeout) clearTimeout(errorTimeout);
      errorMsg.innerText = text;
      errorMsg.style.display = 'block';
      setTimeout(() => {
        errorMsg.style.opacity = '1';
      }, 10);

      errorTimeout = setTimeout(() => {
        hideErrorMessage();
      }, 3000);
    }
  }

  function updateQuestionVisibility() {
    if ((txtArea && txtArea.value.trim() !== '') || (phoneInput && phoneInput.value.trim() !== '')) {
      qContainer.style.opacity = '0';
      qContainer.style.pointerEvents = 'none';
      hideErrorMessage();
    } else {
      qContainer.style.opacity = '1';
    }
  }

  if (txtArea) txtArea.addEventListener('input', updateQuestionVisibility);
  if (phoneInput) phoneInput.addEventListener('input', updateQuestionVisibility);

  document.getElementById('btn-enigma-send').addEventListener('click', async () => {
    const messageVal = txtArea ? txtArea.value.trim() : '';
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';

    if (!messageVal && !phoneVal) {
      showErrorMessage("O SILÊNCIO NÃO É UM CONTATO.");
      return;
    }

    hideErrorMessage();

    const nomeFinal = phoneVal || "Anônimo (Coringa)";
    const msgFinal = `${messageVal} [Origem: HUB Coringa - Contexto: ${state.lastViewedWork}]`;

    // 1. DISPARO TELEGRAM DIRETO
    try {
      const textoTelegram = `🔥 *NOVO LEAD NA 432UP! (CORINGA)*\n\n` +
                            `👤 *Nome/Contato:* ${nomeFinal}\n` +
                            `📞 *Telefone:* ${phoneVal}\n` +
                            `💬 *Detalhes:* ${msgFinal}`;

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: textoTelegram,
          parse_mode: 'Markdown'
        })
      }).catch(e => console.error("Erro no Telegram:", e));
    } catch (errTg) {
      console.error("Falha na chamada do Telegram:", errTg);
    }

    // 2. DISPARO SUPABASE DIRETO (TRATADO DE FORMA ASSÍNCRONA)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('co_leads').insert([{
          nome: nomeFinal,
          whatsapp: phoneVal,
          mensagem: msgFinal,
          origem: 'hub_coringa',
          created_at: new Date().toISOString()
        }]);

        if (error) {
          console.error("Erro Supabase:", error);
          showErrorMessage("NÃO CONSEGUI RECEBER.\nTENTE NOVAMENTE.");
          return;
        }
      } catch (errSupa) {
        console.error("Falha na gravação do Supabase:", errSupa);
        showErrorMessage("NÃO CONSEGUI RECEBER.\nTENTE NOVAMENTE.");
        return;
      }
    }

    closeModal();
    triggerSuccessSequence();
  });
}

function triggerSuccessSequence() {
  const showStep = (txt) => {
    introBox.innerHTML = `<span class="feedback-text">${txt}</span>`;
  };

  introScreen.classList.remove('fade-out');
  flashOverlay.classList.add('active');
  triggerIntroExplosion();
  setTimeout(() => flashOverlay.classList.remove('active'), 600);

  showStep("RECEBI.");

  setTimeout(() => {
    showStep("AGORA É COMIGO.");
    setTimeout(() => {
      showStep("EU ENTRO EM CONTATO.");
      setTimeout(() => {
        introBox.innerHTML = `
          <span class="ha-word">HA</span>
          <span class="ha-word">HA</span>
          <span class="ha-word">HA</span>
        `;
        flashOverlay.classList.add('active');
        triggerIntroExplosion();
        setTimeout(() => flashOverlay.classList.remove('active'), 600);

        setTimeout(() => {
          showStep("CONEXÃO ENCERRADA.");
          setTimeout(() => {
            state.crtAnimating = true;
            drawCRTStatic();
            crtScreen.className = 'active';
            crtCanvas.className = '';

            setTimeout(() => {
              crtCanvas.className = 'crt-turn-off';
              setTimeout(() => {
                state.crtAnimating = false;
                crtScreen.style.display = 'none';
                blackoutOverlay.style.display = 'block';
              }, 800);
            }, 2000);
          }, 1600);
        }, 1800);
      }, 1500);
    }, 1500);
  }, 1500);
}

function closeModal() {
  modalOverlay.classList.remove('active');
  state.selectedWork = null;
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

enigmaTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  openEnigmaModal();
});

window.addEventListener('mousemove', (e) => {
  state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  state.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  
  state.targetFluidX = state.targetMouseX;
  state.targetFluidY = state.targetMouseY;
  state.targetFluidZ = state.targetMouseX * state.targetMouseY;
});

function triggerIntroExplosion() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const dist = 300 + Math.random() * 400;
    introExplosionParticles.push({
      sx: centerX, sy: centerY,
      ex: centerX + Math.cos(angle) * dist,
      ey: centerY + Math.sin(angle) * dist,
      life: 1.0,
      decay: 0.025 + Math.random() * 0.02,
      color: ['#d946ef', '#84cc16', '#c084fc', '#10b981'][i % 4]
    });
  }
}

function updateAndDrawIntroExplosion() {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (let i = introExplosionParticles.length - 1; i >= 0; i--) {
    const p = introExplosionParticles[i];
    p.life -= p.decay;

    if (p.life <= 0) {
      introExplosionParticles.splice(i, 1);
      continue;
    }

    const currentX = p.sx + (p.ex - p.sx) * (1 - p.life);
    const currentY = p.sy + (p.ey - p.sy) * (1 - p.life);

    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3.0 * p.life;
    ctx.globalAlpha = p.life * 0.8;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(p.sx, p.sy);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  }

  ctx.restore();
}

let lastTime = 0;
let plasmaTimer = 0;

function renderLoop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  PerformanceManager.monitorFPS(timestamp);

  state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
  state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

  state.fluidX += (state.targetFluidX - state.fluidX) * 0.04;
  state.fluidY += (state.targetFluidY - state.fluidY) * 0.04;
  state.fluidZ += (state.targetFluidZ - state.fluidZ) * 0.04;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  updateAndDrawTeslaDischarges();
  drawSovereignCore3D(timestamp);
  updateAndDrawIntroExplosion();

  if (universe.classList.contains('visible')) {
    plasmaTimer += delta;
    if (plasmaTimer > state.nextIdleInterval) {
      plasmaTimer = 0;
      state.nextIdleInterval = Math.floor(400 + Math.random() * 1400);
      createTeslaDischarge(null, null, null, 'idle');
    }
  }

  if (state.isBirthActive) {
    state.birthProgress += 0.025;
    if (state.birthProgress >= 1) {
      state.birthProgress = 1;
      state.isBirthActive = false;
    }
  }

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const easeBirth = Math.sin((state.birthProgress * Math.PI) / 2);

  for (let i = 0; i < screenCards.length; i++) {
    screenCards[i].interRepelX = 0;
    screenCards[i].interRepelY = 0;
  }

  for (let i = 0; i < screenCards.length; i++) {
    for (let j = i + 1; j < screenCards.length; j++) {
      const cA = screenCards[i];
      const cB = screenCards[j];
      const cdx = cA.currentX - cB.currentX;
      const cdy = cA.currentY - cB.currentY;
      const cdist = Math.hypot(cdx, cdy) || 0.001;
      const minDist = state.isMobile ? 120 : 180;
      if (cdist < minDist) {
        const overlap = (minDist - cdist) / minDist;
        const force = overlap * 22;
        const nx = cdx / cdist;
        const ny = cdy / cdist;
        cA.interRepelX += nx * force;
        cA.interRepelY += ny * force;
        cB.interRepelX -= nx * force;
        cB.interRepelY -= ny * force;
      }
    }
  }

  const mousePxX = (state.mouseX * 0.5 + 0.5) * window.innerWidth;
  const mousePxY = (state.mouseY * 0.5 + 0.5) * window.innerHeight;

  screenCards.forEach((cardObj) => {
    cardObj.orbitPhase += cardObj.orbitSpeed;

    const floatX = Math.cos(cardObj.orbitPhase) * cardObj.orbitRadiusX;
    const floatY = Math.sin(cardObj.orbitPhase * 1.3) * cardObj.orbitRadiusY;

    const parallaxX = state.mouseX * (state.isMobile ? 12 : 28);
    const parallaxY = state.mouseY * (state.isMobile ? 12 : 28);

    const targetDriftX = state.fluidX * 35 * cardObj.inertiaMass;
    const targetDriftY = state.fluidY * 35 * cardObj.inertiaMass;
    const targetDriftZ = state.fluidZ * 25 * cardObj.inertiaMass;

    cardObj.driftX += (targetDriftX - cardObj.driftX) * (0.03 / cardObj.inertiaMass);
    cardObj.driftY += (targetDriftY - cardObj.driftY) * (0.03 / cardObj.inertiaMass);
    cardObj.driftZ += (targetDriftZ - cardObj.driftZ) * (0.03 / cardObj.inertiaMass);

    const baseTargetX = centerX + (cardObj.baseX / 100) * window.innerWidth + floatX + parallaxX + cardObj.driftX;
    const baseTargetY = centerY + (cardObj.baseY / 100) * window.innerHeight + floatY + parallaxY + cardObj.driftY;

    let targetPhysX = 0;
    let targetPhysY = 0;

    if (!state.isMobile) {
      const dx = baseTargetX - mousePxX;
      const dy = baseTargetY - mousePxY;
      const dist = Math.hypot(dx, dy) || 0.001;
      const nx = dx / dist;
      const ny = dy / dist;

      const rOuter = 230;
      const rInner = 95;

      if (dist < rOuter) {
        if (dist > rInner) {
          const factor = Math.sin(((rOuter - dist) / (rOuter - rInner)) * Math.PI);
          const force = factor * 48;
          targetPhysX = nx * force;
          targetPhysY = ny * force;
        } else {
          const factor = (rInner - dist) / rInner;
          const force = factor * 28;
          targetPhysX = -nx * force;
          targetPhysY = -ny * force;
        }
      }
    }

    cardObj.physX += (targetPhysX + cardObj.interRepelX - cardObj.physX) * 0.08;
    cardObj.physY += (targetPhysY + cardObj.interRepelY - cardObj.physY) * 0.08;

    let rawScreenX = centerX + (baseTargetX + cardObj.physX - centerX) * easeBirth;
    let rawScreenY = centerY + (baseTargetY + cardObj.physY - centerY) * easeBirth;

    const cardW = state.isMobile ? 153 : 197;
    const cardH = state.isMobile ? 98 : 125;
    const pad = 12;

    const clampedX = Math.max(cardW / 2 + pad, Math.min(window.innerWidth - cardW / 2 - pad, rawScreenX));
    const clampedY = Math.max(cardH / 2 + pad, Math.min(window.innerHeight - cardH / 2 - pad, rawScreenY));

    cardObj.currentX = clampedX;
    cardObj.currentY = clampedY;

    let scale = easeBirth;
    let opacity = easeBirth * 0.85;

    if (state.hoveredWork === cardObj) {
      scale *= 1.12;
      opacity = 1.0;
    } else if (state.hoveredWork) {
      scale *= 0.94;
      opacity = 0.45;
    }

    const rotX = -state.mouseY * 8 + (cardObj.driftY * 0.15);
    const rotY = state.mouseX * 8 + (cardObj.driftX * 0.15);
    const rotZ = cardObj.driftZ * 0.2;

    cardObj.element.style.transform = `
      translate3d(${clampedX}px, ${clampedY}px, ${(cardObj.baseZ + cardObj.driftZ) * easeBirth}px)
      scale(${scale})
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
      rotateZ(${rotZ}deg)
    `;
    cardObj.element.style.opacity = opacity;
  });

  if (universe.classList.contains('visible')) {
    state.phraseTimer += delta;
    if (state.phraseTimer > 8000 && !state.phraseVisible) {
      state.phraseVisible = true;
      centralPhrase.classList.add('visible');
      setTimeout(() => {
        centralPhrase.classList.remove('visible');
        state.phraseVisible = false;
        state.phraseTimer = 0;
      }, 5000);
    }
  }

  requestAnimationFrame(renderLoop);
}

function initExperience() {
  initConstellation();

  requestAnimationFrame((time) => {
    lastTime = time;
    renderLoop(time);
  });

  state.crtAnimating = true;
  drawCRTStatic();
  crtScreen.className = 'active';
  crtCanvas.className = 'crt-turn-on';

  setTimeout(() => {
    crtScreen.classList.add('fade-dissolve');

    setTimeout(() => {
      crtScreen.className = '';
      crtScreen.classList.remove('fade-dissolve');
      state.crtAnimating = false;

      flashOverlay.classList.add('active');
      triggerIntroExplosion();
      setTimeout(() => flashOverlay.classList.remove('active'), 600);

      setTimeout(() => {
        introScreen.classList.add('fade-out');
        universe.classList.add('visible');

        state.isBirthActive = true;
        state.birthProgress = 0;
      }, 1500);
    }, 900);
  }, 700);
}

window.addEventListener('load', initExperience);
