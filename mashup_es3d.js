// =============================================================================
// EYE SPY 3D - ENGINE (V4022)
// Copyright (c) 2026 ABM visual, Adelaide, South Australia. All rights reserved.
// Not open source. No part of this game, its code, riddles, hints, design, text,
// audio or artwork may be copied, modified or reused without written permission.
// See the LICENSE file in this repository.
//
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

  // Adding &es3d=off to the page address switches the game off, for looking
  // at the plain tour.
  if (/[?&]es3d=off/.test(location.search)) {
    console.log('EYE SPY 3D \u2014 switched off by the page address');
    return;
  }

  const VERSION = 'V4022';
  console.log('EYE SPY 3D — ' + VERSION + ' loaded');

  // ---------------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------------
  // The intro video. If INTRO_VIDEO_FILE names a video file in this repo
  // (an .mp4 under 20 MB), it plays in a plain player with no YouTube
  // branding. While it is empty, the YouTube video is used instead.
  const INTRO_VIDEO_FILE = '';
  const YOUTUBE_VIDEO_ID = 'Ly2dwu4pTVo';
  const ASSET_BASE = 'https://cdn.jsdelivr.net/gh/ABMvisual/eyespy3d@main/';
  // Web app URL of backend/leaderboard.gs once deployed. While empty, scores
  // are kept on this device only and stage-two sign-ups are switched off.
  const BACKEND_URL = '';
  // Clicking a riddle disc on the floor: true replays the riddle, false does
  // nothing (the Riddle button is then the only way to hear it again). The
  // discs' clickable area is a square, so stray clicks on the corners are common.
  const DISC_CLICK_REPLAYS = false;
  // Page the Share button hands out. Empty = the page that embeds the game.
  const SHARE_URL = 'https://abmvisual.com/eye-spy-3d';
  // Colours of the photo popup's label bar (set by script, see stylePopup).
  const THEME = { bar: '#1a1714', barText: '#c4e82c' };
  const SAVE_KEY = 'es3d_save_v1';
  const BOARD_KEY = 'es3d_board_v1';
  const BOARD_SIZE = 10;

  // ---------------------------------------------------------------------------
  // CONTENT
  // Riddle wording, and which words are marked as objects, are copied word
  // for word from the riddle discs on the floor, which the recordings follow.
  // hint  = first hint, elaborates on the riddle
  // where = second hint, roughly where to look (leave '' to skip that step)
  // The last hint always names the item. Nothing is ever found for the player.
  // ---------------------------------------------------------------------------
  const LOBBY_SWEEP = '7k4p5mu5f5eydt8h0f8cygptb';
  const END_SWEEP = 'e5ynaauc9kx9mar4r52hp1rfb';

  const LEVELS = [
    {
      sweep: 'cwckxx365uimbeqk6ngp0t5ud', clue: 'pink bopeep.mp3',
      riddle: 'The {pink bo-peep|pink Bo-Peep} has lost her sheep, and {two white cows|two white cows} have taken over, {yourself|the front is silver and the back is brown}, once you find yourself, it\u2019s time to move around',
      items: [
        { id: 'pink bo-peep', name: 'Pink Bo-Peep', photo: 'pink bopeep.jpeg', hint: 'A shepherdess with no flock, dressed in pink.', where: 'On the shelf, just below the two white cows.' },
        { id: 'two white cows', name: 'Two white cows', hint: 'Where the sheep should be, a pair of pale cattle stand instead.', where: 'Directly above the Pink Bo-Peep.' },
        { id: 'yourself', name: 'Yourself', reveal: 'It is you, in the mirror.', hint: 'Silver at the front, brown at the back, and you are in it. What shows you your own face?', where: 'Across the room from the Pink Bo-Peep, on the table.' }
      ]
    },
    {
      sweep: 'ep98q9hxumexd83q38p12k4xc', clue: 'bowl of plastic fruit.mp3',
      riddle: 'From a {plastic fruit|bowl of plastic fruit}, to a {decongestant cough elixir|decongestant cough elixir}, if nothing else has worked, maybe a {pineapple sunday|Pineapple Sunday} will fix ya?',
      items: [
        { id: 'plastic fruit', name: 'Bowl of plastic fruit', hint: 'It looks good enough to eat, but none of it is real.', where: 'On the table beside the mirror.' },
        { id: 'decongestant cough elixir', name: 'Decongestant cough elixir', hint: 'An old advertisement for medicine for a blocked nose and a tickly throat.', where: 'On the wall next to the mirror.' },
        { id: 'pineapple sunday', name: 'Pineapple Sunday', hint: 'A sweet treat with a tropical name, spelled like the day of the week.', where: 'On the wall opposite the decongestant cough elixir.' }
      ]
    },
    {
      sweep: 't3si6z3gnc6ix4qh6cgmtgnfa', clue: 'Aztec chocolate.mp3',
      riddle: 'Should you put the box of {aztec chocolate|Aztec chocolate}, or the {atomic coffee|explosive coffee maker}, for the kid to enjoy, in the {royal perambulator|royal perambulator}?',
      items: [
        { id: 'aztec chocolate', name: 'Aztec chocolate', hint: 'A box of something sweet, named after an ancient Mexican empire.', where: 'On the fourth shelf.' },
        { id: 'atomic coffee', name: 'Atomic coffee maker', hint: 'The riddle says explosive. The maker’s name comes from the nuclear age.', where: 'On the floor, to the left of the shelf.' },
        { id: 'royal perambulator', name: 'Royal perambulator', hint: 'A perambulator is a pram. This one is fit for a prince or princess.', where: 'Opposite the shelf.' }
      ]
    },
    {
      sweep: '2cngsqh5q4t1ep85y5ky0h49d', clue: 'crowin the bag.mp3',
      riddle: 'We all know a {a crow in the bag|crow in the bag}, is worth a {a hand in two|hand in two}, but would {vitreous china|vitreous china} (when played on a {musical tyre|musical tyre}) sound like a loo?',
      items: [
        { id: 'a crow in the bag', name: 'A crow in the bag', hint: 'A black bird that has ended up inside a bag.', where: 'On a Coke cooler in the hallway.' },
        { id: 'a hand in two', name: 'A hand in two', hint: 'The old saying about a bird in the hand has been twisted. Look for a hand, and count to two.', where: 'On the corner of the crockery shelf.' },
        { id: 'vitreous china', name: 'Vitreous china', hint: 'The glazed ceramic that toilets and basins are made from. The “loo” is your clue.', where: 'Behind glass, on the fourth shelf of the first bay in the aluminium cupboard.' },
        { id: 'musical tyre', name: 'Musical tyre', hint: 'Something round like a tyre that can carry a tune.', where: 'On a wooden table, opposite the crockery shelf.' }
      ]
    },
    {
      sweep: '66yna1yh5e2ig14bmzzf1sn2c', clue: 'hanimex.mp3',
      riddle: 'Do you have any idea what {Hanimexs Movielux|Hanimex\u2019s Movielux}, the {argus previewer|Argus PreViewer}, {scotts mower maker|Scott\u2019s Mower Maker}, and a {porcelain lobster|Porcelain Lobster} have in common?',
      items: [
        { id: 'Hanimexs Movielux', name: 'Hanimex’s Movielux', hint: 'Home movie gear from the days of film. Look for the Hanimex name.', where: 'On the middle wooden box, on top of the camera shelf.' },
        { id: 'argus previewer', name: 'Argus PreViewer', hint: 'A small viewer for checking slides before the show. Look for the Argus name.', where: 'Around the middle of the camera cabinet.' },
        { id: 'scotts mower maker', name: 'Scott’s Mower Maker', hint: 'Something for the lawn, with Scott’s name on it.', where: 'On the wall, to the right of Hanimex\u2019s Movielux.' },
        { id: 'porcelain lobster', name: 'Porcelain lobster', hint: 'A shellfish that will never see a pot, because it is made of china.', where: 'At the bottom of the wooden cabinet, diagonally opposite the camera cabinet.' }
      ]
    },
    {
      sweep: '3hdk0cskxw0apbr2iw8016htb', clue: 'wall climbing baby.mp3',
      riddle: 'Watch the {wall climbing baby|wall climbing baby} as they play {hide and seek|hide and seek}, searching for the {barley|barley} and some {some flumis|Flumi\u2019s} to put them to sleep',
      items: [
        { id: 'wall climbing baby', name: 'Wall climbing baby', hint: 'A little one who has left the floor and is heading up the wall.', where: 'On top of the cabinet, above the Flumi\u2019s sign.' },
        { id: 'hide and seek', name: 'Hide and seek', hint: 'Someone here is hiding, or counting. Look for the game being played.', where: 'In the bottom right-hand corner of the cabinet, next to the Flumi\u2019s sign.' },
        { id: 'barley', name: 'Barley', photo: 'barley.jpg', hint: 'A grain you might find in soup or a soothing drink. Look for the word on a label.', where: 'In the same cabinet as hide and seek.' },
        { id: 'some flumis', name: 'Some Flumi’s', hint: 'An unusual name on a packet. The riddle says they help with sleep.', where: 'Down and to the right of the barley, at about 45 degrees, towards hide and seek.' }
      ]
    },
    {
      sweep: 'r7sd2g426fhbfa2wdh5dfxy5d', clue: 'an odd purves terms.mp3',
      riddle: 'A {a pair of old jugs|pair of old jugs}, an {odd purves terms|odd purves terms}, a {a third more time|third more time}, and a {round thing|round thing that serves}',
      items: [
        { id: 'a pair of old jugs', name: 'A pair of old jugs', hint: 'Two pourers that have seen better days, side by side.', where: 'Third shelf up, in the cabinet to the left of the clock.' },
        { id: 'odd purves terms', name: 'An odd Purves terms', hint: 'Look for the name Purves in print.', where: 'Written on the Bridge Estate sign, to the right of the clock and the solar cabinet.' },
        { id: 'a third more time', name: 'A third more time', hint: 'Something here promises a third extra. Think about what measures time.', where: '' },
        { id: 'round thing', name: 'A round thing', hint: 'It is circular and made for serving.', where: '' }
      ]
    },
    {
      sweep: '20qckty5qi20t39838cq274rc', clue: '',
      riddle: '{three wooden discs|Three wooden discs} are not floating for certain, but {australia in stitches|Australia is in stitches} across from a {cat in a turban|cat in a turban}',
      items: [
        { id: 'three wooden discs', name: 'Three wooden discs', hint: 'Count three flat circles made of timber.', where: 'To the left of the lamp, which is to the left of the typewriter.' },
        { id: 'australia in stitches', name: 'Australia in stitches', aliases: ['embroidered australia'], hint: 'The shape of the country, made with needle and thread.', where: 'On the right shoulder of the jacket on the mannequin.' },
        { id: 'cat in a turban', name: 'Cat in a turban', hint: 'A feline wearing unusual headwear.', where: 'In the cabinet opposite the typewriter, directly to the right of the painting.' }
      ]
    },
    {
      sweep: 'dy113u49qt5s7y38ms7ibmd9b', clue: 'she disinterestedly sat.mp3',
      riddle: 'On fine velvet, {she disinterestedly sat|she disinterestedly sat}, while below {two chambermen|two chambermen chatted}, opposing the {picked pack|pack}',
      items: [
        { id: 'she disinterestedly sat', name: 'She disinterestedly sat', hint: 'A woman seated on velvet, looking thoroughly bored.', where: 'The painting on the wall, behind the light fixture.' },
        { id: 'two chambermen', name: 'Two chambermen', hint: 'They sound like servants, but this pair is the kind once kept under the bed.', where: 'Under the wooden table at the end of the row.' },
        { id: 'picked pack', name: 'The picked pack', hint: 'Opposite the chatting pair, look for a pack.', where: 'On the floor, at the other end of the row from the two chambermen.' }
      ]
    },
    {
      sweep: 'rxgziepm3g4e0fgdgnwwk6efd', clue: '',
      riddle: 'The {viking preserve|Viking preserves}, and {two box of confetti|two box of confetti}, a {drinking urn|drinking urn}, and {confetti|one more confetti}',
      items: [
        { id: 'viking preserve', name: 'Viking preserves', hint: 'Something preserved in a jar or tin, with a Norse name on it.', where: 'On the red carpet, at the bottom of the cabinet.' },
        { id: 'two box of confetti', name: 'Two box of confetti', hint: 'Party paper for throwing, two boxes together.', where: 'To the right of the gramophone horn.' },
        { id: 'drinking urn', name: 'Drinking urn', hint: 'A large vessel for serving drinks to a crowd.', where: 'Opposite the gramophone, to the left of the grandfather clock.' },
        { id: 'confetti', name: 'Confetti', hint: 'The same party paper again, on its own this time.', where: 'Below the red lantern, on top of the cabinet to the left of the gramophone.' }
      ]
    },
    {
      sweep: 'w2bre69ufwyaywn11ch032aaa', clue: '',
      riddle: 'As the {eagle|Eagle soars}, and {beatles|Beatles cascade}, a {gnome all alone|lone gnome} spies a {blue hand|shiny blue hand holding a cone}, he might make his home',
      items: [
        { id: 'eagle', name: 'Eagle', hint: 'A bird of prey with its wings spread.', where: 'In the glass cabinet, on the top shelf, with a small wooden cabinet directly above.' },
        { id: 'beatles', name: 'Beatles', hint: 'Spelled like the band, not the insect.', where: 'On a small wooden shelf, next to the large red pot.' },
        { id: 'gnome all alone', name: 'Gnome all alone', hint: 'A small garden character standing all by himself.', where: 'On the bottom shelf, directly below the Eagle.' },
        { id: 'blue hand', name: 'Blue hand', hint: 'A glossy hand in an unexpected colour, holding something cone-shaped.', where: 'Second shelf up, in the cabinet directly opposite the gnome.' }
      ]
    },
    {
      sweep: 'dimg015tts6u2b30hh0pndaqd', clue: '',
      riddle: 'The {mock ducks|flock of mock ducks} hang out far from the {wooden goanna|wooden goanna}, and halfway across, an {unarmed man|unarmed man wears a red bandana}',
      items: [
        { id: 'mock ducks', name: 'Mock ducks', hint: 'A group of birds that aren’t the real thing.', where: 'On the wall behind Phil.' },
        { id: 'wooden goanna', name: 'Wooden goanna', hint: 'An Australian lizard carved from timber, a long way from the ducks.', where: 'On the floor.' },
        { id: 'unarmed man', name: 'Unarmed man', hint: 'Halfway between the ducks and the lizard, a man in a red bandana is missing something.', where: 'On a small wooden cabinet in the hallway, below the Sons of Australia poster.' }
      ]
    },
    {
      sweep: 'iwaxrd4g1gki6i64y6dk1iuhd', clue: '',
      riddle: 'Whose {whose head|head} is that, to the left of the {hat|hat}, to the right of the {runners|runners}, above the {the plugs|plugs}, in front of the {the hugs|hugs}?',
      items: [
        { id: 'whose head', name: 'Whose head', hint: 'A head with no body, sitting on top of a stick.', where: 'Down the hallway, heading away from the front door.' },
        { id: 'hat', name: 'Hat', hint: 'Headwear on a stick of its own.', where: 'To the right of the head.' },
        { id: 'runners', name: 'Runners', hint: 'Sports shoes, just to the left of the mystery head.', where: 'Top right of the shelf to the left of the hat.' },
        { id: 'the plugs', name: 'The plugs', hint: 'Look below the head for a set of plugs.', where: 'On the floor below the hat.' },
        { id: 'the hugs', name: 'The hugs', hint: 'Behind the head, someone is having a cuddle.', where: 'On the small shelf opposite the wooden shelf with the runners on it.' }
      ]
    },
    {
      sweep: 'aty78ze3y9ddyg8702gmncdma', clue: '',
      riddle: 'When I {dimboola|rowed from Dimboola}, to {egypt etc|Egypt etc}, I wore my {akubra|Akubra} and spied a {tiger|tiger}, a {butterfly|butterfly}, and {horse head|horse head} to end it',
      items: [
        { id: 'dimboola', name: 'Dimboola', hint: 'A town in western Victoria. Look for its name in a newspaper clipping.', where: 'To the right of the table in front of the two wooden shelves.' },
        { id: 'egypt etc', name: 'Egypt etc', hint: 'Pyramids, pharaohs and more. Look for the land of the Nile.', where: 'On the second shelf, opposite Dimboola.' },
        { id: 'akubra', name: 'Akubra', hint: 'The classic Australian bush hat.', where: 'On the red case, to the right of the cross-stitch frame.' },
        { id: 'tiger', name: 'Tiger', hint: 'A big cat with stripes.', where: 'On the wall below the fish paintings, to the left.' },
        { id: 'butterfly', name: 'Butterfly', hint: 'Delicate wings, pinned or painted.', where: 'Next to the Scotch pendant.' },
        { id: 'horse head', name: 'Horse head', hint: 'Just the head of a horse, not the whole animal.', where: 'On the wall, directly above where the two wooden shelves join.' }
      ]
    }
  ];

  // Player names that are not allowed on the leaderboard. Checked after
  // turning look-alike numerals back into letters (4 -> a, 0 -> o, ...).
  // BLOCKED_EXACT must match the whole name, BLOCKED_PARTS anywhere inside it.
  const BLOCKED_EXACT = ['anal', 'ass', 'abo', 'bum', 'cok', 'coc', 'cnt', 'cun', 'cum', 'dik', 'dic', 'dck', 'fgt', 'gai', 'gay', 'god',
    'hoe', 'homo', 'jew', 'jiz', 'kkk', 'kik', 'kyk', 'kys', 'milf', 'mong', 'naz', 'nig', 'ngr', 'nob', 'nonce', 'nude',
    'orgy', 'paki', 'pis', 'poo', 'poof', 'pus', 'rap', 'rape', 'sex', 'sht', 'smut', 'spaz', 'spic', 'tard', 'tit',
    'twt', 'vag', 'wog', 'wtf', 'xxx'];
  const BLOCKED_PARTS = ['fuck', 'fuk', 'fuc', 'fck', 'fuq', 'phuk', 'phuc', 'shit', 'cunt', 'kunt', 'cock', 'dick', 'fag', 'nigg',
    'niga', 'negro', 'kike', 'rapist', 'molest', 'slut', 'skank', 'whore', 'hooker', 'bitch', 'bastard', 'pussy', 'twat',
    'wank', 'tosser', 'bollock', 'piss', 'tits', 'titty', 'boob', 'clit', 'anus', 'arse', 'asshole', 'coon', 'chink',
    'gook', 'beaner', 'darkie', 'honkey', 'jigaboo', 'jiggaboo', 'pikey', 'raghead', 'slanteye', 'wetback', 'towelhead',
    'tranny', 'shemale', 'dyke', 'lesbo', 'poofter', 'queer', 'spastic', 'retard', 'cripple', 'fatso', 'lardass',
    'nazi', 'hitler', 'swastika', 'penis', 'vagin', 'dildo', 'porn', 'hentai', 'incest', 'jailbait', 'lolita', 'nympho',
    'horny', 'boner', 'blowjob', 'handjob', 'rimjob', 'orgasm', 'semen', 'jizz', 'queef', 'paedo', 'pedo'];

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
    return (raw || '').toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 10);
  }

  function isNameAllowed(name) {
    if (!/^[A-Z0-9_]{2,10}$/.test(name)) return false;
    const plain = name.toLowerCase().replace(/_/g, '').replace(/[0134578]/g, (d) => ({ 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b' }[d]));
    return !BLOCKED_EXACT.includes(plain) && !BLOCKED_PARTS.some((part) => plain.includes(part));
  }

  function newPlayerId() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  LEVELS.forEach((level) => {
    const words = {};
    level.riddle.replace(/\{([^|}]+)\|([^}]+)\}/g, (m, id, text) => { words[id] = text; return m; });
    level.items.forEach((item) => {
      item.keys = [item.id, item.name].concat(item.aliases || []).map(norm);
      // The riddle's own words for this object, used as its heading in Hints.
      item.riddleWords = (words[item.id] || item.name).replace(/^./, (ch) => ch.toUpperCase());
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
    started: false,
    muted: (() => { try { return localStorage.getItem('es3d_muted') === '1'; } catch (e) { return false; } })(),
    revealed: false,
    resume: false,
    advancePending: false,
    currentSweep: '',
    arrivedAt: 0,
    photoBase: '/media/3780//',
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
  // The riddle player is unlocked by the first button press, because phones
  // only let a page play sound on elements a real tap has already started.
  // ---------------------------------------------------------------------------
  const clueAudio = new Audio();
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
    soundContext();
    clueAudio.src = silentWavUrl();
    clueAudio.play().catch(() => {});
  }

  let audioCtx = null;
  function soundContext() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {}
    return audioCtx;
  }

  // Each object has a short recording of its name (the mp3 files beside this
  // script). They are fetched and decoded on arrival at a level so they play
  // the instant an object is found.
  const nameSounds = {};
  function preloadLevelNames() {
    const level = LEVELS[state.levelIndex];
    const ctx = soundContext();
    if (!level || !ctx) return;
    level.items.forEach((item) => {
      if (state.found[item.id] || nameSounds[item.id]) return;
      nameSounds[item.id] = fetch(ASSET_BASE + encodeURIComponent(item.id + '.mp3'))
        .then((res) => { if (!res.ok) throw new Error('not found'); return res.arrayBuffer(); })
        .then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
        .catch(() => null);
    });
  }

  // A short, warm note made in code. Used when a name recording is not ready.
  function playDing(ctx) {
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(0.5, now + 0.012);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    out.connect(ctx.destination);
    [[1, 1], [2, 0.3]].forEach(([multiple, level]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(150 * multiple, now);
      osc.frequency.exponentialRampToValueAtTime(205 * multiple, now + 0.09);
      gain.gain.value = level;
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  function playFoundSound(item) {
    const ctx = state.muted ? null : soundContext();
    if (!ctx) return;
    const ready = nameSounds[item.id] || Promise.resolve(null);
    const giveUp = new Promise((resolve) => setTimeout(() => resolve(null), 150));
    Promise.race([ready, giveUp]).then((buffer) => {
      if (!buffer) { playDing(ctx); return; }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    });
  }

  // MPEmbed serves a popup's photo from its media folder under the same file
  // name every time, so asking for it early puts it in the browser's cache.
  const preloaded = {};
  function preloadLevelPhotos() {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    level.items.forEach((item, i) => {
      if (state.found[item.id] || preloaded[item.id]) return;
      preloaded[item.id] = true;
      setTimeout(() => { new Image().src = state.photoBase + (item.photo || item.id + '.jpeg'); }, 400 + i * 150);
    });
  }

  // Keeps the media folder's address in step with what MPEmbed actually uses.
  function notePhotoFolder(img) {
    const src = img ? img.getAttribute('src') || '' : '';
    const cut = src.lastIndexOf('/');
    if (cut > 0) state.photoBase = src.slice(0, cut + 1);
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

  // Always replayed through our own player: MPEmbed's stops answering after
  // its nadir disc has been clicked a couple of times.
  function replayClue() {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    const el = mpeClueElement();
    const src = state.clueSrc[state.levelIndex] || (el && (el.currentSrc || el.src)) ||
      (level.clue ? location.origin + '/media/3780/' + encodeURIComponent(level.clue) : '');
    if (!src) { toast('The riddle audio is not available for this level.'); return; }
    if (el) el.pause();
    clueAudio.src = src;
    clueAudio.currentTime = 0;
    clueAudio.play().catch(() => toast('The riddle audio could not be played.'));
  }

  // ---------------------------------------------------------------------------
  // STYLES
  // Plain sans-serif on solid charcoal panels with cream text, for
  // readability over a busy scene. The accent is the lime of the Eye Spy 3D
  // logo. To restyle the whole game, change the --es variables.
  // ---------------------------------------------------------------------------
  const CSS = `
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
    #panoPlayer i.closetab, #panoPlayer i[class*="times-circle"], #panoPlayer [class*="close"] {
      display: none !important; opacity: 0 !important; position: absolute !important; left: -9999px !important;
      pointer-events: none !important; visibility: hidden !important;
    }
    #customBillboardFullOverlay [class*="close"], .mpe-window-close, .mpe-popup-close, .mpe-modal-close, .mp-mattertag-close {
      transform: scale(3.5) !important; right: 35px !important; top: 35px !important;
      opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; pointer-events: auto !important;
    }
    #customBillboardFull, #customBillboardFull * { transition: none !important; animation: none !important; }
    /* MPEmbed's replay-audio popup is closed by script the moment it opens. */
    body:not(.es3d-show-audio-popup) #customBillboardFull.audio { opacity: 0 !important; }
    /* MPEmbed colours the label's inner text itself, so it is set here too. */
    #customBillboardFull.photo .tag-text-content, #customBillboardFull.photo .tag-text-content * {
      color: ${THEME.barText} !important; text-shadow: none !important;
    }

    /* Tall screens: fill the popup's height and crop the wide photo's sides. */
    @media (orientation: portrait) {
      #customBillboardFull.photo img.tag-image {
        width: 100% !important; height: 72vh !important; aspect-ratio: auto !important;
        object-fit: cover !important; object-position: center !important;
      }
    }

    .es3d {
      --es-sun: #c4e82c; --es-night: #1a1714; --es-cream: #fbf3dc;
      --es-panel: #1a1714; --es-panel-soft: #2d2924; --es-text: #fbf3dc; --es-accent: var(--es-sun); --es-on-accent: #1a1714;
      --es-edge: rgba(251,243,220,0.45); --es-line: rgba(251,243,220,0.25); --es-track: rgba(251,243,220,0.2);
      font-size: calc(clamp(15px, 0.62vw + 9px, 30px) * var(--es-scale, 1)); color: var(--es-text);
    }
    html.es3d-text-l .es3d { --es-scale: 1.2; }
    html.es3d-text-xl .es3d { --es-scale: 1.45; }
    html.es3d-contrast .es3d {
      --es-panel: #000; --es-panel-soft: #1c1c1c; --es-text: #fff; --es-on-accent: #000;
      --es-edge: #fff; --es-line: #fff; --es-track: #666;
    }
    html.es3d-contrast .es3d-card { border-width: 3px; }
    html.es3d-grey { filter: grayscale(1); }
    @font-face {
      font-family: "OpenDyslexic"; font-display: swap;
      src: url('https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic/files/opendyslexic-latin-400-normal.woff2') format('woff2');
    }
    html.es3d-dyslexia .es3d, html.es3d-dyslexia .es3d * {
      font-family: "OpenDyslexic", "Comic Sans MS", "Comic Sans", Verdana, sans-serif !important;
      letter-spacing: 0.04em; word-spacing: 0.14em;
    }
    html.es3d-dyslexia .es3d p, html.es3d-dyslexia #es3d-riddle, html.es3d-dyslexia .es3d-hint, html.es3d-dyslexia .es3d-help-row { line-height: 1.7 !important; }
    @media (prefers-reduced-motion: reduce) { .es3d, .es3d * { animation: none !important; transition: none !important; } }
    .es3d button:focus-visible, .es3d a:focus-visible, .es3d input:focus-visible, .es3d textarea:focus-visible {
      outline: 3px solid var(--es-sun); outline-offset: 2px;
    }
    .es3d, .es3d * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif; }
    .es3d-hidden { display: none !important; }
    .es3d button, .es3d a { cursor: pointer !important; font: inherit; }
    .es3d button *, .es3d label, .es3d label * { cursor: pointer !important; }
    .es3d input, .es3d textarea { cursor: text !important; }
    .es3d input[type="checkbox"] { cursor: pointer !important; }
    .es3d svg { width: 1.7em; height: 1.7em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    /* Screens that sit over the dark cover photo: yellow and cream on dark. */
    #es3d-dim, #es3d-cover, #es3d-welcome, #es3d-video { position: fixed; inset: 0; }
    #es3d-dim { background: rgba(0,0,0,0.55); z-index: 2147483640; }
    #es3d-cover {
      background: #111 url('${ASSET_BASE}Load_image.webp') center / cover no-repeat;
      z-index: 2147483641; animation: es3d-punch 12s infinite alternate ease-in-out;
    }
    #es3d-cover::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.45); }
    @keyframes es3d-punch { from { transform: scale(1); } to { transform: scale(1.08); } }
    #es3d-loading {
      position: fixed; left: 0; right: 0; top: 46%; z-index: 2147483642; text-align: center; font-size: 1.4em; color: var(--es-cream);
      animation: es3d-fade 2s infinite ease-in-out;
    }
    @keyframes es3d-fade { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

    #es3d-welcome {
      z-index: 2147483643; display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 1.5em; text-align: center; overflow-y: auto; color: var(--es-cream);
    }
    #es3d-welcome h1 { margin: 0 0 0.3em; font-size: 2.8em; color: var(--es-sun); text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
    #es3d-welcome p { margin: 0 0 1.3em; font-size: 1.25em; text-shadow: 0 1px 3px rgba(0,0,0,0.8); max-width: 30em; }
    #es3d-name-row { margin: 0 0 1.4em; display: flex; flex-direction: column; align-items: center; gap: 0.5em; }
    #es3d-name {
      width: 11em; padding: 0.35em 0.4em; font-size: 1.6em; font-weight: 700; letter-spacing: 0.08em; text-align: center;
      text-transform: uppercase; color: var(--es-cream); background: rgba(0,0,0,0.6); border: 2px solid var(--es-sun); border-radius: 0.3em;
    }
    #es3d-name::placeholder { color: rgba(251,243,220,0.35); }
    #es3d-name-note { min-height: 1.3em; font-size: 0.9em; color: var(--es-sun); }

    /* Buttons: burgundy on the yellow panels, yellow on the dark screens. */
    .es3d-btn {
      display: inline-block; padding: 0.6em 1.5em; font-size: 1.2em; font-weight: 700; text-decoration: none;
      background: var(--es-accent); color: var(--es-on-accent); border: 2px solid var(--es-accent); border-radius: 0.35em; margin: 0.3em;
    }
    .es3d-btn:hover { filter: brightness(1.25); }
    .es3d-btn.es3d-quiet { background: transparent; color: var(--es-text); font-size: 1em; }
    .es3d-btn.es3d-small { font-size: 0.95em; padding: 0.45em 1em; margin: 0.2em 0; }
    #es3d-welcome .es3d-btn, #es3d-video .es3d-btn {
      background: var(--es-sun); color: var(--es-night); border-color: var(--es-sun); box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    #es3d-welcome .es3d-btn:hover, #es3d-video .es3d-btn:hover { filter: brightness(1.1); }
    #es3d-welcome .es3d-btn.es3d-quiet, #es3d-video .es3d-btn.es3d-quiet { background: rgba(0,0,0,0.5); color: var(--es-cream); border-color: var(--es-cream); box-shadow: none; }

    #es3d-video { background: #000; z-index: 2147483644; }
    #es3d-video-frame, #es3d-video iframe, #es3d-video-file { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
    #es3d-video-file { display: block !important; visibility: visible !important; opacity: 1 !important; left: 0 !important; background: #000; pointer-events: auto !important; }
    #es3d-video-skip { position: absolute; right: 1.5em; bottom: 1.5em; z-index: 2; }

    .es3d-card { background: var(--es-panel); border: 2px solid var(--es-edge); border-radius: 0.45em; box-shadow: 0 6px 24px rgba(0,0,0,0.55); }
    #es3d-prompt {
      position: fixed; left: 50%; bottom: 14%; transform: translateX(-50%); z-index: 9000; width: min(27em, calc(100vw - 32px));
      padding: 1.1em; text-align: center;
    }
    #es3d-prompt p { margin: 0 0 0.7em; font-size: 1.15em; font-weight: 600; }

    #es3d-hud { position: fixed; inset: 0; z-index: 9000; pointer-events: none; transition: opacity 0.2s ease; }
    body.es3d-popup-open #es3d-hud, body.es3d-popup-open #es3d-panel, body.es3d-popup-open #es3d-prompt,
    body.es3d-popup-open #es3d-corner { opacity: 0; pointer-events: none !important; }
    body.es3d-popup-open #es3d-hud *, body.es3d-popup-open #es3d-panel *, body.es3d-popup-open #es3d-corner * { pointer-events: none !important; }
    #es3d-top {
      position: absolute; top: max(10px, env(safe-area-inset-top)); left: 10px; width: min(31em, calc(100vw - 20px));
      padding: 0.6em 0.8em 0.7em; pointer-events: auto;
    }
    #es3d-status { display: flex; justify-content: space-between; align-items: baseline; gap: 0.7em; font-weight: 700; }
    #es3d-timer { font-variant-numeric: tabular-nums; }
    #es3d-bar { height: 0.5em; margin: 0.45em 0; background: var(--es-track); border-radius: 0.25em; overflow: hidden; }
    #es3d-bar-fill { height: 100%; width: 0; background: var(--es-accent); transition: width 0.4s ease; }
    #es3d-riddle {
      display: block; width: 100%; padding: 0; margin: 0; text-align: left; background: none; border: none; color: var(--es-text);
      font-size: 1.2em; line-height: 1.35;
    }
    #es3d-riddle.es3d-collapsed { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #es3d-riddle .es3d-item { font-weight: 800; color: var(--es-accent); }
    /* Found words are shown as a solid highlight, like the found pills below. */
    #es3d-riddle .es3d-item.es3d-found {
      background: var(--es-accent); color: var(--es-on-accent); padding: 0.02em 0.3em; border-radius: 0.2em;
      -webkit-box-decoration-break: clone; box-decoration-break: clone;
    }
    #es3d-slots { display: flex; gap: 0.4em; margin-top: 0.55em; flex-wrap: wrap; }
    .es3d-slot {
      min-width: 2.1em; height: 2.1em; padding: 0 0.7em; display: inline-flex; align-items: center; justify-content: center; gap: 0.4em;
      font-size: 0.95em; font-weight: 700; border-radius: 1.05em; border: 2px dashed var(--es-text); color: var(--es-text); background: transparent;
    }
    button.es3d-slot:hover { background: var(--es-panel-soft); }
    .es3d-slot.es3d-found { border: 2px solid var(--es-accent); background: var(--es-accent); color: var(--es-on-accent); padding-left: 0.3em; }
    .es3d-tick {
      width: 1.5em; height: 1.5em; flex: 0 0 auto; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
      background: var(--es-on-accent); color: var(--es-accent); font-weight: 900; line-height: 1;
    }
    .es3d-tick.es3d-on-panel { background: var(--es-accent); color: var(--es-on-accent); }

    #es3d-controls {
      position: absolute; left: 50%; bottom: max(12px, env(safe-area-inset-bottom)); transform: translateX(-50%);
      display: flex; gap: 0.25em; padding: 0.3em; pointer-events: auto; max-width: calc(100vw - 16px);
    }
    #es3d-controls button {
      min-width: 4.6em; min-height: 44px; padding: 0.35em 0.5em; display: flex; flex-direction: column; align-items: center; gap: 0.1em;
      font-size: 0.85em; font-weight: 600; color: var(--es-text); background: transparent; border: none; border-radius: 0.35em; white-space: nowrap;
    }
    #es3d-controls button:hover:not(:disabled) { background: var(--es-accent); color: var(--es-on-accent); }
    #es3d-controls button:disabled { opacity: 0.3; cursor: default !important; }

    #es3d-corner { position: fixed; right: 12px; bottom: max(56px, calc(env(safe-area-inset-bottom) + 56px)); z-index: 9000; display: flex; flex-direction: column; gap: 0.5em; transition: opacity 0.2s ease; }
    #es3d-corner button {
      width: 3em; height: 3em; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; padding: 0;
      color: var(--es-text); background: var(--es-panel); border: 2px solid var(--es-edge); border-radius: 50%; box-shadow: 0 4px 14px rgba(0,0,0,0.5);
    }
    #es3d-corner button:hover, #es3d-corner button.es3d-muted { background: var(--es-accent); color: var(--es-on-accent); border-color: var(--es-on-accent); }

    #es3d-return {
      position: fixed; left: 50%; bottom: 6.6em; transform: translateX(-50%); z-index: 9700; display: flex; align-items: center; gap: 0.6em;
      padding: 0.55em 1.1em; font-size: 1.1em; font-weight: 800; color: var(--es-on-accent); background: var(--es-accent);
      border: 2px solid var(--es-on-accent); border-radius: 2em; box-shadow: 0 4px 18px rgba(0,0,0,0.55); white-space: nowrap;
    }
    #es3d-return b {
      min-width: 1.7em; height: 1.7em; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;
      background: var(--es-on-accent); color: var(--es-accent);
    }
    body.es3d-popup-open #es3d-return { opacity: 0; pointer-events: none !important; }

    #es3d-panel {
      position: fixed; inset: 0; z-index: 9500; display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.55);
    }
    #es3d-panel-card { position: relative; width: min(34em, 100%); max-height: min(90vh, 100%); overflow-y: auto; padding: 1.1em 1.1em 1em; }
    #es3d-panel-close {
      position: absolute; top: 0.2em; right: 0.2em; width: 1.9em; height: 1.9em; font-size: 1.7em; font-weight: 700; line-height: 1;
      color: var(--es-text); background: none; border: none;
    }
    #es3d-panel h2 { margin: 0 2em 0.45em 0; font-size: 1.5em; }
    #es3d-panel h3 { margin: 1em 0 0.35em; font-size: 1.15em; }
    #es3d-panel p { margin: 0 0 0.6em; line-height: 1.45; }
    #es3d-panel ol { margin: 0 0 0.7em 1.3em; padding: 0; line-height: 1.5; }
    #es3d-panel .es3d-note { font-size: 0.88em; opacity: 0.85; }
    #es3d-panel .es3d-btn { font-size: 1em; padding: 0.5em 1.1em; margin: 0.25em 0.4em 0.25em 0; }
    .es3d-help-row { display: flex; gap: 0.8em; align-items: flex-start; padding: 0.55em 0.7em; margin: 0 0 0.4em; background: var(--es-panel-soft); border-radius: 0.4em; line-height: 1.4; }
    .es3d-help-row b, .es3d-help-card b { display: block; color: var(--es-accent); }
    .es3d-help-num, .es3d-help-icon {
      flex: 0 0 auto; width: 2.1em; height: 2.1em; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;
    }
    .es3d-help-num { background: var(--es-accent); color: var(--es-on-accent); font-weight: 900; }
    .es3d-help-icon { color: var(--es-accent); border: 2px solid var(--es-accent); }
    .es3d-help-icon svg { width: 1.3em; height: 1.3em; }
    .es3d-help-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(9em, 1fr)); gap: 0.5em; margin: 0 0 0.4em; }
    .es3d-help-card { padding: 0.7em; background: var(--es-panel-soft); border-radius: 0.4em; line-height: 1.4; }
    .es3d-help-card svg { display: block; width: 2em; height: 2em; margin-bottom: 0.3em; color: var(--es-accent); }
    #es3d-panel .es3d-help-title { color: var(--es-accent); }
    .es3d-help-intro { font-size: 1.1em; }
    #es3d-rewatch { margin-top: 0.6em !important; }
    .es3d-section { padding: 0.8em 0 0.1em; margin-top: 0.8em; border-top: 2px solid var(--es-line); }
    .es3d-section h3 { margin-top: 0 !important; }

    .es3d-hint-card { padding: 0.7em 0.8em; margin: 0 0 0.6em; background: var(--es-panel-soft); border-radius: 0.4em; }
    .es3d-hint-title { display: flex; justify-content: space-between; align-items: center; gap: 0.6em; font-size: 1.1em; font-weight: 800; margin-bottom: 0.35em; }
    .es3d-hint-title span { font-size: 0.8em; font-weight: 400; }
    .es3d-hint-card.es3d-found .es3d-hint-title { margin-bottom: 0; }
    .es3d-hint { margin: 0 0 0.5em; line-height: 1.4; }
    .es3d-hint b { display: block; font-size: 0.75em; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.85; }

    .es3d-list-level { padding: 0.55em 0; border-top: 2px solid var(--es-line); display: flex; gap: 0.7em; align-items: flex-start; }
    .es3d-list-level.es3d-current .es3d-list-title { text-decoration: underline; }
    .es3d-list-title { flex: 0 0 5em; font-weight: 800; padding-top: 0.2em; }
    .es3d-list-items { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4em; }
    .es3d-list-go { flex: 0 0 auto; padding: 0.3em 0.9em; font-weight: 700; color: var(--es-on-accent); background: var(--es-accent); border: none; border-radius: 0.3em; }

    table.es3d-board { width: 100%; border-collapse: collapse; font-size: 0.95em; font-variant-numeric: tabular-nums; }
    table.es3d-board th { text-align: left; font-size: 0.85em; font-weight: 600; padding: 0.3em 0.4em; }
    table.es3d-board td { padding: 0.4em; border-top: 1px solid var(--es-line); }
    table.es3d-board tr.es3d-me td { font-weight: 800; background: var(--es-panel-soft); }
    .es3d-stats { display: flex; gap: 0.5em; margin: 0 0 0.8em; }
    .es3d-stat { flex: 1; padding: 0.5em 0.4em; text-align: center; background: var(--es-panel-soft); border-radius: 0.4em; }
    .es3d-stat b { display: block; font-size: 1.4em; font-variant-numeric: tabular-nums; }
    .es3d-stat span { font-size: 0.82em; }
    #es3d-panel input[type="email"], #es3d-panel input[type="text"], #es3d-panel textarea {
      width: 100%; padding: 0.55em; margin: 0 0 0.5em; font: inherit; font-size: max(16px, 1em); color: var(--es-night);
      background: var(--es-cream); border: 2px solid var(--es-night); border-radius: 0.3em;
    }
    #es3d-panel textarea { min-height: 4.5em; resize: vertical; }
    .es3d-share-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9.5em, 1fr)); gap: 0.5em; margin: 0 0 0.8em; }
    .es3d-share-grid .es3d-btn { margin: 0 !important; display: flex; align-items: center; gap: 0.6em; padding-left: 0.8em !important; text-align: left; }
    .es3d-share-grid .es3d-btn svg { flex: 0 0 auto; color: var(--es-accent); }
    .es3d-consent { display: flex; gap: 0.6em; align-items: flex-start; margin: 0 0 0.6em; font-size: 0.92em; line-height: 1.4; }
    .es3d-consent input { width: 1.3em; height: 1.3em; margin-top: 0.1em; flex: 0 0 auto; accent-color: var(--es-accent); }

    #es3d-toast {
      position: fixed; left: 50%; bottom: 10.5em; transform: translateX(-50%); z-index: 9600; max-width: calc(100vw - 32px);
      padding: 0.6em 1.2em; font-size: 1.15em; font-weight: 700; color: var(--es-on-accent); background: var(--es-accent);
      border: 2px solid var(--es-on-accent); border-radius: 0.4em; box-shadow: 0 4px 18px rgba(0,0,0,0.5);
      opacity: 0; pointer-events: none; transition: opacity 0.25s ease; text-align: center;
    }
    #es3d-toast.es3d-show { opacity: 1; }

    /* Tells the player a panel has more below than fits on screen. */
    #es3d-panel-card { scrollbar-width: auto; scrollbar-color: var(--es-accent) var(--es-track); }
    #es3d-panel-card::-webkit-scrollbar { width: 14px; }
    #es3d-panel-card::-webkit-scrollbar-track { background: var(--es-track); }
    #es3d-panel-card::-webkit-scrollbar-thumb { background: var(--es-accent); border-radius: 7px; }
    #es3d-more {
      position: sticky; bottom: -1em; margin: 0 -1.1em -1em; padding: 1.6em 0 0.6em; text-align: center; font-weight: 800;
      background: linear-gradient(to bottom, transparent, var(--es-panel) 55%); pointer-events: none;
    }
    #es3d-more span { display: inline-block; padding: 0.25em 0.9em; border-radius: 1em; background: var(--es-accent); color: var(--es-on-accent); }

    @media (max-width: 560px) {
      #es3d-welcome h1 { font-size: 2em; }
      #es3d-controls { gap: 0; }
      #es3d-controls button { min-width: 3.6em; padding: 0.35em 0.2em; }
      #es3d-corner { bottom: 5.8em; }
      #es3d-return { bottom: 10.5em; }
      #es3d-toast { bottom: 14.5em; }
    }
  `;

  const ICONS = {
    back: '<path d="M11 6l-6 6 6 6M19 6l-6 6 6 6"/>',
    skip: '<path d="M13 6l6 6-6 6M5 6l6 6-6 6"/>',
    riddle: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"/>',
    hints: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 4M12 17h.01"/>',
    list: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',
    share: '<path d="M12 15V4M8 8l4-4 4 4M5 12v7h14v-7"/>',
    facebook: '<path fill="currentColor" stroke="none" d="M9 8H6v4h3v12h5V12h3.6l.4-4h-4V6.3c0-1 .2-1.3 1.2-1.3H18V0h-3.8C10.6 0 9 1.6 9 4.6V8z"/>',
    discord: '<path d="M7 6.5c3-1.3 7-1.3 10 0 1.8 2.8 2.7 6 2.5 9.8-1.3 1-2.7 1.7-4 2l-1-1.8M7 6.5C5.2 9.3 4.3 12.5 4.5 16.3c1.3 1 2.7 1.7 4 2l1-1.8M8.5 16.5c2.2 1 4.8 1 7 0"/><circle cx="9.5" cy="12" r="1.2"/><circle cx="14.5" cy="12" r="1.2"/>',
    sms: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-.8.8c-.9-.4-1.6-1.1-2-2l.8-.8-1-2z"/>',
    x: '<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    reddit: '<circle cx="12" cy="14" r="6.5"/><circle cx="9.5" cy="13" r="1"/><circle cx="14.5" cy="13" r="1"/><path d="M9.5 16.5c1.5 1 3.5 1 5 0M12 7.5l1-4 3.5.8"/><circle cx="18" cy="4.5" r="1.3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3.5"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',
    soundOff: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    mouse: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v3"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7 14h10"/>',
    touch: '<path d="M9 11V5.5a1.5 1.5 0 013 0V11m0-1.5a1.5 1.5 0 013 0V11m0-.5a1.5 1.5 0 013 0V15a6 6 0 01-6 6h-1a5 5 0 01-4.2-2.3L6 14.5a1.5 1.5 0 012.5-1.6l.5.6"/>',
    access: '<circle cx="12" cy="4.5" r="1.7"/><path d="M5 9h14M12 9v6M12 15l-3.5 5.5M12 15l3.5 5.5"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

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

  // The browser tab's icon and name, when the game is opened on its own page.
  // (Embedded in another site, the tab shows that site's icon instead.)
  const TAB_ICON = 'data:image/png;base64,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';

  function setTabIcon() {
    document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((node) => node.remove());
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = TAB_ICON;
    document.head.appendChild(link);
    document.title = 'Eye Spy 3D';
  }

  function buildUI() {
    setTabIcon();
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    ui.dim = el('div', 'es3d-dim');
    ui.cover = el('div', 'es3d-cover');
    ui.loading = el('div', 'es3d-loading', 'Opening the store…');
    ui.loading.classList.add('es3d-hidden');
    ui.welcome = el('div', 'es3d-welcome');
    ui.prompt = el('div', 'es3d-prompt', '<p>Welcome to Eye Spy 3D<br>Watch the short intro and the hunt begins.</p><button class="es3d-btn" type="button" id="es3d-prompt-go">Watch the intro</button>');
    ui.prompt.classList.add('es3d-card', 'es3d-hidden');
    const control = (act, iconName, label, hint) =>
      '<button type="button" data-act="' + act + '" title="' + hint + '" aria-label="' + hint + '">' + icon(iconName) + '<span>' + label + '</span></button>';
    ui.hud = el('div', 'es3d-hud', `
      <div id="es3d-top" class="es3d-card">
        <div id="es3d-status"><span id="es3d-level"></span><span id="es3d-count"></span><span id="es3d-timer">00:00</span></div>
        <div id="es3d-bar"><div id="es3d-bar-fill"></div></div>
        <button id="es3d-riddle" type="button" aria-label="Riddle, tap to shrink or expand"></button>
        <div id="es3d-slots"></div>
      </div>
      <div id="es3d-controls" class="es3d-card">
        ${control('prev', 'back', 'Back', 'Go back a level')}
        ${control('riddle', 'riddle', 'Riddle', 'Hear the riddle again')}
        ${control('hints', 'hints', 'Hints', 'Hints for each object in this riddle')}
        ${control('list', 'list', 'Found', 'Everything found so far')}
        ${control('share', 'share', 'Share', 'Share the game')}
        ${control('next', 'skip', 'Skip', 'Skip to the next level')}
      </div>`);
    ui.hud.classList.add('es3d-hidden');
    ui.panel = el('div', 'es3d-panel', '<div id="es3d-panel-card" class="es3d-card"><button id="es3d-panel-close" type="button" aria-label="Close">&times;</button><div id="es3d-panel-body"></div><div id="es3d-more" class="es3d-hidden"><span>More below &#8595;</span></div></div>');
    ui.panel.classList.add('es3d-hidden');
    ui.returnPill = el('button', 'es3d-return');
    ui.returnPill.type = 'button';
    ui.returnPill.classList.add('es3d-hidden');
    ui.returnPill.addEventListener('click', () => { const level = returnTarget; hideReturnPill(); goToLevel(level); });
    ui.corner = el('div', 'es3d-corner', '<button type="button" data-corner="access" title="Accessibility settings" aria-label="Accessibility settings">' + icon('access') + '</button>' +
      '<button type="button" data-corner="mute"></button>' +
      '<button type="button" data-corner="help" title="How to play" aria-label="How to play">' + icon('help') + '</button>');
    ui.corner.classList.add('es3d-hidden');
    ui.toast = el('div', 'es3d-toast');
    ui.toast.setAttribute('role', 'status');

    document.getElementById('es3d-prompt-go').addEventListener('click', () => {
      unlockAudio();
      state.phase = 'intro';
      renderHud();
      playIntroVideo(() => goToLevel(0));
    });
    ui.corner.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-corner]');
      if (!btn) return;
      if (btn.dataset.corner === 'mute') setMuted(!state.muted);
      else if (btn.dataset.corner === 'access') showAccessPanel();
      else showHelpPanel();
    });
    // A "?" slot opens the hints for that object.
    document.getElementById('es3d-slots').addEventListener('click', (e) => {
      const slot = e.target.closest('button[data-slot]');
      if (slot) showHintPanel(Number(slot.dataset.slot));
    });
    applyAccess();
    setMuted(state.muted);
    setInterval(applyMute, 700);
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
      else if (act === 'riddle') replayClue();
      else if (act === 'hints') showHintPanel();
      else if (act === 'list') showListPanel();
      else if (act === 'share') shareGame();
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

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    }
    return legacyCopy(text);
  }

  // Works inside an embedded frame, where the modern clipboard is often blocked.
  function legacyCopy(text) {
    const box = document.createElement('textarea');
    box.value = text;
    box.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(box);
    box.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (e) {}
    box.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  }

  // Our own menu, in the order people actually pass a game around, instead of
  // the browser's share sheet (which on a computer offers Notes and Reminders).
  function shareGame() {
    const url = SHARE_URL || document.referrer || location.href;
    const message = 'Can you find everything hidden in the store? Play Eye Spy 3D: ' + url;
    const u = encodeURIComponent(url);
    const m = encodeURIComponent(message);
    const links = [
      ['Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u, 'facebook'],
      ['Discord', 'copy:Link copied. Paste it into any Discord chat.', 'discord'],
      ['Text message', 'sms:?&body=' + m, 'sms'],
      ['Email', 'mailto:?subject=' + encodeURIComponent('Eye Spy 3D') + '&body=' + m, 'email'],
      ['WhatsApp', 'https://wa.me/?text=' + m, 'whatsapp'],
      ['X', 'https://twitter.com/intent/tweet?text=' + m, 'x'],
      ['Reddit', 'https://www.reddit.com/submit?url=' + u + '&title=' + encodeURIComponent('Eye Spy 3D'), 'reddit'],
      ['Copy link', 'copy:Link copied.', 'copy']
    ];
    if (navigator.share) links.push(['More\u2026', 'native:', 'more']);
    openPanel(`
      <h2>Share Eye Spy 3D</h2>
      <p>Send the game to someone who would enjoy the hunt.</p>
      <div class="es3d-share-grid">
        ${links.map(([label, target, iconName], i) => target.startsWith('copy:') || target.startsWith('native:')
          ? '<button class="es3d-btn es3d-quiet" type="button" data-share="' + i + '">' + icon(iconName) + esc(label) + '</button>'
          : '<a class="es3d-btn es3d-quiet" href="' + esc(target) + '"' + (/^https:/.test(target) ? ' target="_blank" rel="noopener"' : '') + '>' + icon(iconName) + esc(label) + '</a>').join('')}
      </div>
      <input type="text" id="es3d-share-link" readonly value="${esc(url)}" aria-label="Link to the game">`);
    document.getElementById('es3d-panel-body').querySelectorAll('button[data-share]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = links[Number(btn.dataset.share)][1];
        if (target.startsWith('native:')) {
          navigator.share({ title: 'Eye Spy 3D', text: 'Can you find everything hidden in the store?', url: url }).catch(() => {});
          return;
        }
        copyText(url).then(() => toast(target.slice(5))).catch(() => {
          document.getElementById('es3d-share-link').select();
          toast('Copy the link shown below.');
        });
      });
    });
  }

  function renderWelcome() {
    const saved = loadSave();
    const canResume = !!(saved && saved.started && !saved.finished);
    const savedName = saved && saved.name ? saved.name : '';
    ui.welcome.innerHTML = `
      <h1>Welcome to Eye Spy 3D</h1>
      <p>Listen to each riddle, then look around and click every object it describes. Please play with your audio on.</p>
      <div id="es3d-name-row">
        <label for="es3d-name">Player name for the leaderboard (up to 10 letters or numbers)</label>
        <input id="es3d-name" type="text" maxlength="10" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(savedName)}" placeholder="YOUR NAME">
        <div id="es3d-name-note"></div>
      </div>
      <div>
        ${canResume
          ? '<button class="es3d-btn" type="button" data-start="resume">Continue where you left off</button><button class="es3d-btn es3d-quiet" type="button" data-start="new">Start a new game</button>'
          : '<button class="es3d-btn" type="button" data-start="new">Start now</button>'}
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
      note.textContent = name.length < 2 ? 'Use at least 2 letters or numbers.' : 'Please pick a different name.';
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
    state.started = true;
    ui.welcome.remove();
    ui.loading.classList.remove('es3d-hidden');
    checkReadyToReveal();
  }

  // --- SOUND ---
  const MUTE_KEY = 'es3d_muted';
  let introPlayer = null;

  // While muted, any sound MPEmbed starts is silenced at the very moment it
  // starts, so nothing is heard even briefly. Two hooks cover both ways a
  // sound can begin: a script calling play(), and the browser starting an
  // element by itself.
  const nativePlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (state.muted) this.muted = true;
    return nativePlay.apply(this, arguments);
  };
  document.addEventListener('play', (e) => {
    if (state.muted && e.target instanceof HTMLMediaElement) e.target.muted = true;
  }, true);

  // One switch for every sound: the riddle, MPEmbed's own players and the
  // intro video. Also re-applied on a timer, as a backstop and to turn the
  // sound back on everywhere after unmuting.
  function applyMute() {
    clueAudio.muted = state.muted;
    document.querySelectorAll('audio, video').forEach((node) => { node.muted = state.muted; });
    try {
      if (introPlayer && introPlayer.mute) { if (state.muted) introPlayer.mute(); else introPlayer.unMute(); }
    } catch (e) {}
  }

  function setMuted(muted) {
    state.muted = muted;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
    applyMute();
    const btn = ui.corner.querySelector('[data-corner="mute"]');
    btn.innerHTML = icon(muted ? 'soundOff' : 'riddle');
    btn.classList.toggle('es3d-muted', muted);
    btn.title = muted ? 'Sound is off. Click to turn it on.' : 'Sound is on. Click to mute.';
    btn.setAttribute('aria-label', btn.title);
    btn.setAttribute('aria-pressed', String(muted));
  }

  // --- INTRO VIDEO (own overlay, no MPEmbed involvement) ---
  // First watched from the lobby, where finishing or skipping it takes the
  // player to level 1. It can be watched again at any time from Help.
  function playIntroVideo(onDone) {
    const overlay = el('div', 'es3d-video', '<div id="es3d-video-frame"></div><button id="es3d-video-skip" class="es3d-btn es3d-quiet" type="button">Skip &gt;</button>');
    let done = false;
    let fallbackTimer = null;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(fallbackTimer);
      introPlayer = null;
      overlay.remove();
      onDone();
    };
    overlay.querySelector('#es3d-video-skip').addEventListener('click', finish);

    if (INTRO_VIDEO_FILE) {
      const video = document.createElement('video');
      video.id = 'es3d-video-file';
      video.src = ASSET_BASE + encodeURIComponent(INTRO_VIDEO_FILE);
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = state.muted;
      video.addEventListener('ended', finish);
      // If our own file will not play, fall back to YouTube rather than stall.
      video.addEventListener('error', () => { video.remove(); if (YOUTUBE_VIDEO_ID) playFromYouTube(); else finish(); });
      overlay.querySelector('#es3d-video-frame').appendChild(video);
      return;
    }
    if (!YOUTUBE_VIDEO_ID) { finish(); return; }
    playFromYouTube();

    function playFromYouTube() {

      // If the YouTube API never loads, do not leave the player stuck.
      fallbackTimer = setTimeout(() => {
        console.warn('Intro video API did not load after 90s, continuing without it.');
        finish();
      }, 90000);

      function createPlayer() {
        clearTimeout(fallbackTimer);
        if (done) return;
        introPlayer = new YT.Player(overlay.querySelector('#es3d-video-frame'), {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: applyMute,
            onStateChange: (event) => { if (event.data === YT.PlayerState.ENDED) finish(); },
            onError: (event) => { console.warn('Intro video error, code:', event.data); finish(); }
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
    ui.corner.classList.toggle('es3d-hidden', !inGame && state.phase !== 'lobby');
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
      slots.innerHTML = level.items.map((item, i) => state.found[item.id]
        ? '<span class="es3d-slot es3d-found"><span class="es3d-tick">&#10003;</span>' + esc(item.name) + '</span>'
        : '<button type="button" class="es3d-slot" data-slot="' + i + '" title="Hints for this object" aria-label="Not found yet. Open hints for object ' + (i + 1) + '">?</button>').join('');
    } else {
      riddle.innerHTML = foundCount() === TOTAL_ITEMS ? 'You found everything.' : 'You have reached the end. Go back to find what you missed.';
      slots.innerHTML = '';
    }

    const controls = document.getElementById('es3d-controls');
    controls.querySelector('[data-act="prev"]').disabled = state.levelIndex === 0;
    controls.querySelector('[data-act="next"]').disabled = !level;
    controls.querySelector('[data-act="riddle"]').disabled = !level;
    controls.querySelector('[data-act="hints"]').disabled = !level;
    fitTopPanel();
  }

  // On wide screens the riddle panel is kept to the left of the bottom bar, so
  // its right edge lines up with the bar's left edge and the middle of the
  // view stays clear. On narrow screens it uses the full width.
  function fitTopPanel() {
    const top = document.getElementById('es3d-top');
    const bar = document.getElementById('es3d-controls');
    if (!top || !bar || ui.hud.classList.contains('es3d-hidden')) return;
    const barLeft = bar.getBoundingClientRect().left;
    top.style.width = window.innerWidth > 900 && barLeft > 260 ? Math.round(barLeft - 10) + 'px' : '';
  }
  window.addEventListener('resize', fitTopPanel);

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
    const card = document.getElementById('es3d-panel-card');
    document.getElementById('es3d-panel-body').innerHTML = html;
    ui.panel.classList.remove('es3d-hidden');
    card.scrollTop = 0;
    card.onscroll = updateMoreCue;
    updateMoreCue();
  }

  // "More below" stays pinned to the bottom of a panel until it is scrolled to the end.
  function updateMoreCue() {
    const card = document.getElementById('es3d-panel-card');
    const more = card.scrollHeight - card.clientHeight - card.scrollTop > 24;
    document.getElementById('es3d-more').classList.toggle('es3d-hidden', !more);
  }

  function closePanel() {
    ui.panel.classList.add('es3d-hidden');
  }

  function hintSteps(item) {
    const steps = [{ label: 'A nudge', text: item.hint }];
    if (item.where) steps.push({ label: 'Where to look', text: item.where });
    steps.push({ label: 'What it is', text: item.reveal || item.name + '.' });
    return steps;
  }

  // One card per object in the riddle, in riddle order. Each object has its
  // own ladder of hints, revealed one press at a time: a nudge, where to look,
  // then its name. The player still has to find and click it.
  function showHintPanel(focusIndex) {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    const card = document.getElementById('es3d-panel-card');
    const keepScroll = ui.panel.classList.contains('es3d-hidden') ? 0 : card.scrollTop;
    const cards = level.items.map((item, i) => {
      const title = esc(item.riddleWords);
      if (state.found[item.id]) {
        return '<div class="es3d-hint-card es3d-found"><div class="es3d-hint-title">' + title + '<span class="es3d-tick es3d-on-panel" aria-label="found">&#10003;</span></div></div>';
      }
      const steps = hintSteps(item);
      const stage = Math.min(state.hintStage[item.id] || 0, steps.length);
      return `<div class="es3d-hint-card" data-card="${i}">
        <div class="es3d-hint-title">${title}<span>${stage} of ${steps.length} hints shown</span></div>
        ${steps.slice(0, stage).map((step, n) => '<div class="es3d-hint"><b>Hint ' + (n + 1) + ': ' + esc(step.label) + '</b>' + esc(step.text) + '</div>').join('')}
        ${stage < steps.length
          ? '<button class="es3d-btn es3d-small" type="button" data-hint="' + i + '">Show hint ' + (stage + 1) + ' of ' + steps.length + '</button>'
          : '<div class="es3d-note">That is every hint. Now find it and click it.</div>'}
      </div>`;
    }).join('');
    openPanel(`
      <h2>Hints for level ${state.levelIndex + 1}</h2>
      <p class="es3d-note">This riddle hides ${level.items.length} objects. Each has its own hints. Hints used so far: ${state.hintsUsed}.</p>
      ${cards}`);
    card.scrollTop = keepScroll;
    const focus = typeof focusIndex === 'number' ? card.querySelector('[data-card="' + focusIndex + '"]') : null;
    if (focus) card.scrollTop = Math.max(0, focus.offsetTop - 16);
    updateMoreCue();
    document.getElementById('es3d-panel-body').querySelectorAll('button[data-hint]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = level.items[Number(btn.dataset.hint)];
        state.hintStage[item.id] = (state.hintStage[item.id] || 0) + 1;
        state.hintsUsed++;
        save();
        showHintPanel();
      });
    });
  }

  function showHelpPanel() {
    const controls = [
      ['mouse', 'Mouse', 'Click and drag to look around. Scroll to zoom.'],
      ['keyboard', 'Keyboard', 'J and L pan left and right. I and K pan up and down.'],
      ['touch', 'Touch', 'Swipe to look around. Pinch to zoom.']
    ];
    const steps = [
      ['Listen', 'Each riddle is read aloud and written at the top of the screen. You can also look down and read it on the floor. To hear it again, press Riddle in the bar at the bottom of the screen.'],
      ['Find', 'If an object looks like what you think the riddle describes, click or tap it. You\u2019ll receive a popup notification every time you correctly identify and find an object.'],
      ['Stuck?', 'Press Hints for up to three hints per object. Hints point you closer, but never find anything for you.'],
      ['Move on', 'Finding everything in a level unlocks the next one. You can skip ahead or go back, but only players who find all ' + TOTAL_ITEMS + ' have completed the game.'],
      ['Accessibility', 'We want as many people as possible to play. Accessibility settings offer larger text, high contrast, black and white, and a dyslexia-friendly typeface. Every riddle is written as well as spoken, and sound can be switched off at any time.']
    ];
    const buttons = [
      ['riddle', 'Riddle', 'Plays the riddle again.'],
      ['hints', 'Hints', 'Up to three hints for each object. You can also click a ? at the top.'],
      ['list', 'Found', 'Everything you have found, with a way to jump between levels.'],
      ['back', 'Back and Skip', 'Move one level at a time.'],
      ['share', 'Share', 'Send the game to a friend.'],
      ['access', 'Accessibility', 'Text size, high contrast, black and white and easier-reading text.'],
      ['soundOff', 'Sound', 'Turns all sound on or off.']
    ];
    openPanel(`
      <h2 class="es3d-help-title">Eye Spy 3D</h2>
      <p class="es3d-help-intro">Eye Spy 3D is a hidden-object game set inside a real antique store. There are ${LEVELS.length} levels, each with its own riddle and its own objects to find, ${TOTAL_ITEMS} in all. You\u2019re locked in position at each level, so the hunt is all about looking. Play the levels in order or jump around. The fastest player to find every object takes the top spot on the leaderboard.</p>
      <h3>Controls</h3>
      <div class="es3d-help-grid">
        ${controls.map(([iconName, title, text]) => '<div class="es3d-help-card">' + icon(iconName) + '<b>' + title + '</b>' + text + '</div>').join('')}
      </div>
      <h3>How to play</h3>
      ${steps.map(([title, text], i) => '<div class="es3d-help-row"><span class="es3d-help-num">' + (i + 1) + '</span><div><b>' + title + '</b>' + text + '</div></div>').join('')}
      <h3>The buttons</h3>
      ${buttons.map(([iconName, title, text]) => '<div class="es3d-help-row"><span class="es3d-help-icon">' + icon(iconName) + '</span><div><b>' + title + '</b>' + text + '</div></div>').join('')}
      <button class="es3d-btn" type="button" id="es3d-rewatch">Watch the intro again</button>`);
    document.getElementById('es3d-rewatch').addEventListener('click', () => {
      closePanel();
      clueAudio.pause();
      playIntroVideo(() => {});
    });
  }

  // --- DISPLAY SETTINGS ---
  // Text size, high contrast, black and white and easier-reading text.
  // Kept on this device.
  const ACCESS_KEY = 'es3d_display';
  const access = (() => {
    try { return Object.assign({ text: 'm', contrast: false, grey: false, dyslexia: false }, JSON.parse(localStorage.getItem(ACCESS_KEY) || '{}')); } catch (e) { return { text: 'm', contrast: false, grey: false, dyslexia: false }; }
  })();

  function applyAccess() {
    const root = document.documentElement.classList;
    root.toggle('es3d-text-l', access.text === 'l');
    root.toggle('es3d-text-xl', access.text === 'xl');
    root.toggle('es3d-contrast', !!access.contrast);
    root.toggle('es3d-grey', !!access.grey);
    root.toggle('es3d-dyslexia', !!access.dyslexia);
    if (ui.hud) fitTopPanel();
    try { localStorage.setItem(ACCESS_KEY, JSON.stringify(access)); } catch (e) {}
  }

  function showAccessPanel() {
    const choice = (key, value, label) =>
      '<button class="es3d-btn es3d-small ' + (access[key] === value ? '' : 'es3d-quiet') + '" type="button" data-set="' + key + '" data-value="' + value + '" aria-pressed="' + (access[key] === value) + '">' + label + '</button> ';
    openPanel(`
      <h2>Accessibility settings</h2>
      <h3>Text size</h3>
      <p>${choice('text', 'm', 'Standard')}${choice('text', 'l', 'Large')}${choice('text', 'xl', 'Extra large')}</p>
      <h3>High contrast</h3>
      <p class="es3d-note">Black panels, white text and heavier outlines.</p>
      <p>${choice('contrast', false, 'Off')}${choice('contrast', true, 'On')}</p>
      <h3>Black and white</h3>
      <p class="es3d-note">Removes colour from the whole screen, including the store.</p>
      <p>${choice('grey', false, 'Off')}${choice('grey', true, 'On')}</p>
      <h3>Easier-reading text</h3>
      <p class="es3d-note">A dyslexia-friendly typeface with wider letter, word and line spacing.</p>
      <p>${choice('dyslexia', false, 'Off')}${choice('dyslexia', true, 'On')}</p>`);
    document.getElementById('es3d-panel-body').querySelectorAll('button[data-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        access[btn.dataset.set] = value === 'true' ? true : value === 'false' ? false : value;
        applyAccess();
        showAccessPanel();
      });
    });
  }

  function showListPanel() {
    const rows = LEVELS.map((level, i) => `
      <div class="es3d-list-level ${i === state.levelIndex ? 'es3d-current' : ''}">
        <div class="es3d-list-title">Level ${i + 1}<br><span class="es3d-note">${levelFoundCount(level)} / ${level.items.length}</span></div>
        <div class="es3d-list-items">${level.items.map((item, n) => state.found[item.id]
          ? '<span class="es3d-slot es3d-found"><span class="es3d-tick">&#10003;</span>' + esc(item.name) + '</span>'
          : '<button type="button" class="es3d-slot" data-level="' + i + '" data-slot="' + n + '" title="Hints for this object" aria-label="Not found yet. Open hints for this object">?</button>').join('')}</div>
        ${i === state.levelIndex ? '' : '<button class="es3d-list-go" type="button" data-go="' + i + '">Go</button>'}
      </div>`).join('');
    openPanel(`<h2>Found</h2><p>${foundCount()} of ${TOTAL_ITEMS} found. Click a <b>?</b> for hints.</p>${rows}`);
    const body = document.getElementById('es3d-panel-body');
    body.querySelectorAll('button[data-go]').forEach((btn) => {
      btn.addEventListener('click', () => goToLevel(Number(btn.dataset.go), state.levelIndex));
    });
    // A "?" opens that object's hints, moving to its level first if needed.
    body.querySelectorAll('button[data-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const levelIndex = Number(btn.dataset.level);
        const slot = Number(btn.dataset.slot);
        if (levelIndex === state.levelIndex) { showHintPanel(slot); return; }
        goToLevel(levelIndex, state.levelIndex).then(() => { if (state.levelIndex === levelIndex) showHintPanel(slot); });
      });
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

  function fillBoard() {
    fetchBoard().then((entries) => {
      const slot = document.getElementById('es3d-board-slot');
      if (slot) slot.innerHTML = boardHtml(entries);
    });
  }

  // Order matters here: back into the game first, then the sign-up, then
  // feedback, with the leaderboard last.
  function showEndPanel() {
    const all = foundCount() === TOTAL_ITEMS;
    const firstUnfinished = LEVELS.findIndex((level) => !isLevelComplete(level));
    openPanel(`
      <h2>${all ? 'You found everything!' : 'You have reached the end'}</h2>
      <div class="es3d-stats">
        <div class="es3d-stat"><b>${foundCount()} / ${TOTAL_ITEMS}</b><span>objects found</span></div>
        <div class="es3d-stat"><b>${formatTime(state.elapsedMs)}</b><span>time</span></div>
        <div class="es3d-stat"><b>${state.hintsUsed}</b><span>hints</span></div>
      </div>
      ${all ? '' : `<p>Some objects are still hidden. Only players who click every one rank by time.</p>
        <button class="es3d-btn" type="button" id="es3d-keep-playing">Keep playing</button>`}

      <div class="es3d-section">
        <h3>Eye Spy 3D Part 2: The rest of the store!</h3>
        <p>Sign up and we will email you when Part 2 opens.</p>
        <form id="es3d-signup" novalidate>
          <input type="email" id="es3d-email" placeholder="you@example.com" autocomplete="email" aria-label="Email address">
          <label class="es3d-consent"><input type="checkbox" id="es3d-consent">
            <span>Yes, ABM Visual may email me about Eye Spy 3D. I can unsubscribe at any time.</span></label>
          <button class="es3d-btn" type="submit">Sign me up</button>
          <p class="es3d-note" id="es3d-signup-note"></p>
        </form>
      </div>

      <div class="es3d-section">
        <h3>Feedback</h3>
        <form id="es3d-feedback-form" novalidate>
          <textarea id="es3d-feedback" placeholder="What did you think?" aria-label="Feedback"></textarea>
          <button class="es3d-btn es3d-quiet" type="submit">Send feedback</button>
          <p class="es3d-note" id="es3d-feedback-note"></p>
        </form>
      </div>

      <div class="es3d-section">
        <h3>Leaderboard</h3>
        <div id="es3d-board-slot"><p class="es3d-note">Loading scores…</p></div>
        ${BACKEND_URL ? '' : '<p class="es3d-note">Showing scores from this device only.</p>'}
        ${state.name ? '' : '<p class="es3d-note">Enter a player name on the welcome screen to appear here.</p>'}
        <button class="es3d-btn es3d-quiet" type="button" id="es3d-again">Start a new game</button>
        <button class="es3d-btn es3d-quiet" type="button" id="es3d-share">Share the game</button>
      </div>`);
    fillBoard();
    const keep = document.getElementById('es3d-keep-playing');
    if (keep) keep.addEventListener('click', () => goToLevel(firstUnfinished));
    document.getElementById('es3d-signup').addEventListener('submit', (e) => { e.preventDefault(); sendSignup(); });
    document.getElementById('es3d-feedback-form').addEventListener('submit', (e) => { e.preventDefault(); sendFeedback(); });
    document.getElementById('es3d-share').addEventListener('click', shareGame);
    document.getElementById('es3d-again').addEventListener('click', () => {
      resetRun();
      save();
      goToLevel(0);
    });
  }

  function sendToBackend(note, payload, thanks) {
    if (!BACKEND_URL) { note.textContent = 'This is not switched on yet, so nothing was sent.'; return; }
    note.textContent = 'Sending…';
    postToBackend(Object.assign({ name: state.name, playerId: state.playerId }, payload))
      .then((data) => { note.textContent = data && data.ok ? thanks : 'That could not be sent. Please try again.'; })
      .catch(() => { note.textContent = 'That could not be sent. Please try again.'; });
  }

  function sendSignup() {
    const note = document.getElementById('es3d-signup-note');
    const email = document.getElementById('es3d-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = 'That email address does not look right.'; return; }
    if (!document.getElementById('es3d-consent').checked) { note.textContent = 'Please tick the box so we are allowed to email you.'; return; }
    sendToBackend(note, { action: 'signup', email: email, consent: true }, 'You are signed up. Thank you!');
  }

  function sendFeedback() {
    const note = document.getElementById('es3d-feedback-note');
    const text = document.getElementById('es3d-feedback').value.trim();
    if (!text) { note.textContent = 'Write something first.'; return; }
    sendToBackend(note, { action: 'feedback', feedback: text }, 'Thanks for the feedback.');
  }

  // ---------------------------------------------------------------------------
  // MOVING THROUGH THE TOUR
  // ---------------------------------------------------------------------------
  let sdk = null;
  let allSweeps = [];

  // Only the sweep the player should be standing on stays enabled, so they
  // cannot wander. That is the lobby until the intro has been watched.
  function lockMap() {
    const allowed = state.phase === 'lobby' || state.phase === 'intro' ? [LOBBY_SWEEP] : [sweepFor(state.levelIndex)];
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

  function arriveAtLevel(index, returnTo) {
    if (typeof returnTo === 'number' && returnTo !== index) showReturnPill(returnTo); else hideReturnPill();
    state.levelIndex = index;
    state.phase = index >= LEVELS.length ? 'end' : 'playing';
    state.advancePending = false;
    state.arrivedAt = Date.now();
    clueAudio.pause();
    lockMap();
    save();
    renderHud();
    if (state.phase === 'end') {
      submitScore();
      showEndPanel();
    } else {
      preloadLevelPhotos();
      preloadLevelNames();
      watchClueAudio();
    }
  }

  // After a jump from the Found list, a "Return to level N" button appears at
  // the bottom of the screen for a few seconds, in case the jump was a mistake.
  const RETURN_SECONDS = 3;
  let returnTarget = null;
  let returnTimer = null;

  function hideReturnPill() {
    clearInterval(returnTimer);
    returnTarget = null;
    ui.returnPill.classList.add('es3d-hidden');
  }

  function showReturnPill(level) {
    hideReturnPill();
    returnTarget = level;
    let left = RETURN_SECONDS;
    const draw = () => { ui.returnPill.innerHTML = icon('undo') + '<span>Return to level ' + (level + 1) + '</span><b>' + left + '</b>'; };
    draw();
    ui.returnPill.classList.remove('es3d-hidden');
    returnTimer = setInterval(() => {
      left--;
      if (left <= 0) hideReturnPill(); else draw();
    }, 1000);
  }

  // returnTo: the level to offer a way back to (set by jumps from the Found list).
  async function goToLevel(index, returnTo) {
    if (state.busy || !sdk || typeof index !== 'number' || index < 0 || index > LEVELS.length) return;
    state.busy = true;
    closePanel();
    try {
      await moveToSweep(sweepFor(index));
      arriveAtLevel(index, returnTo);
    } catch (error) {
      console.error('Eye Spy 3D: could not move to level ' + (index + 1), error);
      toast('Could not move there. Please try again.');
    }
    state.busy = false;
  }

  function checkReadyToReveal() {
    if (!state.started || !state.tourReady || state.revealed) return;
    state.revealed = true;
    reveal();
  }

  async function reveal() {
    ui.loading.remove();
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
    // New game: hold the player in the lobby until they have watched (or
    // skipped) the intro, which then drops them straight into level 1.
    state.phase = 'lobby';
    try {
      await sdk.Sweep.enable(LOBBY_SWEEP).catch(() => {});
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
    if (sweepId) state.currentSweep = sweepId;
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
      'color', 'margin', 'background-color', 'padding', 'white-space', 'overflow', 'font-family', 'font-weight']
      .forEach((prop) => labelEl.style.removeProperty(prop));
    const backgroundEl = overlay.querySelector('.customBillboardBackground') || overlay.querySelector('.customBillboardBG');
    if (backgroundEl) {
      ['background-color', 'display', 'align-items', 'justify-content'].forEach((prop) => backgroundEl.style.removeProperty(prop));
    }
    const set = (node, props) => Object.keys(props).forEach((prop) => node.style.setProperty(prop, props[prop], 'important'));
    if (isAudioClue) {
      if (backgroundEl) set(backgroundEl, { 'background-color': THEME.bar, display: 'flex', 'align-items': 'center', 'justify-content': 'center' });
      set(labelEl, {
        position: 'static', display: 'block', width: '85%', 'max-width': '85%', 'box-sizing': 'border-box', 'text-align': 'center',
        'font-size': '150%', color: THEME.barText, margin: 'auto', 'background-color': 'transparent', padding: '20px',
        'white-space': 'normal', overflow: 'visible'
      });
    } else {
      set(labelEl, {
        display: 'block', width: '100%', 'box-sizing': 'border-box', 'text-align': 'center', 'font-size': '240%',
        color: THEME.barText, margin: '0', 'background-color': THEME.bar, padding: '14px 24px',
        'font-weight': '800', 'font-family': 'system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
      });
    }
  }

  // Clicking a nadir disc makes MPEmbed open a small audio-player popup to
  // replay the riddle. Close it straight away so nothing extra appears on
  // screen; DISC_CLICK_REPLAYS decides whether the riddle is replayed.
  function takeOverCluePopup(overlay) {
    const closeBtn = overlay.querySelector('[class*="close"]');
    if (!closeBtn) return false;
    const media = overlay.querySelector('audio[src], audio source[src]');
    if (media && media.src && LEVELS[state.levelIndex]) state.clueSrc[state.levelIndex] = media.src;
    overlay.querySelectorAll('audio').forEach((node) => node.pause());
    closeBtn.click();
    if (DISC_CLICK_REPLAYS) replayClue();
    return true;
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
    playFoundSound(item);
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
        // Still flying to a level: look again shortly rather than lose the click.
        if (state.busy) { setTimeout(handleOverlayState, 300); return; }
        handledSignature = popupSignature(overlay);
        const labelEl = overlay.querySelector('.tag-text-content');
        const img = overlay.querySelector('img.tag-image') || overlay.querySelector('.tag-media-content img');
        const full = document.getElementById('customBillboardFull');
        const isAudioClue = !!(full && full.classList.contains('audio'));
        if (isAudioClue && takeOverCluePopup(overlay)) return;
        // Could not close MPEmbed's audio popup, so show it rather than leave
        // an invisible popup blocking the screen.
        document.body.classList.toggle('es3d-show-audio-popup', isAudioClue);
        if (labelEl) stylePopup(overlay, labelEl, isAudioClue);
        if (!isAudioClue) {
          notePhotoFolder(img);
          registerFind(labelEl ? labelEl.textContent : '', img ? img.getAttribute('src') : '');
        }
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

  // ---------------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------------
  // The hidden objects must not give themselves away by changing the mouse
  // cursor on hover, so the cursor is pinned to the plain arrow, both on this
  // page and inside the tour's frame where the browser allows it. The pin is
  // lifted whenever the tour itself is showing a busy cursor, so the player
  // can still see the loading wheel.
  const CURSOR_RULE_PAGE = 'html, body, body *:not(.es3d):not(.es3d *) { cursor: default !important; } ' +
    '#customBillboardFullOverlay [class*="close"] { cursor: pointer !important; }';
  const CURSOR_RULE_FRAME = '* { cursor: default !important; }';

  function steadyCursor() {
    const docs = [[document, CURSOR_RULE_PAGE]];
    document.querySelectorAll('iframe').forEach((frame) => {
      try { if (frame.contentDocument && frame.contentDocument.head) docs.push([frame.contentDocument, CURSOR_RULE_FRAME]); } catch (e) {}
    });
    docs.forEach(([doc, rule]) => {
      let style = doc.getElementById('es3d-cursor');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'es3d-cursor';
        style.textContent = rule;
        doc.head.appendChild(style);
      }
      // Look at the cursor the tour would show without the pin.
      style.disabled = true;
      const hovered = doc.querySelectorAll(':hover');
      const probes = [doc.body, hovered[hovered.length - 1]].concat(Array.from(doc.querySelectorAll('canvas')).slice(0, 3));
      const view = doc.defaultView || window;
      style.disabled = probes.some((node) => node && /wait|progress/.test(view.getComputedStyle(node).cursor));
    });
  }

  // Matterport's own tags (such as one added for Matterport Discover) are
  // taken out of the game view. This only affects what this page shows; the
  // tags stay on the space itself. Anything labelled as one of the game's
  // objects is left alone, in case MPEmbed registers its hotspots as tags.
  function hideMatterportTags() {
    const isGameObject = (label) => {
      const key = norm(label);
      return !!key && LEVELS.some((level) => level.items.some((item) => item.keys.includes(key)));
    };
    try {
      if (sdk.Tag && sdk.Tag.data && sdk.Tag.remove) {
        sdk.Tag.data.subscribe({
          onAdded: (id, tag) => { if (!isGameObject(tag && tag.label)) Promise.resolve(sdk.Tag.remove(id)).catch(() => {}); }
        });
        return;
      }
      if (sdk.Mattertag && sdk.Mattertag.getData) {
        sdk.Mattertag.getData().then((tags) => {
          const ids = tags.filter((tag) => !isGameObject(tag.label)).map((tag) => tag.sid);
          if (ids.length > 0) return sdk.Mattertag.remove(ids);
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Eye Spy 3D: could not hide Matterport tags', e);
    }
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
    hideMatterportTags();
    setInterval(steadyCursor, 400);
    state.tourReady = true;
    checkReadyToReveal();
  }

  function waitForTour() {
    steadyCursor();
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

  const bootTimer = setInterval(() => {
    if (!document.head || !document.body) return;
    clearInterval(bootTimer);
    buildUI();
    waitForTour();
  }, 50);
})();
