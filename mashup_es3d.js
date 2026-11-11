// =============================================================================
// EYE SPY 3D - ENGINE (V4000)
// Rewrite of V3031. Still loaded into MPEmbed as a custom script, still uses
// MPEmbed's popups and per-pano clue audio, but the game itself (levels,
// progress, hints, skipping, scores) now lives here, with its own HUD.
//
// Editing content: everything a non-coder needs is in the CONTENT block below
// (riddles, items, hints). Riddle text marks each item as {item id|words}.
// =============================================================================

(function () {
  'use strict';

  if (window.__ES3D_LOADED__) return;
  window.__ES3D_LOADED__ = true;

  const VERSION = 'V4000';
  console.log('EYE SPY 3D — ' + VERSION + ' loaded');

  // ---------------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------------
  const YOUTUBE_VIDEO_ID = 'Ly2dwu4pTVo';
  const ASSET_BASE = 'https://cdn.jsdelivr.net/gh/ABMvisual/eyespy3d@main/';
  // Web app URL of backend/leaderboard.gs once deployed. While empty, scores
  // are kept on this device only and stage-two sign-ups are switched off.
  const BACKEND_URL = '';
  const SAVE_KEY = 'es3d_save_v1';
  const BOARD_KEY = 'es3d_board_v1';
  const BOARD_SIZE = 10;

  // ---------------------------------------------------------------------------
  // CONTENT
  // hint  = first hint, elaborates on the riddle
  // where = second hint, roughly where to look (leave '' to skip that step)
  // The last hint always names the item. Nothing is ever found for the player.
  // ---------------------------------------------------------------------------
  const LOBBY_SWEEP = '7k4p5mu5f5eydt8h0f8cygptb';
  const END_SWEEP = 'e5ynaauc9kx9mar4r52hp1rfb';

  const LEVELS = [
    {
      sweep: 'cwckxx365uimbeqk6ngp0t5ud', clue: 'pink bopeep.mp3',
      riddle: 'The {pink bo-peep|Pink Bo-Peep} has lost her sheep, and {two white cows|two white cows} had taken over. The front is silver and the back is brown: once you find {yourself|yourself}, it’s time to move around.',
      items: [
        { id: 'pink bo-peep', name: 'Pink Bo-Peep', hint: 'A shepherdess with no flock, dressed in pink.', where: '' },
        { id: 'two white cows', name: 'Two white cows', hint: 'Where the sheep should be, a pair of pale cattle stand instead.', where: '' },
        { id: 'yourself', name: 'Yourself', hint: 'Silver at the front, brown at the back, and you are in it. What shows you your own face?', where: '' }
      ]
    },
    {
      sweep: 'ep98q9hxumexd83q38p12k4xc', clue: 'bowl of plastic fruit.mp3',
      riddle: 'From a {plastic fruit|bowl of plastic fruit}, to a {decongestant cough elixir|decongestant cough elixir}, if nothing else has worked, maybe a {pineapple sunday|Pineapple Sunday} will fix ya?',
      items: [
        { id: 'plastic fruit', name: 'Bowl of plastic fruit', hint: 'It looks good enough to eat, but none of it is real.', where: '' },
        { id: 'decongestant cough elixir', name: 'Decongestant cough elixir', hint: 'Old-fashioned medicine for a blocked nose and a tickly throat.', where: '' },
        { id: 'pineapple sunday', name: 'Pineapple Sunday', hint: 'A sweet treat with a tropical name, spelled like the day of the week.', where: '' }
      ]
    },
    {
      sweep: 't3si6z3gnc6ix4qh6cgmtgnfa', clue: 'Aztec chocolate.mp3',
      riddle: 'Should you put the box of {aztec chocolate|Aztec chocolate}, or the {atomic coffee|explosive coffee maker}, for the kid to enjoy, in the {royal perambulator|royal perambulator}?',
      items: [
        { id: 'aztec chocolate', name: 'Aztec chocolate', hint: 'A box of something sweet, named after an ancient Mexican empire.', where: '' },
        { id: 'atomic coffee', name: 'Atomic coffee maker', hint: 'The riddle says explosive. The maker’s name comes from the nuclear age.', where: '' },
        { id: 'royal perambulator', name: 'Royal perambulator', hint: 'A perambulator is a pram. This one is fit for a prince or princess.', where: '' }
      ]
    },
    {
      sweep: '2cngsqh5q4t1ep85y5ky0h49d', clue: 'crowin the bag.mp3',
      riddle: 'We all know {a crow in the bag|a crow in the bag} is worth {a hand in two|a hand in two}. Would {vitreous china|vitreous china} played on the {musical tyre|musical tyre} sound like a loo?',
      items: [
        { id: 'a crow in the bag', name: 'A crow in the bag', hint: 'A black bird that has ended up inside a bag.', where: '' },
        { id: 'a hand in two', name: 'A hand in two', hint: 'The old saying about a bird in the hand has been twisted. Look for a hand, and count to two.', where: '' },
        { id: 'vitreous china', name: 'Vitreous china', hint: 'The glazed ceramic that toilets and basins are made from. The “loo” is your clue.', where: '' },
        { id: 'musical tyre', name: 'Musical tyre', hint: 'Something round like a tyre that can carry a tune.', where: '' }
      ]
    },
    {
      sweep: '66yna1yh5e2ig14bmzzf1sn2c', clue: 'hanimex.mp3',
      riddle: 'Do you have any idea what {Hanimexs Movielux|Hanimex’s Movielux}, the {argus previewer|Argus PreViewer}, {scotts mower maker|Scott’s Mower Maker}, and a {porcelain lobster|Porcelain Lobster} have in common?',
      items: [
        { id: 'Hanimexs Movielux', name: 'Hanimex’s Movielux', hint: 'Home movie gear from the days of film. Look for the Hanimex name.', where: '' },
        { id: 'argus previewer', name: 'Argus PreViewer', hint: 'A small viewer for checking slides before the show. Look for the Argus name.', where: '' },
        { id: 'scotts mower maker', name: 'Scott’s Mower Maker', hint: 'Something for the lawn, with Scott’s name on it.', where: '' },
        { id: 'porcelain lobster', name: 'Porcelain lobster', hint: 'A shellfish that will never see a pot, because it is made of china.', where: '' }
      ]
    },
    {
      sweep: '3hdk0cskxw0apbr2iw8016htb', clue: 'wall climbing baby.mp3',
      riddle: 'Watch the {wall climbing baby|wall climbing baby} as they play {hide and seek|hide and seek}, searching for the {barley|barley} and some {some flumis|Flumi’s} to put them to sleep.',
      items: [
        { id: 'wall climbing baby', name: 'Wall climbing baby', hint: 'A little one who has left the floor and is heading up the wall.', where: '' },
        { id: 'hide and seek', name: 'Hide and seek', hint: 'Someone here is hiding, or counting. Look for the game being played.', where: '' },
        { id: 'barley', name: 'Barley', hint: 'A grain you might find in soup or a soothing drink. Look for the word on a label.', where: '' },
        { id: 'some flumis', name: 'Some Flumi’s', hint: 'An unusual name on a packet. The riddle says they help with sleep.', where: '' }
      ]
    },
    {
      sweep: 'r7sd2g426fhbfa2wdh5dfxy5d', clue: 'an odd purves terms.mp3',
      riddle: '{a pair of old jugs|A pair of old jugs}, {odd purves terms|an odd Purves terms}, {a third more time|a third more time}, and {round thing|a round thing} that serves.',
      items: [
        { id: 'a pair of old jugs', name: 'A pair of old jugs', hint: 'Two pourers that have seen better days, side by side.', where: '' },
        { id: 'odd purves terms', name: 'An odd Purves terms', hint: 'Look for the name Purves in print.', where: '' },
        { id: 'a third more time', name: 'A third more time', hint: 'Something here promises a third extra. Think about what measures time.', where: '' },
        { id: 'round thing', name: 'A round thing', hint: 'It is circular and made for serving.', where: '' }
      ]
    },
    {
      sweep: '20qckty5qi20t39838cq274rc', clue: '',
      riddle: '{three wooden discs|Three wooden discs} aren’t floating for certain, with {australia in stitches|Australia in stitches} by a {cat in a turban|cat in a turban}.',
      items: [
        { id: 'three wooden discs', name: 'Three wooden discs', hint: 'Count three flat circles made of timber.', where: '' },
        { id: 'australia in stitches', name: 'Australia in stitches', aliases: ['embroidered australia'], hint: 'The shape of the country, made with needle and thread.', where: '' },
        { id: 'cat in a turban', name: 'Cat in a turban', hint: 'A feline wearing unusual headwear.', where: '' }
      ]
    },
    {
      sweep: 'dy113u49qt5s7y38ms7ibmd9b', clue: 'she disinterestedly sat.mp3',
      riddle: 'On fine velvet, {she disinterestedly sat|she disinterestedly sat}, while below {two chambermen|two chambermen} chatted, opposing the {picked pack|pack}.',
      items: [
        { id: 'she disinterestedly sat', name: 'She disinterestedly sat', hint: 'A woman seated on velvet, looking thoroughly bored.', where: '' },
        { id: 'two chambermen', name: 'Two chambermen', hint: 'Below her, a pair deep in conversation.', where: '' },
        { id: 'picked pack', name: 'The picked pack', hint: 'Opposite the chatting pair, look for a pack.', where: '' }
      ]
    },
    {
      sweep: 'rxgziepm3g4e0fgdgnwwk6efd', clue: '',
      riddle: '{viking preserve|Viking preserves}, and {two box of confetti|two box of confetti}, a {drinking urn|drinking urn}, and one more {confetti|confetti}.',
      items: [
        { id: 'viking preserve', name: 'Viking preserves', hint: 'Something preserved in a jar or tin, with a Norse name on it.', where: '' },
        { id: 'two box of confetti', name: 'Two box of confetti', hint: 'Party paper for throwing, two boxes together.', where: '' },
        { id: 'drinking urn', name: 'Drinking urn', hint: 'A large vessel for serving drinks to a crowd.', where: '' },
        { id: 'confetti', name: 'Confetti', hint: 'The same party paper again, on its own this time.', where: '' }
      ]
    },
    {
      sweep: 'w2bre69ufwyaywn11ch032aaa', clue: '',
      riddle: 'As the {eagle|Eagle} soars, and {beatles|Beatles} cascade, a lone {gnome all alone|gnome} spies a shiny {blue hand|blue hand} holding a cone. He might make his home.',
      items: [
        { id: 'eagle', name: 'Eagle', hint: 'A bird of prey with its wings spread.', where: '' },
        { id: 'beatles', name: 'Beatles', hint: 'Spelled like the band, not the insect.', where: '' },
        { id: 'gnome all alone', name: 'Gnome all alone', hint: 'A small garden character standing all by himself.', where: '' },
        { id: 'blue hand', name: 'Blue hand', hint: 'A glossy hand in an unexpected colour, holding something cone-shaped.', where: '' }
      ]
    },
    {
      sweep: 'dimg015tts6u2b30hh0pndaqd', clue: '',
      riddle: 'The flock of {mock ducks|mock ducks} hang out far from the {wooden goanna|wooden goanna}, and halfway across, an {unarmed man|unarmed man} wears a red bandana.',
      items: [
        { id: 'mock ducks', name: 'Mock ducks', hint: 'A group of birds that aren’t the real thing.', where: '' },
        { id: 'wooden goanna', name: 'Wooden goanna', hint: 'An Australian lizard carved from timber, a long way from the ducks.', where: '' },
        { id: 'unarmed man', name: 'Unarmed man', hint: 'Halfway between the ducks and the lizard, a man in a red bandana is missing something.', where: '' }
      ]
    },
    {
      sweep: 'iwaxrd4g1gki6i64y6dk1iuhd', clue: '',
      riddle: '{whose head|Whose head} is that, to the left of the {hat|hat}, to the right of the {runners|runners}, above the {the plugs|plugs}, in front of the {the hugs|hugs}?',
      items: [
        { id: 'whose head', name: 'Whose head', hint: 'Start in the middle of the riddle: a head with a hat on one side and runners on the other.', where: '' },
        { id: 'hat', name: 'Hat', hint: 'Headwear, just to the right of the mystery head.', where: '' },
        { id: 'runners', name: 'Runners', hint: 'Sports shoes, just to the left of the mystery head.', where: '' },
        { id: 'the plugs', name: 'The plugs', hint: 'Look below the head for a set of plugs.', where: '' },
        { id: 'the hugs', name: 'The hugs', hint: 'Behind the head, someone is having a cuddle.', where: '' }
      ]
    },
    {
      sweep: 'aty78ze3y9ddyg8702gmncdma', clue: '',
      riddle: 'When I rowed from {dimboola|Dimboola}, to {egypt etc|Egypt etc}, I wore my {akubra|Akubra} and spied a {tiger|tiger}, a {butterfly|butterfly}, and {horse head|horse head} to end it.',
      items: [
        { id: 'dimboola', name: 'Dimboola', hint: 'A town in western Victoria. Look for its name in print.', where: '' },
        { id: 'egypt etc', name: 'Egypt etc', hint: 'Pyramids, pharaohs and more. Look for the land of the Nile.', where: '' },
        { id: 'akubra', name: 'Akubra', hint: 'The classic Australian bush hat.', where: '' },
        { id: 'tiger', name: 'Tiger', hint: 'A big cat with stripes.', where: '' },
        { id: 'butterfly', name: 'Butterfly', hint: 'Delicate wings, pinned or painted.', where: '' },
        { id: 'horse head', name: 'Horse head', hint: 'Just the head of a horse, not the whole animal.', where: '' }
      ]
    }
  ];

  // Three-character names that are not allowed on the leaderboard. Checked
  // after turning look-alike numerals back into letters (4 -> a, 0 -> o, ...).
  const BLOCKED_NAMES = ['ass', 'abo', 'bum', 'cok', 'coc', 'cnt', 'cum', 'dik', 'dic', 'dck', 'fag', 'fgt', 'fuk',
    'fuc', 'fck', 'fuq', 'fux', 'gai', 'gay', 'god', 'hoe', 'jew', 'jiz', 'kkk', 'kik', 'kyk', 'kys', 'naz', 'nig',
    'ngr', 'nob', 'pis', 'poo', 'pus', 'rap', 'sex', 'sht', 'sic', 'tit', 'twt', 'vag', 'wog', 'wtf', 'xxx'];

  // ---------------------------------------------------------------------------
  // SMALL HELPERS
  // ---------------------------------------------------------------------------
  const TOTAL_ITEMS = LEVELS.reduce((n, level) => n + level.items.length, 0);

  function norm(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function fileKey(src) {
    if (!src) return '';
    let name = src.split('?')[0].split('/').pop() || '';
    try { name = decodeURIComponent(name); } catch (e) {}
    return norm(name.replace(/\.[a-z0-9]+$/i, ''));
  }

  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
  }

  function cleanName(raw) {
    return (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  }

  function isNameAllowed(name) {
    if (!/^[A-Z0-9]{3}$/.test(name)) return false;
    const plain = name.toLowerCase().replace(/[0134578]/g, (d) => ({ 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b' }[d]));
    return !BLOCKED_NAMES.includes(plain) && !BLOCKED_NAMES.includes(name.toLowerCase());
  }

  function newPlayerId() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  LEVELS.forEach((level) => {
    level.items.forEach((item) => {
      item.keys = [item.id, item.name].concat(item.aliases || []).map(norm);
    });
  });

  // ---------------------------------------------------------------------------
  // STATE AND SAVED PROGRESS
  // ---------------------------------------------------------------------------
  const state = {
    phase: 'welcome', // welcome -> intro -> lobby -> playing -> end
    levelIndex: 0,
    found: {},
    hintStage: {},
    hintsUsed: 0,
    elapsedMs: 0,
    finished: false,
    name: '',
    playerId: newPlayerId(),
    busy: false,
    tourReady: false,
    introDone: false,
    revealed: false,
    resume: false,
    advancePending: false,
    currentSweep: '',
    arrivedAt: 0,
    clueSrc: {}
  };

  function loadSave() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      return saved && typeof saved === 'object' ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        levelIndex: state.levelIndex, found: state.found, hintStage: state.hintStage, hintsUsed: state.hintsUsed,
        elapsedMs: state.elapsedMs, finished: state.finished, name: state.name, playerId: state.playerId,
        started: state.phase === 'playing' || state.phase === 'end'
      }));
    } catch (e) {}
  }

  function resetRun() {
    state.levelIndex = 0;
    state.found = {};
    state.hintStage = {};
    state.hintsUsed = 0;
    state.elapsedMs = 0;
    state.finished = false;
    state.advancePending = false;
    state.playerId = newPlayerId();
  }

  function foundCount() {
    return Object.keys(state.found).length;
  }

  function levelFoundCount(level) {
    return level.items.filter((item) => state.found[item.id]).length;
  }

  function isLevelComplete(level) {
    return levelFoundCount(level) === level.items.length;
  }

  function sweepFor(index) {
    return index >= LEVELS.length ? END_SWEEP : LEVELS[index].sweep;
  }

  // ---------------------------------------------------------------------------
  // AUDIO
  // A small fixed pool, unlocked by the first button press, because phones only
  // let a page play sound on elements a real tap has already started.
  // ---------------------------------------------------------------------------
  const sfxPool = [new Audio(), new Audio()];
  const clueAudio = new Audio();
  let sfxTurn = 0;
  let audioUnlocked = false;

  function silentWavUrl() {
    const samples = 800;
    const view = new DataView(new ArrayBuffer(44 + samples));
    const text = (offset, s) => { for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i)); };
    text(0, 'RIFF'); view.setUint32(4, 36 + samples, true); text(8, 'WAVE'); text(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, 8000, true); view.setUint32(28, 8000, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true);
    text(36, 'data'); view.setUint32(40, samples, true);
    for (let i = 0; i < samples; i++) view.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }));
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    const url = silentWavUrl();
    sfxPool.concat(clueAudio).forEach((el) => {
      el.src = url;
      el.play().catch(() => {});
    });
  }

  function playItemSound(item) {
    const el = sfxPool[sfxTurn++ % sfxPool.length];
    el.src = ASSET_BASE + encodeURIComponent(item.id + '.mp3');
    el.currentTime = 0;
    el.play().catch(() => {});
  }

  // Fetch the current level's item sounds ahead of time so the first play is
  // instant. Replaces the old boot-time warm-up of every sound in the game.
  function preloadLevelSounds() {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    level.items.forEach((item, i) => {
      if (state.found[item.id]) return;
      setTimeout(() => {
        fetch(ASSET_BASE + encodeURIComponent(item.id + '.mp3'), { mode: 'no-cors' }).catch(() => {});
      }, 300 + i * 200);
    });
  }

  function mpeClueElement() {
    const inPlayer = document.querySelector('#panoPlayer audio');
    if (inPlayer) return inPlayer;
    return Array.from(document.querySelectorAll('audio')).find((el) => (el.currentSrc || el.src || '').includes('/media/')) || null;
  }

  // MPEmbed plays each level's clue itself on arrival. Remember which file it
  // used, so Replay still works after MPEmbed has thrown its own player away.
  function watchClueAudio() {
    const index = state.levelIndex;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const el = mpeClueElement();
      const src = el && (el.currentSrc || el.src);
      if (index !== state.levelIndex || tries > 30) { clearInterval(timer); return; }
      if (src && !el.paused && Date.now() - state.arrivedAt > 1200) {
        state.clueSrc[index] = src;
        clearInterval(timer);
      }
    }, 500);
  }

  function replayClue() {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    const el = mpeClueElement();
    const learned = state.clueSrc[state.levelIndex];
    const src = learned || (level.clue ? location.origin + '/media/3780/' + encodeURIComponent(level.clue) : '');
    if (el && (el.currentSrc || el.src) && (!learned || (el.currentSrc || el.src) === learned)) {
      clueAudio.pause();
      el.currentTime = 0;
      el.play().catch(() => {});
      return;
    }
    if (!src) { toast('No audio clue for this level yet. The riddle is written above.'); return; }
    if (el) el.pause();
    clueAudio.src = src;
    clueAudio.currentTime = 0;
    clueAudio.play().catch(() => toast('The clue audio could not be played.'));
  }

  // ---------------------------------------------------------------------------
  // STYLES
  // ---------------------------------------------------------------------------
  const CSS = `
    * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }

    /* A V3031 copy of this script may still be loaded by MPEmbed's saved
       settings. Its screens must never show alongside this version's. */
    #eye-spy-start-ui, #eye-spy-image-cover, #eye-spy-dark-overlay, #eye-spy-video-overlay { display: none !important; }

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

    .es3d, .es3d * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .es3d-hidden { display: none !important; }
    .es3d button { cursor: pointer; font: inherit; }

    #es3d-dim, #es3d-cover, #es3d-welcome, #es3d-video { position: fixed; inset: 0; }
    #es3d-dim { background: rgba(0,0,0,0.55); z-index: 2147483640; }
    #es3d-cover {
      background: #111 url('${ASSET_BASE}Load_image.webp') center / cover no-repeat;
      z-index: 2147483641; animation: es3d-punch 12s infinite alternate ease-in-out;
    }
    #es3d-cover::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.45); }
    @keyframes es3d-punch { from { transform: scale(1); } to { transform: scale(1.08); } }

    #es3d-welcome {
      z-index: 2147483643; display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 24px; text-align: center; color: #fff; overflow-y: auto;
    }
    #es3d-welcome h1 { margin: 0 0 12px; font-size: clamp(28px, 6vw, 44px); text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
    #es3d-welcome p { margin: 0 0 22px; font-size: clamp(15px, 3.4vw, 20px); text-shadow: 0 1px 3px rgba(0,0,0,0.8); max-width: 520px; }
    #es3d-name-row { margin: 0 0 22px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    #es3d-name-row label { font-size: 15px; }
    #es3d-name {
      width: 132px; padding: 10px 8px; font-size: 30px; font-weight: 700; letter-spacing: 10px; text-align: center;
      text-transform: uppercase; color: #CCFF00; background: rgba(0,0,0,0.6); border: 2px solid #CCFF00; border-radius: 8px;
    }
    #es3d-name-note { min-height: 18px; font-size: 13px; color: #ffd27d; }
    .es3d-btn {
      padding: 14px 34px; font-size: 20px; font-weight: 700; background: #CCFF00; color: #000; border: none;
      border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); margin: 6px;
    }
    .es3d-btn:hover { transform: scale(1.04); }
    .es3d-btn.es3d-quiet { background: rgba(255,255,255,0.14); color: #fff; border: 1px solid rgba(255,255,255,0.6); font-size: 16px; padding: 10px 22px; }

    #es3d-video { background: #000; z-index: 2147483644; }
    #es3d-video-frame, #es3d-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
    #es3d-video-skip { position: absolute; right: 24px; bottom: 24px; z-index: 2; }

    #es3d-prompt {
      position: fixed; left: 50%; bottom: 12%; transform: translateX(-50%); z-index: 9000; width: min(440px, calc(100vw - 32px));
      padding: 18px; text-align: center; color: #fff; background: rgba(20,20,20,0.92); border: 1px solid rgba(204,255,0,0.6); border-radius: 12px;
    }
    #es3d-prompt p { margin: 0 0 12px; font-size: 17px; }

    #es3d-hud { position: fixed; inset: 0; z-index: 9000; pointer-events: none; color: #fff; transition: opacity 0.2s ease; }
    body.es3d-popup-open #es3d-hud, body.es3d-popup-open #es3d-panel, body.es3d-popup-open #es3d-prompt { opacity: 0; pointer-events: none !important; }
    body.es3d-popup-open #es3d-hud * , body.es3d-popup-open #es3d-panel * { pointer-events: none !important; }
    #es3d-top {
      position: absolute; top: max(10px, env(safe-area-inset-top)); left: 10px; width: min(430px, calc(100vw - 20px));
      padding: 10px 12px; background: rgba(20,20,20,0.86); border-radius: 12px; pointer-events: auto;
    }
    #es3d-status { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-size: 14px; font-weight: 600; }
    #es3d-timer { font-variant-numeric: tabular-nums; color: #CCFF00; }
    #es3d-bar { height: 6px; margin: 8px 0; background: rgba(255,255,255,0.18); border-radius: 3px; overflow: hidden; }
    #es3d-bar-fill { height: 100%; width: 0; background: #CCFF00; transition: width 0.4s ease; }
    #es3d-riddle {
      display: block; width: 100%; padding: 0; margin: 0; text-align: left; background: none; border: none; color: #d9b44a;
      font-size: 15px; line-height: 1.45;
    }
    #es3d-riddle.es3d-collapsed { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #es3d-riddle .es3d-item { color: #fff; font-weight: 600; }
    #es3d-riddle .es3d-item.es3d-found { color: #CCFF00; }
    #es3d-riddle .es3d-item.es3d-found::after { content: " \\2713"; }
    #es3d-slots { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .es3d-slot {
      min-width: 26px; height: 26px; padding: 0 8px; display: inline-flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; border-radius: 13px; border: 1px dashed rgba(255,255,255,0.5); color: rgba(255,255,255,0.6);
    }
    .es3d-slot.es3d-found { border: 1px solid #CCFF00; background: rgba(204,255,0,0.16); color: #CCFF00; }

    #es3d-controls {
      position: absolute; left: 50%; bottom: max(12px, env(safe-area-inset-bottom)); transform: translateX(-50%);
      display: flex; gap: 6px; padding: 6px; background: rgba(20,20,20,0.86); border-radius: 12px; pointer-events: auto;
      max-width: calc(100vw - 16px);
    }
    #es3d-controls button {
      min-width: 52px; min-height: 44px; padding: 6px 12px; font-size: 14px; font-weight: 600; color: #fff;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; white-space: nowrap;
    }
    #es3d-controls button:hover { background: rgba(255,255,255,0.22); }
    #es3d-controls button:disabled { opacity: 0.35; cursor: default; }
    #es3d-controls button.es3d-main { background: #CCFF00; color: #000; border-color: #CCFF00; }

    #es3d-panel {
      position: fixed; inset: 0; z-index: 9500; display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.5); color: #fff;
    }
    #es3d-panel-card {
      position: relative; width: min(520px, 100%); max-height: min(86vh, 100%); overflow-y: auto; padding: 22px 20px 20px;
      background: #1c1c1c; border: 1px solid rgba(255,255,255,0.18); border-radius: 14px;
    }
    #es3d-panel-close {
      position: absolute; top: 8px; right: 8px; width: 40px; height: 40px; font-size: 22px; color: #fff; background: none; border: none;
    }
    #es3d-panel h2 { margin: 0 34px 12px 0; font-size: 22px; }
    #es3d-panel h3 { margin: 18px 0 8px; font-size: 16px; color: #CCFF00; }
    #es3d-panel p { margin: 0 0 10px; font-size: 15px; line-height: 1.5; }
    #es3d-panel .es3d-note { font-size: 13px; color: rgba(255,255,255,0.65); }
    .es3d-hint { padding: 10px 12px; margin: 0 0 8px; background: rgba(255,255,255,0.08); border-left: 3px solid #CCFF00; border-radius: 6px; font-size: 15px; line-height: 1.45; }
    .es3d-hint b { display: block; font-size: 12px; color: #CCFF00; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .es3d-list-level { padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.12); display: flex; gap: 10px; align-items: flex-start; }
    .es3d-list-level.es3d-current .es3d-list-title { color: #CCFF00; }
    .es3d-list-title { flex: 0 0 76px; font-size: 14px; font-weight: 700; padding-top: 4px; }
    .es3d-list-items { flex: 1; display: flex; flex-wrap: wrap; gap: 6px; }
    .es3d-list-go { flex: 0 0 auto; padding: 5px 12px; font-size: 13px; color: #fff; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; }
    table.es3d-board { width: 100%; border-collapse: collapse; font-size: 14px; font-variant-numeric: tabular-nums; }
    table.es3d-board th { text-align: left; font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 600; padding: 4px 6px; }
    table.es3d-board td { padding: 6px; border-top: 1px solid rgba(255,255,255,0.1); }
    table.es3d-board tr.es3d-me td { color: #CCFF00; font-weight: 700; }
    .es3d-stats { display: flex; gap: 8px; margin: 0 0 6px; }
    .es3d-stat { flex: 1; padding: 10px 6px; text-align: center; background: rgba(255,255,255,0.08); border-radius: 8px; }
    .es3d-stat b { display: block; font-size: 20px; color: #CCFF00; font-variant-numeric: tabular-nums; }
    .es3d-stat span { font-size: 12px; color: rgba(255,255,255,0.7); }
    #es3d-panel input[type="email"], #es3d-panel textarea {
      width: 100%; padding: 10px; margin: 0 0 8px; font: inherit; font-size: 16px; color: #fff; background: rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.35); border-radius: 8px;
    }
    #es3d-panel textarea { min-height: 70px; resize: vertical; }
    #es3d-panel .es3d-btn { font-size: 16px; padding: 10px 22px; margin: 4px 6px 4px 0; box-shadow: none; }

    #es3d-toast {
      position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 9600; max-width: calc(100vw - 32px);
      padding: 12px 20px; font-size: 16px; font-weight: 600; color: #000; background: #CCFF00; border-radius: 10px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.5); opacity: 0; pointer-events: none; transition: opacity 0.25s ease; text-align: center;
    }
    #es3d-toast.es3d-show { opacity: 1; }

    @media (max-width: 560px) {
      #es3d-top { padding: 8px 10px; }
      #es3d-riddle { font-size: 14px; }
      #es3d-controls { gap: 4px; padding: 5px; }
      #es3d-controls button { min-width: 44px; padding: 6px 8px; font-size: 13px; }
    }
  `;

  // ---------------------------------------------------------------------------
  // SCREENS
  // ---------------------------------------------------------------------------
  const ui = {};

  function el(tag, id, html) {
    const node = document.createElement(tag);
    if (id) node.id = id;
    node.classList.add('es3d');
    if (html) node.innerHTML = html;
    document.body.appendChild(node);
    return node;
  }

  function buildUI() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    ui.dim = el('div', 'es3d-dim');
    ui.cover = el('div', 'es3d-cover');
    ui.welcome = el('div', 'es3d-welcome');
    ui.video = el('div', 'es3d-video', '<div id="es3d-video-frame"></div><button id="es3d-video-skip" class="es3d-btn es3d-quiet" type="button">Skip &gt;</button>');
    ui.video.classList.add('es3d-hidden');
    ui.prompt = el('div', 'es3d-prompt', '<p>Level 1 is just ahead. Walk over to it, or let us take you.</p><button class="es3d-btn" type="button" id="es3d-prompt-go">Take me there</button>');
    ui.prompt.classList.add('es3d-hidden');
    ui.hud = el('div', 'es3d-hud', `
      <div id="es3d-top">
        <div id="es3d-status"><span id="es3d-level"></span><span id="es3d-count"></span><span id="es3d-timer">00:00</span></div>
        <div id="es3d-bar"><div id="es3d-bar-fill"></div></div>
        <button id="es3d-riddle" type="button" aria-label="Riddle, tap to shrink or expand"></button>
        <div id="es3d-slots"></div>
      </div>
      <div id="es3d-controls">
        <button type="button" data-act="prev" aria-label="Previous level">&#8249; Back</button>
        <button type="button" data-act="clue">Clue</button>
        <button type="button" data-act="hint" class="es3d-main">Hint</button>
        <button type="button" data-act="list">List</button>
        <button type="button" data-act="board">Scores</button>
        <button type="button" data-act="next" aria-label="Skip to next level">Skip &#8250;</button>
      </div>`);
    ui.hud.classList.add('es3d-hidden');
    ui.panel = el('div', 'es3d-panel', '<div id="es3d-panel-card"><button id="es3d-panel-close" type="button" aria-label="Close">&times;</button><div id="es3d-panel-body"></div></div>');
    ui.panel.classList.add('es3d-hidden');
    ui.toast = el('div', 'es3d-toast');
    ui.toast.setAttribute('role', 'status');

    document.getElementById('es3d-video-skip').addEventListener('click', finishIntro);
    document.getElementById('es3d-prompt-go').addEventListener('click', () => { unlockAudio(); goToLevel(0); });
    document.getElementById('es3d-panel-close').addEventListener('click', closePanel);
    ui.panel.addEventListener('click', (e) => { if (e.target === ui.panel) closePanel(); });
    document.getElementById('es3d-riddle').addEventListener('click', (e) => e.currentTarget.classList.toggle('es3d-collapsed'));
    document.getElementById('es3d-controls').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn || btn.disabled) return;
      unlockAudio();
      const act = btn.dataset.act;
      if (act === 'prev') goToLevel(state.levelIndex - 1);
      else if (act === 'next') goToLevel(state.levelIndex + 1);
      else if (act === 'clue') replayClue();
      else if (act === 'hint') showHintPanel(false);
      else if (act === 'list') showListPanel();
      else if (act === 'board') showBoardPanel();
    });

    renderWelcome();
  }

  let toastTimer = null;
  function toast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('es3d-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.remove('es3d-show'), 2600);
  }

  function renderWelcome() {
    const saved = loadSave();
    const canResume = !!(saved && saved.started && !saved.finished);
    const savedName = saved && saved.name ? saved.name : '';
    ui.welcome.innerHTML = `
      <h1>Welcome to Eye Spy 3D</h1>
      <p>Listen to each riddle, then look around and click every object it describes. Please play with your audio on.</p>
      <div id="es3d-name-row">
        <label for="es3d-name">Your 3-character name for the leaderboard</label>
        <input id="es3d-name" type="text" maxlength="3" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(savedName)}" placeholder="AAA">
        <div id="es3d-name-note"></div>
      </div>
      <div>
        ${canResume ? '<button class="es3d-btn" type="button" data-start="resume">Continue</button>' : ''}
        <button class="es3d-btn ${canResume ? 'es3d-quiet' : ''}" type="button" data-start="new">${canResume ? 'Start again' : 'Watch the intro'}</button>
      </div>`;
    const input = document.getElementById('es3d-name');
    input.addEventListener('input', () => { input.value = cleanName(input.value); });
    ui.welcome.querySelectorAll('button[data-start]').forEach((btn) => {
      btn.addEventListener('click', () => startPressed(btn.dataset.start === 'resume', saved));
    });
  }

  function startPressed(resume, saved) {
    const note = document.getElementById('es3d-name-note');
    const name = cleanName(document.getElementById('es3d-name').value);
    if (name && !isNameAllowed(name)) {
      note.textContent = name.length < 3 ? 'Use exactly 3 letters or numbers.' : 'Please pick a different name.';
      return;
    }
    unlockAudio();
    const docEl = document.documentElement;
    try {
      if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
    } catch (e) {}

    if (resume && saved) {
      state.levelIndex = Math.max(0, Math.min(saved.levelIndex || 0, LEVELS.length));
      state.found = saved.found || {};
      state.hintStage = saved.hintStage || {};
      state.hintsUsed = saved.hintsUsed || 0;
      state.elapsedMs = saved.elapsedMs || 0;
      state.playerId = saved.playerId || state.playerId;
      state.resume = true;
    } else {
      resetRun();
    }
    state.name = name;
    ui.welcome.remove();

    if (state.resume) {
      state.introDone = true;
      checkReadyToReveal();
    } else {
      state.phase = 'intro';
      playIntroVideo();
    }
  }

  // --- INTRO VIDEO (own overlay, no MPEmbed involvement) ---
  function finishIntro() {
    if (state.introDone) return;
    state.introDone = true;
    ui.video.remove();
    checkReadyToReveal();
  }

  function playIntroVideo() {
    const frame = document.getElementById('es3d-video-frame');
    if (!YOUTUBE_VIDEO_ID || !frame) { finishIntro(); return; }
    ui.video.classList.remove('es3d-hidden');

    // If the YouTube API never loads, do not leave the player stuck.
    const fallbackTimer = setTimeout(() => {
      console.warn('Intro video API did not load after 90s, continuing without it.');
      finishIntro();
    }, 90000);

    function createPlayer() {
      clearTimeout(fallbackTimer);
      if (state.introDone) return;
      new YT.Player(frame, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (event) => { if (event.data === YT.PlayerState.ENDED) finishIntro(); },
          onError: (event) => { console.warn('Intro video error, code:', event.data); finishIntro(); }
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

  // ---------------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------------
  function riddleHtml(level) {
    return esc(level.riddle).replace(/\{([^|}]+)\|([^}]+)\}/g, (m, id, words) =>
      '<span class="es3d-item' + (state.found[id] ? ' es3d-found' : '') + '">' + words + '</span>');
  }

  function renderHud() {
    const inGame = state.phase === 'playing' || state.phase === 'end';
    ui.hud.classList.toggle('es3d-hidden', !inGame);
    ui.prompt.classList.toggle('es3d-hidden', state.phase !== 'lobby');
    if (!inGame) return;

    const level = LEVELS[state.levelIndex];
    document.getElementById('es3d-level').textContent = level ? 'Level ' + (state.levelIndex + 1) + ' of ' + LEVELS.length : 'The end';
    document.getElementById('es3d-count').textContent = foundCount() + ' / ' + TOTAL_ITEMS + ' found';
    document.getElementById('es3d-bar-fill').style.width = (100 * foundCount() / TOTAL_ITEMS) + '%';
    document.getElementById('es3d-timer').textContent = formatTime(state.elapsedMs);

    const riddle = document.getElementById('es3d-riddle');
    const slots = document.getElementById('es3d-slots');
    if (level) {
      riddle.innerHTML = riddleHtml(level);
      slots.innerHTML = level.items.map((item) => state.found[item.id]
        ? '<span class="es3d-slot es3d-found">' + esc(item.name) + '</span>'
        : '<span class="es3d-slot" aria-label="Not found yet">?</span>').join('');
    } else {
      riddle.innerHTML = foundCount() === TOTAL_ITEMS ? 'You found everything.' : 'You have reached the end. Go back to find what you missed.';
      slots.innerHTML = '';
    }

    const controls = document.getElementById('es3d-controls');
    controls.querySelector('[data-act="prev"]').disabled = state.levelIndex === 0;
    controls.querySelector('[data-act="next"]').disabled = !level;
    controls.querySelector('[data-act="clue"]').disabled = !level;
    controls.querySelector('[data-act="hint"]').disabled = !level || isLevelComplete(level);
  }

  let lastTick = Date.now();
  setInterval(() => {
    const now = Date.now();
    const delta = now - lastTick;
    lastTick = now;
    if (state.phase !== 'playing' || state.finished || document.hidden || delta > 5000) return;
    state.elapsedMs += delta;
    const timer = document.getElementById('es3d-timer');
    if (timer) timer.textContent = formatTime(state.elapsedMs);
    if (Math.floor(state.elapsedMs / 1000) % 10 === 0) save();
  }, 1000);

  // ---------------------------------------------------------------------------
  // PANELS
  // ---------------------------------------------------------------------------
  function openPanel(html) {
    document.getElementById('es3d-panel-body').innerHTML = html;
    ui.panel.classList.remove('es3d-hidden');
    document.getElementById('es3d-panel-card').scrollTop = 0;
  }

  function closePanel() {
    ui.panel.classList.add('es3d-hidden');
  }

  function hintSteps(item) {
    const steps = [{ label: 'Think about it', text: item.hint }];
    if (item.where) steps.push({ label: 'Where to look', text: item.where });
    steps.push({ label: 'What it is', text: 'You are looking for: ' + item.name + '.' });
    return steps;
  }

  // Hints work through the level's items in riddle order, one unfound item at
  // a time. Each press reveals one more step; the last step names the item.
  function showHintPanel(revealNext) {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    const item = level.items.find((it) => !state.found[it.id]);
    if (!item) return;
    const steps = hintSteps(item);
    let stage = state.hintStage[item.id] || 0;
    if ((revealNext || stage === 0) && stage < steps.length) {
      stage++;
      state.hintStage[item.id] = stage;
      state.hintsUsed++;
      save();
    }
    const position = level.items.indexOf(item) + 1;
    openPanel(`
      <h2>Hint</h2>
      <p class="es3d-note">For item ${position} of ${level.items.length} in this riddle. Hints used so far: ${state.hintsUsed}.</p>
      ${steps.slice(0, stage).map((step) => '<div class="es3d-hint"><b>' + esc(step.label) + '</b>' + esc(step.text) + '</div>').join('')}
      ${stage < steps.length
        ? '<button class="es3d-btn" type="button" id="es3d-more-hint">Another hint</button>'
        : '<p class="es3d-note">That is every hint for this one. You still need to find it and click it yourself.</p>'}`);
    const more = document.getElementById('es3d-more-hint');
    if (more) more.addEventListener('click', () => showHintPanel(true));
  }

  function showListPanel() {
    const rows = LEVELS.map((level, i) => `
      <div class="es3d-list-level ${i === state.levelIndex ? 'es3d-current' : ''}">
        <div class="es3d-list-title">Level ${i + 1}<br><span class="es3d-note">${levelFoundCount(level)} / ${level.items.length}</span></div>
        <div class="es3d-list-items">${level.items.map((item) => state.found[item.id]
          ? '<span class="es3d-slot es3d-found">' + esc(item.name) + '</span>'
          : '<span class="es3d-slot">?</span>').join('')}</div>
        ${i === state.levelIndex ? '' : '<button class="es3d-list-go" type="button" data-go="' + i + '">Go</button>'}
      </div>`).join('');
    openPanel(`<h2>Checklist</h2><p>${foundCount()} of ${TOTAL_ITEMS} found.</p>${rows}`);
    document.getElementById('es3d-panel-body').querySelectorAll('button[data-go]').forEach((btn) => {
      btn.addEventListener('click', () => goToLevel(Number(btn.dataset.go)));
    });
  }

  // --- LEADERBOARD ---
  // Players who found everything rank first, fastest at the top. Until there
  // are enough of those to fill the board, the rest is filled by whoever has
  // found the most items.
  function sortBoard(entries) {
    return entries.slice().sort((a, b) =>
      (b.completed ? 1 : 0) - (a.completed ? 1 : 0) || b.found - a.found || a.timeMs - b.timeMs).slice(0, BOARD_SIZE);
  }

  function myEntry() {
    return {
      playerId: state.playerId, name: state.name, found: foundCount(), total: TOTAL_ITEMS,
      timeMs: Math.round(state.elapsedMs), hints: state.hintsUsed, completed: foundCount() === TOTAL_ITEMS
    };
  }

  function localBoard() {
    try {
      const list = JSON.parse(localStorage.getItem(BOARD_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function postToBackend(payload) {
    // text/plain keeps this a "simple" request, which Apps Script web apps need.
    return fetch(BACKEND_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then((res) => res.json());
  }

  function submitScore() {
    if (!state.name || foundCount() === 0) return;
    const entry = myEntry();
    try {
      const list = localBoard().filter((row) => row.playerId !== entry.playerId);
      list.push(entry);
      localStorage.setItem(BOARD_KEY, JSON.stringify(sortBoard(list)));
    } catch (e) {}
    if (BACKEND_URL) postToBackend(Object.assign({ action: 'score' }, entry)).catch(() => {});
  }

  function fetchBoard() {
    if (!BACKEND_URL) return Promise.resolve(localBoard());
    return fetch(BACKEND_URL + '?action=board').then((res) => res.json()).then((data) => (data && data.board) || []).catch(() => localBoard());
  }

  function boardHtml(entries) {
    const rows = sortBoard(entries);
    if (rows.length === 0) return '<p class="es3d-note">No scores yet. Be the first.</p>';
    return `<table class="es3d-board">
      <tr><th>#</th><th>Name</th><th>Found</th><th>Time</th><th>Hints</th></tr>
      ${rows.map((row, i) => `<tr class="${row.playerId === state.playerId ? 'es3d-me' : ''}">
        <td>${i + 1}</td><td>${esc(cleanName(row.name))}</td><td>${Number(row.found) || 0} / ${TOTAL_ITEMS}</td>
        <td>${formatTime(Number(row.timeMs) || 0)}</td><td>${Number(row.hints) || 0}</td></tr>`).join('')}
    </table>`;
  }

  function boardSection() {
    return `<h3>Leaderboard</h3><div id="es3d-board-slot"><p class="es3d-note">Loading scores…</p></div>
      ${BACKEND_URL ? '' : '<p class="es3d-note">Showing scores from this device only.</p>'}
      ${state.name ? '' : '<p class="es3d-note">Enter a 3-character name on the welcome screen to appear here.</p>'}`;
  }

  function fillBoard() {
    fetchBoard().then((entries) => {
      const slot = document.getElementById('es3d-board-slot');
      if (slot) slot.innerHTML = boardHtml(entries);
    });
  }

  function showBoardPanel() {
    openPanel('<h2>Scores</h2><p class="es3d-note">Find every item to rank by time. Until the board is full of finishers, it shows who has found the most.</p>' + boardSection());
    fillBoard();
  }

  function showEndPanel() {
    const all = foundCount() === TOTAL_ITEMS;
    openPanel(`
      <h2>${all ? 'You found everything!' : 'You have reached the end'}</h2>
      <div class="es3d-stats">
        <div class="es3d-stat"><b>${foundCount()} / ${TOTAL_ITEMS}</b><span>items found</span></div>
        <div class="es3d-stat"><b>${formatTime(state.elapsedMs)}</b><span>time</span></div>
        <div class="es3d-stat"><b>${state.hintsUsed}</b><span>hints</span></div>
      </div>
      ${all ? '' : '<p>Some items are still hidden. Use Back or the List to return and find them. Only players who click every item rank by time.</p>'}
      ${boardSection()}
      <h3>Stage two is coming</h3>
      <p>Leave your email to hear when the next stage of Eye Spy 3D opens. Feedback is welcome too.</p>
      <form id="es3d-signup" novalidate>
        <input type="email" id="es3d-email" placeholder="you@example.com" autocomplete="email" aria-label="Email address">
        <textarea id="es3d-feedback" placeholder="Feedback (optional)" aria-label="Feedback"></textarea>
        <button class="es3d-btn" type="submit">Send</button>
        <button class="es3d-btn es3d-quiet" type="button" id="es3d-again">Play again</button>
        <p class="es3d-note" id="es3d-signup-note">Your email is only used to tell you about stage two.</p>
      </form>`);
    fillBoard();
    document.getElementById('es3d-signup').addEventListener('submit', (e) => { e.preventDefault(); sendSignup(); });
    document.getElementById('es3d-again').addEventListener('click', () => {
      resetRun();
      save();
      goToLevel(0);
    });
  }

  function sendSignup() {
    const note = document.getElementById('es3d-signup-note');
    const email = document.getElementById('es3d-email').value.trim();
    const feedback = document.getElementById('es3d-feedback').value.trim();
    if (!email && !feedback) { note.textContent = 'Add an email address or some feedback first.'; return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = 'That email address does not look right.'; return; }
    if (!BACKEND_URL) { note.textContent = 'Sign-ups are not switched on yet, so nothing was sent.'; return; }
    note.textContent = 'Sending…';
    postToBackend({ action: 'signup', email: email, feedback: feedback, name: state.name, playerId: state.playerId })
      .then((data) => { note.textContent = data && data.ok ? 'Thanks, that has been sent.' : 'That could not be sent. Please try again.'; })
      .catch(() => { note.textContent = 'That could not be sent. Please try again.'; });
  }

  // ---------------------------------------------------------------------------
  // MOVING THROUGH THE TOUR
  // ---------------------------------------------------------------------------
  let sdk = null;
  let allSweeps = [];

  // Only the sweep the player should be standing on stays enabled, so they
  // cannot wander. The lobby stays open only until level 1 is first reached.
  function lockMap() {
    const allowed = state.phase === 'lobby' ? [LOBBY_SWEEP, LEVELS[0].sweep] : [sweepFor(state.levelIndex)];
    const others = allSweeps.filter((id) => !allowed.includes(id));
    if (others.length > 0) sdk.Sweep.disable(...others).catch(() => {});
  }

  async function moveToSweep(sweepId) {
    await sdk.Sweep.enable(sweepId).catch(() => {});
    if (state.currentSweep === sweepId) return;
    try {
      await sdk.Sweep.moveTo(sweepId, { transition: sdk.Sweep.Transition.FLY });
    } catch (flyError) {
      await sdk.Sweep.moveTo(sweepId, { transition: sdk.Sweep.Transition.INSTANT });
    }
  }

  function arriveAtLevel(index) {
    state.levelIndex = index;
    state.phase = index >= LEVELS.length ? 'end' : 'playing';
    state.advancePending = false;
    state.arrivedAt = Date.now();
    lockMap();
    save();
    renderHud();
    if (state.phase === 'end') {
      submitScore();
      showEndPanel();
    } else {
      preloadLevelSounds();
      watchClueAudio();
    }
  }

  async function goToLevel(index) {
    if (state.busy || !sdk || index < 0 || index > LEVELS.length) return;
    state.busy = true;
    closePanel();
    try {
      await moveToSweep(sweepFor(index));
      arriveAtLevel(index);
    } catch (error) {
      console.error('Eye Spy 3D: could not move to level ' + (index + 1), error);
      toast('Could not move there. Please try again.');
    }
    state.busy = false;
  }

  function checkReadyToReveal() {
    if (!state.introDone || !state.tourReady || state.revealed) return;
    state.revealed = true;
    reveal();
  }

  async function reveal() {
    [ui.cover, ui.dim].forEach((node) => {
      node.style.transition = 'opacity 0.6s ease';
      node.style.opacity = '0';
      setTimeout(() => node.remove(), 600);
    });
    if (state.resume) {
      await goToLevel(state.levelIndex);
      // If the move failed, still drop the player into the game where they are.
      if (state.phase !== 'playing' && state.phase !== 'end') arriveAtLevel(state.levelIndex);
      return;
    }
    // New game: land in the lobby with a clear prompt. Walking to level 1 or
    // pressing "Take me there" both start the hunt.
    state.phase = 'lobby';
    try {
      await sdk.Sweep.enable(LOBBY_SWEEP, LEVELS[0].sweep).catch(() => {});
      if (state.currentSweep !== LOBBY_SWEEP) {
        await sdk.Sweep.moveTo(LOBBY_SWEEP, { transition: sdk.Sweep.Transition.INSTANT });
      }
    } catch (e) {
      console.warn('Eye Spy 3D: could not move to the lobby', e);
    }
    lockMap();
    renderHud();
  }

  function onSweepChanged(sweepId) {
    if (!sweepId) return;
    state.currentSweep = sweepId;
    // The player walked from the lobby to level 1 by themselves.
    if (state.phase === 'lobby' && sweepId === LEVELS[0].sweep && !state.busy) arriveAtLevel(0);
  }

  // ---------------------------------------------------------------------------
  // MPEMBED POPUPS: detecting which item was opened
  // ---------------------------------------------------------------------------
  function matchItem(level, label, imageSrc) {
    const byFile = fileKey(imageSrc);
    const byLabel = norm(label);
    const exact = level.items.find((item) => (byFile && item.keys.includes(byFile)) || (byLabel && item.keys.includes(byLabel)));
    if (exact) return exact;
    if (byLabel.length < 4) return null;
    // Loose match ("Bowl of Plastic Fruit" vs "plastic fruit"), longest key
    // first so "two box of confetti" is never mistaken for "confetti".
    let best = null;
    let bestLength = 0;
    level.items.forEach((item) => {
      item.keys.forEach((key) => {
        if (key.length > bestLength && (byLabel.includes(key) || key.includes(byLabel))) {
          best = item;
          bestLength = key.length;
        }
      });
    });
    return best;
  }

  function isOverlayOpen(overlay) {
    return !!overlay && window.getComputedStyle(overlay).display !== 'none';
  }

  // #customBillboardFull carries class "audio" for the replay-clue popup and
  // "photo" for item popups. Inline styles are used because MPEmbed's own
  // late-injected stylesheet beats rules in our <style> block. Only the
  // properties set here are ever cleared: MPEmbed puts its own inline
  // positioning on these elements and that must survive.
  function stylePopup(overlay, labelEl, isAudioClue) {
    ['position', 'display', 'width', 'max-width', 'box-sizing', 'text-align', 'font-size',
      'color', 'margin', 'background-color', 'padding', 'white-space', 'overflow']
      .forEach((prop) => labelEl.style.removeProperty(prop));
    const backgroundEl = overlay.querySelector('.customBillboardBackground') || overlay.querySelector('.customBillboardBG');
    if (backgroundEl) {
      ['background-color', 'display', 'align-items', 'justify-content'].forEach((prop) => backgroundEl.style.removeProperty(prop));
    }
    const set = (node, props) => Object.keys(props).forEach((prop) => node.style.setProperty(prop, props[prop], 'important'));
    if (isAudioClue) {
      if (backgroundEl) set(backgroundEl, { 'background-color': '#4a4a4a', display: 'flex', 'align-items': 'center', 'justify-content': 'center' });
      set(labelEl, {
        position: 'static', display: 'block', width: '85%', 'max-width': '85%', 'box-sizing': 'border-box', 'text-align': 'center',
        'font-size': '150%', color: 'white', margin: 'auto', 'background-color': 'transparent', padding: '20px',
        'white-space': 'normal', overflow: 'visible'
      });
    } else {
      set(labelEl, {
        display: 'block', width: '100%', 'box-sizing': 'border-box', 'text-align': 'center', 'font-size': '240%',
        color: 'white', margin: '0', 'background-color': '#1c1c1c', padding: '14px 24px'
      });
    }
  }

  function registerFind(label, imageSrc) {
    const level = LEVELS[state.levelIndex];
    if (state.phase !== 'playing' || state.busy || !level) return;
    const item = matchItem(level, label, imageSrc);
    if (!item) {
      console.log('Eye Spy 3D: popup did not match an item on this level:', label, imageSrc);
      return;
    }
    if (state.found[item.id]) return;
    state.found[item.id] = true;
    playItemSound(item);
    if (isLevelComplete(level)) state.advancePending = true;
    if (foundCount() === TOTAL_ITEMS) state.finished = true;
    save();
    renderHud();
    submitScore();
  }

  function onPopupClosed() {
    const level = LEVELS[state.levelIndex];
    if (state.phase !== 'playing' || !level) return;
    if (state.advancePending) {
      state.advancePending = false;
      toast(state.levelIndex + 1 < LEVELS.length ? 'Level ' + (state.levelIndex + 1) + ' complete!' : 'Final level complete!');
      goToLevel(state.levelIndex + 1);
    } else {
      const left = level.items.length - levelFoundCount(level);
      if (left > 0 && left < level.items.length) toast(left === 1 ? '1 more to find here' : left + ' more to find here');
    }
  }

  let overlayWasOpen = false;
  let handledSignature = null;
  let popupPending = false;

  function popupSignature(overlay) {
    const labelEl = overlay.querySelector('.tag-text-content');
    const img = overlay.querySelector('img.tag-image') || overlay.querySelector('.tag-media-content img');
    const full = document.getElementById('customBillboardFull');
    return [labelEl ? labelEl.textContent : '', img ? img.getAttribute('src') : '', full && full.classList.contains('audio') ? 'audio' : 'item'].join('|');
  }

  function handleOverlayState() {
    const overlay = document.getElementById('customBillboardFullOverlay');
    if (!overlay) return;
    const open = isOverlayOpen(overlay);
    document.body.classList.toggle('es3d-popup-open', open);

    // Handled once per distinct popup, not on every mutation: MPEmbed mutates
    // the popup many times a second while it animates or plays audio. Keyed on
    // the popup's content, so a tag swapped in without closing still counts.
    if (open && !popupPending && popupSignature(overlay) !== handledSignature) {
      popupPending = true;
      // One frame's grace: MPEmbed swaps the "audio"/"photo" class on the
      // reused element slightly after the popup first becomes visible.
      requestAnimationFrame(() => {
        popupPending = false;
        if (!isOverlayOpen(overlay)) return;
        handledSignature = popupSignature(overlay);
        const labelEl = overlay.querySelector('.tag-text-content');
        const img = overlay.querySelector('img.tag-image') || overlay.querySelector('.tag-media-content img');
        const full = document.getElementById('customBillboardFull');
        const isAudioClue = !!(full && full.classList.contains('audio'));
        if (labelEl) stylePopup(overlay, labelEl, isAudioClue);
        if (!isAudioClue) registerFind(labelEl ? labelEl.textContent : '', img ? img.getAttribute('src') : '');
      });
    }
    if (!open) {
      handledSignature = null;
      if (overlayWasOpen) onPopupClosed();
    }
    overlayWasOpen = open;
  }

  // Scoped to the single overlay element and throttled to once per frame,
  // because isOverlayOpen() forces a style recalculation.
  function attachOverlayObserver() {
    const overlay = document.getElementById('customBillboardFullOverlay');
    if (!overlay) { setTimeout(attachOverlayObserver, 250); return; }
    let scheduled = false;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; handleOverlayState(); });
    }).observe(overlay, { attributes: true, attributeFilter: ['style', 'class'], childList: true, subtree: true, characterData: true });
    handleOverlayState();
  }

  // Hides the close icon on MPEmbed's per-pano audio player. The audio itself
  // must keep playing, it is the level's clue.
  function attachPanoAudioChromeHider() {
    const panoPlayer = document.getElementById('panoPlayer');
    if (!panoPlayer) { setTimeout(attachPanoAudioChromeHider, 250); return; }
    let scheduled = false;
    const hideChrome = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        panoPlayer.querySelectorAll('.closetab, i[class*="times-circle"], [class*="close"]').forEach((node) => {
          node.style.setProperty('display', 'none', 'important');
          node.style.setProperty('opacity', '0', 'important');
          node.style.setProperty('pointer-events', 'none', 'important');
        });
      });
    };
    new MutationObserver(hideChrome).observe(panoPlayer, { childList: true, subtree: true });
    hideChrome();
  }

  // ---------------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------------
  // If MPEmbed's saved settings still load V3031 alongside this script, its
  // popup handler and lobby lock both stand down while these two flags read
  // true, which leaves this version as the only one running the game.
  function standDownLegacyScript() {
    ['isTeleporting', 'lobbyLocked'].forEach((flag) => {
      try {
        Object.defineProperty(window, flag, { get: () => true, set: () => {}, configurable: true });
      } catch (e) {}
    });
  }

  async function initTour(mpSdk) {
    sdk = mpSdk;
    const collection = await new Promise((resolve) => {
      const sub = sdk.Sweep.data.subscribe({
        onCollectionUpdated: (sweeps) => {
          if (Object.keys(sweeps).length > 0) { resolve(sweeps); sub.cancel(); }
        }
      });
    });
    allSweeps = Object.keys(collection);
    sdk.Sweep.current.subscribe((sweep) => onSweepChanged(sweep && (sweep.sid || sweep.id)));
    attachOverlayObserver();
    attachPanoAudioChromeHider();
    state.tourReady = true;
    checkReadyToReveal();
  }

  function waitForTour() {
    let subscribed = false;
    let started = false;
    const timer = setInterval(() => {
      if (subscribed || !window.mpSdk || !window.mpSdk.App) return;
      subscribed = true;
      clearInterval(timer);
      window.mpSdk.App.state.subscribe((appState) => {
        if (started || appState.phase !== window.mpSdk.App.Phase.PLAYING) return;
        started = true;
        initTour(window.mpSdk).catch((e) => console.error('Eye Spy 3D: tour setup failed', e));
      });
    }, 500);
  }

  standDownLegacyScript();
  const bootTimer = setInterval(() => {
    if (!document.head || !document.body) return;
    clearInterval(bootTimer);
    buildUI();
    waitForTour();
  }, 50);
})();
