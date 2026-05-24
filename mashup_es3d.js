// --- 0. DYNAMIC AUDIO ENGINE ---
const GITHUB_BASE = 'https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/';

const AUDIO_MAP = {
  '/pink bopeep.jpeg': 'pink bo-peep.mp3',
  '/two white cows.jpeg': 'two white cows.mp3',
  '/yourself.jpeg': 'yourself.mp3',
  '/decongestant cough elixir.jpeg': 'decongestant cough elixir.mp3',
  '/plastic fruit.jpeg': 'plastic fruit.mp3',
  '/pineapple sunday.jpeg': 'pineapple sunday.mp3'
};

window.globalSfx = new Audio();
window.globalChime = new Audio('https://upload.wikimedia.org/wikipedia/commons/d/d7/Tada.mp3');

function playItemSound(imageFilename) {
  try {
    let mp3Name = AUDIO_MAP[imageFilename];
    if (mp3Name) {
      window.globalSfx.src = GITHUB_BASE + encodeURIComponent(mp3Name);
    } else {
      window.globalSfx.src = 'https://upload.wikimedia.org/wikipedia/commons/4/42/Ping.mp3';
    }
    window.globalSfx.currentTime = 0;
    window.globalSfx.play().catch(()=>{});
  } catch(e) {}
}

// --- 1. BOOT LOADER ---
let bootInterval = setInterval(() => {
  if (document.head && document.body) {
    clearInterval(bootInterval);
    injectCustomUI();
  }
}, 50);

function injectCustomUI() {
  const customStyles = document.createElement('style');
  customStyles.innerHTML = `
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    [id*="media-overlay"], [class*="media-overlay"], .mpe-overlay, #mpe-overlay { filter: none !important; -webkit-filter: none !important; background: transparent !important; background-color: transparent !important; }
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
    
    /* AGGRESSIVE AUDIO PLAYER & ROGUE X ASSASSIN */
    audio, video, [id*="audio"]:not(#es-btn-vol):not(#es-vol-label):not(#es-vol-tooltip), [class*="audio-player"], [class*="audio-controls"], [class*="audio-close"], .mpe-media-close { display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; visibility: hidden !important; }
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close { transform: scale(3.5) !important; right: 35px !important; top: 35px !important; opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important; }

    /* PERFECT B&W FILTER WITH 20% RED TINT SHADOW */
    #eye-spy-dark-overlay { 
        position: fixed !important; 
        top: 0 !important; left: 0 !important; 
        width: 100vw !important; height: 100vh !important; 
        background: rgba(20, 5, 5, 0.2) !important; 
        backdrop-filter: grayscale(100%) contrast(110%) brightness(95%) !important;
        -webkit-backdrop-filter: grayscale(100%) contrast(110%) brightness(95%) !important;
        z-index: 2147483645 !important; 
    }

    #eye-spy-image-cover { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; background-size: cover !important; background-position: center !important; z-index: 2147483646 !important; }
    #eye-spy-image-cover::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: inherit; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; backdrop-filter: blur(15px); background-color: rgba(0,0,0,0.4); }
    #eye-spy-start-ui { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
    #eye-spy-welcome-block { display: none; flex-direction: column; align-items: center; }
    
    #eye-spy-start-btn { padding: 16px 40px !important; font-size: 24px !important; font-weight: bold !important; background: #CCFF00 !important; color: #000 !important; border: none !important; border-radius: 8px !important; cursor: pointer !important; transition: transform 0.2s ease !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; pointer-events: auto !important; }
    #eye-spy-start-btn:hover { transform: scale(1.05) !important; }
    
    /* PILL CONTROL PANEL STYLES */
    #es-control-panel { 
      display: none !important; 
      position: fixed !important; 
      bottom: 15px !important; 
      left: 15px !important; 
      width: 320px !important; 
      height: 60px !important; 
      align-items: center !important; 
      justify-content: space-between !important;
      background: #1c1c1c !important; 
      padding: 0 20px !important; 
      border-radius: 30px !important; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.8) !important; 
      z-index: 2147483647 !important; 
      border: 2px solid #333 !important; 
      box-sizing: border-box !important;
    }
    .es-panel-btn { 
      background: transparent !important; 
      border: none !important; 
      cursor: pointer !important; 
      display: flex !important; 
      flex-direction: column !important;
      align-items: center !important; 
      justify-content: center !important; 
      padding: 5px !important; 
      border-radius: 8px !important; 
      transition: transform 0.2s ease, background 0.2s ease !important; 
      width: 60px !important;
      gap: 3px !important;
      position: relative !important;
    }
    .es-panel-btn:hover { 
      transform: scale(1.1) !important; 
      background: rgba(204, 255, 0, 0.1) !important; 
    }
    .es-panel-btn img {
      width: 24px !important;
      height: 24px !important;
      pointer-events: none !important;
    }
    .es-panel-btn span {
      font-size: 10px !important;
      font-weight: bold !important;
      color: #CCFF00 !important;
      letter-spacing: 0.5px !important;
      font-family: sans-serif !important;
      pointer-events: none !important;
    }
    .es-panel-divider { 
      width: 2px !important; 
      height: 30px !important; 
      background: #444 !important; 
      border-radius: 2px !important; 
      transition: opacity 0.3s ease !important;
    }

    /* CUSTOM CSS TOOLTIPS */
    .es-tooltip {
      position: absolute !important;
      top: -35px !important;
      background: rgba(0,0,0,0.9) !important;
      color: #fff !important;
      padding: 6px 10px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      font-weight: bold !important;
      font-family: sans-serif !important;
      white-space: nowrap !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.2s ease !important;
      z-index: 999999 !important;
      border: 1px solid #444 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.8) !important;
    }
    .es-panel-btn:hover .es-tooltip {
      opacity: 1 !important;
    }

    @keyframes eye-spy-fade { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
  `;
  document.head.appendChild(customStyles);

  const darkOverlay = document.createElement('div'); darkOverlay.id = 'eye-spy-dark-overlay'; document.body.appendChild(darkOverlay);
  const imageCover = document.createElement('div'); imageCover.id = 'eye-spy-image-cover'; document.body.appendChild(imageCover);

  const startUI = document.createElement('div'); startUI.id = 'eye-spy-start-ui';
  startUI.innerHTML = `
    <div id="eye-spy-loading-text">Loading 3D experience...</div>
    <div id="eye-spy-welcome-block">
      <h1 style="margin: 0 0 15px 0; text-align: center; font-size: 42px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); color: white;">Welcome to Eye Spy 3D</h1>
      <p style="margin: 0 0 30px 0; font-size: 20px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">Please enjoy this experience with your audio on</p>
      <button id="eye-spy-start-btn">Start now!</button>
    </div>
  `;
  document.body.appendChild(startUI);

  // PILL CONTROL PANEL HTML 
  const panel = document.createElement('div');
  panel.id = 'es-control-panel';
  panel.innerHTML = `
    <button class="es-panel-btn" id="es-btn-prev" style="opacity: 0 !important; pointer-events: none !important; transition: opacity 0.3s ease !important;">
      <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z'/%3E%3C/svg%3E">
      <span>BACK</span>
      <div class="es-tooltip">Back</div>
    </button>
    
    <div class="es-panel-divider" id="es-div-prev" style="opacity: 0 !important;"></div>

    <button class="es-panel-btn" id="es-btn-clue">
      <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M12.01 2.01c-3.3 0-5.99 2.69-5.99 6h3.41c0-1.42 1.15-2.58 2.58-2.58 1.43 0 2.58 1.15 2.58 2.58 0 2.58-3.87 2.26-3.87 6.45h3.44c0-2.9 3.87-3.23 3.87-6.45 0-3.31-2.69-6-6.02-6zM10.29 18.99h3.44v3.44h-3.44z'/%3E%3C/svg%3E">
      <span>CLUE</span>
      <div class="es-tooltip">Replay Clue</div>
    </button>

    <div class="es-panel-divider"></div>
    
    <button class="es-panel-btn" id="es-btn-vol">
      <img id="es-img-unmute" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E">
      <img id="es-img-mute" style="display:none !important;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E">
      <span id="es-vol-label">MUTE</span>
      <div class="es-tooltip" id="es-vol-tooltip">Mute / Un-Mute</div>
    </button>

    <div class="es-panel-divider" id="es-div-next" style="opacity: 0 !important;"></div>

    <button class="es-panel-btn" id="es-btn-next" style="opacity: 0 !important; pointer-events: none !important; transition: opacity 0.3s ease !important;">
      <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z'/%3E%3C/svg%3E">
      <span>CHEAT</span>
      <div class="es-tooltip">Cheat</div>
    </button>
  `;
  document.body.appendChild(panel);

  startMechanics();
}

function startMechanics() {
  const SWEEP_30 = '7k4p5mu5f5eydt8h0f8cygptb'; 
  const SWEEP_28 = 'cwckxx365uimbeqk6ngp0t5ud';
  const SWEEP_27 = 'ep98q9hxumexd83q38p12k4xc';

  // Level 0 = Lobby. Level 1 = First Puzzle.
  const LEVELS = [
    { level: 0, startSweeps: [SWEEP_30, SWEEP_28], targetSweep: SWEEP_28, imagesToFind: [] }, 
    { level: 1, startSweeps: [SWEEP_28], targetSweep: SWEEP_27, imagesToFind: ['/pink bopeep.jpeg', '/two white cows.jpeg', '/yourself.jpeg'] },
    { level: 2, startSweeps: [SWEEP_27], targetSweep: 't3si6z3gnc6ix4qh6cgmtgnfa', imagesToFind: ['/decongestant cough elixir.jpeg', '/plastic fruit.jpeg', '/pineapple sunday.jpeg'] },
    { level: 3, startSweeps: ['t3si6z3gnc6ix4qh6cgmtgnfa'], targetSweep: '2cngsqh5q4t1ep85y5ky0h49d', imagesToFind: ['/aztec chocolate.jpeg', '/atomic coffee.jpeg', '/royal perambulator.jpeg'] },
    { level: 4, startSweeps: ['2cngsqh5q4t1ep85y5ky0h49d'], targetSweep: '66yna1yh5e2ig14bmzzf1sn2c', imagesToFind: ['/a crow in a bag.jpeg', '/a hand in two.jpeg', '/vitreous china.jpeg', '/musical tyre.jpeg'] },
    { level: 5, startSweeps: ['66yna1yh5e2ig14bmzzf1sn2c'], targetSweep: '3hdk0cskxw0apbr2iw8016htb', imagesToFind: ['/Hanimexs Movielux.jpeg', '/argus previewer.jpeg', '/porcelain lobster.jpeg', '/scotts mower maker.jpeg'] },
    { level: 6, startSweeps: ['3hdk0cskxw0apbr2iw8016htb'], targetSweep: 'r7sd2g426fhbfa2wdh5dfxy5d', imagesToFind: ['/barley.jpg', '/some flumis.jpeg', '/wall climbing baby.jpeg', '/hide and seek.jpeg'] },
    { level: 7, startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], targetSweep: '20qckty5qi20t39838cq274rc', imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg'] }
  ];

  window.currentLevelIndex = 0; // Starts in Lobby (Index 0)
  window.allModelSweeps = [];
  window.foundImages = {};
  window.isTeleporting = false; 
  window.pathsPreloaded = false; 
  window.activeOpenPopups = new Set(); 
  
  // Custom Memory Tracker to prevent stutter on first visit but allow Replays
  window.visitedSweeps = new Set();

  const targetMatchStrings = [];
  LEVELS.forEach(level => {
    level.imagesToFind.forEach(img => targetMatchStrings.push(img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', '')));
  });

  // --- START BUTTON LOGIC ---
  const startBtn = document.getElementById('eye-spy-start-btn');
  if(startBtn) {
    startBtn.addEventListener('click', () => {
      const ui = document.getElementById('eye-spy-start-ui');
      const overlay = document.getElementById('eye-spy-dark-overlay');
      if(ui) { ui.style.transition = "opacity 0.4s ease"; ui.style.opacity = "0"; setTimeout(() => ui.remove(), 400); }
      if(overlay) { overlay.style.transition = "opacity 0.4s ease"; overlay.style.opacity = "0"; setTimeout(() => overlay.remove(), 400); }

      try {
          window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA'; 
          window.globalSfx.play().catch(()=>{});
          window.globalChime.volume = 0;
          window.globalChime.play().then(() => { window.globalChime.pause(); window.globalChime.volume = 1; window.globalChime.currentTime = 0; }).catch(()=>{});
      } catch(e) {}

      // Reveal Panel. User stays in Sweep 30 natively.
      const controls = document.getElementById('es-control-panel');
      if (controls) controls.style.setProperty('display', 'flex', 'important');
      updatePanelVisibility();
    });
  }

  // --- UI VISIBILITY LOGIC ---
  function updatePanelVisibility() {
    const prevBtn = document.getElementById('es-btn-prev');
    const nextBtn = document.getElementById('es-btn-next');
    const divPrev = document.getElementById('es-div-prev');
    const divNext = document.getElementById('es-div-next');
    
    // CHEAT BUTTON (Appears strictly at Level 1+)
    if (window.currentLevelIndex >= 1) {
        if (nextBtn) { nextBtn.style.setProperty('opacity', '1', 'important'); nextBtn.style.setProperty('pointer-events', 'auto', 'important'); }
        if (divNext) divNext.style.setProperty('opacity', '1', 'important');
    } else {
        if (nextBtn) { nextBtn.style.setProperty('opacity', '0', 'important'); nextBtn.style.setProperty('pointer-events', 'none', 'important'); }
        if (divNext) divNext.style.setProperty('opacity', '0', 'important');
    }

    // BACK BUTTON (Appears strictly at Level 2+)
    if (window.currentLevelIndex >= 2) {
        if (prevBtn) { prevBtn.style.setProperty('opacity', '1', 'important'); prevBtn.style.setProperty('pointer-events', 'auto', 'important'); }
        if (divPrev) divPrev.style.setProperty('opacity', '1', 'important');
    } else {
        if (prevBtn) { prevBtn.style.setProperty('opacity', '0', 'important'); prevBtn.style.setProperty('pointer-events', 'none', 'important'); }
        if (divPrev) divPrev.style.setProperty('opacity', '0', 'important');
    }
  }

  // --- BUTTON LOGIC ---
  let isMuted = false;
  document.getElementById('es-btn-vol').addEventListener('click', () => {
      isMuted = !isMuted;
      window.globalSfx.muted = isMuted;
      window.globalChime.muted = isMuted;
      document.getElementById('es-img-unmute').style.setProperty('display', isMuted ? 'none' : 'block', 'important');
      document.getElementById('es-img-mute').style.setProperty('display', isMuted ? 'block' : 'none', 'important');
      document.getElementById('es-vol-label').innerText = isMuted ? 'UN-MUTE' : 'MUTE';
      document.getElementById('es-vol-tooltip').innerText = isMuted ? 'Un-Mute' : 'Mute';
      
      document.querySelectorAll('audio, video').forEach(media => { media.muted = isMuted; });
  });

  // Replay Native Room Audio safely without fighting MPEmbed
  document.getElementById('es-btn-clue').addEventListener('click', () => {
      document.querySelectorAll('audio, video').forEach(media => {
          media.currentTime = 0;
          media.play().catch(()=>{});
      });
  });

  document.getElementById('es-btn-next').addEventListener('click', () => {
      const cLevel = LEVELS[window.currentLevelIndex]; 
      if (cLevel && window.mpSdk && !window.isTeleporting) {
          window.activeOpenPopups.clear();
          cLevel.imagesToFind.forEach(img => window.foundImages[img] = true);
          executeFastTeleport(window.mpSdk, cLevel);
      }
  });

  document.getElementById('es-btn-prev').addEventListener('click', () => {
      // FIREWALL: Prevents returning to Sweep 30.
      if (window.currentLevelIndex <= 1 || window.isTeleporting) return;
      
      window.activeOpenPopups.clear();
      window.isTeleporting = true;
      window.currentLevelIndex--; 
      
      const pLevel = LEVELS[window.currentLevelIndex];

      // Temporarily enable the room to allow smooth FLY transition backward
      window.mpSdk.Sweep.enable(pLevel.startSweeps[0]).then(() => {
          window.mpSdk.Sweep.moveTo(pLevel.startSweeps[0], { transition: window.mpSdk.Sweep.Transition.FLY }).catch(() => {
              return window.mpSdk.Sweep.moveTo(pLevel.startSweeps[0], { transition: window.mpSdk.Sweep.Transition.INSTANT });
          }).then(() => {
              setupLevelTracking();
              lockMapForCurrentLevel(window.mpSdk);
              updatePanelVisibility();
          });
      });
  });

  function setupLevelTracking() {
    window.foundImages = {};
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (currentLevel) currentLevel.imagesToFind.forEach(image => window.foundImages[image] = false);
    window.isTeleporting = false;
    window.pathsPreloaded = false;
    window.activeOpenPopups.clear();
  }

  function checkAllFound() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || currentLevel.imagesToFind.length === 0) return true;
    return currentLevel.imagesToFind.every(img => window.foundImages[img] === true);
  }

  // --- VISUAL HUNTER & X-ASSASSIN ---
  setInterval(() => {
    // Top-of-screen popup close buttons (hide safely behind panel)
    document.querySelectorAll('[class*="close"], [id*="close"]').forEach(btn => {
      let rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 100 && rect.height > 0) { 
          btn.style.setProperty('display', 'none', 'important'); 
          btn.style.setProperty('opacity', '0', 'important'); 
      }
    });

    // Aggressively assassinate the rogue audio X at the bottom of the screen
    document.querySelectorAll('[class*="close"], svg').forEach(btn => {
      let rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 150 && rect.height > 0 && btn.id !== 'es-btn-vol') { 
          btn.style.setProperty('display', 'none', 'important'); 
      }
    });

    document.querySelectorAll('.mpe-media-overlay, .mpe-overlay').forEach(el => {
        el.style.setProperty('filter', 'none', 'important'); el.style.setProperty('-webkit-filter', 'none', 'important'); el.style.setProperty('backdrop-filter', 'none', 'important'); el.style.setProperty('-webkit-backdrop-filter', 'none', 'important'); el.style.setProperty('background', 'transparent', 'important'); 
    });

    const textElements = document.querySelectorAll('div, span, p, h1, h2, h3');
    textElements.forEach(el => {
      if (el.children.length === 0 && el.textContent && el.offsetParent !== null) {
        const textClean = el.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (textClean.length > 3 && targetMatchStrings.includes(textClean)) {
          el.style.setProperty('position', 'absolute', 'important'); el.style.setProperty('left', '50%', 'important'); el.style.setProperty('top', '50%', 'important'); el.style.setProperty('transform', 'translate(-50%, -50%)', 'important'); el.style.setProperty('font-size', '240%', 'important'); el.style.setProperty('color', 'white', 'important'); el.style.setProperty('margin', '0', 'important'); el.style.setProperty('white-space', 'nowrap', 'important');
          const banner = el.parentElement;
          if (banner && !banner.dataset.styled) {
            banner.style.setProperty('background-color', '#1c1c1c', 'important'); banner.style.setProperty('background', '#1c1c1c', 'important'); 
            if (window.getComputedStyle(banner).position === 'static') banner.style.setProperty('position', 'relative', 'important');
            banner.style.setProperty('min-height', '75px', 'important'); banner.dataset.styled = "true"; 
          }
        }
      }
    });
  }, 250); 

  // --- TRIPWIRE ---
  const observer = new MutationObserver((mutations) => {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel) return; 

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 || node.nodeType === 3) { 
          let searchString = (node.textContent || '').toLowerCase() + " ";
          if (node.nodeType === 1) {
             const mediaTags = node.tagName === 'IMG' ? [node] : (node.querySelectorAll ? node.querySelectorAll('img, [style*="background-image"]') : []);
             mediaTags.forEach(m => searchString += (m.src || m.style.backgroundImage || '').toLowerCase() + " ");
          }

          currentLevel.imagesToFind.forEach((filename) => {
            const cleanName = filename.toLowerCase();
            const encodedName = encodeURI(filename).toLowerCase();
            
            if (searchString.includes(cleanName) || searchString.includes(encodedName)) {
              if (!window.activeOpenPopups.has(filename)) {
                playItemSound(filename); 
                window.activeOpenPopups.add(filename); 
              }

              if (!window.foundImages[filename]) {
                 console.log(`🎯 [Escape Room] Found: ${filename}`);
                 window.foundImages[filename] = true;
              }
              
              if (checkAllFound() && !window.pathsPreloaded) {
                window.pathsPreloaded = true;
                try { window.globalChime.currentTime = 0; window.globalChime.play().catch(()=>{}); } catch(e){}
                if (window.mpSdk) window.mpSdk.Sweep.enable(...window.allModelSweeps).catch(() => {});
              }
            }
          });
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === 1 || node.nodeType === 3) { 
          let searchString = (node.textContent || '').toLowerCase() + " ";
          if (node.nodeType === 1) {
             const mediaTags = node.tagName === 'IMG' ? [node] : (node.querySelectorAll ? node.querySelectorAll('img, [style*="background-image"]') : []);
             mediaTags.forEach(m => searchString += (m.src || m.style.backgroundImage || '').toLowerCase() + " ");
          }

          currentLevel.imagesToFind.forEach((filename) => {
            const cleanName = filename.toLowerCase();
            const encodedName = encodeURI(filename).toLowerCase();

            if (searchString.includes(cleanName) || searchString.includes(encodedName)) {
              window.activeOpenPopups.delete(filename); 
              if (checkAllFound() && window.activeOpenPopups.size === 0 && !window.isTeleporting) {
                executeFastTeleport(window.mpSdk, currentLevel);
              }
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  async function initMashupLogic(mpSdk) {
    window.mpSdk = mpSdk;
    setupLevelTracking();

    let sweepCollection = await new Promise((resolve) => {
      let sub = mpSdk.Sweep.data.subscribe({
        onCollectionUpdated: function (collection) {
          if (Object.keys(collection).length > 0) { resolve(collection); sub.cancel(); }
        }
      });
    });

    window.allModelSweeps = Object.keys(sweepCollection);
    lockMapForCurrentLevel(mpSdk);

    const cover = document.getElementById('eye-spy-image-cover');
    if (cover) { cover.style.transition = "opacity 0.5s ease"; cover.style.opacity = "0"; setTimeout(() => cover.remove(), 500); }
    
    const loadingText = document.getElementById('eye-spy-loading-text');
    if (loadingText) loadingText.remove();
    
    const welcomeBlock = document.getElementById('eye-spy-welcome-block');
    if (welcomeBlock) welcomeBlock.style.display = "flex";

    // Track physical walking and manage Audio Memory
    mpSdk.on(mpSdk.Sweep.Event.ENTER, function(sweepId) {
        
        // Exact Level Tracking
        if (sweepId === SWEEP_28 && window.currentLevelIndex === 0) {
            window.currentLevelIndex = 1;
            setupLevelTracking(); 
            lockMapForCurrentLevel(window.mpSdk); 
            updatePanelVisibility();
        } else if (sweepId === SWEEP_27 && window.currentLevelIndex === 1) {
            window.currentLevelIndex = 2;
            setupLevelTracking();
            lockMapForCurrentLevel(window.mpSdk); 
            updatePanelVisibility();
        }

        // Memory Tracker: If it's a replay, aggressively force the audio.
        if (!window.visitedSweeps.has(sweepId)) {
            window.visitedSweeps.add(sweepId); // MPEmbed plays it flawlessly the first time.
        } else {
            setTimeout(() => {
                document.querySelectorAll('audio, video').forEach(media => {
                    media.currentTime = 0;
                    media.play().catch(()=>{});
                });
            }, 300); // Small delay to let MPEmbed load the skip before injecting
        }
    });

    mpSdk.on(mpSdk.Sweep.Event.EXIT, function(fromSweep) {
      const cLevel = LEVELS[window.currentLevelIndex];
      if (cLevel && cLevel.startSweeps.includes(fromSweep)) { mpSdk.Sweep.disable(fromSweep).catch(() => {}); }
    });
  }

  function lockMapForCurrentLevel(mpSdk) {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel) return;
    const sweepsToDisable = window.allModelSweeps.filter(id => !currentLevel.startSweeps.includes(id));
    if (sweepsToDisable.length > 0) mpSdk.Sweep.disable(...sweepsToDisable).catch(() => {});
  }

  async function executeFastTeleport(mpSdk, levelData) {
    window.isTeleporting = true;
    try {
      // Temporarily enable target room so we can FLY smoothly
      await mpSdk.Sweep.enable(levelData.targetSweep).catch(()=>{});
        
      try { 
          await mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: mpSdk.Sweep.Transition.FLY });
      } catch (flyError) { 
          await mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: mpSdk.Sweep.Transition.INSTANT }); 
      }

      const sweepsToLock = window.allModelSweeps.filter(id => id !== levelData.targetSweep);
      await mpSdk.Sweep.disable(...sweepsToLock).catch(() => {});

      window.currentLevelIndex++; 
      
      if (LEVELS[window.currentLevelIndex]) {
          setupLevelTracking(); 
          updatePanelVisibility();
      } else {
          const controls = document.getElementById('es-control-panel');
          if (controls) controls.remove();
      }
    } catch (error) { console.error("Teleport failed:", error); }
  }

  let checkSdkInterval = setInterval(function() {
    if (window.mpSdk && window.mpSdk.Sweep) { clearInterval(checkSdkInterval); initMashupLogic(window.mpSdk); }
  }, 500);
}
