// =============================================================================
// EYE SPY 3D — V400: THE TRUE GOLDEN BASELINE (EXTRACTED FROM LOG)
// =============================================================================

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

function playItemSound(imageFilename) {
  try {
    let mp3Name = AUDIO_MAP[imageFilename];
    if (mp3Name) {
      window.globalSfx.src = GITHUB_BASE + encodeURIComponent(mp3Name);
      window.globalSfx.currentTime = 0;
      window.globalSfx.play().catch(()=>{});
    }
  } catch(e) {}
}

// --- 1. BOOT LOADER & CSS INJECTION ---
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
    
    /* AGGRESSIVE UI ASSASSINATION */
    [id*="media-overlay"], [class*="media-overlay"], .mpe-overlay, #mpe-overlay { filter: none !important; -webkit-filter: none !important; background: transparent !important; background-color: transparent !important; }
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
    audio, video, [id*="audio"], [class*="audio-player"], div[style*="bottom: 0px"] [class*="close"], div[style*="bottom: 0"] [class*="close"], .mpe-media-close { display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; visibility: hidden !important; }
    
    /* ENLARGE POPUP CLOSE BUTTON */
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close { transform: scale(3.5) !important; right: 35px !important; top: 35px !important; opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important; }

    /* KILL POPUP ANIMATIONS */
    .mpe-popup, .mp-mattertag { transition: none !important; animation: none !important; }

    /* START SCREEN FILTERS */
    #eye-spy-dark-overlay { 
        position: fixed !important; 
        top: 0 !important; left: 0 !important; 
        width: 100vw !important; height: 100vh !important; 
        background: rgba(90, 60, 30, 0.3) !important; 
        backdrop-filter: sepia(100%) contrast(110%) brightness(85%) hue-rotate(-5deg) !important;
        -webkit-backdrop-filter: sepia(100%) contrast(110%) brightness(85%) hue-rotate(-5deg) !important;
        z-index: 2147483645 !important; 
    }

    #eye-spy-image-cover { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; background-size: cover !important; background-position: center !important; z-index: 2147483646 !important; }
    #eye-spy-image-cover::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: inherit; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; backdrop-filter: blur(15px); background-color: rgba(0,0,0,0.4); }
    #eye-spy-start-ui { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
    #eye-spy-welcome-block { display: none; flex-direction: column; align-items: center; }
    
    #eye-spy-start-btn { padding: 16px 40px !important; font-size: 24px !important; font-weight: bold !important; background: #CCFF00 !important; color: #000 !important; border: none !important; border-radius: 8px !important; cursor: pointer !important; transition: transform 0.2s ease !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; pointer-events: auto !important; }
    #eye-spy-start-btn:hover { transform: scale(1.05) !important; }
    #eye-spy-loading-text { position: absolute; top: 40px; color: white; font-size: 16px; font-weight: normal; animation: eye-spy-fade 2s infinite ease-in-out; z-index: 2147483647; }
    
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

  // SECONDARY JS AUDIO ASSASSIN
  setInterval(() => {
    document.querySelectorAll('[class*="close"], [id*="close"]').forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 100 && rect.height > 0) {
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('opacity', '0', 'important');
      }
    });
  }, 100);

  startMechanics();
}

function startMechanics() {
  const SWEEPS = {
    lobby:       '7k4p5mu5f5eydt8h0f8cygptb',  // Level 0 spawn (Sweep 30)
    level1Entry: 'cwckxx365uimbeqk6ngp0t5ud',  // Sweep 28
    level2Entry: 'ep98q9hxumexd83q38p12k4xc',  // Sweep 27
  };

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

  window.currentLevelIndex = 0;
  window.allModelSweeps = [];
  window.foundImages = {};
  window.isTeleporting = false; 
  window.activeOpenPopups = new Set(); 

  const targetMatchStrings = [];
  LEVELS.forEach(level => {
    level.imagesToFind.forEach(img => {
      targetMatchStrings.push(img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', ''));
    });
  });

  function setupLevelTracking() {
    window.foundImages = {};
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (currentLevel && currentLevel.imagesToFind) {
      currentLevel.imagesToFind.forEach(image => { window.foundImages[image] = false; });
    }
    window.isTeleporting = false;
    window.activeOpenPopups.clear();
  }

  function checkAllFound() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || !currentLevel.imagesToFind || currentLevel.imagesToFind.length === 0) return true;
    return currentLevel.imagesToFind.every(img => window.foundImages[img] === true);
  }

  // --- THE FAST MUTATION OBSERVER ---
  const observer = new MutationObserver((mutations) => {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || currentLevel.imagesToFind.length === 0) return; 

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
              
              // Apply CSS
              if (node.nodeType === 1) {
                  const textEls = Array.from(node.querySelectorAll('div, span, p, h1, h2, h3'));
                  if (['DIV','SPAN','P','H1','H2','H3'].includes(node.tagName)) textEls.push(node);
                  
                  textEls.forEach(el => {
                      if (el.children.length === 0 && el.textContent) {
                          const t2 = el.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
                          if (t2.includes(cleanName.replace(/[^a-z0-9]/g, '')) && !el.dataset.styled) {
                              el.dataset.styled = "true";
                              el.style.setProperty('position', 'absolute', 'important');
                              el.style.setProperty('left', '50%', 'important');
                              el.style.setProperty('top', '50%', 'important');
                              el.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
                              el.style.setProperty('font-size', '240%', 'important');
                              el.style.setProperty('color', 'white', 'important');
                              el.style.setProperty('margin', '0', 'important');
                              el.style.setProperty('white-space', 'nowrap', 'important');
                              if (el.parentElement) {
                                  el.parentElement.style.setProperty('background-color', '#1c1c1c', 'important');
                                  el.parentElement.style.setProperty('min-height', '75px', 'important');
                              }
                          }
                      }
                  });
              }

              if (!window.activeOpenPopups.has(filename)) {
                playItemSound(filename); 
                window.activeOpenPopups.add(filename); 
              }

              if (!window.foundImages[filename]) {
                 window.foundImages[filename] = true;
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
                executeFastTeleport(currentLevel);
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

    // Swap loading text for Start button
    const loadingText = document.getElementById('eye-spy-loading-text');
    if (loadingText) loadingText.remove();
    const welcomeBlock = document.getElementById('eye-spy-welcome-block');
    if (welcomeBlock) welcomeBlock.style.display = "flex";

    // Bind Start Button to clear overlays and apply the locks
    const startBtn = document.getElementById('eye-spy-start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const ui = document.getElementById('eye-spy-start-ui');
            const overlay = document.getElementById('eye-spy-dark-overlay');
            const cover = document.getElementById('eye-spy-image-cover');
            
            if (ui) { ui.style.transition = "opacity 0.4s ease"; ui.style.opacity = "0"; setTimeout(() => ui.remove(), 400); }
            if (overlay) { overlay.style.transition = "opacity 0.4s ease"; overlay.style.opacity = "0"; setTimeout(() => overlay.remove(), 400); }
            if (cover) { cover.style.transition = "opacity 0.4s ease"; cover.style.opacity = "0"; setTimeout(() => cover.remove(), 400); }

            try { window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA'; window.globalSfx.play().catch(()=>{}); } catch(e) {}
            
            // Lock the map instantly upon starting
            lockMapForCurrentLevel();
        });
    }

    window.mpSdk.on(window.mpSdk.Sweep.Event.ENTER, function(sweepId) {
      if (window.isTeleporting) return;
      
      // Step off Sweep 30 -> Upgrade to Level 1
      if (window.currentLevelIndex === 0 && sweepId !== SWEEPS.lobby) {
          window.currentLevelIndex = 1;
          setupLevelTracking();
          lockMapForCurrentLevel();
      }
      
      // Clear audio on room enter
      window.globalSfx.pause();
      window.globalSfx.currentTime = 0;
      window.activeOpenPopups.clear();
      
      setTimeout(() => {
          document.querySelectorAll('audio, video').forEach(media => {
              media.currentTime = 0;
              media.play().catch(()=>{});
          });
      }, 300);
    });
  }

  function lockMapForCurrentLevel() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || window.allModelSweeps.length === 0) return;
    
    // Enable all, then surgically disable
    window.mpSdk.Sweep.enable(...window.allModelSweeps).catch(()=>{});

    setTimeout(() => {
        // If past level 0, permanently lock sweep 30
        if (window.currentLevelIndex > 0) {
            window.mpSdk.Sweep.disable(SWEEPS.lobby).catch(()=>{});
        }
        // Lock the target sweep until puzzle is solved
        if (window.currentLevelIndex > 0 && currentLevel.targetSweep) {
            window.mpSdk.Sweep.disable(currentLevel.targetSweep).catch(()=>{});
        }
    }, 150); 
  }

  async function executeFastTeleport(levelData) {
    window.isTeleporting = true;
    try {
      await window.mpSdk.Sweep.enable(levelData.targetSweep).catch(() => {});

      try { await window.mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: window.mpSdk.Sweep.Transition.FLY });
      } catch (flyError) { await window.mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: window.mpSdk.Sweep.Transition.INSTANT }); }

      window.currentLevelIndex++; 
      
      if (LEVELS[window.currentLevelIndex]) {
          setupLevelTracking(); 
          lockMapForCurrentLevel();
      }
    } catch (error) {}
    window.isTeleporting = false;
  }

  let checkSdkInterval = setInterval(function() {
    if (window.mpSdk && window.mpSdk.Sweep) { 
      clearInterval(checkSdkInterval); 
      initMashupLogic(window.mpSdk); 
    }
  }, 500);
}
