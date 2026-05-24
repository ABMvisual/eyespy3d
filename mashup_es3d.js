
// =============================================================================
// EYE SPY 3D — V230: DECOUPLED BOOTLOADER & FLAWLESS NAVIGATION
// =============================================================================

const GITHUB_BASE = 'https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/';

const SWEEPS = {
  lobby:       '7k4p5mu5f5eydt8h0f8cygptb',  // Level 0 spawn (Sweep 30)
  level1Entry: 'cwckxx365uimbeqk6ngp0t5ud',  // Sweep 28
  level2Entry: 'ep98q9hxumexd83q38p12k4xc',  // Sweep 27
};

const CHIME_URL  = GITHUB_BASE + 'chime.mp3';
const CHIME_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Tada.mp3';
const PING_URL   = 'https://upload.wikimedia.org/wikipedia/commons/4/42/Ping.mp3';

const AUDIO_MAP = {
  '/pink bopeep.jpeg':               'pink bo-peep.mp3',
  '/two white cows.jpeg':            'two white cows.mp3',
  '/yourself.jpeg':                  'yourself.mp3',
  '/decongestant cough elixir.jpeg': 'decongestant cough elixir.mp3',
  '/plastic fruit.jpeg':             'plastic fruit.mp3',
  '/pineapple sunday.jpeg':          'pineapple sunday.mp3',
};

// Level Definitions
const LEVELS = [
  { level: 0, startSweeps: [SWEEPS.lobby], targetSweep: SWEEPS.level1Entry, imagesToFind: [] }, 
  { level: 1, startSweeps: [SWEEPS.level1Entry], targetSweep: SWEEPS.level2Entry, imagesToFind: ['/pink bopeep.jpeg', '/two white cows.jpeg', '/yourself.jpeg'] },
  { level: 2, startSweeps: [SWEEPS.level2Entry], targetSweep: 't3si6z3gnc6ix4qh6cgmtgnfa', imagesToFind: ['/decongestant cough elixir.jpeg', '/plastic fruit.jpeg', '/pineapple sunday.jpeg'] },
  { level: 3, startSweeps: ['t3si6z3gnc6ix4qh6cgmtgnfa'], targetSweep: '2cngsqh5q4t1ep85y5ky0h49d', imagesToFind: ['/aztec chocolate.jpeg', '/atomic coffee.jpeg', '/royal perambulator.jpeg'] },
  { level: 4, startSweeps: ['2cngsqh5q4t1ep85y5ky0h49d'], targetSweep: '66yna1yh5e2ig14bmzzf1sn2c', imagesToFind: ['/a crow in a bag.jpeg', '/a hand in two.jpeg', '/vitreous china.jpeg', '/musical tyre.jpeg'] },
  { level: 5, startSweeps: ['66yna1yh5e2ig14bmzzf1sn2c'], targetSweep: '3hdk0cskxw0apbr2iw8016htb', imagesToFind: ['/Hanimexs Movielux.jpeg', '/argus previewer.jpeg', '/porcelain lobster.jpeg', '/scotts mower maker.jpeg'] },
  { level: 6, startSweeps: ['3hdk0cskxw0apbr2iw8016htb'], targetSweep: 'r7sd2g426fhbfa2wdh5dfxy5d', imagesToFind: ['/barley.jpg', '/some flumis.jpeg', '/wall climbing baby.jpeg', '/hide and seek.jpeg'] },
  { level: 7, startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], targetSweep: '20qckty5qi20t39838cq274rc', imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg'] }
];

window.globalSfx   = new Audio();
window.globalChime = new Audio();
window.globalChime.src = CHIME_URL;
window.globalChime.onerror = () => { window.globalChime.src = CHIME_FALLBACK; };

function playItemSound(imageFilename) {
  try {
    const mp3Name = AUDIO_MAP[imageFilename];
    window.globalSfx.src = mp3Name ? GITHUB_BASE + encodeURIComponent(mp3Name) : PING_URL;
    window.globalSfx.currentTime = 0;
    window.globalSfx.play().catch(() => {});
  } catch (e) {}
}

let _bootInterval = setInterval(() => {
  if (document.head && document.body) {
    clearInterval(_bootInterval);
    injectCustomUI();
  }
}, 50);

function injectCustomUI() {
  const style = document.createElement('style');
  style.innerHTML = `
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    [id*="media-overlay"], [class*="media-overlay"], .mpe-overlay, #mpe-overlay { filter: none !important; -webkit-filter: none !important; background: transparent !important; background-color: transparent !important; }
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
    
    /* AUDIO PLAYER ASSASSIN */
    audio, video, [id*="audio"]:not(#es-btn-vol):not(#es-vol-label):not(#es-vol-tooltip), [class*="audio-player"], [class*="audio-controls"], [class*="audio-close"], .mpe-media-close { display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; visibility: hidden !important; }
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close { transform: scale(3.5) !important; right: 35px !important; top: 35px !important; opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important; }

    /* PERFECT B&W FILTER WITH 20% RED TINT SHADOW */
    #eye-spy-dark-overlay { 
        position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(20, 5, 5, 0.2) !important; 
        backdrop-filter: grayscale(100%) contrast(110%) brightness(95%) !important; -webkit-backdrop-filter: grayscale(100%) contrast(110%) brightness(95%) !important; z-index: 2147483645 !important; 
    }

    #eye-spy-image-cover { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; background-size: cover !important; background-position: center !important; z-index: 2147483646 !important; }
    #eye-spy-image-cover::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: inherit; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; backdrop-filter: blur(15px); background-color: rgba(0,0,0,0.4); }
    #eye-spy-start-ui { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
    #eye-spy-welcome-block { display: none; flex-direction: column; align-items: center; }
    
    #eye-spy-start-btn { padding: 16px 40px !important; font-size: 24px !important; font-weight: bold !important; background: #CCFF00 !important; color: #000 !important; border: none !important; border-radius: 8px !important; cursor: pointer !important; transition: transform 0.2s ease !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; pointer-events: auto !important; }
    #eye-spy-start-btn:hover { transform: scale(1.05) !important; }

    /* LOADING TEXT FIXED TO TOP CENTER */
    #eye-spy-loading-text { position: absolute !important; top: 40px !important; left: 50% !important; transform: translateX(-50%) !important; color: white !important; font-size: 16px; font-weight: normal; animation: eye-spy-fade 2s infinite ease-in-out; z-index: 2147483647; text-align: center; }
    
    /* PILL CONTROL PANEL STYLES */
    #es-control-panel { display: none !important; position: fixed !important; bottom: 15px !important; left: 15px !important; width: 320px !important; height: 60px !important; align-items: center !important; justify-content: space-between !important; background: #1c1c1c !important; padding: 0 20px !important; border-radius: 30px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.8) !important; z-index: 2147483647 !important; border: 2px solid #333 !important; box-sizing: border-box !important; }
    .es-panel-btn { background: transparent !important; border: none !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; padding: 5px !important; border-radius: 8px !important; transition: transform 0.2s ease, background 0.2s ease !important; width: 60px !important; gap: 3px !important; position: relative !important; }
    .es-panel-btn:hover { transform: scale(1.1) !important; background: rgba(204, 255, 0, 0.1) !important; }
    .es-panel-btn img { width: 24px !important; height: 24px !important; pointer-events: none !important; }
    .es-panel-btn span { font-size: 10px !important; font-weight: bold !important; color: #CCFF00 !important; letter-spacing: 0.5px !important; font-family: sans-serif !important; pointer-events: none !important; }
    .es-panel-divider { width: 2px !important; height: 30px !important; background: #444 !important; border-radius: 2px !important; transition: opacity 0.3s ease !important; }

    /* CUSTOM CSS TOOLTIPS */
    .es-tooltip { position: absolute !important; top: -35px !important; background: rgba(0,0,0,0.9) !important; color: #fff !important; padding: 6px 10px !important; border-radius: 4px !important; font-size: 12px !important; font-weight: bold !important; font-family: sans-serif !important; white-space: nowrap !important; opacity: 0 !important; pointer-events: none !important; transition: opacity 0.2s ease !important; z-index: 999999 !important; border: 1px solid #444 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.8) !important; }
    .es-panel-btn:hover .es-tooltip { opacity: 1 !important; }

    @keyframes eye-spy-fade { 0%{opacity:0.2} 50%{opacity:1} 100%{opacity:0.2} }
  `;
  document.head.appendChild(style);

  const darkOverlay = document.createElement('div'); darkOverlay.id = 'eye-spy-dark-overlay'; document.body.appendChild(darkOverlay);
  const imageCover = document.createElement('div'); imageCover.id = 'eye-spy-image-cover'; document.body.appendChild(imageCover);

  const startUI = document.createElement('div'); startUI.id = 'eye-spy-start-ui';
  startUI.innerHTML = `
    <div id="eye-spy-loading-text">Loading 3D experience...</div>
    <div id="eye-spy-welcome-block">
      <h1 style="margin:0 0 15px 0;text-align:center;font-size:42px;text-shadow:0 2px 4px rgba(0,0,0,0.8);color:white;">Welcome to Eye Spy 3D</h1>
      <p style="margin:0 0 30px 0;font-size:20px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8);">Please enjoy this experience with your audio on</p>
      <button id="eye-spy-start-btn">Start now!</button>
    </div>
  `;
  document.body.appendChild(startUI);

  const panel = document.createElement('div');
  panel.id = 'es-control-panel';
  panel.innerHTML = `
    <button class="es-panel-btn" id="es-btn-prev" style="opacity:0 !important;pointer-events:none !important;transition:opacity 0.3s ease !important;">
      <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z'/%3E%3C/svg%3E">
      <span>BACK</span><div class="es-tooltip">Back</div>
    </button>
    
    <div class="es-panel-divider" id="es-div-prev" style="opacity:0 !important;"></div>

    <button class="es-panel-btn" id="es-btn-clue">
      <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M12.01 2.01c-3.3 0-5.99 2.69-5.99 6h3.41c0-1.42 1.15-2.58 2.58-2.58 1.43 0 2.58 1.15 2.58 2.58 0 2.58-3.87 2.26-3.87 6.45h3.44c0-2.9 3.87-3.23 3.87-6.45 0-3.31-2.69-6-6.02-6zM10.29 18.99h3.44v3.44h-3.44z'/%3E%3C/svg%3E">
      <span>CLUE</span><div class="es-tooltip">Replay Clue</div>
    </button>

    <div class="es-panel-divider"></div>
    
    <button class="es-panel-btn" id="es-btn-vol">
      <img id="es-img-unmute" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E">
      <img id="es-img-mute" style="display:none !important;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E">
      <span id="es-vol-label">MUTE</span><div class="es-tooltip" id="es-vol-tooltip">Mute / Un-Mute</div>
    </button>

    <div class="es-panel-divider" id="es-div-next" style="opacity:0 !important;"></div>

    <button class="es-panel-btn" id="es-btn-next" style="opacity:0 !important;pointer-events:none !important;transition:opacity 0.3s ease !important;">
      <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z'/%3E%3C/svg%3E">
      <span>CHEAT</span><div class="es-tooltip">Cheat</div>
    </button>
  `;
  document.body.appendChild(panel);

  startMechanics();
}

function startMechanics() {
  let currentLevelIndex = 0;  
  let allModelSweeps    = [];
  let foundImages       = {};
  let isTeleporting     = false;
  let pathsPreloaded    = false;
  let activeOpenPopups  = new Set();
  let visitedSweeps     = new Set();
  let isMuted           = false;
  let mpSdk             = null;
  let hasReachedLevel1  = false;
  let hasReachedLevel2  = false;

  function currentLevel() { return LEVELS[currentLevelIndex]; }

  function checkAllFound() {
    const lvl = currentLevel();
    if (!lvl || lvl.imagesToFind.length === 0) return true;
    return lvl.imagesToFind.every(img => foundImages[img] === true);
  }

  function setupLevelTracking() {
    foundImages      = {};
    pathsPreloaded   = false;
    activeOpenPopups = new Set();
    isTeleporting    = false;      
    const lvl = currentLevel();
    if (lvl) lvl.imagesToFind.forEach(img => { foundImages[img] = false; });
  }

  function updatePanelVisibility() {
    const prevBtn  = document.getElementById('es-btn-prev');
    const nextBtn  = document.getElementById('es-btn-next');
    const divPrev  = document.getElementById('es-div-prev');
    const divNext  = document.getElementById('es-div-next');

    const showNext = hasReachedLevel1 || currentLevelIndex >= 1;
    const showPrev = hasReachedLevel2 || currentLevelIndex >= 2;

    const applyVisibility = (btn, divider, visible) => {
      if (btn) {
        btn.style.setProperty('opacity',        visible ? '1' : '0',    'important');
        btn.style.setProperty('pointer-events', visible ? 'auto' : 'none', 'important');
      }
      if (divider) divider.style.setProperty('opacity', visible ? '1' : '0', 'important');
    };

    applyVisibility(nextBtn, divNext, showNext);
    applyVisibility(prevBtn, divPrev, showPrev);
  }

  // RE-ENGINEERED LOCKDOWN: Protect the boundaries, let the player walk freely inside
  function lockMapForCurrentLevel() {
    if (!mpSdk || allModelSweeps.length === 0) return; 
    const lvl = currentLevel();
    if (!lvl) return;

    // 1. Re-enable all sweeps to keep intermediate pathfinding alive
    mpSdk.Sweep.enable(...allModelSweeps).catch(()=>{});

    setTimeout(() => {
        // 2. FIREWALL: Never allow return to the Lobby once Level 1 begins
        if (currentLevelIndex > 0) {
            mpSdk.Sweep.disable(SWEEPS.lobby).catch(()=>{});
        }

        // 3. LOCK: Prevent walking forward to the next level before puzzle is solved
        if (currentLevelIndex > 0 && lvl.targetSweep) {
            mpSdk.Sweep.disable(lvl.targetSweep).catch(()=>{});
        }
    }, 150); 
  }

  async function executeFastTeleport(levelData) {
    if (!mpSdk || isTeleporting) return;
    isTeleporting = true; 

    try {
      await mpSdk.Sweep.enable(levelData.targetSweep).catch(() => {});

      try {
        await mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: mpSdk.Sweep.Transition.FLY });
      } catch {
        await mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: mpSdk.Sweep.Transition.INSTANT });
      }

      currentLevelIndex++;
      const nextLvl = currentLevel();
      if (nextLvl) {
        setupLevelTracking();
        lockMapForCurrentLevel();
        updatePanelVisibility();
      } else {
        const controls = document.getElementById('es-control-panel');
        if (controls) controls.remove();
      }
    } catch (error) {
      console.error('[EyeSpy3D] Teleport failed:', error);
      isTeleporting = false; 
    }
  }

  document.getElementById('es-btn-vol').addEventListener('click', () => {
    isMuted = !isMuted;
    window.globalSfx.muted   = isMuted;
    window.globalChime.muted = isMuted;
    document.querySelectorAll('audio, video').forEach(m => { m.muted = isMuted; });

    document.getElementById('es-img-unmute').style.setProperty('display', isMuted ? 'none'  : 'block', 'important');
    document.getElementById('es-img-mute').style.setProperty('display',   isMuted ? 'block' : 'none',  'important');
    document.getElementById('es-vol-label').innerText    = isMuted ? 'UN-MUTE' : 'MUTE';
    document.getElementById('es-vol-tooltip').innerText  = isMuted ? 'Un-Mute' : 'Mute';
  });

  document.getElementById('es-btn-clue').addEventListener('click', () => {
    const scopedMedia = document.querySelectorAll('[data-mpe] audio, [data-mpe] video, .mpe-popup audio, .mpe-popup video');
    const target = scopedMedia.length > 0 ? scopedMedia : document.querySelectorAll('audio, video');
    target.forEach(m => { m.currentTime = 0; m.play().catch(() => {}); });
  });

  document.getElementById('es-btn-next').addEventListener('click', () => {
    const lvl = currentLevel();
    if (!lvl || isTeleporting) return;
    activeOpenPopups.clear();
    lvl.imagesToFind.forEach(img => { foundImages[img] = true; });
    executeFastTeleport(lvl);
  });

  document.getElementById('es-btn-prev').addEventListener('click', async () => {
    if (currentLevelIndex <= 1 || isTeleporting) return; // Cannot return to Lobby
    if (!mpSdk) return;

    isTeleporting = true; 

    const targetIndex = currentLevelIndex - 1;
    const prevLvl     = LEVELS[targetIndex];

    try {
      await mpSdk.Sweep.enable(prevLvl.startSweeps[0]).catch(() => {});

      try {
        await mpSdk.Sweep.moveTo(prevLvl.startSweeps[0], { transition: mpSdk.Sweep.Transition.FLY });
      } catch {
        await mpSdk.Sweep.moveTo(prevLvl.startSweeps[0], { transition: mpSdk.Sweep.Transition.INSTANT });
      }

      currentLevelIndex = targetIndex;
      setupLevelTracking();
      lockMapForCurrentLevel();
      updatePanelVisibility();

    } catch (error) {
      console.error('[EyeSpy3D] Back navigation failed:', error);
      isTeleporting = false; 
    }
  });

  // --- START BUTTON LOGIC ---
  const startBtn = document.getElementById('eye-spy-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const ui      = document.getElementById('eye-spy-start-ui');
      const overlay = document.getElementById('eye-spy-dark-overlay');
      const cover   = document.getElementById('eye-spy-image-cover');
      
      // DECOUPLED REMOVAL: Fades out the UI and Image Cover simultaneously exactly when clicked.
      if (ui)      { ui.style.transition = 'opacity 0.4s ease'; ui.style.opacity = '0'; setTimeout(() => ui.remove(), 400); }
      if (overlay) { overlay.style.transition = 'opacity 0.4s ease'; overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 400); }
      if (cover)   { cover.style.transition = 'opacity 0.4s ease'; cover.style.opacity = '0'; setTimeout(() => cover.remove(), 400); }

      try {
        window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA';
        window.globalSfx.play().catch(() => {});
        window.globalChime.volume = 0;
        window.globalChime.play().then(() => { window.globalChime.pause(); window.globalChime.volume = 1; window.globalChime.currentTime = 0; }).catch(() => {});
      } catch (e) {}

      const controls = document.getElementById('es-control-panel');
      if (controls) controls.style.setProperty('display', 'flex', 'important');
      updatePanelVisibility();
    });
  }

  const TARGET_MATCH_STRINGS = LEVELS.flatMap(lvl =>
    lvl.imagesToFind.map(img => img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg','').replace('jpg',''))
  );

  // --- UNIFIED ENGINE ---
  setInterval(() => {
    // 1. Rogue X Assassin
    document.querySelectorAll('[class*="close"], [id*="close"]').forEach(btn => {
      if (!btn.closest('#es-control-panel')) {
        const rect = btn.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 100 && rect.height > 0) {
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('opacity', '0',    'important');
        }
      }
    });

    document.querySelectorAll('[class*="close"], svg').forEach(btn => {
      if (btn.id === 'es-btn-vol' || btn.closest('#es-control-panel')) return;
      const rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 150 && rect.height > 0) {
        btn.style.setProperty('display', 'none', 'important');
      }
    });

    // 2. Locate Active Popups
    const activePopups = document.querySelectorAll('.mpe-popup, .mp-mattertag, [class*="media-overlay"]');
    const currentlyVisibleThisFrame = new Set();
    const currentLevelData = currentLevel();

    if (activePopups.length > 0) {
        activePopups.forEach(popup => {
            popup.style.setProperty('filter',            'none',        'important');
            popup.style.setProperty('-webkit-filter',    'none',        'important');
            popup.style.setProperty('backdrop-filter',   'none',        'important');
            popup.style.setProperty('-webkit-backdrop-filter', 'none',  'important');
            popup.style.setProperty('background',        'transparent', 'important');

            // 3. Instant Scan for Popup Text
            if (currentLevelData) {
                const textElements = popup.querySelectorAll('div, span, p, h1, h2, h3');
                textElements.forEach(el => {
                    if (el.children.length === 0 && el.textContent) {
                        const textClean = el.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
                        
                        let matchedImg = null;
                        currentLevelData.imagesToFind.forEach(img => {
                            const cleanTarget = img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', '');
                            if (textClean.length > 3 && textClean.includes(cleanTarget)) {
                                matchedImg = img;
                            }
                        });

                        if (matchedImg) {
                            currentlyVisibleThisFrame.add(matchedImg);
                            
                            // Apply CSS Instantly
                            if (!el.dataset.styled) {
                                el.dataset.styled = "true";
                                el.style.setProperty('position',   'absolute',              'important');
                                el.style.setProperty('left',       '50%',                   'important');
                                el.style.setProperty('top',        '50%',                   'important');
                                el.style.setProperty('transform',  'translate(-50%, -50%)', 'important');
                                el.style.setProperty('font-size',  '240%',                  'important');
                                el.style.setProperty('color',      'white',                 'important');
                                el.style.setProperty('margin',     '0',                     'important');
                                el.style.setProperty('white-space','nowrap',                'important');
                                
                                const banner = el.parentElement;
                                if (banner) {
                                    banner.style.setProperty('background-color', '#1c1c1c', 'important');
                                    banner.style.setProperty('background',       '#1c1c1c', 'important');
                                    if (window.getComputedStyle(banner).position === 'static') {
                                        banner.style.setProperty('position', 'relative', 'important');
                                    }
                                    banner.style.setProperty('min-height', '75px', 'important');
                                }
                            }

                            if (!activeOpenPopups.has(matchedImg)) {
                                activeOpenPopups.add(matchedImg);
                                playItemSound(matchedImg);
                                
                                if (!foundImages[matchedImg]) {
                                    foundImages[matchedImg] = true;
                                    console.log(`🎯 [EyeSpy3D] Found: ${matchedImg}`);
                                    
                                    if (checkAllFound() && !pathsPreloaded) {
                                        pathsPreloaded = true;
                                        playChime();
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    activeOpenPopups.forEach(img => {
        if (!currentlyVisibleThisFrame.has(img)) {
            activeOpenPopups.delete(img);
            if (checkAllFound() && activeOpenPopups.size === 0 && !isTeleporting) {
                executeFastTeleport(currentLevelData);
            }
        }
    });

  }, 150); 

  async function initMashupLogic(sdk) {
    mpSdk = sdk;
    setupLevelTracking();

    // Instantly reveal Start button - decoupled from SDK sweeps loading
    const loadingText   = document.getElementById('eye-spy-loading-text');
    const welcomeBlock  = document.getElementById('eye-spy-welcome-block');
    if (loadingText)  loadingText.remove();
    if (welcomeBlock) welcomeBlock.style.setProperty('display', 'flex', 'important');

    const sub = sdk.Sweep.data.subscribe({
        onCollectionUpdated(collection) {
            const keys = Object.keys(collection);
            if (keys.length > 0) {
                allModelSweeps = keys;
                sub.cancel();
                // If game already started, apply map locks
                if (document.getElementById('es-control-panel')?.style.display === 'flex') {
                    lockMapForCurrentLevel();
                }
            }
        }
    });

    mpSdk.on(mpSdk.Sweep.Event.ENTER, sweepId => {
      if (isTeleporting) return; 

      // Level 1 Trigger: If user steps OFF Sweep 30
      if (currentLevelIndex === 0 && sweepId !== SWEEPS.lobby) {
        currentLevelIndex = 1; 
        hasReachedLevel1 = true;
        setupLevelTracking();
        lockMapForCurrentLevel();
        updatePanelVisibility();
      }

      // Level 2 Trigger: If user walks into Sweep 27 naturally
      if (currentLevelIndex === 1 && sweepId === SWEEPS.level2Entry) {
        currentLevelIndex = 2;
        hasReachedLevel2 = true;
        setupLevelTracking();
        lockMapForCurrentLevel();
        updatePanelVisibility();
      }

      if (!visitedSweeps.has(sweepId)) {
        visitedSweeps.add(sweepId);
      } else {
        setTimeout(() => {
          document.querySelectorAll('audio, video').forEach(m => {
            m.currentTime = 0;
            m.play().catch(() => {});
          });
        }, 300);
      }
    });

    mpSdk.on(mpSdk.Sweep.Event.EXIT, fromSweep => {
       document.querySelectorAll('audio, video').forEach(m => {
          m.pause();
          m.currentTime = 0;
       });
    });
  }

  const sdkPollInterval = setInterval(() => {
    if (window.mpSdk && window.mpSdk.Sweep) {
      clearInterval(sdkPollInterval);
      initMashupLogic(window.mpSdk);
    }
  }, 500);
}
