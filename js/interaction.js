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

window.addEventListener('mousemove', (e) => {
  state.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  state.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  
  state.targetFluidX = state.targetMouseX;
  state.targetFluidY = state.targetMouseY;
  state.targetFluidZ = state.targetMouseX * state.targetMouseY;
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

enigmaTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  openEnigmaModal();
});

window.addEventListener('load', initExperience);
