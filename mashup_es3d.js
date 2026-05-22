// --- 0. AUDIO SETUP ---
window.audioSuccess = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3');
window.audioUnlock = new Audio('https://cdn.pixabay.com/download/audio/2021/08/09/audio_24e370a563.mp3');


// --- 1. START SCREEN, AUDIO UI NUKE & GLOBAL CSS ---
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
  
  /* TARGETED ASSASSINATION: The White Circle image & Custom Billboard */
  [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  /* PREVENT THE AUDIO 'X' FLASH */
  audio, video, #mpe-audio-player, .mpe-audio-player, div[style*="bottom: 0"][style*="right: 0"] > [class*="close"] {
    display: none !important;
    opacity: 0 !important;
    position: absolute !important;
    left: -9999px !important;
    pointer-events: none !important;
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

  /* DUAL-LAYER START SCREEN STYLING */
  #eye-spy-image-cover {
    position: fixed !important; 
    top: 0 !important; 
    left: 0 !important; 
    width: 100vw !important; 
    height: 100vh !important;
    /* UPDATE THIS URL WITH YOUR START SCREEN IMAGE */
    background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop') !important; 
    background-size: cover !important;
    background-position: center !important;
    background-color: #111 !important;
    z-index: 2147483647 !important; 
  }

  #eye-spy-start-ui {
    position: fixed !important; 
    top: 0 !important; 
    left: 0 !important; 
    width: 100vw !important; 
    height: 100vh !important;
    background: transparent !important; 
    z-index: 2147483646 !important; 
    display: none; 
    flex-direction: column !important; 
    justify-content: flex-end !important; 
    align-items: center !important;
    padding-bottom: 10vh !important;
  }
  
  #eye-spy-start-btn {
    padding: 16px 40px !important; 
    font-size: 24px !important; 
    font-weight: bold !important;
    background: #CCFF00 !important; 
    color: #000 !important; 
    border: none !important; 
    border-radius: 8px !important;
    cursor: wait !important; 
    transition: transform 0.2s ease, opacity 0.2s ease !important;
    opacity: 0.5 !important;
    pointer-events: none !important; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
  }
  
  #eye-spy-start-btn.ready { 
    opacity: 1 !important;
    pointer-events: auto !important; 
    cursor: pointer !important;
  }

  #eye-spy-start-btn.ready:hover { 
    transform: scale(1.05) !important; 
  }
`;
document.head.appendChild(customStyles);

// Inject Dual-Layer Start Screen HTML
const imageCover = document.createElement('div');
imageCover.id = 'eye-spy-image-cover';
document.body.appendChild(imageCover);

const startUI = document.createElement('div');
startUI.id = 'eye-spy-start-ui';
startUI.innerHTML = `<button id="eye-spy-start-btn">Loading 3D Experience...</button>`;
document.body.appendChild(startUI);

document.getElementById('eye-spy-start-btn').addEventListener('click', () => {
  // THE AUDIO WARM-UP: Silently play and pause to unlock browser audio restrictions
  window.audioSuccess.volume = 0;
  window.audioSuccess.play().then(() => { window.audioSuccess.pause(); window.audioSuccess.volume = 1; window.audioSuccess.currentTime = 0; }).catch(()=>{});
  
  window.audioUnlock.volume = 0;
  window.audioUnlock.play().then(() => { window.audioUnlock.pause(); window.audioUnlock.volume = 1; window.audioUnlock.currentTime = 0; }).catch(()=>{});

  startUI.style.transition = "opacity 0.5s ease";
  startUI.style.opacity = "0";
  setTimeout(() => startUI.remove(), 500);
});

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
    }
  });

  document.querySelectorAll('.mpe-media-overlay, .mpe-overlay').forEach(el => {
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('-webkit-filter', 'none', 'important');
      el.style.setProperty('backdrop-filter', 'none', 'important');
      el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
      el.style.setProperty('background', 'transparent', 'important'); 
  });

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


// --- 5. THE TRIPWIRE LISTENER (WITH UNLOCKED AUDIO) ---
const observer = new MutationObserver((mutations) => {
  const currentLevel = LEVELS[window.currentLevelIndex];
  if (!currentLevel) return; 

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 || node.nodeType === 3) { 
        const html = node.innerHTML || '';
        const outer = node.outerHTML || '';
        const text = node.textContent || '';

        currentLevel.imagesToFind.forEach((filename) => {
          const encodedName = encodeURI(filename);

          if (html.includes(filename) || html.includes(encodedName) || outer.includes(filename) || text.includes(filename)) {
            if (!window.foundImages[filename]) {
              console.log(`🎯 [Escape Room] Found: ${filename}`);
              
              // FIRE AUDIO
              window.audioSuccess.currentTime = 0; 
              window.audioSuccess.play().catch(e => console.log("Audio blocked:", e));
            }
            
            window.activeOpenPopups.add(filename); 
            window.foundImages[filename] = true;
            
            if (checkAllFound() && !window.pathsPreloaded) {
              window.pathsPreloaded = true;
              console.log(`🔓 [Escape Room] All items found! Unlocking map for flight...`);
              
              // FIRE UNLOCK AUDIO
              window.audioUnlock.currentTime = 0;
              window.audioUnlock.play().catch(e => console.log("Audio blocked:", e));

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
        const html = node.innerHTML || '';
        const outer = node.outerHTML || '';
        const text = node.textContent || '';

        currentLevel.imagesToFind.forEach((filename) => {
          const encodedName = encodeURI(filename);

          if (html.includes(filename) || html.includes(encodedName) || outer.includes(filename) || text.includes(filename)) {
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

  // CRITICAL: Sweeps are loaded! Unlock UI.
  const cover = document.getElementById('eye-spy-image-cover');
  if (cover) {
    cover.style.transition = "opacity 0.5s ease";
    cover.style.opacity = "0";
    setTimeout(() => cover.remove(), 500);
  }
  
  const startBtn = document.getElementById('eye-spy-start-btn');
  if (startBtn) {
      startBtn.innerText = "Start Experience";
      startBtn.classList.add('ready');
  }
  const startUI = document.getElementById('eye-spy-start-ui');
  if (startUI) {
      startUI.style.display = "flex";
  }

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
}

// Boot-up
let checkSdkInterval = setInterval(function() {
  if (window.mpSdk && window.mpSdk.Sweep) {
    clearInterval(checkSdkInterval); 
    initMashupLogic(window.mpSdk);
  }
}, 500);
