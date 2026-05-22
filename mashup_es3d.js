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
    audio, video, [id*="audio"], [class*="audio-player"], div[style*="bottom: 0px"] [class*="close"], div[style*="bottom: 0"] [class*="close"] { display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; visibility: hidden !important; }
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close { transform: scale(3.5) !important; right: 35px !important; top: 35px !important; opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important; }

    /* VINTAGE SEPIA START SCREEN FILTER */
    #eye-spy-dark-overlay { 
        position: fixed !important; 
        top: 0 !important; left: 0 !important; 
        width: 100vw !important; height: 100vh !important; 
        background: rgba(60, 40, 20, 0.4) !important; 
        backdrop-filter: sepia(70%) contrast(110%) brightness(90%) !important;
        -webkit-backdrop-filter: sepia(70%) contrast(110%) brightness(90%) !important;
        z-index: 2147483645 !important; 
    }

    #eye-spy-image-cover { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; background-size: cover !important; background-position: center !important; z-index: 2147483646 !important; }
    #eye-spy-image-cover::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: inherit; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; backdrop-filter: blur(15px); background-color: rgba(0,0,0,0.4); }
    #eye-spy-start-ui { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
    #eye-spy-welcome-block { display: none; flex-direction: column; align-items: center; }
    
    #eye-spy-start-btn { padding: 16px 40px !important; font-size: 24px !important; font-weight: bold !important; background: #CCFF00 !important; color: #000 !important; border: none !important; border-radius: 8px !important; cursor: pointer !important; transition: transform 0.2s ease !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; pointer-events: auto !important; }
    #eye-spy-start-btn:hover { transform: scale(1.05) !important; }
    #eye-spy-loading-text { position: absolute; top: 40px; color: white; font-size: 16px; font-weight: normal; animation: eye-spy-fade 2s infinite ease-in-out; z-index: 2147483647; }
    
    /* PILL CONTROL PANEL STYLES - BULLETPROOF CSS ICONS */
    #es-control-panel { 
      display: none !important; 
      position: fixed !important; 
      bottom: 15px !important; 
      left: 15px !important; 
      width: 250px !important; 
      height: 60px !important; 
      align-items: center !important; 
      justify-content: space-between !important;
      background: #1c1c1c !important; 
      padding: 0 25px !important; 
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
    }
    .es-panel-btn:hover { 
      transform: scale(1.1) !important; 
      background: rgba(204, 255, 0, 0.1) !important; 
    }
    
    /* BULLETPROOF SVG BACKGROUNDS TO DEFEAT MPEMBED SANITIZER */
    .es-icon-prev { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z'/%3E%3C/svg%3E") center center / contain no-repeat; width: 24px; height: 24px; }
    .es-icon-next { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z'/%3E%3C/svg%3E") center center / contain no-repeat; width: 24px; height: 24px; }
    .es-icon-unmute { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") center center / contain no-repeat; width: 26px; height: 26px; }
    .es-icon-mute { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E") center center / contain no-repeat; width: 26px; height: 26px; display: none; }

    .es-panel-btn span {
      font-size: 10px !important;
      font-weight: bold !important;
      color: #CCFF00 !important;
      letter-spacing: 0.5px !important;
      font-family: sans-serif !important;
    }
    .es-panel-divider { 
      width: 2px !important; 
      height: 30px !important; 
      background: #444 !important; 
      border-radius: 2px !important; 
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

  // PILL CONTROL PANEL HTML (Bulletproof backgrounds)
  const panel = document.createElement('div');
  panel.id = 'es-control-panel';
  panel.innerHTML = `
    <button class="es-panel-btn" id="es-btn-prev" title="Skip Backward">
      <div class="es-icon-prev"></div>
      <span>BACK</span>
    </button>

    <div class="es-panel-divider"></div>
    
    <button class="es-panel-btn" id="es-btn-audio" title="Mute / Unmute Audio">
      <div class="es-icon-unmute" id="es-svg-unmute"></div>
      <div class="es-icon-mute" id="es-svg-mute"></div>
      <span id="es-audio-label">MUTE</span>
    </button>

    <div class="es-panel-divider"></div>

    <button class="es-panel-btn" id="es-btn-next" title="Skip Forward">
      <div class="es-icon-next"></div>
      <span>CHEAT</span>
    </button>
  `;
  document.body.appendChild(panel);

  const startBtn = document.getElementById('eye-spy-start-btn');
  if(startBtn) {
    startBtn.addEventListener('click', () => {
      const ui = document.getElementById('eye-spy-start-ui');
      const overlay = document.getElementById('eye-spy-dark-overlay');
      if(ui) { ui.style.transition = "opacity 0.4s ease"; ui.style.opacity = "0"; setTimeout(() => ui.remove(), 400); }
      if(overlay) { overlay.style.transition = "opacity 0.4s ease"; overlay.style.opacity = "0"; setTimeout(() => overlay.remove(), 400); }

      // Reveal Panel ONLY after start is clicked
      const controls = document.getElementById('es-control-panel');
      if (controls) controls.style.setProperty('display', 'flex', 'important');

      try {
          window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA'; 
          window.globalSfx.play().catch(()=>{});
          window.globalChime.volume = 0;
          window.globalChime.play().then(() => { window.globalChime.pause(); window.globalChime.volume = 1; window.globalChime.currentTime = 0; }).catch(()=>{});
      } catch(e) {}
    });
  }

  startMechanics();
}

function startMechanics() {
  const LEVELS = [
    { level: 1, startSweeps: ['7k4p5mu5f5eydt8h0f8cygptb', 'cwckxx365uimbeqk6ngp0t5ud'], targetSweep: 'ep98q9hxumexd83q38p12k4xc', imagesToFind: ['/pink bopeep.jpeg', '/two white cows.jpeg', '/yourself.jpeg'] },
    { level: 2, startSweeps: ['ep98q9hxumexd83q38p12k4xc'], targetSweep: 't3si6z3gnc6ix4qh6cgmtgnfa', imagesToFind: ['/decongestant cough elixir.jpeg', '/plastic fruit.jpeg', '/pineapple sunday.jpeg'] },
    { level: 3, startSweeps: ['t3si6z3gnc6ix4qh6cgmtgnfa'], targetSweep: '2cngsqh5q4t1ep85y5ky0h49d', imagesToFind: ['/aztec chocolate.jpeg', '/atomic coffee.jpeg', '/royal perambulator.jpeg'] },
    { level: 4, startSweeps: ['2cngsqh5q4t1ep85y5ky0h49d'], targetSweep: '66yna1yh5e2ig14bmzzf1sn2c', imagesToFind: ['/a crow in a bag.jpeg', '/a hand in two.jpeg', '/vitreous china.jpeg', '/musical tyre.jpeg'] },
    { level: 5, startSweeps: ['66yna1yh5e2ig14bmzzf1sn2c'], targetSweep: '3hdk0cskxw0apbr2iw8016htb', imagesToFind: ['/Hanimexs Movielux.jpeg', '/argus previewer.jpeg', '/porcelain lobster.jpeg', '/scotts mower maker.jpeg'] },
    { level: 6, startSweeps: ['3hdk0cskxw0apbr2iw8016htb'], targetSweep: 'r7sd2g426fhbfa2wdh5dfxy5d', imagesToFind: ['/barley.jpg', '/some flumis.jpeg', '/wall climbing baby.jpeg', '/hide and seek.jpeg'] },
    { level: 7, startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], targetSweep: '20qckty5qi20t39838cq274rc', imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg'] }
  ];

  window.currentLevelIndex = 0;
  window.allModelSweeps = [];
  window.foundImages = {};
  window.isTeleporting = false; 
  window.pathsPreloaded = false; 
  
  // Decoupled tracking: found status vs currently active audio status
  window.activeOpenPopups = new Set(); 

  const targetMatchStrings = [];
  LEVELS.forEach(level => {
    level.imagesToFind.forEach(img => targetMatchStrings.push(img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', '')));
  });

  // --- VISUAL HUNTER (RESTORED TO GOLDEN v50) ---
  setInterval(() => {
    document.querySelectorAll('[class*="close"], [id*="close"]').forEach(btn => {
      if (btn.getBoundingClientRect().bottom > window.innerHeight - 100) { btn.style.setProperty('display', 'none', 'important'); btn.style.setProperty('opacity', '0', 'important'); }
    });

    document.querySelectorAll('.mpe-media-overlay, .mpe-overlay').forEach(el => {
        el.style.setProperty('filter', 'none', 'important'); el.style.setProperty('-webkit-filter', 'none', 'important'); el.style.setProperty('backdrop-filter', 'none', 'important'); el.style.setProperty('-webkit-backdrop-filter', 'none', 'important'); el.style.setProperty('background', 'transparent', 'important'); 
    });

    // Contains 'div' for proper popup styling
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

  // --- BUTTON LOGIC ---
  let isMuted = false;
  document.getElementById('es-btn-audio').addEventListener('click', () => {
      isMuted = !isMuted;
      window.globalSfx.muted = isMuted;
      window.globalChime.muted = isMuted;
      document.getElementById('es-svg-unmute').style.display = isMuted ? 'none' : 'block';
      document.getElementById('es-svg-mute').style.display = isMuted ? 'block' : 'none';
      document.getElementById('es-audio-label').innerText = isMuted ? 'UNMUTE' : 'MUTE';
  });

  document.getElementById('es-btn-next').addEventListener('click', () => {
      const cLevel = LEVELS[window.currentLevelIndex];
      if (cLevel && window.mpSdk && !window.isTeleporting) {
          // Kill audio and memory before jump
          window.globalSfx.pause();
          window.globalSfx.currentTime = 0;
          window.activeOpenPopups.clear();

          cLevel.imagesToFind.forEach(img => window.foundImages[img] = true);
          executeFastTeleport(window.mpSdk, cLevel);
      }
  });

  document.getElementById('es-btn-prev').addEventListener('click', () => {
      // Hard block preventing return to Sweep 30 (Anything before Index 0)
      if (window.currentLevelIndex <= 0 || window.isTeleporting) return;
      
      // Kill audio and memory before jump
      window.globalSfx.pause();
      window.globalSfx.currentTime = 0;
      window.activeOpenPopups.clear();

      window.isTeleporting = true;
      window.currentLevelIndex--;
      const pLevel = LEVELS[window.currentLevelIndex];

      window.mpSdk.Sweep.enable(...pLevel.startSweeps).then(() => {
          window.mpSdk.Sweep.moveTo(pLevel.startSweeps[0], { transition: window.mpSdk.Sweep.Transition.INSTANT }).then(() => {
              setupLevelTracking();
              lockMapForCurrentLevel(window.mpSdk);
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
    return Object.values(window.foundImages).every(status => status === true);
  }

  // --- TRIPWIRE WITH DECOUPLED INFINITE AUDIO REPLAY ---
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
              
              // 1. Audio Logic: Always play if it isn't currently open
              if (!window.activeOpenPopups.has(filename)) {
                playItemSound(filename); 
                window.activeOpenPopups.add(filename); 
              }

              // 2. Escape Room Logic: Track progress
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
              // Clear from memory so it can play again next time it opens
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
      try { await mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: mpSdk.Sweep.Transition.FLY });
      } catch (flyError) { await mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: mpSdk.Sweep.Transition.INSTANT }); }

      const sweepsToLock = window.allModelSweeps.filter(id => id !== levelData.targetSweep);
      await mpSdk.Sweep.disable(...sweepsToLock).catch(() => {});

      window.currentLevelIndex++; 
      
      if (LEVELS[window.currentLevelIndex]) {
          setupLevelTracking(); 
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
