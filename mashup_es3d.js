// =============================================================================
// EYE SPY 3D - ENGINE (V3029)
// Base: V3028
// Fix: the overlay MutationObserver had no throttle at all, unlike the
// panoPlayer chrome hider fixed in V3026. isOverlayOpen() calls
// getComputedStyle(), forcing a synchronous style recalculation, and this
// was running on every single mutation across the entire popup subtree.
// If MPEmbed animates the popup's own fade-in via repeated inline style
// writes, every frame of that animation was forcing a reflow here, right
// at the moment the popup should be appearing. Throttled to at most once
// per animation frame, same pattern as V3026.
// =============================================================================

const YOUTUBE_VIDEO_ID = 'Ly2dwu4pTVo';

console.log('EYE SPY 3D \u2014 V3029 loaded');

// Switched from raw.githubusercontent.com to jsDelivr's GitHub mirror.
// raw.githubusercontent.com is not intended for serving production binary
// assets and does not reliably declare the correct content type for mp3
// files. Confirmed directly in DevTools' Issues panel: all 48 item sound
// effect requests were being blocked by CORB (Cross-Origin Read Blocking),
// which is why found-item sound effects have never played reliably. jsDelivr
// mirrors the same repo files with correct audio content types and CORS
// headers, so the same files now load without being blocked.
const GITHUB_BASE = 'https://cdn.jsdelivr.net/gh/ABMvisual/eyespy3d@main/';

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
  '/a crow in the bag.jpeg': 'a crow in the bag.mp3',
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
  '/cat in a turban.jpeg': 'cat in a turban.mp3',
  '/embroidered australia.jpeg': 'embroidered australia.mp3',
  '/australia in stitches.jpeg': 'australia in stitches.mp3',
  '/three wooden discs.jpeg': 'three wooden discs.mp3',
  '/she disinterestedly sat.jpeg': 'she disinterestedly sat.mp3',
  '/picked pack.jpeg': 'picked pack.mp3',
  '/two chambermen.jpeg': 'two chambermen.mp3',
  '/drinking urn.jpeg': 'drinking urn.mp3',
  '/viking preserve.jpeg': 'viking preserve.mp3',
  '/confetti.jpeg': 'confetti.mp3',
  '/two box of confetti.jpeg': 'two box of confetti.mp3',
  '/eagle.jpeg': 'eagle.mp3',
  '/blue hand.jpeg': 'blue hand.mp3',
  '/gnome all alone.jpeg': 'gnome all alone.mp3',
  '/beatles.jpeg': 'beatles.mp3',
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
// Placeholder "door unlocked" chime removed. It was pointing at a random
// Wikipedia Commons URL nobody on this project added, not meant to be in
// use, and it was the one remaining CORB-blocked request left after the
// jsDelivr swap fixed all 47 real item sounds. Left as an empty Audio()
// so the mechanism still exists, just set window.globalChime.src to a
// real hosted file (e.g. via GITHUB_BASE) once one exists.
window.globalChime = new Audio();

function playItemSound(imageFilename) {
  let mp3Name = AUDIO_MAP[imageFilename];
  if (mp3Name) {
    window.globalSfx.src = GITHUB_BASE + encodeURIComponent(mp3Name);
    window.globalSfx.currentTime = 0;
    window.globalSfx.play().catch(() => {});
  }
}

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '').replace('jpeg', '').replace('jpg', '');
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
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }

    [id*="media-overlay"], [class*="media-overlay"], .mpe-overlay, #mpe-overlay {
      filter: none !important; -webkit-filter: none !important;
      background: transparent !important; background-color: transparent !important;
    }
    [id*="media-loader"], [class*="media-loader"], .mpe-loader, #mpe-loader, .spinner,
    #customBillboardLoading, img[src*="loader.svg"] {
      display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;
    }
    audio, video, [id*="audio"], [class*="audio-player"],
    div[style*="bottom: 0px"] [class*="close"], div[style*="bottom: 0"] [class*="close"], .mpe-media-close,
    .pano-media, .mpe-media-overlay, .pano-media [class*="close"], .mpe-media-overlay [class*="close"],
    #panoPlayer .audioplayer, #panoPlayer .audiopalyerpano, #panoPlayer .closetab,
    #panoPlayer i.closetab, #panoPlayer i[class*="times-circle"] {
      display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important;
      pointer-events: none !important; visibility: hidden !important;
    }

    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close {
      transform: scale(3.5) !important; right: 35px !important; top: 35px !important;
      opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important;
    }

    #customBillboardFull, #customBillboardFull * { transition: none !important; animation: none !important; }
    /* Label styling is now applied via direct inline JS on open, see handleOverlayState(). */

    #eye-spy-dark-overlay {
      position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
      background: rgba(0, 0, 0, 0.4) !important;
      backdrop-filter: grayscale(100%) brightness(60%) !important;
      -webkit-backdrop-filter: grayscale(100%) brightness(60%) !important;
      z-index: 2147483645 !important;
    }
    #eye-spy-image-cover {
      position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
      background-image: url('https://raw.githubusercontent.com/ABMvisual/eyespy3d/main/Load_image.webp') !important;
      background-size: cover !important; background-position: center !important;
      z-index: 2147483646 !important; animation: slow-punch 12s infinite alternate ease-in-out;
    }
    #eye-spy-image-cover::after {
      content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-image: inherit; background-size: contain !important; background-repeat: no-repeat !important;
      background-position: center !important; backdrop-filter: blur(15px); background-color: rgba(0,0,0,0.4);
    }
    @keyframes slow-punch { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }

    #eye-spy-start-ui {
      position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
      z-index: 2147483647 !important; display: flex !important; flex-direction: column !important;
      justify-content: center !important; align-items: center !important;
    }
    #eye-spy-welcome-block { display: flex; flex-direction: column; align-items: center; }
    #eye-spy-start-btn {
      padding: 16px 40px !important; font-size: 24px !important; font-weight: bold !important;
      background: #CCFF00 !important; color: #000 !important; border: none !important; border-radius: 8px !important;
      cursor: pointer !important; transition: transform 0.2s ease !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; pointer-events: auto !important;
    }
    #eye-spy-start-btn:hover { transform: scale(1.05) !important; }
    #eye-spy-loading-text {
      position: absolute; top: 40px; color: white; font-size: 16px; font-weight: normal;
      animation: eye-spy-fade 2s infinite ease-in-out; z-index: 2147483647;
    }
    @keyframes eye-spy-fade { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }

    /* INTRO VIDEO OVERLAY: entirely our own, no MPEmbed involvement */
    #eye-spy-video-overlay {
      position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
      background: #000 !important; z-index: 2147483647 !important; display: none;
    }
    #eye-spy-video-frame-wrap {
      position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important;
    }
    #eye-spy-video-frame-wrap iframe {
      width: 100% !important; height: 100% !important; border: none !important;
    }
    #eye-spy-video-skip-btn {
      position: absolute !important; bottom: 30px !important; right: 30px !important;
      padding: 10px 22px !important; font-size: 16px !important; font-weight: bold !important;
      background: rgba(255,255,255,0.15) !important; color: #fff !important;
      border: 1px solid rgba(255,255,255,0.6) !important; border-radius: 6px !important;
      cursor: pointer !important; z-index: 2147483647 !important; pointer-events: auto !important;
    }
    #eye-spy-video-skip-btn:hover { background: rgba(255,255,255,0.3) !important; }
  `;
  document.head.appendChild(customStyles);

  const darkOverlay = document.createElement('div'); darkOverlay.id = 'eye-spy-dark-overlay'; document.body.appendChild(darkOverlay);
  const imageCover = document.createElement('div'); imageCover.id = 'eye-spy-image-cover'; document.body.appendChild(imageCover);

  const startUI = document.createElement('div'); startUI.id = 'eye-spy-start-ui';
  startUI.innerHTML = `
    <div id="eye-spy-welcome-block">
      <h1 style="margin: 0 0 15px 0; text-align: center; font-size: 42px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); color: white;">Welcome to Eye Spy 3D</h1>
      <p style="margin: 0 0 30px 0; font-size: 20px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">Please enjoy this experience with your audio on</p>
      <button id="eye-spy-start-btn">Watch the intro</button>
    </div>
  `;
  document.body.appendChild(startUI);

  const videoOverlay = document.createElement('div'); videoOverlay.id = 'eye-spy-video-overlay';
  videoOverlay.innerHTML = `
    <div id="eye-spy-video-frame-wrap"></div>
    <button id="eye-spy-video-skip-btn">Skip &gt;</button>
  `;
  document.body.appendChild(videoOverlay);

  startMechanics();
}

function startMechanics() {
  const LEVELS = [
    { level: 1, startSweeps: ['7k4p5mu5f5eydt8h0f8cygptb', 'cwckxx365uimbeqk6ngp0t5ud'], targetSweep: 'ep98q9hxumexd83q38p12k4xc', imagesToFind: ['/pink bopeep.jpeg', '/two white cows.jpeg', '/yourself.jpeg'] },
    { level: 2, startSweeps: ['ep98q9hxumexd83q38p12k4xc'], targetSweep: 't3si6z3gnc6ix4qh6cgmtgnfa', imagesToFind: ['/decongestant cough elixir.jpeg', '/plastic fruit.jpeg', '/pineapple sunday.jpeg'] },
    { level: 3, startSweeps: ['t3si6z3gnc6ix4qh6cgmtgnfa'], targetSweep: '2cngsqh5q4t1ep85y5ky0h49d', imagesToFind: ['/aztec chocolate.jpeg', '/atomic coffee.jpeg', '/royal perambulator.jpeg'] },
    { level: 4, startSweeps: ['2cngsqh5q4t1ep85y5ky0h49d'], targetSweep: '66yna1yh5e2ig14bmzzf1sn2c', imagesToFind: ['/a crow in the bag.jpeg', '/a hand in two.jpeg', '/vitreous china.jpeg', '/musical tyre.jpeg'] },
    { level: 5, startSweeps: ['66yna1yh5e2ig14bmzzf1sn2c'], targetSweep: '3hdk0cskxw0apbr2iw8016htb', imagesToFind: ['/Hanimexs Movielux.jpeg', '/argus previewer.jpeg', '/porcelain lobster.jpeg', '/scotts mower maker.jpeg'] },
    { level: 6, startSweeps: ['3hdk0cskxw0apbr2iw8016htb'], targetSweep: 'r7sd2g426fhbfa2wdh5dfxy5d', imagesToFind: ['/barley.jpg', '/some flumis.jpeg', '/wall climbing baby.jpeg', '/hide and seek.jpeg'] },
    { level: 7, startSweeps: ['r7sd2g426fhbfa2wdh5dfxy5d'], targetSweep: '20qckty5qi20t39838cq274rc', imagesToFind: ['/a pair of old jugs.jpeg', '/a third more time.jpeg', '/odd purves terms.jpeg', '/round thing.jpeg'] },
    { level: 8, startSweeps: ['20qckty5qi20t39838cq274rc'], targetSweep: 'dy113u49qt5s7y38ms7ibmd9b', imagesToFind: ['/cat in a turban.jpeg', '/australia in stitches.jpeg', '/three wooden discs.jpeg'] },
    { level: 9, startSweeps: ['dy113u49qt5s7y38ms7ibmd9b'], targetSweep: 'rxgziepm3g4e0fgdgnwwk6efd', imagesToFind: ['/she disinterestedly sat.jpeg', '/picked pack.jpeg', '/two chambermen.jpeg'] },
    { level: 10, startSweeps: ['rxgziepm3g4e0fgdgnwwk6efd'], targetSweep: 'w2bre69ufwyaywn11ch032aaa', imagesToFind: ['/drinking urn.jpeg', '/viking preserve.jpeg', '/confetti.jpeg', '/two box of confetti.jpeg'] },
    { level: 11, startSweeps: ['w2bre69ufwyaywn11ch032aaa'], targetSweep: 'dimg015tts6u2b30hh0pndaqd', imagesToFind: ['/eagle.jpeg', '/blue hand.jpeg', '/gnome all alone.jpeg', '/beatles.jpeg'] },
    { level: 12, startSweeps: ['dimg015tts6u2b30hh0pndaqd'], targetSweep: 'iwaxrd4g1gki6i64y6dk1iuhd', imagesToFind: ['/mock ducks.jpeg', '/unarmed man.jpeg', '/wooden goanna.jpeg'] },
    { level: 13, startSweeps: ['iwaxrd4g1gki6i64y6dk1iuhd'], targetSweep: 'aty78ze3y9ddyg8702gmncdma', imagesToFind: ['/whose head.jpeg', '/runners.jpeg', '/the plugs.jpeg', '/hat.jpeg', '/the hugs.jpeg'] },
    { level: 14, startSweeps: ['aty78ze3y9ddyg8702gmncdma'], targetSweep: 'e5ynaauc9kx9mar4r52hp1rfb', imagesToFind: ['/dimboola.jpeg', '/akubra.jpeg', '/egypt etc.jpeg', '/tiger.jpeg', '/butterfly.jpeg', '/horse head.jpeg'] },
    { level: 15, startSweeps: ['e5ynaauc9kx9mar4r52hp1rfb'], targetSweep: null, imagesToFind: [] }
  ];

  // Reverse lookup: normalised label text -> exact filename, built once.
  const normalizedToFilename = {};
  LEVELS.forEach(level => {
    level.imagesToFind.forEach(img => {
      normalizedToFilename[normalize(img)] = img;
    });
  });

  window.currentLevelIndex = 0;
  window.allModelSweeps = [];
  window.foundImages = {};
  window.isTeleporting = false;
  window.activeOpenPopups = new Set();
  window.overlayWasOpen = false; // tracks last known state of #customBillboardFullOverlay

  const startBtn = document.getElementById('eye-spy-start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }

      const ui = document.getElementById('eye-spy-start-ui');
      if (ui) { ui.style.transition = 'opacity 0.4s ease'; ui.style.opacity = '0'; setTimeout(() => ui.remove(), 400); }

      try { window.globalSfx.src = 'data:audio/mp3;base64,//MkxAA'; window.globalSfx.play().catch(() => {}); } catch (e) {}

      playIntroVideo();
    });
  }

  function setupLevelTracking() {
    window.foundImages = {};
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (currentLevel && currentLevel.imagesToFind) {
      currentLevel.imagesToFind.forEach(image => { window.foundImages[image] = false; });
    }
    window.isTeleporting = false;
    window.activeOpenPopups.clear();
    window.overlayWasOpen = false;
  }

  function checkAllFound() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || !currentLevel.imagesToFind || currentLevel.imagesToFind.length === 0) return true;
    return currentLevel.imagesToFind.every(img => window.foundImages[img] === true);
  }

  function isOverlayOpen(overlay) {
    if (!overlay) return false;
    const style = window.getComputedStyle(overlay);
    return style.display !== 'none';
  }

  function handleOverlayState() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || currentLevel.imagesToFind.length === 0 || window.isTeleporting) return;

    const overlay = document.getElementById('customBillboardFullOverlay');
    const open = isOverlayOpen(overlay);

    if (open) {
      const labelEl = overlay.querySelector('.tag-text-content');

      // Style and log only once per open, not on every mutation fire. If the
      // audio element inside a popup mutates its own attributes during
      // playback (a progress indicator, for instance), this observer can
      // fire many times a second, redoing the same work each time was the
      // likely cause of lag returning.
      if (labelEl && labelEl.dataset.esHandled !== 'true' && labelEl.dataset.esPending !== 'true') {
        // Mark pending synchronously so further mutation firings within the
        // same open do not schedule duplicate work, but do not read
        // classList or style anything yet.
        labelEl.dataset.esPending = 'true';

        // Defer one frame before reading #customBillboardFull's class or
        // applying any styling. Confirmed via the diagnostic log: when an
        // item popup opens immediately after the audio-clue popup, our
        // observer's very first eligible mutation can fire before MPEmbed
        // has finished swapping the class from "audio" to "photo" on the
        // reused element, causing the item popup to be styled with the
        // audio branch's properties. A one-frame defer gives that class
        // swap time to settle before we ever read it. Still only one style
        // pass per open, so this does not reintroduce the mutation-storm
        // lag the esHandled guard was originally added to prevent.
        requestAnimationFrame(() => {
          // The popup may have already closed again within that one frame
          // (a very fast click-through). Bail out rather than styling a
          // popup that is no longer open.
          if (!isOverlayOpen(overlay)) {
            delete labelEl.dataset.esPending;
            return;
          }

          labelEl.dataset.esHandled = 'true';

        const rawLabel = labelEl.textContent;
        const cleanLabel = normalize(rawLabel);

        // Exact match first (cheap, and the common case). If that fails, fall
        // back to a contains-either-way check against this level's own items
        // only, so a label like "Bowl of Plastic Fruit" still matches the
        // expected "plastic fruit" without risking a false match against a
        // different level's items.
        let matchedFilename = normalizedToFilename[cleanLabel];
        if (!matchedFilename && cleanLabel) {
          matchedFilename = currentLevel.imagesToFind.find((img) => {
            const cleanImg = normalize(img);
            return cleanLabel.includes(cleanImg) || cleanImg.includes(cleanLabel);
          });
        }

        // #customBillboardFull carries class "audio" for the replay-clue
        // popup and "photo" for item popups, confirmed via inspection. Style
        // each differently rather than guessing at one shared treatment.
        const billboardFull = document.getElementById('customBillboardFull');
        const isAudioClue = billboardFull && billboardFull.classList.contains('audio');

        // Clear only the specific properties either branch ever sets, not
        // the whole inline style. A full cssText reset (the V3017 fix) also
        // wiped out MPEmbed's OWN inline positioning on this element (very
        // likely something like position/bottom tied to --tagBottomOffset,
        // set by MPEmbed itself when the popup is first built), which our
        // item branch never explicitly re-applies. That is why item popups
        // started rendering centred over the middle of the image instead of
        // pinned to the bottom banner, immediately after that fix. Clearing
        // only the union of properties both branches use fixes the original
        // leak (audio styling stuck on item popups) without touching
        // anything MPEmbed itself put there.
        ['position', 'display', 'width', 'max-width', 'box-sizing', 'text-align', 'font-size',
          'color', 'margin', 'background-color', 'padding', 'white-space', 'overflow']
          .forEach((prop) => labelEl.style.removeProperty(prop));

        if (isAudioClue) {
          // Full grey card, text centred and free to wrap so nothing is cut
          // off regardless of word count.
          const backgroundEl = overlay.querySelector('.customBillboardBackground') || overlay.querySelector('.customBillboardBG');
          if (backgroundEl) {
            backgroundEl.style.setProperty('background-color', '#4a4a4a', 'important');
            backgroundEl.style.setProperty('display', 'flex', 'important');
            backgroundEl.style.setProperty('align-items', 'center', 'important');
            backgroundEl.style.setProperty('justify-content', 'center', 'important');
          }
          labelEl.style.setProperty('position', 'static', 'important');
          labelEl.style.setProperty('display', 'block', 'important');
          labelEl.style.setProperty('width', '85%', 'important');
          labelEl.style.setProperty('max-width', '85%', 'important');
          labelEl.style.setProperty('box-sizing', 'border-box', 'important');
          labelEl.style.setProperty('text-align', 'center', 'important');
          labelEl.style.setProperty('font-size', '150%', 'important');
          labelEl.style.setProperty('color', 'white', 'important');
          labelEl.style.setProperty('margin', 'auto', 'important');
          labelEl.style.setProperty('background-color', 'transparent', 'important');
          labelEl.style.setProperty('padding', '20px', 'important');
          labelEl.style.setProperty('white-space', 'normal', 'important');
          labelEl.style.setProperty('overflow', 'visible', 'important');
        } else {
          // Item popup: sit within the label's own existing banner rather
          // than fighting MPEmbed's layout with absolute positioning over
          // the whole image. Inline styles beat MPEmbed's own late-injected
          // stylesheet, which a rule in our <style> block couldn't reliably
          // override.
          labelEl.style.setProperty('display', 'block', 'important');
          labelEl.style.setProperty('width', '100%', 'important');
          labelEl.style.setProperty('box-sizing', 'border-box', 'important');
          labelEl.style.setProperty('text-align', 'center', 'important');
          labelEl.style.setProperty('font-size', '240%', 'important');
          labelEl.style.setProperty('color', 'white', 'important');
          labelEl.style.setProperty('margin', '0', 'important');
          labelEl.style.setProperty('background-color', '#1c1c1c', 'important');
          labelEl.style.setProperty('padding', '14px 24px', 'important');
        }

        window.activeOpenPopups.clear();

        if (matchedFilename && currentLevel.imagesToFind.includes(matchedFilename)) {
          window.activeOpenPopups.add(matchedFilename);
          if (!window.foundImages[matchedFilename]) {
            console.log(`Found: ${matchedFilename}`);
            playItemSound(matchedFilename);
            window.foundImages[matchedFilename] = true;
          }
          if (checkAllFound()) {
            console.log('All items found, door unlocked.');
            try {
              if (window.globalChime.src) {
                window.globalChime.currentTime = 0;
                window.globalChime.play().catch(() => {});
              }
            } catch (e) {}
          }
        } else if (!isAudioClue) {
          // Only log a non-match for item popups. The replay-clue audio
          // popup never matches an item on purpose, logging that every
          // time it opens is expected noise, not useful.
          console.log('Popup opened but label did not match any expected item:', rawLabel);
        }
        });
      }
    }

    if (!open) {
      if (window.overlayWasOpen) {
        window.activeOpenPopups.clear();
        if (checkAllFound() && !window.isTeleporting) {
          console.log('Teleport sequence starting.');
          executeFastTeleport(window.mpSdk, currentLevel);
        }
      }
      const staleLabelEl = overlay.querySelector('.tag-text-content');
      if (staleLabelEl) {
        delete staleLabelEl.dataset.esHandled;
        delete staleLabelEl.dataset.esPending;
      }
    }

    window.overlayWasOpen = open;
  }

  // Lightweight observer scoped to the single overlay element, not the whole page.
  function attachOverlayObserver() {
    const overlay = document.getElementById('customBillboardFullOverlay');
    if (!overlay) {
      // Overlay skeleton not in the DOM yet, retry shortly.
      setTimeout(attachOverlayObserver, 250);
      return;
    }
    // isOverlayOpen() forces a synchronous style recalculation on every
    // call, via getComputedStyle(). This observer watches the entire popup
    // subtree (style, class, and text changes), so if MPEmbed animates the
    // popup's own fade-in via repeated inline style writes, every frame of
    // that animation was triggering a forced reflow here, right at the
    // exact moment the popup should be appearing smoothly. Throttled to at
    // most once per animation frame, same pattern already used for the
    // panoPlayer chrome hider.
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        handleOverlayState();
      });
    });
    observer.observe(overlay, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true,
      characterData: true
    });
    // Catch the initial state too, in case it is already open.
    handleOverlayState();
  }

  // Hides MPEmbed's native per-pano audio player's visual chrome only (the
  // close icon). The audio itself must keep playing, it is the level's clue.
  function attachPanoAudioChromeHider() {
    const panoPlayer = document.getElementById('panoPlayer');
    if (!panoPlayer) {
      setTimeout(attachPanoAudioChromeHider, 250);
      return;
    }

    // This observer previously ran querySelectorAll and rewrote three style
    // properties on EVERY single mutation inside #panoPlayer, with no guard
    // at all, unlike the popup label observer which has had a once-per-open
    // guard since V3011. While arrival audio plays, its progress/attribute
    // updates can generate a steady stream of mutations, and this function
    // was doing full DOM work on every one of them. Throttled to at most
    // once per animation frame, and skips elements that already have the
    // hidden styles applied rather than rewriting them every time.
    let scheduled = false;
    const hideChrome = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        panoPlayer.querySelectorAll('.closetab, i[class*="times-circle"], [class*="close"]').forEach(el => {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
        });
      });
    };
    const observer = new MutationObserver(hideChrome);
    observer.observe(panoPlayer, { childList: true, subtree: true });
    hideChrome();
  }

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
    window.tourReady = true;
    console.log('tourReady set true. allModelSweeps count:', window.allModelSweeps.length);
    attachOverlayObserver();
    attachPanoAudioChromeHider();

    // Lobby lock: once the player first walks from the lobby to the hunt
    // sweep, the lobby is disabled behind them. Level 1 only, one-time only.
    window.lobbyLocked = false;
    mpSdk.on(mpSdk.Sweep.Event.ENTER, function (sweepId) {
      if (window.currentLevelIndex !== 0 || window.lobbyLocked) return;
      const lobbySweep = LEVELS[0].startSweeps[0];
      const huntSweep = LEVELS[0].startSweeps[1];
      if (sweepId === huntSweep) {
        window.lobbyLocked = true;
        mpSdk.Sweep.disable(lobbySweep).catch(() => {});
      }
    });

    checkReadyToReveal();
  }

  // --- READY-STATE HANDSHAKE: reveal only once both the video has finished
  // and the model has loaded, whichever happens second. ---
  window.videoFinished = false;
  window.tourReady = false;
  window.hasRevealed = false;

  function checkReadyToReveal() {
    console.log('checkReadyToReveal called. videoFinished:', window.videoFinished, 'tourReady:', window.tourReady, 'hasRevealed:', window.hasRevealed);
    if (window.videoFinished && window.tourReady && !window.hasRevealed) {
      window.hasRevealed = true;
      console.log('Conditions met, calling revealGameAndTeleport().');
      revealGameAndTeleport();
    }
  }

  async function revealGameAndTeleport() {
    console.log('revealGameAndTeleport() started.');
    try {
      const cover = document.getElementById('eye-spy-image-cover');
      if (cover) {
        cover.style.transition = 'opacity 0.6s ease';
        cover.style.opacity = '0';
        setTimeout(() => cover.remove(), 600);
        console.log('Cover fade triggered.');
      } else {
        console.log('Cover element not found, nothing to fade.');
      }
      const darkOverlay = document.getElementById('eye-spy-dark-overlay');
      if (darkOverlay) {
        darkOverlay.style.transition = 'opacity 0.6s ease';
        darkOverlay.style.opacity = '0';
        setTimeout(() => darkOverlay.remove(), 600);
        console.log('Dark overlay fade triggered.');
      } else {
        console.log('Dark overlay element not found, nothing to fade.');
      }

      // Land at the lobby, not the hunt sweep. The player then walks across
      // naturally (a single click on Matterport's own navigation arrow), which
      // reads as far less abrupt than an instant forced jump straight after
      // the video ends.
      const lobbySweep = LEVELS[0].startSweeps[0];
      console.log('Attempting to enable and move to lobby sweep:', lobbySweep);
      await window.mpSdk.Sweep.enable(lobbySweep).catch((e) => console.warn('Sweep.enable failed:', e));
      await window.mpSdk.Sweep.moveTo(lobbySweep, { transition: window.mpSdk.Sweep.Transition.INSTANT });
      console.log('Move to lobby sweep completed.');
      lockMapForCurrentLevel();
      console.log('lockMapForCurrentLevel() completed. revealGameAndTeleport() finished successfully.');
    } catch (e) {
      console.error('revealGameAndTeleport() threw an error:', e);
    }
  }

  // --- INTRO VIDEO (own overlay, no MPEmbed involvement) ---
  function proceedPastVideo() {
    console.log('proceedPastVideo() called.');
    const videoOverlay = document.getElementById('eye-spy-video-overlay');
    if (videoOverlay) {
      videoOverlay.style.transition = 'opacity 0.4s ease';
      videoOverlay.style.opacity = '0';
      setTimeout(() => videoOverlay.remove(), 400);
    }
    window.videoFinished = true;
    checkReadyToReveal();
  }

  function playIntroVideo() {
    const videoOverlay = document.getElementById('eye-spy-video-overlay');
    const frameWrap = document.getElementById('eye-spy-video-frame-wrap');
    const skipBtn = document.getElementById('eye-spy-video-skip-btn');

    if (skipBtn) skipBtn.addEventListener('click', proceedPastVideo);

    // No video configured, or overlay missing: skip straight to the hunt.
    if (!YOUTUBE_VIDEO_ID || YOUTUBE_VIDEO_ID === 'REPLACE_WITH_YOUR_VIDEO_ID' || !videoOverlay || !frameWrap) {
      proceedPastVideo();
      return;
    }

    videoOverlay.style.display = 'block';

    // Fallback: if the YouTube API never loads (network issue, blocked script, etc),
    // do not leave the player stuck. Pushed out to 90s so a slow-loading API can't
    // be mistaken for a stuck video, and it logs clearly if it ever actually fires.
    const fallbackTimer = setTimeout(() => {
      console.warn('Intro video fallback timeout fired after 90s, proceeding without confirmation the video finished.');
      proceedPastVideo();
    }, 90000);

    function createPlayer() {
      clearTimeout(fallbackTimer);
      new YT.Player(frameWrap, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: function () {
            console.log('Intro video ready and should now be playing.');
          },
          onStateChange: function (event) {
            const stateNames = { '-1': 'UNSTARTED', 0: 'ENDED', 1: 'PLAYING', 2: 'PAUSED', 3: 'BUFFERING', 5: 'CUED' };
            console.log('Intro video state changed to:', stateNames[event.data] || event.data);
            if (event.data === YT.PlayerState.ENDED) {
              proceedPastVideo();
            }
          },
          onError: function (event) {
            console.warn('Intro video error, code:', event.data, '(2=invalid ID, 5=HTML5 error, 100=not found/private, 101 or 150=embedding disabled by owner)');
            proceedPastVideo();
          }
        }
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }

  function lockMapForCurrentLevel() {
    const currentLevel = LEVELS[window.currentLevelIndex];
    if (!currentLevel || window.allModelSweeps.length === 0) return;
    const sweepsToDisable = window.allModelSweeps.filter(id => !currentLevel.startSweeps.includes(id));
    if (sweepsToDisable.length > 0) {
      window.mpSdk.Sweep.disable(...sweepsToDisable).catch(() => {});
    }
  }

  async function executeFastTeleport(mpSdk, levelData) {
    if (!levelData.targetSweep) return;
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
        console.log('Game complete.');
      }
    } catch (error) {
      console.error('Teleport failed:', error);
    }
    window.isTeleporting = false;
  }

  let checkSdkInterval = setInterval(function () {
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
