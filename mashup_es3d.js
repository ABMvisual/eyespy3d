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
  let mp3Name = AUDIO_MAP[imageFilename];
  if (mp3Name) {
    window.globalSfx.src = GITHUB_BASE + encodeURIComponent(mp3Name);
  } else {
    window.globalSfx.src = 'https://upload.wikimedia.org/wikipedia/commons/4/42/Ping.mp3';
  }
  window.globalSfx.currentTime = 0;
  window.globalSfx.play().catch(() => {});
}

// --- 1. BOOT LOADER (Safely waits for browser to be ready) ---
let bootInterval = setInterval(() => {
  if (document.head && document.body) {
    clearInterval(bootInterval);
    injectCustomUI();
  }
}, 50);

function injectCustomUI() {
  // --- CSS INJECTION ---
  const customStyles = document.createElement('style');
  customStyles.innerHTML = `
    /* AGGRESSIVELY NUKE MPEMBED AUDIO UI */
    * {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }

    [id*="media-overlay"], [class*="media-overlay"], .mpe-overlay, #mpe-overlay {
      filter: none !important;
      -webkit-filter: none !important;
      background: transparent !important;
      background-color: transparent !important;
    }
    
    /* TARGETED ASSASSINATION */
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* PREVENT THE AUDIO 'X' MICRO-FLASH */
    audio, video, [id*="audio"], [class*="audio-player"], 
    div[style*="bottom: 0px"] [class*="close"], 
    div[style*="bottom: 0"] [class*="close"] {
      display: none !important;
      opacity: 0 !important;
      position: absolute !important;
      left: -9999px !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    /* SCALE UP *ONLY* THE POPUP 'X' BUTTON */
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close {
      transform: scale(3.5) !important; 
      right: 35px !important; 
      top: 35px !important; 
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 99999 !important;
      pointer-events: auto !important;
    }

    /* MULTI-LAYER START SCREEN */
    #eye-spy-dark-overlay {
      position: fixed !important; 
      top: 0 !important; left: 0 !important; 
      width: 100vw !important; height: 100vh !important;
      background: rgba(0, 0, 0, 0.75) !important; 
      z-index: 2147483645 !important; 
    }

    #eye-spy-image-cover {
      position: fixed !important; 
      top: 0 !important; left: 0 !important; 
      width: 100vw !important; height: 100vh !important;
      background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; 
      background-size: cover !important;
      background-position: center !important;
      z-index: 2147483646 !important; 
    }
    
    #eye-spy-image-cover::after {
      content: "";
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-image: inherit;
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      backdrop-filter: blur(15px);
      background-color: rgba(0,0,0,0.4);
    }

    #eye-spy-start-ui {
      position: fixed !important; 
      top: 0 !important; left: 0 !important; 
      width: 100vw !important; height: 100vh !important;
      z-index: 2147483647 !important; 
      display: flex !important; 
      flex-direction: column !important; 
      justify-content: center !important; 
      align-items: center !important;
    }

    #eye-spy-welcome-block {
      display: none; 
      flex-direction: column;
      align-items: center;
    }
    
    #eye-spy-start-btn {
      padding: 16px 40px !important; 
      font-size: 24px !important; 
      font-weight: bold !important;
      background: #CCFF00 !important; 
      color: #000 !important; 
      border: none !important; 
      border-radius: 8px !important;
      cursor: pointer !important; 
      transition: transform 0.2s ease !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
      pointer-events: auto !important;
    }

    #eye-spy-start-btn:hover { 
      transform: scale(1.05) !important; 
    }

    #eye-spy-loading-text {
        position: absolute;
        top: 40px;
        color: white;
        font-size: 16px;
        font-weight: normal;
        animation: eye-spy-fade 2s infinite ease-in-out;
        z-index: 2147483647; 
    }

    @keyframes eye-spy-fade {
        0% { opacity: 0.2; }
        50% { opacity: 1; }
        100% { opacity: 0.2; }
    }
  `;
  document.head.appendChild(customStyles);

  // --- HTML INJECTION ---
  const darkOverlay = document.createElement('div');
  darkOverlay.id = 'eye-spy-dark-overlay';
  document.body.appendChild(darkOverlay);

  const imageCover = document.createElement('div');
  imageCover.id = 'eye-spy-image-cover';
  document.body.appendChild(imageCover);

  const startUI = document.createElement('div');
  startUI.id = 'eye-spy-start-ui';
  startUI.innerHTML = `
    <div id="eye-spy-loading-text">Loading 3D experience...</div>
    <div id="eye-spy-welcome-block">
      <h1 style="margin: 0 0 15px 0; text-align: center; font-size: 42px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); color: white;">Welcome to Eye Spy 3D</h1>
      <p style="margin: 0 0 30px 0; font-size: 20px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">Please enjoy this experience with your audio on</p>
      <button id="eye-spy-start-btn">Start now!</button>
    </div>
  `;
  document.body.appendChild(startUI);

  // --- BUTTON CLICK EVENT ---
  const startBtn = document.getElementById('eye-spy-start-btn');
  if(startBtn) {
    startBtn.addEventListener('click', () => {
      const ui = document.getElementById('eye-spy-start-ui');
      const overlay = document.getElementById('eye-spy-dark-overlay');
      if(ui) { ui.style.transition = "opacity 0.4s ease"; ui.style.opacity = "0"; setTimeout(() => ui.remove(), 400); }
      if(overlay) { overlay.style.transition = "opacity 0.4s ease"; overlay.style.opacity = "0"; setTimeout(() => overlay.remove(), 400); }

      window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA'; 
      window.globalSfx.play().catch(() => {});
      window.globalChime.volume = 0;
      window.globalChime.play().then(() => { 
        window.globalChime.pause(); 
        window.globalChime.volume = 1; 
        window.globalChime.currentTime = 0; 
      }).catch(() => {});
    });
  }

  // Fire up the mechanics
  startMechanics();
}

function startMechanics() {
  // --- 2. LEVEL CONFIGURATION ---
  const LEVELS = [
    {
      level: 1,
      startSweeps: ['7k4p5mu5f5eydt8h0f8cygptb', 'cwckxx365uimbeqk6ngp0t5ud'], 
      targetSweep: 'ep98q9hxumexd83q38p12k4xc', 
      imagesToFind: ['/pink bopeep.jpeg', '/two white cows.jpeg', '/yourself.jpeg']
    },
    {
      level: 2,
      startSweeps: ['ep98q9hxumexd83q38p12k4xc'], 
      targetSweep: 't3si6z3gnc6ix4qh6cgmtgnfa', 
      imagesToFind: ['/decongestant cough elixir.jpeg', '/plastic fruit.jpeg', '/pineapple sunday.jpeg']
    },
    {
      level: 3,
      startSweeps: ['t3si6z3gnc6ix4qh6cgmtgnfa'], 
      targetSweep: '2cngsqh5q4t1ep85y5ky0h49d', 
      imagesToFind: ['/aztec chocolate.jpeg', '/atomic coffee.jpeg', '/royal perambulator.jpeg']
    },
    {
      level: 4,
      startSweeps: ['2cngsqh5q4t1ep85y5ky0h49d'], 
      targetSweep: '66yna1yh5e2ig14bmzzf1sn2c', 
      imagesToFind: ['/a crow in a bag.jpeg', '/a hand in two.jpeg', '/vitreous china.jpeg', '/musical tyre.jpeg']
    },
    {
      level: 5,
      startSweeps: ['66yna1yh5e2ig14bmzzf1sn2c'], 
      targetSweep: '3hdk0cskxw0apbr2iw8016htb', 
      imagesToFind: ['/Hanimexs Movielux.jpeg', '/argus previewer.jpeg', '/porcelain lobster.jpeg', '/scotts mower maker.jpeg']
    },
    {
      level: 6,
      startSweeps: ['3hdk0cskxw0apbr2iw8016htb'], 
      targetSweep: 'r7sd2g426fhbfa2wdh5dfxy5d', 
      imagesToFind: ['/barley.jpg', '/some flumis.jpeg', '/wall climbing baby.jpeg', '/hide and seek.jpeg']
    },
    {
      level: 7,
      startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], 
      targetSweep: '20qckty5qi20t39838cq274rc', 
      imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg']
    }
  ];

  // --- 3. THE VISUAL HUNTER ---
  const targetMatchStrings = [];
  LEVELS.forEach(level => {
    level.imagesToFind.forEach(img => {
      targetMatchStrings.push(img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', ''));
    });
  });

  setInterval(() => {
    document.querySelectorAll('[class*="close"], [id*="close"]').forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 100) {
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('opacity', '0', 'important');
      }
    });

    // NOTE: Redundant background filter styling loop was removed here!

    const textElements = document.querySelectorAll('div, span, p, h1, h2, h3');
    textElements.forEach(el => {
      if (el.children.length === 0 && el.textContent && el.offsetParent !== null) {
        const textClean = el.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (textClean.length > 3 && targetMatchStrings.includes(textClean)) {
          el.style.setProperty('position', 'absolute', 'important');
          el.style.setProperty('left', '50%', 'important');
          el.style.setProperty('top', '50%', 'important'); 
          el.style.setProperty('transform', 'translate(-50%, -50%)', 'important'); 
          el.style.setProperty('font-size', '240%', 'important'); 
          el.style.setProperty('color', 'white', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('white-space', 'nowrap', 'important');
          
          const banner = el.parentElement;
          if (banner && !banner.dataset.styled) {
            banner.style.setProperty('background-color', '#1c1c1c', 'important');
            banner.style.setProperty('background', '#1c1c1c', 'important'); 
            if (window.getComputedStyle(banner).position === 'static') {
              banner.style.setProperty('position', 'relative', 'important');
            }
            banner.style.setProperty('min-height', '75px', 'important');
            banner.dataset.styled = "true"; 
          }
        }
      }
    });
  }, 250); 

  // --- 4. GLOBAL STATE TRACKING ---
  window.currentLevelIndex = 0;
  window.allModelSweeps = [];
  window.foundImages = {};
  window.isTeleporting = false; 
  window.pathsPreloaded = false; 
  window.activeOpenPopups = new Set(); 

  function setupLevelTracking() {
    window.foundImages = {};
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (currentLevel) {
      currentLevel.imagesToFind.forEach(image => {
        window.foundImages[image] = false;
      });
    }
    window.isTeleporting = false;
    window.pathsPreloaded = false;
    window.activeOpenPopups.clear();
  }

  function checkAllFound() {
    return Object.values(window.foundImages).every(status => status === true);
  }

  // --- 5. THE TRIPWIRE LISTENER ---
  const observer = new MutationObserver((mutations) => {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel) return; 

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 || node.nodeType === 3) { 
          const outer = node.outerHTML || '';

          currentLevel.imagesToFind.forEach((filename) => {
            const encodedName = encodeURI(filename);

            if (outer.includes(filename) || outer.includes(encodedName)) {
              if (!window.foundImages[filename]) {
                console.log(`🎯 [Escape Room] Found: ${filename}`);
                playItemSound(filename); 
              }
              
              window.activeOpenPopups.add(filename); 
              window.foundImages[filename] = true;
              
              if (checkAllFound() && !window.pathsPreloaded) {
                window.pathsPreloaded = true;
                console.log(`🔓 [Escape Room] All items found! Unlocking map...`);
                
                window.globalChime.currentTime = 0;
                window.globalChime.play().catch(() => {});

                if (window.mpSdk) {
                  window.mpSdk.Sweep.enable(...window.allModelSweeps).catch(() => {});
                }
              }
            }
          });
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === 1 || node.nodeType === 3) { 
          const outer = node.outerHTML || '';

          currentLevel.imagesToFind.forEach((filename) => {
            const encodedName = encodeURI(filename);

            if (outer.includes(filename) || outer.includes(encodedName)) {
              window.activeOpenPopups.delete(filename); 
              
              if (checkAllFound() && window.activeOpenPopups.size === 0 && !window.isTeleporting) {
                console.log(`🚀 [Escape Room] Initiating Teleport sequence!`);
                executeFastTeleport(window.mpSdk, currentLevel);
              }
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // --- 6. INITIALIZATION & DOOR LOCKS ---
  async function initMashupLogic(mpSdk) {
    window.mpSdk = mpSdk;
    setupLevelTracking();

    let sweepCollection = await new Promise((resolve) => {
      let sub = mpSdk.Sweep.data.subscribe({
        onCollectionUpdated: function (collection) {
          if (Object.keys(collection).length > 0) {
              resolve(collection);
              sub.cancel(); 
          }
        }
      });
    });

    window.allModelSweeps = Object.keys(sweepCollection);
    lockMapForCurrentLevel(mpSdk);

    // CRITICAL: Sweeps are loaded! 
    const cover = document.getElementById('eye-spy-image-cover');
    if (cover) {
      cover.style.transition = "opacity 0.5s ease";
      cover.style.opacity = "0";
      setTimeout(() => cover.remove(), 500);
    }
    
    const loadingText = document.getElementById('eye-spy-loading-text');
    if (loadingText) loadingText.remove();
    
    const welcomeBlock = document.getElementById('eye-spy-welcome-block');
    if (welcomeBlock) welcomeBlock.style.display = "flex";

    mpSdk.on(mpSdk.Sweep.Event.EXIT, function(fromSweep) {
      const cLevel = LEVELS[window.currentLevelIndex];
      if (cLevel && cLevel.startSweeps.includes(fromSweep)) {
        mpSdk.Sweep.disable(fromSweep).catch(() => {});
      }
    });
  }

  function lockMapForCurrentLevel(mpSdk) {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel) return;

    const sweepsToDisable = window.allModelSweeps.filter(
      id => !currentLevel.startSweeps.includes(id)
    );

    if (sweepsToDisable.length > 0) {
      mpSdk.Sweep.disable(...sweepsToDisable).catch(() => {});
    }
  }

  // --- 7. THE NATURAL TELEPORT SEQUENCE ---
  async function executeFastTeleport(mpSdk, levelData) {
    window.isTeleporting = true;
    
    try {
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
      } else {
        console.log("🏆 [Escape Room] Complete!");
      }

    } catch (error) {
      console.error("Teleport failed:", error);
    }
    window.isTeleporting = false;
  }

  // Boot-up SDK Checker
  let checkSdkInterval = setInterval(function() {
    if (window.mpSdk && window.mpSdk.Sweep) {
      clearInterval(checkSdkInterval); 
      initMashupLogic(window.mpSdk);
    }
  }, 500);
}
