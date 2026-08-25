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
