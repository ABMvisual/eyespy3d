// =============================================================================
// EYE SPY 3D — LEAN MASTER ENGINE (V4000)
// ARCHITECTURE FIX: Zero DOM scanning. Directly targets #customBillboardFullOverlay
// =============================================================================

const GITHUB_BASE = 'https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/';

const AUDIO_MAP = {
  '/pink bopeep.jpeg': 'pink bo-peep.mp3',
  '/two white cows.jpeg': 'two white cows.mp3',
  '/yourself.jpeg': 'yourself.mp3',
  '/decongestant cough elixir.jpeg': 'decongestant cough elixir.mp3',
  '/plastic fruit.jpeg': 'plastic fruit.mp3',
  '/pineapple sunday.jpeg': 'pineapple sunday.mp3',
  '/aztec chocolate.jpeg': 'aztec chocolate.mp3',
  '/atomic coffee.jpeg': 'atomic coffee.mp3',
  '/royal perambulator.jpeg': 'royal perambulator.mp3',
  '/a crow in a bag.jpeg': 'a crow in a bag.mp3',
  '/a hand in two.jpeg': 'a hand in two.mp3',
  '/vitreous china.jpeg': 'vitreous china.mp3',
  '/musical tyre.jpeg': 'musical tyre.mp3',
  '/Hanimexs Movielux.jpeg': 'Hanimexs Movielux.mp3',
  '/argus previewer.jpeg': 'argus previewer.mp3',
  '/porcelain lobster.jpeg': 'porcelain lobster.mp3',
  '/scotts mower maker.jpeg': 'scotts mower maker.mp3',
  '/barley.jpg': 'barley.mp3',
  '/some flumis.jpeg': 'some flumis.mp3',
  '/wall climbing baby.jpeg': 'wall climbing baby.mp3',
  '/hide and seek.jpeg': 'hide and seek.mp3',
  '/a pair of old jugs.jpeg': 'a pair of old jugs.mp3',
  '/a third more time.jpeg': 'a third more time.mp3',
  '/odd purves terms.jpeg': 'odd purves terms.mp3',
  '/round thing.jpeg': 'round thing.mp3',
  
  // LEVELS 8 - 15
  '/cat in a turban.jpeg': 'cat in a turban.mp3',
  '/embroidered australia.jpeg': 'embroidered australia.mp3',
  '/three wooden discs.jpeg': 'three wooden discs.mp3',
  '/she disinterestedly sat.jpeg': 'she disinterestedly sat.mp3',
  '/picked pack.jpeg': 'picked pack.mp3',
  '/two little fellas.jpeg': 'two little fellas.mp3',
  '/drinking urn.jpeg': 'drinking urn.mp3',
  '/viking preserve.jpeg': 'viking preserve.mp3',
  '/confetti.jpeg': 'confetti.mp3',
  '/two box of confetti.jpeg': 'two box of confetti.mp3',
  '/eagle.jpeg': 'eagle.mp3',
  '/blue hand.jpeg': 'blue hand.mp3',
  '/gnome all alone.jpeg': 'gnome all alone.mp3',
  '/beetles.jpeg': 'beetles.mp3',
  '/mock ducks.jpeg': 'mock ducks.mp3',
  '/unarmed man.jpeg': 'unarmed man.mp3',
  '/wooden goanna.jpeg': 'wooden goanna.mp3',
  '/whose head.jpeg': 'whose head.mp3',
  '/runners.jpeg': 'runners.mp3',
  '/the plugs.jpeg': 'the plugs.mp3',
  '/hat.jpeg': 'hat.mp3',
  '/the hugs.jpeg': 'the hugs.mp3',
  '/dimboola.jpeg': 'dimboola.mp3',
  '/akubra.jpeg': 'akubra.mp3',
  '/egypt etc.jpeg': 'egypt etc.mp3',
  '/tiger.jpeg': 'tiger.mp3',
  '/butterfly.jpeg': 'butterfly.mp3',
  '/horse head.jpeg': 'horse head.mp3'
};

window.globalSfx = new Audio();
window.globalChime = new Audio('https://upload.wikimedia.org/wikipedia/commons/d/d7/Tada.mp3');

function playItemSound(imageFilename) {
  let mp3Name = AUDIO_MAP[imageFilename];
  if (mp3Name) {
    window.globalSfx.src = GITHUB_BASE + encodeURIComponent(mp3Name);
    window.globalSfx.currentTime = 0;
    window.globalSfx.play().catch(()=>{});
  }
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
    
    [id*="media-overlay"], [class*="media-overlay"], .mpe-overlay, #mpe-overlay { filter: none !important; -webkit-filter: none !important; background: transparent !important; background-color: transparent !important; }
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
    
    audio, [id*="audio"], [class*="audio-player"] { display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; visibility: hidden !important; }
    
    /* PRE-GAME STATE: Hides the video player completely until "Start" is clicked */
    body:not(.game-started) video, 
    body:not(.game-started) [class*="close"], 
    body:not(.game-started) .mpe-media-close {
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
    }

    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close { transform: scale(3.5) !important; right: 35px !important; top: 35px !important; z-index: 99999 !important; pointer-events: auto !important; }

    .mpe-popup, .mp-mattertag { transition: none !important; animation: none !important; }

    #eye-spy-dark-overlay { 
        position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; 
        background: rgba(0, 0, 0, 0.4) !important; 
        backdrop-filter: grayscale(100%) brightness(60%) !important;
        -webkit-backdrop-filter: grayscale(100%) brightness(60%) !important;
        z-index: 2147483645 !important; 
    }

    #eye-spy-image-cover { 
        position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; 
        background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; 
        background-size: cover !important; background-position: center !important; 
        z-index: 2147483646 !important; animation: slow-punch 12s infinite alternate ease-in-out;
    }
    #eye-spy-image-cover::after { 
        content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background-image: inherit; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; 
        backdrop-filter: blur(15px); background-color: rgba(0,0,0,0.4); 
    }
    
    @keyframes slow-punch { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }

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
    { level: 7, startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], targetSweep: '20qckty5qi20t39838cq274rc', imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg'] },
    { level: 8, startSweeps: ['20qckty5qi20t39838cq274rc'], targetSweep: 'dy113u49qt5s7y38ms7ibmd9b', imagesToFind: ['/cat in a turban.jpeg', '/embroidered australia.jpeg', '/three wooden discs.jpeg'] },
    { level: 9, startSweeps: ['dy113u49qt5s7y38ms7ibmd9b'], targetSweep: 'rxgziepm3g4e0fgdgnwwk6efd', imagesToFind: ['/she disinterestedly sat.jpeg', '/picked pack.jpeg', '/two little fellas.jpeg'] },
    { level: 10, startSweeps: ['rxgziepm3g4e0fgdgnwwk6efd'], targetSweep: 'w2bre69ufwyaywn11ch032aaa', imagesToFind: ['/drinking urn.jpeg', '/viking preserve.jpeg', '/confetti.jpeg', '/two box of confetti.jpeg'] },
    { level: 11, startSweeps: ['w2bre69ufwyaywn11ch032aaa'], targetSweep: 'dimg015tts6u2b30hh0pndaqd', imagesToFind: ['/eagle.jpeg', '/blue hand.jpeg', '/gnome all alone.jpeg', '/beetles.jpeg'] },
    { level: 12, startSweeps: ['dimg015tts6u2b30hh0pndaqd'], targetSweep: 'iwaxrd4g1gki6i64y6dk1iuhd', imagesToFind: ['/mock ducks.jpeg', '/unarmed man.jpeg', '/wooden goanna.jpeg'] },
    { level: 13, startSweeps: ['iwaxrd4g1gki6i64y6dk1iuhd'], targetSweep: 'aty78ze3y9ddyg8702gmncdma', imagesToFind: ['/whose head.jpeg', '/runners.jpeg', '/the plugs.jpeg', '/hat.jpeg', '/the hugs.jpeg'] },
    { level: 14, startSweeps: ['aty78ze3y9ddyg8702gmncdma'], targetSweep: 'e5ynaauc9kx9mar4r52hp1rfb', imagesToFind: ['/dimboola.jpeg', '/akubra.jpeg', '/egypt etc.jpeg', '/tiger.jpeg', '/butterfly.jpeg', '/horse head.jpeg'] },
    { level: 15, startSweeps: ['e5ynaauc9kx9mar4r52hp1rfb'], targetSweep: 'e5ynaauc9kx9mar4r52hp1rfb', imagesToFind: [] }
  ];

  window.currentLevelIndex = 0;
  window.allModelSweeps = [];
  window.foundImages = {};
  window.isTeleporting = false; 
  window.activeOpenPopups = new Set(); 

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

  // --- THE ULTRA-LEAN ENGINE (No DOM Scanning, Direct Visibility Checks) ---
  setInterval(() => {
    // 1. Keep unwanted audio players hidden, but leave the Intro Video untouched
    document.querySelectorAll('audio, [class*="audio-player"]').forEach(btn => {
      btn.style.setProperty('display', 'none', 'important');
      btn.style.setProperty('opacity', '0', 'important');
    });

    // 2. Hijack the intro video so it stays frozen until Start is clicked
    if (!document.body.classList.contains('game-started')) {
      document.querySelectorAll('video').forEach(v => v.pause());
    }

    // 3. Directly target the Custom Billboard boxes
    const openPopups = document.querySelectorAll('#customBillboardFullOverlay, .mpe-popup, .mpe-media-overlay');
    let anyOpen = false;

    openPopups.forEach(overlay => {
        // If the box is actively visible on the screen
        if (window.getComputedStyle(overlay).display !== 'none' && window.getComputedStyle(overlay).visibility !== 'hidden') {
            anyOpen = true;
            
            // Look directly inside for the text
            const textContainer = overlay.querySelector('.tag-text-content, div[class*="text"], h1, h2, h3, p');
            if (!textContainer || !textContainer.textContent) return;

            const textClean = textContainer.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            const currentLevel = LEVELS[window.currentLevelIndex];
            
            if (!currentLevel || window.isTeleporting) return;

            currentLevel.imagesToFind.forEach((filename) => {
                const cleanName = filename.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', '');
                
                // We found a match!
                if (textClean.includes(cleanName)) {
                    
                    // A) Format it instantly (Only applies once)
                    if (!textContainer.dataset.styled) {
                        textContainer.style.setProperty('position', 'absolute', 'important');
                        textContainer.style.setProperty('left', '50%', 'important');
                        textContainer.style.setProperty('top', '50%', 'important'); 
                        textContainer.style.setProperty('transform', 'translate(-50%, -50%)', 'important'); 
                        textContainer.style.setProperty('font-size', '240%', 'important'); 
                        textContainer.style.setProperty('color', 'white', 'important');
                        textContainer.style.setProperty('margin', '0', 'important');
                        textContainer.style.setProperty('white-space', 'nowrap', 'important');
                        
                        const banner = textContainer.parentElement;
                        if (banner) {
                            banner.style.setProperty('background-color', '#1c1c1c', 'important');
                            banner.style.setProperty('background', '#1c1c1c', 'important'); 
                            if (window.getComputedStyle(banner).position === 'static') {
                                banner.style.setProperty('position', 'relative', 'important');
                            }
                            banner.style.setProperty('min-height', '75px', 'important');
                        }
                        textContainer.dataset.styled = "true"; 
                    }

                    // B) Game Logic
                    if (!window.foundImages[filename]) {
                        console.log(`🎯 [Escape Room] Found: ${filename}`);
                        playItemSound(filename); 
                        window.foundImages[filename] = true;
                        
                        if (checkAllFound()) {
                            console.log(`🔓 [Escape Room] All items found! Door unlocked.`);
                            try { window.globalChime.currentTime = 0; window.globalChime.play().catch(()=>{}); } catch(e){}
                        }
                    }
                    
                    // Register that it is actively open right now
                    window.activeOpenPopups.add(filename);
                }
            });
        }
    });

    // 4. Teleport Trigger: If ALL popups are closed (display: none), but we have active popups in memory
    if (!anyOpen && window.activeOpenPopups.size > 0) {
        window.activeOpenPopups.clear(); // Clear the memory, the player closed it
        
        if (checkAllFound() && !window.isTeleporting) {
            console.log(`🚀 [Escape Room] Initiating Teleport sequence!`);
            executeFastTeleport(window.mpSdk, LEVELS[window.currentLevelIndex]);
        }
    }

  }, 100); // Because we aren't scanning the DOM tree, running this at 100ms is incredibly fast and lag-free.

  // --- INITIALIZATION & DOOR LOCKS ---
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

    const loadingText = document.getElementById('eye-spy-loading-text');
    if (loadingText) loadingText.remove();
    
    const cover = document.getElementById('eye-spy-image-cover');
    if (cover) {
        cover.style.transition = "opacity 0.6s ease";
        cover.style.opacity = "0";
        setTimeout(() => cover.remove(), 600);
    }
    
    const welcomeBlock = document.getElementById('eye-spy-welcome-block');
    if (welcomeBlock) welcomeBlock.style.display = "flex";

    const startBtn = document.getElementById('eye-spy-start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
            else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();

            const ui = document.getElementById('eye-spy-start-ui');
            const overlay = document.getElementById('eye-spy-dark-overlay');
            if (ui) { ui.style.transition = "opacity 0.4s ease"; ui.style.opacity = "0"; setTimeout(() => ui.remove(), 400); }
            if (overlay) { overlay.style.transition = "opacity 0.4s ease"; overlay.style.opacity = "0"; setTimeout(() => overlay.remove(), 400); }

            document.body.classList.add('game-started');

            // --- THE BULLETPROOF VIDEO HOUND ---
            let attempts = 0;
            let waitForVideo = setInterval(() => {
                const v = document.querySelector('video');
                if (v) {
                    clearInterval(waitForVideo); 
                    v.currentTime = 0;
                    v.play().catch(()=>{});
                    
                    v.onended = () => {
                        let container = v.closest('.mpe-popup, .mp-mattertag, [id*="Billboard"], [class*="billboard"]') || v.parentElement;
                        // Scoped search inside container, fallback to page-wide if needed
                        const closeBtn = container ? container.querySelector('[class*="close"]') : document.querySelector('[class*="close"]');
                        if (closeBtn) closeBtn.click();
                        else console.warn('[Eye Spy] Video ended but could not find the X to close it!');
                    };
                }
                if(attempts++ > 100) clearInterval(waitForVideo); // Give up after 10 seconds to prevent endless loop
            }, 100);

            try { window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA'; window.globalSfx.play().catch(() => {}); } catch (e) {}

            lockMapForCurrentLevel();
        });
    }
  }

  function lockMapForCurrentLevel() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || window.allModelSweeps.length === 0) return;

    const sweepsToDisable = window.allModelSweeps.filter(
      id => !currentLevel.startSweeps.includes(id)
    );

    if (sweepsToDisable.length > 0) {
      window.mpSdk.Sweep.disable(...sweepsToDisable).catch(() => {});
    }
  }

  async function executeFastTeleport(mpSdk, levelData) {
    window.isTeleporting = true;
    
    try {
      await window.mpSdk.Sweep.enable(levelData.targetSweep).catch(() => {});

      try { 
          await window.mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: window.mpSdk.Sweep.Transition.FLY });
      } catch (flyError) { 
          await window.mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: window.mpSdk.Sweep.Transition.INSTANT }); 
      }

      window.currentLevelIndex++; 
      
      if (LEVELS[window.currentLevelIndex]) {
          setupLevelTracking(); 
          lockMapForCurrentLevel(); 
      } else {
          console.log("🏆 [Escape Room] Complete!");
      }
    } catch (error) {
      console.error("Teleport failed:", error);
    }
    window.isTeleporting = false;
  }

  let checkSdkInterval = setInterval(function() {
    if (window.mpSdk && window.mpSdk.App) {
        window.mpSdk.App.state.subscribe(function (appState) {
            if (appState.phase === window.mpSdk.App.Phase.PLAYING) {
                clearInterval(checkSdkInterval); 
                initMashupLogic(window.mpSdk); 
            }
        });
    }
  }, 500);
}
