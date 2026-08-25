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

    // 1. WHITELIST ABSOLUTA APPLE: iPhone e iPad preservados em FULL
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

    // 2. DETECÇÃO IMEDIATA PARA ANDROID INTERMEDIÁRIO (Mali-G / Adreno 5xx/61x)
    const isLowEndGPU = /Mali-G|Mali-T|Adreno 3|Adreno 4|Adreno 5|Adreno 61|PowerVR/i.test(renderer);
    const lowRAM = navigator.deviceMemory && navigator.deviceMemory <= 4;
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (isLowEndGPU || lowRAM || lowCores) {
      this.tier = 'LOW';
    } else {
      this.tier = 'ADAPTIVE';
    }
  },

  monitorFPS(now) {
    if (this.tier === 'FULL') return;

    this.frameCount++;
    if (now - this.lastFpsCheck >= 1000) {
      const currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastFpsCheck = now;
      this.fpsHistory.push(currentFPS);

      if (this.fpsHistory.length > 3) {
        this.fpsHistory.shift();
        const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

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
  const rawDpr = window.devicePixelRatio || 1;
  const dpr = PerformanceManager.tier === 'LOW' ? Math.min(rawDpr, 1.25) : rawDpr;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  crtCanvas.width = window.innerWidth / 2;
  crtCanvas.height = window.innerHeight / 2;

  state.isMobile = window.innerWidth <= 768;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
