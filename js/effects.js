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
    if (PerformanceManager.tier !== 'LOW') {
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 12;
    }

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
    if (PerformanceManager.tier !== 'LOW') {
      ctx.shadowColor = syn.color;
      ctx.shadowBlur = 14;
    }
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.8 * alpha;
    ctx.globalAlpha = alpha * 0.9;
    if (PerformanceManager.tier !== 'LOW') {
      ctx.shadowBlur = 4;
    }
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
      if (PerformanceManager.tier !== 'LOW') {
        ctx.shadowColor = color;
        ctx.shadowBlur = isCardTouch ? 20 : 10;
      }

      ctx.beginPath();
      for (let j = 0; j < strand.path.length; j++) {
        const pt = strand.path[j];
        if (j === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      ctx.lineWidth = (isCardTouch ? 2.8 : (isAir ? 1.4 : 1.8)) * life;
      ctx.globalAlpha = (isCardTouch ? 0.75 : 0.55) * life;
      if (PerformanceManager.tier !== 'LOW') {
        ctx.shadowBlur = 8;
      }

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
      if (PerformanceManager.tier !== 'LOW') {
        ctx.shadowBlur = 4;
      }

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
      if (PerformanceManager.tier !== 'LOW') {
        ctx.shadowBlur = 12;
      }
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
    if (PerformanceManager.tier !== 'LOW') {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.moveTo(p.sx, p.sy);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  }

  ctx.restore();
}
