// --- 0. START SCREEN, AUDIO UI NUKE & GLOBAL CSS ---
const customStyles = document.createElement('style');
customStyles.innerHTML = `
  /* 1. AGGRESSIVELY NUKE MPEMBED AUDIO UI (CSS Baseline) */
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
  
  /* THE SMOKING GUN: customBillboardLoading */
  [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  audio, video, #mpe-audio-player, .mpe-audio-player {
    opacity: 0 !important;
    position: absolute !important;
    left: -9999px !important;
    pointer-events: none !important;
  }

  /* 2. SCALE UP *ONLY* THE POPUP 'X' BUTTON (Make it HUGE & Inside Banner) */
  .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close {
    transform: scale(2.5) !important; /* 250% larger */
    right: 25px !important; /* Pulls it inward from the right edge */
    top: 25px !important; /* Pushes it down into the banner */
    opacity: 1 !important;
    visibility: visible !important;
    z-index: 99999 !important;
  }

  /* 3. Isolated Start Screen Styling */
  #eye-spy-start-screen {
    position: fixed !important; 
    top: 0 !important; 
    left: 0 !important; 
    width: 100vw !important; 
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.5) !important; 
    z-index: 2147483647 !important; 
    display: flex !important; 
    flex-direction: column !important; 
    justify-content: center !important; 
    align-items: center !important;
    color: white !important; 
    font-family: sans-serif !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  #eye-spy-start-btn {
    padding: 16px 32px !important; 
    font-size: 20px !important; 
    font-weight: bold !important;
    background: #CCFF00 !important; 
    color: #000 !important; 
    border: none !important; 
    border-radius: 8px !important;
    cursor: pointer !important; 
    transition: transform 0.2s ease !important;
  }
  
  #eye-spy-start-btn:hover { 
    transform: scale(1.05) !important; 
  }
`;
document.head.appendChild(customStyles);

// Inject Start Screen HTML
const startScreen = document.createElement('div');
startScreen.id = 'eye-spy-start-screen';
startScreen.innerHTML = `
  <h1 style="margin-bottom: 15px; text-align: center; font-size: 32px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">Welcome to Eye Spy 3D</h1>
  <p style="margin-bottom: 40px; font-size: 18px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">Audio is required for this experience.</p>
  <button id="eye-spy-start-btn">Start Experience</button>
`;
document.body.appendChild(startScreen);

document.getElementById('eye-spy-start-btn').addEventListener('click', () => {
  startScreen.style.transition = "opacity 0.5s ease";
  startScreen.style.opacity = "0";
  setTimeout(() => startScreen.remove(), 500);
});

// --- 1. LEVEL CONFIGURATION ---
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

// --- 1.5. THE VISUAL HUNTER (Force Overwrites MPEmbed Layout) ---
const targetMatchStrings = [];
LEVELS.forEach(level => {
  level.imagesToFind.forEach(img => {
    targetMatchStrings.push(img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', ''));
  });
});

setInterval(() => {
  // 1A. DYNAMIC AUDIO UI SNIPER (The Bottom X)
  document.querySelectorAll('[class*="close"], [id*="close"]').forEach(btn => {
    const rect = btn.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 100) {
      btn.style.setProperty('display', 'none', 'important');
      btn.style.setProperty('opacity', '0', 'important');
      btn.style.setProperty('pointer-events', 'none', 'important');
    }
  });

  // 1B. THE BLUR STRIPPER (Targeting specific MPEmbed overlay classes)
  document.querySelectorAll('.mpe-media-overlay, .mpe-overlay').forEach(el => {
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('-webkit-filter', 'none', 'important');
      el.style.setProperty('backdrop-filter', 'none', 'important');
      el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
      el.style.setProperty('background', 'transparent', 'important'); 
  });

  // 1C. THE SPINNER ASSASSIN
  document.querySelectorAll('.mpe-loader, .spinner, [class*="media-loader"], #customBillboardLoading').forEach(loader => {
        loader.style.setProperty('display', 'none', 'important');
        loader.style.setProperty('opacity', '0', 'important');
  });
  
  // Specific SVG hunt
  document.querySelectorAll('svg').forEach(svg => {
    const parent = svg.parentElement;
    if (parent && window.getComputedStyle(parent).position === 'absolute' && window.getComputedStyle(parent).zIndex > 1000) {
        svg.style.setProperty('display', 'none', 'important');
        svg.style.setProperty('opacity', '0', 'important');
        parent.style.setProperty('display', 'none', 'important');
        parent.style.setProperty('background', 'transparent', 'important');
    }
  });

  // 1D. BLUE CURSOR FIX
  [document.body, document.documentElement, ...document.querySelectorAll('canvas')].forEach(el => {
    if (el.style.cursor === 'wait' || el.style.cursor === 'progress') {
      el.style.removeProperty('cursor'); 
    }
  });

  // 2. THE TEXT BANNER FORMATTER
  const textElements = document.querySelectorAll('div, span, p, h1, h2, h3');
  
  textElements.forEach(el => {
    if (el.children.length === 0 && el.textContent && el.offsetParent !== null) {
      const textClean = el.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (textClean.length > 3 && targetMatchStrings.includes(textClean)) {
        
        // Force the TEXT to dead-center (Horizontal AND Vertical) and 200% size
        el.style.setProperty('position', 'absolute', 'important');
        el.style.setProperty('left', '50%', 'important');
        el.style.setProperty('top', '50%', 'important'); 
        el.style.setProperty('transform', 'translate(-50%, -50%)', 'important'); 
        el.style.setProperty('font-size', '200%', 'important');
        el.style.setProperty('color', 'white', 'important');
        el.style.setProperty('margin', '0', 'important');
        el.style.setProperty('white-space', 'nowrap', 'important');
        
        // Force the BANNER to the Custom Dark Charcoal
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


// --- 2. GLOBAL STATE TRACKING ---
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


// --- 3. THE TRIPWIRE LISTENER (Logic Only) ---
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
            }
            window.activeOpenPopups.add(filename); 
            window.foundImages[filename] = true;
            
            if (checkAllFound() && !window.pathsPreloaded) {
              window.pathsPreloaded = true;
              console.log(`🔓 [Escape Room] All items found! Unlocking map for flight...`);
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


// --- 4. INITIALIZATION & DOOR LOCKS ---
async function initMashupLogic(mpSdk) {
  window.mpSdk = mpSdk;
  setupLevelTracking();

  let sweepCollection = await new Promise((resolve) => {
    let sub = mpSdk.Sweep.data.subscribe({
      onCollectionUpdated: function (collection) {
        resolve(collection);
        sub.cancel(); 
      }
    });
  });

  window.allModelSweeps = Object.keys(sweepCollection);
  lockMapForCurrentLevel(mpSdk);

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

// --- 5. THE NATURAL TELEPORT SEQUENCE ---
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
