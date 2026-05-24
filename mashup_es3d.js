// =============================================================================
// EYE SPY 3D — V245: MODULAR ENGINE & STRICT ESCAPE ROOM LOGIC
// =============================================================================

// -----------------------------------------------------------------------------
// MODULE 1: CONFIGURATION & AUDIO ENGINE
// -----------------------------------------------------------------------------
const GITHUB_BASE = 'https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/';

const SWEEPS = {
  lobby:       '7k4p5mu5f5eydt8h0f8cygptb',  // Level 0 spawn (Sweep 30)
  level1Entry: 'cwckxx365uimbeqk6ngp0t5ud',  // Sweep 28
  level2Entry: 'ep98q9hxumexd83q38p12k4xc',  // Sweep 27
};

const AUDIO_MAP = {
  '/pink bopeep.jpeg':               'pink bo-peep.mp3',
  '/two white cows.jpeg':            'two white cows.mp3',
  '/yourself.jpeg':                  'yourself.mp3',
  '/decongestant cough elixir.jpeg': 'decongestant cough elixir.mp3',
  '/plastic fruit.jpeg':             'plastic fruit.mp3',
  '/pineapple sunday.jpeg':          'pineapple sunday.mp3',
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

window.globalSfx = new Audio();

function playItemSound(imageFilename) {
  try {
    const mp3Name = AUDIO_MAP[imageFilename];
    if (mp3Name) {
        window.globalSfx.src = GITHUB_BASE + encodeURIComponent(mp3Name);
        window.globalSfx.currentTime = 0;
        window.globalSfx.play().catch(() => {});
    }
  } catch (e) {}
}

// -----------------------------------------------------------------------------
// MODULE 2: GAME STATE
// -----------------------------------------------------------------------------
const GameState = {
  levelIndex: 0,
  foundImages: {},
  activePopups: new Set(),
  isTeleporting: false,
  mpSdk: null,
  allSweeps: [],
  isMuted: false,

  getCurrentLevelData() {
      return LEVELS[this.levelIndex];
  },
  setupNewLevel() {
      this.foundImages = {};
      this.activePopups.clear();
      this.isTeleporting = false;
      const lvl = this.getCurrentLevelData();
      if (lvl && lvl.imagesToFind) {
          lvl.imagesToFind.forEach(img => { this.foundImages[img] = false; });
      }
  },
  areAllItemsFound() {
      const lvl = this.getCurrentLevelData();
      if (!lvl || !lvl.imagesToFind || lvl.imagesToFind.length === 0) return true;
      return lvl.imagesToFind.every(img => this.foundImages[img] === true);
  }
};

// -----------------------------------------------------------------------------
// MODULE 3: UI & CSS INJECTION
// -----------------------------------------------------------------------------
const UIManager = {
  init() {
    const style = document.createElement('style');
    style.innerHTML = `
      * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
      
      /* KILL ALL POPUP ANIMATIONS FOR INSTANT SNAPPING */
      .mpe-popup, .mpe-popup *, .mp-mattertag, .mpe-media-overlay, .mpe-overlay {
          transition: none !important;
          animation: none !important;
          filter: none !important;
          background: transparent !important;
      }
      [id*="media-loader"], .spinner { display: none !important; }
      
      /* KILL AUDIO PLAYERS & X BUTTONS */
      audio, video, [id*="audio"]:not(#es-btn-vol):not(#es-vol-label):not(#es-vol-tooltip), 
      [class*="audio-player"], [class*="audio-close"], .mpe-media-close { 
          display: none !important; opacity: 0 !important; pointer-events: none !important; 
      }

      /* ENLARGE TOP CLOSE BUTTONS */
      #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close { 
          transform: scale(3.5) !important; right: 35px !important; top: 35px !important; z-index: 99999 !important; pointer-events: auto !important;
      }

      /* START SCREEN & B&W SHADOW */
      #eye-spy-dark-overlay { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(20, 5, 5, 0.2) !important; backdrop-filter: grayscale(100%) contrast(110%) brightness(95%) !important; z-index: 2147483645 !important; }
      #eye-spy-image-cover { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/ES3D_load%20screen%20omni.png') !important; background-size: cover !important; background-position: center !important; z-index: 2147483646 !important; }
      #eye-spy-start-ui { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; }
      
      /* LOADING TEXT POSITION FIX */
      #eye-spy-loading-text { position: absolute !important; top: 40px !important; left: 50% !important; transform: translateX(-50%) !important; color: white !important; font-size: 16px; font-weight: normal; animation: eye-spy-fade 2s infinite ease-in-out; z-index: 2147483647; text-align: center; }

      #eye-spy-start-btn { padding: 16px 40px !important; font-size: 24px !important; font-weight: bold !important; background: #CCFF00 !important; color: #000 !important; border: none !important; border-radius: 8px !important; cursor: pointer !important; transition: transform 0.2s ease !important; }
      #eye-spy-start-btn:hover { transform: scale(1.05) !important; }

      /* CONTROL PANEL */
      #es-control-panel { display: none !important; position: fixed !important; bottom: 15px !important; left: 15px !important; width: 320px !important; height: 60px !important; align-items: center !important; justify-content: space-between !important; background: #1c1c1c !important; padding: 0 20px !important; border-radius: 30px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.8) !important; z-index: 2147483647 !important; border: 2px solid #333 !important; }
      .es-panel-btn { background: transparent !important; border: none !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; padding: 5px !important; border-radius: 8px !important; width: 60px !important; gap: 3px !important; position: relative !important; }
      .es-panel-btn img { width: 24px !important; height: 24px !important; pointer-events: none !important; }
      .es-panel-btn span { font-size: 10px !important; font-weight: bold !important; color: #CCFF00 !important; font-family: sans-serif !important; }
      .es-panel-divider { width: 2px !important; height: 30px !important; background: #444 !important; border-radius: 2px !important; }
      
      @keyframes eye-spy-fade { 0%{opacity:0.2} 50%{opacity:1} 100%{opacity:0.2} }
    `;
    document.head.appendChild(style);

    // Inject Start Screen
    document.body.insertAdjacentHTML('beforeend', `
      <div id="eye-spy-dark-overlay"></div>
      <div id="eye-spy-image-cover"></div>
      <div id="eye-spy-start-ui">
        <div id="eye-spy-loading-text">Loading 3D experience...</div>
        <div id="eye-spy-welcome-block" style="display: none; flex-direction: column; align-items: center;">
            <h1 style="margin:0 0 15px 0;text-align:center;font-size:42px;text-shadow:0 2px 4px rgba(0,0,0,0.8);color:white;">Welcome to Eye Spy 3D</h1>
            <p style="margin:0 0 30px 0;font-size:20px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8);">Please enjoy this experience with your audio on</p>
            <button id="eye-spy-start-btn">Start now!</button>
        </div>
      </div>
    `);

    // Inject Panel
    document.body.insertAdjacentHTML('beforeend', `
      <div id="es-control-panel">
        <button class="es-panel-btn" id="es-btn-prev" style="opacity:0 !important;pointer-events:none !important;"><img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z'/%3E%3C/svg%3E"><span>BACK</span></button>
        <div class="es-panel-divider" id="es-div-prev" style="opacity:0 !important;"></div>
        <button class="es-panel-btn" id="es-btn-clue"><img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Ctext x='12' y='19' font-family='sans-serif' font-size='22' font-weight='900' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E"><span>CLUE</span></button>
        <div class="es-panel-divider"></div>
        <button class="es-panel-btn" id="es-btn-vol"><img id="es-img-unmute" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E"><img id="es-img-mute" style="display:none !important;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/%3E%3C/svg%3E"><span id="es-vol-label">MUTE</span></button>
        <div class="es-panel-divider" id="es-div-next" style="opacity:0 !important;"></div>
        <button class="es-panel-btn" id="es-btn-next" style="opacity:0 !important;pointer-events:none !important;"><img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCFF00'%3E%3Cpath d='M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z'/%3E%3C/svg%3E"><span>CHEAT</span></button>
      </div>
    `);

    // Wiring Start Button
    document.getElementById('eye-spy-start-btn').addEventListener('click', () => {
        document.getElementById('eye-spy-start-ui').style.opacity = '0';
        document.getElementById('eye-spy-dark-overlay').style.opacity = '0';
        document.getElementById('eye-spy-image-cover').style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('eye-spy-start-ui').remove();
            document.getElementById('eye-spy-dark-overlay').remove();
            document.getElementById('eye-spy-image-cover').remove();
        }, 400);

        try { // iOS Audio Unlock
            window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA';
            window.globalSfx.play().catch(()=>{});
        } catch(e) {}

        document.getElementById('es-control-panel').style.setProperty('display', 'flex', 'important');
        this.updatePanel();
    });

    // Wiring Panel Buttons
    document.getElementById('es-btn-vol').addEventListener('click', () => {
        GameState.isMuted = !GameState.isMuted;
        window.globalSfx.muted = GameState.isMuted;
        document.getElementById('es-img-unmute').style.setProperty('display', GameState.isMuted ? 'none' : 'block', 'important');
        document.getElementById('es-img-mute').style.setProperty('display', GameState.isMuted ? 'block' : 'none', 'important');
        document.getElementById('es-vol-label').innerText = GameState.isMuted ? 'UN-MUTE' : 'MUTE';
    });

    document.getElementById('es-btn-clue').addEventListener('click', () => {
        const media = Array.from(document.querySelectorAll('.mpe-popup audio, .mpe-popup video'));
        media.forEach(m => { m.currentTime = 0; m.play().catch(()=>{}); });
    });

    document.getElementById('es-btn-next').addEventListener('click', () => {
        const lvl = GameState.getCurrentLevelData();
        if (!lvl || GameState.isTeleporting) return;
        GameState.activePopups.clear();
        if(lvl.imagesToFind) lvl.imagesToFind.forEach(img => GameState.foundImages[img] = true);
        MapManager.teleportForward(lvl);
    });

    document.getElementById('es-btn-prev').addEventListener('click', () => {
        if (GameState.levelIndex <= 1 || GameState.isTeleporting) return; // Firewall: Prevents return to Lobby
        MapManager.teleportBackward();
    });
  },

  updatePanel() {
    const showNext = GameState.levelIndex >= 1; // CHEAT Appears at Level 1
    const showPrev = GameState.levelIndex >= 2; // BACK Appears at Level 2

    const setVis = (id, isVis) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.setProperty('opacity', isVis ? '1' : '0', 'important');
            el.style.setProperty('pointer-events', isVis ? 'auto' : 'none', 'important');
        }
    };
    setVis('es-btn-next', showNext);
    setVis('es-div-next', showNext);
    setVis('es-btn-prev', showPrev);
    setVis('es-div-prev', showPrev);
  }
};

// -----------------------------------------------------------------------------
// MODULE 4: MAP & NAVIGATION MANAGER
// -----------------------------------------------------------------------------
const MapManager = {
  lockMap() {
    if (!GameState.mpSdk || GameState.allSweeps.length === 0) return;
    const lvl = GameState.getCurrentLevelData();
    if (!lvl) return;

    // 1. Define allowed sweeps (STRICT ESCAPE ROOM)
    const allowedSweeps = [...lvl.startSweeps];
    
    // If in the lobby, target must be open so they can walk there
    if (GameState.levelIndex === 0) allowedSweeps.push(lvl.targetSweep);

    // 2. Define sweeps to disable
    const sweepsToDisable = GameState.allSweeps.filter(id => !allowedSweeps.includes(id));

    // 3. Apply Strict Locks
    if (sweepsToDisable.length > 0) {
        GameState.mpSdk.Sweep.disable(...sweepsToDisable).catch(()=>{});
    }
    if (allowedSweeps.length > 0) {
        GameState.mpSdk.Sweep.enable(...allowedSweeps).catch(()=>{});
    }
  },

  async teleportForward(lvlData) {
    if (GameState.isTeleporting) return;
    GameState.isTeleporting = true;
    
    try {
        await GameState.mpSdk.Sweep.enable(lvlData.targetSweep).catch(()=>{});
        try { await GameState.mpSdk.Sweep.moveTo(lvlData.targetSweep, { transition: GameState.mpSdk.Sweep.Transition.FLY }); }
        catch { await GameState.mpSdk.Sweep.moveTo(lvlData.targetSweep, { transition: GameState.mpSdk.Sweep.Transition.INSTANT }); }
        
        GameState.levelIndex++;
        GameState.setupNewLevel();
        this.lockMap();
        UIManager.updatePanel();
    } catch (e) { console.error("Teleport failed", e); }
    
    GameState.isTeleporting = false;
  },

  async teleportBackward() {
    if (GameState.isTeleporting) return;
    GameState.isTeleporting = true;

    const targetIdx = GameState.levelIndex - 1;
    const prevLvl = LEVELS[targetIdx];

    try {
        await GameState.mpSdk.Sweep.enable(prevLvl.startSweeps[0]).catch(()=>{});
        try { await GameState.mpSdk.Sweep.moveTo(prevLvl.startSweeps[0], { transition: GameState.mpSdk.Sweep.Transition.FLY }); }
        catch { await GameState.mpSdk.Sweep.moveTo(prevLvl.startSweeps[0], { transition: GameState.mpSdk.Sweep.Transition.INSTANT }); }
        
        GameState.levelIndex = targetIdx;
        GameState.setupNewLevel();
        this.lockMap();
        UIManager.updatePanel();
    } catch (e) {}

    GameState.isTeleporting = false;
  }
};

// -----------------------------------------------------------------------------
// MODULE 5: THE VISUAL HUNTER (Optimized Heartbeat)
// -----------------------------------------------------------------------------
function startVisualHunter() {
  setInterval(() => {

    // AGGRESSIVE ROGUE X ASSASSIN
    Array.from(document.querySelectorAll('[class*="close"], svg')).forEach(btn => {
      if (btn.id === 'es-btn-vol' || btn.closest('#es-control-panel')) return;
      const rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 150 && rect.height > 0) {
        btn.style.setProperty('display', 'none', 'important');
      }
    });

    // Locate Open Popups
    const popups = Array.from(document.querySelectorAll('.mpe-popup, .mp-mattertag'));
    const visibleThisFrame = new Set();
    const lvlData = GameState.getCurrentLevelData();

    if (popups.length > 0 && lvlData && lvlData.imagesToFind) {
        popups.forEach(popup => {
            const textNodes = Array.from(popup.querySelectorAll('div, span, p, h1, h2, h3'));
            
            textNodes.forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const textClean = el.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
                    
                    let matchedImg = null;
                    lvlData.imagesToFind.forEach(img => {
                        const cleanTarget = img.toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg','').replace('jpg','');
                        if (textClean.length > 3 && textClean.includes(cleanTarget)) matchedImg = img;
                    });

                    if (matchedImg) {
                        visibleThisFrame.add(matchedImg);
                        
                        // Apply CSS Instantly
                        if (!el.dataset.styled) {
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
                                el.parentElement.style.setProperty('background', '#1c1c1c', 'important');
                                el.parentElement.style.setProperty('min-height', '75px', 'important');
                            }
                        }

                        // Trigger Audio
                        if (!GameState.activePopups.has(matchedImg)) {
                            GameState.activePopups.add(matchedImg);
                            playItemSound(matchedImg);
                            
                            if (!GameState.foundImages[matchedImg]) {
                                GameState.foundImages[matchedImg] = true;
                                console.log(`🎯 Found: ${matchedImg}`);
                            }
                        }
                    }
                }
            });
        });
    }

    // Detect Closed Popups -> Trigger Teleport
    Array.from(GameState.activePopups).forEach(img => {
        if (!visibleThisFrame.has(img)) {
            GameState.activePopups.delete(img);
            if (GameState.areAllItemsFound() && GameState.activePopups.size === 0 && !GameState.isTeleporting) {
                MapManager.teleportForward(lvlData);
            }
        }
    });

  }, 100); // 100ms safe heartbeat
}

// -----------------------------------------------------------------------------
// MODULE 6: SDK BOOTLOADER & TRIGGERS
// -----------------------------------------------------------------------------
let _sdkPoll = setInterval(() => {
  if (document.body && window.mpSdk && window.mpSdk.Sweep) {
    clearInterval(_sdkPoll);
    
    UIManager.init();
    GameState.mpSdk = window.mpSdk;
    GameState.setupNewLevel();
    startVisualHunter();

    // Fetch sweeps and swap Start UI
    const sub = window.mpSdk.Sweep.data.subscribe({
      onCollectionUpdated(collection) {
        if (Object.keys(collection).length > 0) {
            GameState.allSweeps = Object.keys(collection);
            
            // Swap Loading text for Start Button
            const loadText = document.getElementById('eye-spy-loading-text');
            const welcome = document.getElementById('eye-spy-welcome-block');
            if (loadText) loadText.remove();
            if (welcome) welcome.style.setProperty('display', 'flex', 'important');

            MapManager.lockMap();
            sub.cancel();
        }
      }
    });

    // The Instruction-Safe "Leave" Trigger
    window.mpSdk.on(window.mpSdk.Sweep.Event.ENTER, sweepId => {
      if (GameState.isTeleporting) return;

      // If at Level 0, and user leaves Sweep 30 -> Upgrade to Level 1
      if (GameState.levelIndex === 0 && sweepId !== SWEEPS.lobby) {
          GameState.levelIndex = 1;
          GameState.setupNewLevel();
          MapManager.lockMap();
          UIManager.updatePanel();
      }
    });
  }
}, 500);
