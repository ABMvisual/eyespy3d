// =============================================================================
// EYE SPY 3D — V610: WEBGL CRASH FIX + ALL LEVELS + END GAME UI
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

let bootInterval = setInterval(() => {
  if (document.head && document.body) {
    clearInterval(bootInterval);
    injectCustomUI();
  }
}, 50);

function injectCustomUI() {
  const customStyles = document.createElement('style');
  customStyles.innerHTML = `
    /* REMOVED GLOBAL WILDCARD TO PREVENT WEBGL CRASH */
    .mpe-overlay, .mpe-popup, .mp-mattertag, [class*="media-overlay"] { 
        backdrop-filter: none !important; 
        -webkit-backdrop-filter: none !important; 
        filter: none !important; 
        -webkit-filter: none !important; 
        background: transparent !important; 
        background-color: transparent !important; 
    }
    
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner, #customBillboardLoading, img[src*="loader.svg"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
    audio, video, [id*="audio"], [class*="audio-player"], div[style*="bottom: 0px"] [class*="close"], div[style*="bottom: 0"] [class*="close"], .mpe-media-close { display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; visibility: hidden !important; }
    
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close { transform: scale(3.5) !important; right: 35px !important; top: 35px !important; opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important; }

    .mpe-popup, .mp-mattertag { transition: none !important; animation: none !important; }

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

    #eye-spy-end-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 2147483648; justify-content: center; align-items: center; backdrop-filter: blur(10px); }
    #es-end-panel { background: #1c1c1c; border: 2px solid #333; border-radius: 12px; padding: 30px; width: 400px; max-width: 90%; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.8); text-align: center; position: relative; }
    .es-form-label { display: block; text-align: left; margin-bottom: 5px; font-size: 14px; color: #aaa; }
    .es-input { width: 100%; box-sizing: border-box; padding: 10px; background: #333; color: white; border: 1px solid #555; border-radius: 6px; margin-bottom: 15px; font-family: inherit; }
    #es-submit-btn { width: 100%; padding: 12px; background: #CCFF00; color: #000; font-weight: bold; font-size: 16px; border: none; border-radius: 6px; cursor: pointer; transition: transform 0.2s; }
    #es-submit-btn:hover { transform: scale(1.03); }
    .es-share-btn { flex: 1; padding: 10px; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; color: white; transition: opacity 0.2s; }
    .es-share-btn:hover { opacity: 0.8; }
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

  const endUI = document.createElement('div');
  endUI.id = 'eye-spy-end-overlay';
  endUI.innerHTML = `
    <div id="es-end-panel">
        <button id="es-close-end" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 20px; cursor: pointer;">✖</button>
        <h2 style="color: #CCFF00; margin-top: 0; font-size: 32px;">You Escaped!</h2>
        <p style="font-size: 16px; margin-bottom: 25px;">Congratulations on completing the experience. We'd love your feedback!</p>
        
        <form id="es-feedback-form">
            <label class="es-form-label">Rating:</label>
            <select id="es-rating" class="es-input">
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Fair</option>
                <option value="1">⭐ Poor</option>
            </select>

            <label class="es-form-label">Feedback / Changes (Optional):</label>
            <textarea id="es-feedback" class="es-input" rows="3" placeholder="Tell us what you think..."></textarea>

            <label class="es-form-label">Email Address (Optional):</label>
            <input type="email" id="es-email" class="es-input" placeholder="your@email.com">

            <button type="submit" id="es-submit-btn">Submit Feedback</button>
        </form>

        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #444;">
            <p style="font-size: 14px; margin-bottom: 15px; color: #aaa;">Share this experience:</p>
            <div style="display: flex; gap: 10px;">
                <button id="es-share-fb" class="es-share-btn" style="background: #1877F2;">Facebook</button>
                <button id="es-share-x" class="es-share-btn" style="background: #000; border: 1px solid #444;">X (Twitter)</button>
                <button id="es-share-email" class="es-share-btn" style="background: #ea4335;">Email</button>
            </div>
        </div>
    </div>
  `;
  document.body.appendChild(endUI);

  setTimeout(() => {
    document.getElementById('es-close-end').onclick = () => document.getElementById('eye-spy-end-overlay').style.display = 'none';
    
    document.getElementById('es-feedback-form').onsubmit = (e) => {
        e.preventDefault();
        e.target.innerHTML = `<h3 style="color: white; margin: 40px 0;">Thank you for your feedback! 🙌</h3>`;
    };

    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("I just escaped the Eye Spy 3D experience! Can you beat it?");
    
    document.getElementById('es-share-fb').onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    document.getElementById('es-share-x').onclick = () => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
    document.getElementById('es-share-email').onclick = () => window.location.href = `mailto:?subject=Eye Spy 3D Experience&body=${shareText} ${shareUrl}`;
  }, 1000);

  // OPTIMIZED AUDIO ASSASSIN (No layout thrashing)
  setInterval(() => {
    document.querySelectorAll('.mpe-media-close, .mpe-audio-player [class*="close"]').forEach(btn => {
      btn.style.setProperty('display', 'none', 'important');
      btn.style.setProperty('opacity', '0', 'important');
    });
  }, 500);

  startMechanics();
}

function startMechanics() {
  const SWEEPS = {
    lobby:       '7k4p5mu5f5eydt8h0f8cygptb',  
    level1Entry: 'cwckxx365uimbeqk6ngp0t5ud',  
    level2Entry: 'ep98q9hxumexd83q38p12k4xc',  
  };

  const LEVELS = [
    { level: 0, startSweeps: [SWEEPS.lobby], targetSweep: SWEEPS.level1Entry, imagesToFind: [] }, 
    { level: 1, startSweeps: [SWEEPS.level1Entry], targetSweep: SWEEPS.level2Entry, imagesToFind: ['/pink bopeep.jpeg', '/two white cows.jpeg', '/yourself.jpeg'] },
    { level: 2, startSweeps: [SWEEPS.level2Entry], targetSweep: 't3si6z3gnc6ix4qh6cgmtgnfa', imagesToFind: ['/decongestant cough elixir.jpeg', '/plastic fruit.jpeg', '/pineapple sunday.jpeg'] },
    { level: 3, startSweeps: ['t3si6z3gnc6ix4qh6cgmtgnfa'], targetSweep: '2cngsqh5q4t1ep85y5ky0h49d', imagesToFind: ['/aztec chocolate.jpeg', '/atomic coffee.jpeg', '/royal perambulator.jpeg'] },
    { level: 4, startSweeps: ['2cngsqh5q4t1ep85y5ky0h49d'], targetSweep: '66yna1yh5e2ig14bmzzf1sn2c', imagesToFind: ['/a crow in a bag.jpeg', '/a hand in two.jpeg', '/vitreous china.jpeg', '/musical tyre.jpeg'] },
    { level: 5, startSweeps: ['66yna1yh5e2ig14bmzzf1sn2c'], targetSweep: '3hdk0cskxw0apbr2iw8016htb', imagesToFind: ['/Hanimexs Movielux.jpeg', '/argus previewer.jpeg', '/porcelain lobster.jpeg', '/scotts mower maker.jpeg'] },
    { level: 6, startSweeps: ['3hdk0cskxw0apbr2iw8016htb'], targetSweep: 'r7sd2g426fhbfa2wdh5dfxy5d', imagesToFind: ['/barley.jpg', '/some flumis.jpeg', '/wall climbing baby.jpeg', '/hide and seek.jpeg'] },
    { level: 7, startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], targetSweep: '20qckty5qi20t39838cq274rc', imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg'] },
    { level: 8, startSweeps: ['20qckty5qi20t39838cq274rc'], targetSweep: 'dy113u49qt5s7y38ms7ibmd9b', imagesToFind: ['/she disinterestedly sat.jpeg', '/picked pack.jpeg', '/two little fellas.jpeg'] },
    { level: 9, startSweeps: ['dy113u49qt5s7y38ms7ibmd9b'], targetSweep: 'rxgziepm3g4e0fgdgnwwk6efd', imagesToFind: ['/drinking urn.jpeg', '/viking preserve.jpeg', '/confetti.jpeg', '/two box of confetti.jpeg'] },
    { level: 10, startSweeps: ['rxgziepm3g4e0fgdgnwwk6efd'], targetSweep: 'w2bre69ufwyaywn11ch032aaa', imagesToFind: ['/eagle.jpeg', '/blue hand.jpeg', '/gnome all alone.jpeg', '/beetles.jpeg'] },
    { level: 11, startSweeps: ['w2bre69ufwyaywn11ch032aaa'], targetSweep: 'dimg015tts6u2b30hh0pndaqd', imagesToFind: ['/mock ducks.jpeg', '/unarmed man.jpeg', '/wooden goanna.jpeg'] },
    { level: 12, startSweeps: ['dimg015tts6u2b30hh0pndaqd'], targetSweep: 'iwaxrd4g1gki6i64y6dk1iuhd', imagesToFind: ['/whose head.jpeg', '/runners.jpeg', '/the plugs.jpeg', '/hat.jpeg', '/the hugs.jpeg'] },
    { level: 13, startSweeps: ['iwaxrd4g1gki6i64y6dk1iuhd'], targetSweep: 'aty78ze3y9ddyg8702gmncdma', imagesToFind: ['/dimboola.jpeg', '/akubra.jpeg', '/egypt etc.jpeg', '/tiger.jpeg', '/butterfly.jpeg', '/horse head.jpeg'] },
    { level: 14, startSweeps: ['aty78ze3y9ddyg8702gmncdma'], targetSweep: 'e5ynaauc9kx9mar4r52hp1rfb', imagesToFind: [] }
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

  setInterval(() => {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || currentLevel.imagesToFind.length === 0 || window.isTeleporting) return;

    const popups = document.querySelectorAll('.mpe-popup, .mp-mattertag, .mpe-media-overlay');
    const currentlyVisiblePopups = new Set();

    popups.forEach(popup => {
        let searchString = (popup.textContent || '').toLowerCase() + " ";
        const imgs = popup.querySelectorAll('img, [style*="background-image"]');
        imgs.forEach(m => searchString += ' ' + (m.src || m.style.backgroundImage || '').toLowerCase());

        currentLevel.imagesToFind.forEach(filename => {
            const cleanName = filename.toLowerCase();
            const encodedName = encodeURI(filename).toLowerCase();

            if (searchString.includes(cleanName) || searchString.includes(encodedName)) {
                currentlyVisiblePopups.add(filename);

                const textEls = Array.from(popup.querySelectorAll('div, span, p, h1, h2, h3'));
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

                if (!window.activeOpenPopups.has(filename)) {
                    playItemSound(filename);
                    window.activeOpenPopups.add(filename);
                }

                if (!window.foundImages[filename]) {
                    window.foundImages[filename] = true;
                }
            }
        });
    });

    window.activeOpenPopups.forEach(filename => {
        if (!currentlyVisiblePopups.has(filename)) {
            window.activeOpenPopups.delete(filename);
            
            if (checkAllFound() && window.activeOpenPopups.size === 0 && !window.isTeleporting) {
                executeFastTeleport(window.mpSdk, currentLevel);
            }
        }
    });
  }, 250); 

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
    const welcomeBlock = document.getElementById('eye-spy-welcome-block');
    if (welcomeBlock) welcomeBlock.style.display = "flex";

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
            
            lockMapForCurrentLevel();
        });
    }

    window.mpSdk.on(window.mpSdk.Sweep.Event.ENTER, function(sweepId) {
      if (window.isTeleporting) return;
      
      if (window.currentLevelIndex === 0 && sweepId !== SWEEPS.lobby) {
          window.currentLevelIndex = 1;
          setupLevelTracking();
          lockMapForCurrentLevel();
      }
      
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
    
    window.mpSdk.Sweep.enable(...window.allModelSweeps).catch(()=>{});

    setTimeout(() => {
        if (window.currentLevelIndex > 0) {
            window.mpSdk.Sweep.disable(SWEEPS.lobby).catch(()=>{});
        }
        if (window.currentLevelIndex > 0 && currentLevel.targetSweep) {
            window.mpSdk.Sweep.disable(currentLevel.targetSweep).catch(()=>{});
        }
    }, 150); 
  }

  async function executeFastTeleport(mpSdk, levelData) {
    window.isTeleporting = true;
    
    try {
      await window.mpSdk.Sweep.enable(levelData.targetSweep).catch(() => {});

      try { await window.mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: window.mpSdk.Sweep.Transition.FLY });
      } catch (flyError) { await window.mpSdk.Sweep.moveTo(levelData.targetSweep, { transition: window.mpSdk.Sweep.Transition.INSTANT }); }

      const sweepsToLock = window.allModelSweeps.filter(id => id !== levelData.targetSweep);
      await window.mpSdk.Sweep.disable(...sweepsToLock).catch(() => {});

      window.currentLevelIndex++; 
      
      if (LEVELS[window.currentLevelIndex] && LEVELS[window.currentLevelIndex].imagesToFind.length > 0) {
        setupLevelTracking(); 
        lockMapForCurrentLevel();
      } else {
        setTimeout(() => {
            const endUI = document.getElementById('eye-spy-end-overlay');
            if (endUI) {
                endUI.style.display = 'flex';
                endUI.style.opacity = '0';
                setTimeout(() => {
                    endUI.style.transition = 'opacity 0.5s ease';
                    endUI.style.opacity = '1';
                }, 50);
            }
        }, 1500);
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
