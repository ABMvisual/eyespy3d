// =============================================================================
// EYE SPY 3D - ENGINE (V4004)
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

  const VERSION = 'V4004';
  console.log('EYE SPY 3D — ' + VERSION + ' loaded');

  // ---------------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------------
  const YOUTUBE_VIDEO_ID = 'Ly2dwu4pTVo';
  const ASSET_BASE = 'https://cdn.jsdelivr.net/gh/ABMvisual/eyespy3d@main/';
  // Web app URL of backend/leaderboard.gs once deployed. While empty, scores
  // are kept on this device only and stage-two sign-ups are switched off.
  const BACKEND_URL = '';
  // Per-item sound effect when an object is found. Off: the game is played to
  // the riddle audio alone.
  const ITEM_SOUNDS = false;
  // Clicking a riddle disc on the floor: true replays the riddle, false does
  // nothing (the Riddle button is then the only way to hear it again). The
  // discs' clickable area is a square, so stray clicks on the corners are common.
  const DISC_CLICK_REPLAYS = false;
  // Page the Share button hands out. Empty = the page that embeds the game.
  const SHARE_URL = 'https://abmvisual.com/eye-spy-3d';
  // Fetch each level's popup photos in the background on arrival, so a popup
  // opens without waiting for its photo. Add &es3dpreload=0 to the page
  // address to turn it off, and &es3ddebug=1 to show how long each photo took.
  const PRELOAD_PHOTOS = !/[?&]es3dpreload=0/.test(location.search);
  const DEBUG_TIMING = /[?&]es3ddebug=1/.test(location.search);
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
        { id: 'pink bo-peep', name: 'Pink Bo-Peep', photo: 'pink bopeep.jpeg', hint: 'A shepherdess with no flock, dressed in pink.', where: 'On the shelf, just below the two white cows.' },
        { id: 'two white cows', name: 'Two white cows', hint: 'Where the sheep should be, a pair of pale cattle stand instead.', where: 'Directly above the Pink Bo-Peep.' },
        { id: 'yourself', name: 'Yourself', hint: 'Silver at the front, brown at the back, and you are in it. What shows you your own face?', where: 'Across the room from the Pink Bo-Peep, on the table.' }
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
      riddle: 'We all know {a crow in the bag|a crow in the bag} is worth {a hand in two|a hand in two}. Would {vitreous china|vitreous china} played on the {musical tyre|musical tyre} sound like a loo?',
      items: [
        { id: 'a crow in the bag', name: 'A crow in the bag', hint: 'A black bird that has ended up inside a bag.', where: 'On a Coke cooler in the hallway.' },
        { id: 'a hand in two', name: 'A hand in two', hint: 'The old saying about a bird in the hand has been twisted. Look for a hand, and count to two.', where: 'On the corner of the crockery shelf.' },
        { id: 'vitreous china', name: 'Vitreous china', hint: 'The glazed ceramic that toilets and basins are made from. The “loo” is your clue.', where: 'Behind glass, on the fourth shelf of the first bay in the aluminium cupboard.' },
        { id: 'musical tyre', name: 'Musical tyre', hint: 'Something round like a tyre that can carry a tune.', where: 'On a wooden table, opposite the crockery shelf.' }
      ]
    },
    {
      sweep: '66yna1yh5e2ig14bmzzf1sn2c', clue: 'hanimex.mp3',
      riddle: 'Do you have any idea what {Hanimexs Movielux|Hanimex’s Movielux}, the {argus previewer|Argus PreViewer}, {scotts mower maker|Scott’s Mower Maker}, and a {porcelain lobster|Porcelain Lobster} have in common?',
      items: [
        { id: 'Hanimexs Movielux', name: 'Hanimex’s Movielux', hint: 'Home movie gear from the days of film. Look for the Hanimex name.', where: 'On the middle wooden box, on top of the camera shelf.' },
        { id: 'argus previewer', name: 'Argus PreViewer', hint: 'A small viewer for checking slides before the show. Look for the Argus name.', where: 'Around the middle of the camera cabinet.' },
        { id: 'scotts mower maker', name: 'Scott’s Mower Maker', hint: 'Something for the lawn, with Scott’s name on it.', where: 'On the wall, to the right of Hanimex\u2019s Movielux.' },
        { id: 'porcelain lobster', name: 'Porcelain lobster', hint: 'A shellfish that will never see a pot, because it is made of china.', where: 'At the bottom of the wooden cabinet, diagonally opposite the camera cabinet.' }
      ]
    },
    {
      sweep: '3hdk0cskxw0apbr2iw8016htb', clue: 'wall climbing baby.mp3',
      riddle: 'Watch the {wall climbing baby|wall climbing baby} as they play {hide and seek|hide and seek}, searching for the {barley|barley} and some {some flumis|Flumi’s} to put them to sleep.',
      items: [
        { id: 'wall climbing baby', name: 'Wall climbing baby', hint: 'A little one who has left the floor and is heading up the wall.', where: 'On top of the cabinet, above the Flumi\u2019s sign.' },
        { id: 'hide and seek', name: 'Hide and seek', hint: 'Someone here is hiding, or counting. Look for the game being played.', where: 'In the bottom right-hand corner of the cabinet, next to the Flumi\u2019s sign.' },
        { id: 'barley', name: 'Barley', photo: 'barley.jpg', hint: 'A grain you might find in soup or a soothing drink. Look for the word on a label.', where: 'In the same cabinet as hide and seek.' },
        { id: 'some flumis', name: 'Some Flumi’s', hint: 'An unusual name on a packet. The riddle says they help with sleep.', where: 'Down and to the right of the barley, at about 45 degrees, towards hide and seek.' }
      ]
    },
    {
      sweep: 'r7sd2g426fhbfa2wdh5dfxy5d', clue: 'an odd purves terms.mp3',
      riddle: '{a pair of old jugs|A pair of old jugs}, {odd purves terms|an odd Purves terms}, {a third more time|a third more time}, and {round thing|a round thing} that serves.',
      items: [
        { id: 'a pair of old jugs', name: 'A pair of old jugs', hint: 'Two pourers that have seen better days, side by side.', where: 'Third shelf up, in the cabinet to the left of the clock.' },
        { id: 'odd purves terms', name: 'An odd Purves terms', hint: 'Look for the name Purves in print.', where: 'Written on the Bridge Estate sign, to the right of the clock and the solar cabinet.' },
        { id: 'a third more time', name: 'A third more time', hint: 'Something here promises a third extra. Think about what measures time.', where: '' },
        { id: 'round thing', name: 'A round thing', hint: 'It is circular and made for serving.', where: '' }
      ]
    },
    {
      sweep: '20qckty5qi20t39838cq274rc', clue: '',
      riddle: '{three wooden discs|Three wooden discs} aren’t floating for certain, with {australia in stitches|Australia in stitches} by a {cat in a turban|cat in a turban}.',
      items: [
        { id: 'three wooden discs', name: 'Three wooden discs', hint: 'Count three flat circles made of timber.', where: 'To the left of the lamp, which is to the left of the typewriter.' },
        { id: 'australia in stitches', name: 'Australia in stitches', aliases: ['embroidered australia'], hint: 'The shape of the country, made with needle and thread.', where: 'On the right shoulder of the jacket on the mannequin.' },
        { id: 'cat in a turban', name: 'Cat in a turban', hint: 'A feline wearing unusual headwear.', where: 'In the cabinet opposite the typewriter, directly to the right of the painting.' }
      ]
    },
    {
      sweep: 'dy113u49qt5s7y38ms7ibmd9b', clue: 'she disinterestedly sat.mp3',
      riddle: 'On fine velvet, {she disinterestedly sat|she disinterestedly sat}, while below {two chambermen|two chambermen} chatted, opposing the {picked pack|pack}.',
      items: [
        { id: 'she disinterestedly sat', name: 'She disinterestedly sat', hint: 'A woman seated on velvet, looking thoroughly bored.', where: 'The painting on the wall, behind the light fixture.' },
        { id: 'two chambermen', name: 'Two chambermen', hint: 'They sound like servants, but this pair is the kind once kept under the bed.', where: 'Under the wooden table at the end of the row.' },
        { id: 'picked pack', name: 'The picked pack', hint: 'Opposite the chatting pair, look for a pack.', where: 'On the floor, at the other end of the row from the two chambermen.' }
      ]
    },
    {
      sweep: 'rxgziepm3g4e0fgdgnwwk6efd', clue: '',
      riddle: '{viking preserve|Viking preserves}, and {two box of confetti|two box of confetti}, a {drinking urn|drinking urn}, and one more {confetti|confetti}.',
      items: [
        { id: 'viking preserve', name: 'Viking preserves', hint: 'Something preserved in a jar or tin, with a Norse name on it.', where: 'On the red carpet, at the bottom of the cabinet.' },
        { id: 'two box of confetti', name: 'Two box of confetti', hint: 'Party paper for throwing, two boxes together.', where: 'To the right of the gramophone horn.' },
        { id: 'drinking urn', name: 'Drinking urn', hint: 'A large vessel for serving drinks to a crowd.', where: 'Opposite the gramophone, to the left of the grandfather clock.' },
        { id: 'confetti', name: 'Confetti', hint: 'The same party paper again, on its own this time.', where: 'Below the red lantern, on top of the cabinet to the left of the gramophone.' }
      ]
    },
    {
      sweep: 'w2bre69ufwyaywn11ch032aaa', clue: '',
      riddle: 'As the {eagle|Eagle} soars, and {beatles|Beatles} cascade, a lone {gnome all alone|gnome} spies a shiny {blue hand|blue hand} holding a cone. He might make his home.',
      items: [
        { id: 'eagle', name: 'Eagle', hint: 'A bird of prey with its wings spread.', where: 'In the glass cabinet, on the top shelf, with a small wooden cabinet directly above.' },
        { id: 'beatles', name: 'Beatles', hint: 'Spelled like the band, not the insect.', where: 'On a small wooden shelf, next to the large red pot.' },
        { id: 'gnome all alone', name: 'Gnome all alone', hint: 'A small garden character standing all by himself.', where: 'On the bottom shelf, directly below the Eagle.' },
        { id: 'blue hand', name: 'Blue hand', hint: 'A glossy hand in an unexpected colour, holding something cone-shaped.', where: 'Second shelf up, in the cabinet directly opposite the gnome.' }
      ]
    },
    {
      sweep: 'dimg015tts6u2b30hh0pndaqd', clue: '',
      riddle: 'The flock of {mock ducks|mock ducks} hang out far from the {wooden goanna|wooden goanna}, and halfway across, an {unarmed man|unarmed man} wears a red bandana.',
      items: [
        { id: 'mock ducks', name: 'Mock ducks', hint: 'A group of birds that aren’t the real thing.', where: 'On the wall behind Phil.' },
        { id: 'wooden goanna', name: 'Wooden goanna', hint: 'An Australian lizard carved from timber, a long way from the ducks.', where: 'On the floor.' },
        { id: 'unarmed man', name: 'Unarmed man', hint: 'Halfway between the ducks and the lizard, a man in a red bandana is missing something.', where: 'On a small wooden cabinet in the hallway, below the Sons of Australia poster.' }
      ]
    },
    {
      sweep: 'iwaxrd4g1gki6i64y6dk1iuhd', clue: '',
      riddle: '{whose head|Whose head} is that, to the left of the {hat|hat}, to the right of the {runners|runners}, above the {the plugs|plugs}, in front of the {the hugs|hugs}?',
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
      riddle: 'When I rowed from {dimboola|Dimboola}, to {egypt etc|Egypt etc}, I wore my {akubra|Akubra} and spied a {tiger|tiger}, a {butterfly|butterfly}, and {horse head|horse head} to end it.',
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
    if (!ITEM_SOUNDS) return;
    const el = sfxPool[sfxTurn++ % sfxPool.length];
    el.src = ASSET_BASE + encodeURIComponent(item.id + '.mp3');
    el.currentTime = 0;
    el.play().catch(() => {});
  }

  // Fetch the current level's item sounds ahead of time so the first play is
  // instant. Replaces the old boot-time warm-up of every sound in the game.
  function preloadLevelSounds() {
    const level = LEVELS[state.levelIndex];
    if (!ITEM_SOUNDS || !level) return;
    level.items.forEach((item, i) => {
      if (state.found[item.id]) return;
      setTimeout(() => {
        fetch(ASSET_BASE + encodeURIComponent(item.id + '.mp3'), { mode: 'no-cors' }).catch(() => {});
      }, 300 + i * 200);
    });
  }

  // MPEmbed serves a popup's photo from its media folder under the same file
  // name every time, so asking for it early puts it in the browser's cache.
  const preloaded = {};
  function preloadLevelPhotos() {
    const level = LEVELS[state.levelIndex];
    if (!PRELOAD_PHOTOS || !level) return;
    level.items.forEach((item, i) => {
      if (state.found[item.id] || preloaded[item.id]) return;
      setTimeout(() => {
        const img = new Image();
        img.onload = () => { preloaded[item.id] = 'ready'; };
        img.onerror = () => { preloaded[item.id] = 'failed'; };
        preloaded[item.id] = 'loading';
        img.src = state.photoBase + (item.photo || item.id + '.jpeg');
      }, 400 + i * 150);
    });
  }

  // Reports how long a popup's photo took to appear once the popup opened.
  function timePopupPhoto(img, item) {
    if (!img) return;
    const src = img.getAttribute('src') || '';
    const cut = src.lastIndexOf('/');
    if (cut > 0) state.photoBase = src.slice(0, cut + 1);
    const started = performance.now();
    const report = () => {
      const ms = Math.round(performance.now() - started);
      const note = 'photo ready in ' + ms + ' ms (preload ' + (PRELOAD_PHOTOS ? (item && preloaded[item.id]) || 'not requested' : 'off') + ')';
      console.log('Eye Spy 3D: ' + (item ? item.name : src) + ', ' + note);
      if (DEBUG_TIMING) toast(note);
    };
    if (img.complete && img.naturalWidth > 0) report();
    else img.addEventListener('load', report, { once: true });
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
  // Bright yellow panels with dark burgundy text, in a plain sans-serif, for
  // the highest readability over a busy scene (burgundy on this yellow is
  // about 11 to 1). To restyle the whole game, change the --es variables.
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
    /* MPEmbed's replay-audio popup is closed by script the moment it opens. */
    body:not(.es3d-show-audio-popup) #customBillboardFull.audio { opacity: 0 !important; }

    /* Tall screens: fill the popup's height and crop the wide photo's sides. */
    @media (orientation: portrait) {
      #customBillboardFull.photo img.tag-image {
        width: 100% !important; height: 72vh !important; aspect-ratio: auto !important;
        object-fit: cover !important; object-position: center !important;
      }
    }

    .es3d {
      --es-yellow: #f2c230; --es-yellow-soft: #f7d566; --es-ink: #2b070c; --es-cream: #fbf3dc; --es-line: rgba(43,7,12,0.4);
      font-size: clamp(15px, 0.62vw + 9px, 30px); color: var(--es-ink);
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
    #es3d-welcome h1 { margin: 0 0 0.3em; font-size: 2.8em; color: var(--es-yellow); text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
    #es3d-welcome p { margin: 0 0 1.3em; font-size: 1.25em; text-shadow: 0 1px 3px rgba(0,0,0,0.8); max-width: 30em; }
    #es3d-name-row { margin: 0 0 1.4em; display: flex; flex-direction: column; align-items: center; gap: 0.5em; }
    #es3d-name {
      width: 11em; padding: 0.35em 0.4em; font-size: 1.6em; font-weight: 700; letter-spacing: 0.08em; text-align: center;
      text-transform: uppercase; color: var(--es-cream); background: rgba(0,0,0,0.6); border: 2px solid var(--es-yellow); border-radius: 0.3em;
    }
    #es3d-name::placeholder { color: rgba(251,243,220,0.35); }
    #es3d-name-note { min-height: 1.3em; font-size: 0.9em; color: var(--es-yellow); }

    /* Buttons: burgundy on the yellow panels, yellow on the dark screens. */
    .es3d-btn {
      display: inline-block; padding: 0.6em 1.5em; font-size: 1.2em; font-weight: 700; text-decoration: none;
      background: var(--es-ink); color: var(--es-yellow); border: 2px solid var(--es-ink); border-radius: 0.35em; margin: 0.3em;
    }
    .es3d-btn:hover { filter: brightness(1.25); }
    .es3d-btn.es3d-quiet { background: transparent; color: var(--es-ink); font-size: 1em; }
    .es3d-btn.es3d-small { font-size: 0.95em; padding: 0.45em 1em; margin: 0.2em 0; }
    #es3d-welcome .es3d-btn, #es3d-video .es3d-btn {
      background: var(--es-yellow); color: var(--es-ink); border-color: var(--es-yellow); box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    #es3d-welcome .es3d-btn:hover, #es3d-video .es3d-btn:hover { filter: brightness(1.1); }
    #es3d-welcome .es3d-btn.es3d-quiet, #es3d-video .es3d-btn.es3d-quiet { background: rgba(0,0,0,0.5); color: var(--es-cream); border-color: var(--es-cream); box-shadow: none; }

    #es3d-video { background: #000; z-index: 2147483644; }
    #es3d-video-frame, #es3d-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
    #es3d-video-skip { position: absolute; right: 1.5em; bottom: 1.5em; z-index: 2; }

    .es3d-card { background: var(--es-yellow); border: 2px solid var(--es-ink); border-radius: 0.45em; box-shadow: 0 6px 24px rgba(0,0,0,0.55); }
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
    #es3d-bar { height: 0.5em; margin: 0.45em 0; background: rgba(43,7,12,0.18); border-radius: 0.25em; overflow: hidden; }
    #es3d-bar-fill { height: 100%; width: 0; background: var(--es-ink); transition: width 0.4s ease; }
    #es3d-riddle {
      display: block; width: 100%; padding: 0; margin: 0; text-align: left; background: none; border: none; color: var(--es-ink);
      font-size: 1.2em; line-height: 1.35;
    }
    #es3d-riddle.es3d-collapsed { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #es3d-riddle .es3d-item { font-weight: 800; }
    #es3d-riddle .es3d-item.es3d-found { text-decoration: underline; text-decoration-thickness: 0.12em; text-underline-offset: 0.18em; }
    #es3d-slots { display: flex; gap: 0.4em; margin-top: 0.55em; flex-wrap: wrap; }
    .es3d-slot {
      min-width: 2.1em; height: 2.1em; padding: 0 0.7em; display: inline-flex; align-items: center; justify-content: center; gap: 0.4em;
      font-size: 0.95em; font-weight: 700; border-radius: 1.05em; border: 2px dashed var(--es-ink); color: var(--es-ink); background: transparent;
    }
    button.es3d-slot:hover { background: var(--es-yellow-soft); }
    .es3d-slot.es3d-found { border: 2px solid var(--es-ink); background: var(--es-ink); color: var(--es-yellow); padding-left: 0.3em; }
    .es3d-tick {
      width: 1.5em; height: 1.5em; flex: 0 0 auto; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
      background: var(--es-yellow); color: var(--es-ink); font-weight: 900; line-height: 1;
    }
    .es3d-tick.es3d-on-yellow { background: var(--es-ink); color: var(--es-yellow); }
    #es3d-riddle .es3d-tick { width: 1.05em; height: 1.05em; font-size: 0.85em; margin-left: 0.25em; vertical-align: 0.08em; }

    #es3d-controls {
      position: absolute; left: 50%; bottom: max(12px, env(safe-area-inset-bottom)); transform: translateX(-50%);
      display: flex; gap: 0.25em; padding: 0.3em; pointer-events: auto; max-width: calc(100vw - 16px);
    }
    #es3d-controls button {
      min-width: 4.6em; min-height: 44px; padding: 0.35em 0.5em; display: flex; flex-direction: column; align-items: center; gap: 0.1em;
      font-size: 0.85em; font-weight: 600; color: var(--es-ink); background: transparent; border: none; border-radius: 0.35em; white-space: nowrap;
    }
    #es3d-controls button:hover:not(:disabled) { background: var(--es-ink); color: var(--es-yellow); }
    #es3d-controls button:disabled { opacity: 0.3; cursor: default !important; }

    #es3d-corner { position: fixed; right: 12px; bottom: max(56px, calc(env(safe-area-inset-bottom) + 56px)); z-index: 9000; display: flex; flex-direction: column; gap: 0.5em; transition: opacity 0.2s ease; }
    #es3d-corner button {
      width: 3em; height: 3em; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; padding: 0;
      color: var(--es-ink); background: var(--es-yellow); border: 2px solid var(--es-ink); border-radius: 50%; box-shadow: 0 4px 14px rgba(0,0,0,0.5);
    }
    #es3d-corner button:hover, #es3d-corner button.es3d-muted { background: var(--es-ink); color: var(--es-yellow); border-color: var(--es-yellow); }

    #es3d-panel {
      position: fixed; inset: 0; z-index: 9500; display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.55);
    }
    #es3d-panel-card { position: relative; width: min(34em, 100%); max-height: min(90vh, 100%); overflow-y: auto; padding: 1.1em 1.1em 1em; }
    #es3d-panel-close {
      position: absolute; top: 0.2em; right: 0.2em; width: 1.9em; height: 1.9em; font-size: 1.7em; font-weight: 700; line-height: 1;
      color: var(--es-ink); background: none; border: none;
    }
    #es3d-panel h2 { margin: 0 2em 0.45em 0; font-size: 1.5em; }
    #es3d-panel h3 { margin: 1em 0 0.35em; font-size: 1.15em; }
    #es3d-panel p { margin: 0 0 0.6em; line-height: 1.45; }
    #es3d-panel ol { margin: 0 0 0.7em 1.3em; padding: 0; line-height: 1.5; }
    #es3d-panel .es3d-note { font-size: 0.88em; opacity: 0.85; }
    #es3d-panel .es3d-btn { font-size: 1em; padding: 0.5em 1.1em; margin: 0.25em 0.4em 0.25em 0; }
    .es3d-section { padding: 0.8em 0 0.1em; margin-top: 0.8em; border-top: 2px solid var(--es-line); }
    .es3d-section h3 { margin-top: 0 !important; }

    .es3d-hint-card { padding: 0.7em 0.8em; margin: 0 0 0.6em; background: var(--es-yellow-soft); border-radius: 0.4em; }
    .es3d-hint-title { display: flex; justify-content: space-between; align-items: center; gap: 0.6em; font-size: 1.1em; font-weight: 800; margin-bottom: 0.35em; }
    .es3d-hint-title span { font-size: 0.8em; font-weight: 400; }
    .es3d-hint-card.es3d-found .es3d-hint-title { margin-bottom: 0; }
    .es3d-hint { margin: 0 0 0.5em; line-height: 1.4; }
    .es3d-hint b { display: block; font-size: 0.75em; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.85; }

    .es3d-list-level { padding: 0.55em 0; border-top: 2px solid var(--es-line); display: flex; gap: 0.7em; align-items: flex-start; }
    .es3d-list-level.es3d-current .es3d-list-title { text-decoration: underline; }
    .es3d-list-title { flex: 0 0 5em; font-weight: 800; padding-top: 0.2em; }
    .es3d-list-items { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4em; }
    .es3d-list-go { flex: 0 0 auto; padding: 0.3em 0.9em; font-weight: 700; color: var(--es-yellow); background: var(--es-ink); border: none; border-radius: 0.3em; }

    table.es3d-board { width: 100%; border-collapse: collapse; font-size: 0.95em; font-variant-numeric: tabular-nums; }
    table.es3d-board th { text-align: left; font-size: 0.85em; font-weight: 600; padding: 0.3em 0.4em; }
    table.es3d-board td { padding: 0.4em; border-top: 1px solid var(--es-line); }
    table.es3d-board tr.es3d-me td { font-weight: 800; background: var(--es-yellow-soft); }
    .es3d-stats { display: flex; gap: 0.5em; margin: 0 0 0.8em; }
    .es3d-stat { flex: 1; padding: 0.5em 0.4em; text-align: center; background: var(--es-yellow-soft); border-radius: 0.4em; }
    .es3d-stat b { display: block; font-size: 1.4em; font-variant-numeric: tabular-nums; }
    .es3d-stat span { font-size: 0.82em; }
    #es3d-panel input[type="email"], #es3d-panel input[type="text"], #es3d-panel textarea {
      width: 100%; padding: 0.55em; margin: 0 0 0.5em; font: inherit; font-size: max(16px, 1em); color: var(--es-ink);
      background: var(--es-cream); border: 2px solid var(--es-ink); border-radius: 0.3em;
    }
    #es3d-panel textarea { min-height: 4.5em; resize: vertical; }
    .es3d-share-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(8.5em, 1fr)); gap: 0.5em; margin: 0 0 0.8em; }
    .es3d-share-grid .es3d-btn { margin: 0 !important; text-align: center; display: block; }
    .es3d-consent { display: flex; gap: 0.6em; align-items: flex-start; margin: 0 0 0.6em; font-size: 0.92em; line-height: 1.4; }
    .es3d-consent input { width: 1.3em; height: 1.3em; margin-top: 0.1em; flex: 0 0 auto; accent-color: var(--es-ink); }

    #es3d-toast {
      position: fixed; left: 50%; bottom: 7em; transform: translateX(-50%); z-index: 9600; max-width: calc(100vw - 32px);
      padding: 0.6em 1.2em; font-size: 1.15em; font-weight: 700; color: var(--es-yellow); background: var(--es-ink);
      border: 2px solid var(--es-yellow); border-radius: 0.4em; box-shadow: 0 4px 18px rgba(0,0,0,0.5);
      opacity: 0; pointer-events: none; transition: opacity 0.25s ease; text-align: center;
    }
    #es3d-toast.es3d-show { opacity: 1; }

    /* Stands in for the mouse pointer while the tour is loading something. */
    #es3d-spinner {
      position: fixed; left: 0; top: 0; width: 30px; height: 30px; margin: -15px 0 0 -15px; z-index: 2147483647; pointer-events: none;
      border-radius: 50%; border: 5px solid var(--es-ink); border-top-color: var(--es-yellow); box-shadow: 0 0 0 2px var(--es-yellow);
      animation: es3d-spin 0.8s linear infinite;
    }
    @keyframes es3d-spin { to { rotate: 360deg; } }

    @media (max-width: 560px) {
      #es3d-welcome h1 { font-size: 2em; }
      #es3d-controls { gap: 0; }
      #es3d-controls button { min-width: 3.6em; padding: 0.35em 0.2em; }
      #es3d-corner { bottom: 5.8em; }
    }
  `;

  const ICONS = {
    back: '<path d="M11 6l-6 6 6 6M19 6l-6 6 6 6"/>',
    skip: '<path d="M13 6l6 6-6 6M5 6l6 6-6 6"/>',
    riddle: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"/>',
    hints: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 4M12 17h.01"/>',
    list: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',
    share: '<path d="M12 15V4M8 8l4-4 4 4M5 12v7h14v-7"/>',
    soundOff: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>'
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

  function buildUI() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    ui.dim = el('div', 'es3d-dim');
    ui.cover = el('div', 'es3d-cover');
    ui.loading = el('div', 'es3d-loading', 'Opening the store…');
    ui.loading.classList.add('es3d-hidden');
    ui.welcome = el('div', 'es3d-welcome');
    ui.prompt = el('div', 'es3d-prompt', '<p>Welcome to the store. Watch the short intro and the hunt begins.</p><button class="es3d-btn" type="button" id="es3d-prompt-go">Watch the intro</button>');
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
        ${control('list', 'list', 'Finds', 'Everything found so far')}
        ${control('share', 'share', 'Share', 'Share the game')}
        ${control('next', 'skip', 'Skip', 'Skip to the next level')}
      </div>`);
    ui.hud.classList.add('es3d-hidden');
    ui.panel = el('div', 'es3d-panel', '<div id="es3d-panel-card" class="es3d-card"><button id="es3d-panel-close" type="button" aria-label="Close">&times;</button><div id="es3d-panel-body"></div></div>');
    ui.panel.classList.add('es3d-hidden');
    ui.corner = el('div', 'es3d-corner', '<button type="button" data-corner="mute"></button>' +
      '<button type="button" data-corner="help" title="How to play" aria-label="How to play">' + icon('help') + '</button>');
    ui.corner.classList.add('es3d-hidden');
    ui.spinner = el('div', 'es3d-spinner');
    ui.spinner.classList.add('es3d-hidden');
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
      else showHelpPanel();
    });
    // A "?" slot opens the hints for that object.
    document.getElementById('es3d-slots').addEventListener('click', (e) => {
      const slot = e.target.closest('button[data-slot]');
      if (slot) showHintPanel(Number(slot.dataset.slot));
    });
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
      ['Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
      ['Discord', 'copy:Link copied. Paste it into any Discord chat.'],
      ['Text message', 'sms:?&body=' + m],
      ['Email', 'mailto:?subject=' + encodeURIComponent('Eye Spy 3D') + '&body=' + m],
      ['WhatsApp', 'https://wa.me/?text=' + m],
      ['X', 'https://twitter.com/intent/tweet?text=' + m],
      ['Reddit', 'https://www.reddit.com/submit?url=' + u + '&title=' + encodeURIComponent('Eye Spy 3D')],
      ['Copy link', 'copy:Link copied.']
    ];
    if (navigator.share) links.push(['More\u2026', 'native:']);
    openPanel(`
      <h2>Share Eye Spy 3D</h2>
      <p>Send the game to someone who would enjoy the hunt.</p>
      <div class="es3d-share-grid">
        ${links.map(([label, target], i) => target.startsWith('copy:') || target.startsWith('native:')
          ? '<button class="es3d-btn es3d-quiet" type="button" data-share="' + i + '">' + esc(label) + '</button>'
          : '<a class="es3d-btn es3d-quiet" href="' + esc(target) + '"' + (/^https:/.test(target) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(label) + '</a>').join('')}
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

  // One switch for every sound: the riddle, MPEmbed's own players and the
  // intro video. MPEmbed makes new audio elements as the player moves, so
  // this is re-applied on a timer.
  function applyMute() {
    sfxPool.concat(clueAudio).forEach((node) => { node.muted = state.muted; });
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
    if (!YOUTUBE_VIDEO_ID) { finish(); return; }

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

  // ---------------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------------
  function riddleHtml(level) {
    return esc(level.riddle).replace(/\{([^|}]+)\|([^}]+)\}/g, (m, id, words) =>
      '<span class="es3d-item' + (state.found[id] ? ' es3d-found' : '') + '">' + words + '</span>' +
      (state.found[id] ? '<span class="es3d-tick es3d-on-yellow" aria-label="found">&#10003;</span>' : ''));
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
    const steps = [{ label: 'A nudge', text: item.hint }];
    if (item.where) steps.push({ label: 'Where to look', text: item.where });
    steps.push({ label: 'What it is', text: item.name + '.' });
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
      const title = 'Object ' + (i + 1);
      if (state.found[item.id]) {
        return '<div class="es3d-hint-card es3d-found"><div class="es3d-hint-title">' + title + ': ' + esc(item.name) + '<span class="es3d-tick es3d-on-yellow" aria-label="found">&#10003;</span></div></div>';
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
      <p class="es3d-note">This riddle hides ${level.items.length} objects, listed in the order the riddle mentions them. Each has its own hints. Hints used so far: ${state.hintsUsed}.</p>
      ${cards}`);
    card.scrollTop = keepScroll;
    const focus = typeof focusIndex === 'number' ? card.querySelector('[data-card="' + focusIndex + '"]') : null;
    if (focus) card.scrollTop = Math.max(0, focus.offsetTop - 16);
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
    openPanel(`
      <h2>How to play</h2>
      <ol>
        <li>At each stop a riddle plays. It names several objects hidden around you.</li>
        <li>Look around and click each object when you spot it.</li>
        <li>Find them all and you move on to the next stop. There are ${LEVELS.length} stops.</li>
      </ol>
      <h3>The buttons</h3>
      <p><b>Riddle</b> plays the riddle again. <b>Hints</b> gives up to three hints for each object, or click a <b>?</b> at the top. <b>Finds</b> shows everything you have found and lets you jump between stops. <b>Back</b> and <b>Skip</b> move a stop at a time. The round speaker button turns all sound on or off.</p>
      <button class="es3d-btn" type="button" id="es3d-rewatch">Watch the intro again</button>`);
    document.getElementById('es3d-rewatch').addEventListener('click', () => {
      closePanel();
      clueAudio.pause();
      playIntroVideo(() => {});
    });
  }

  function showListPanel() {
    const rows = LEVELS.map((level, i) => `
      <div class="es3d-list-level ${i === state.levelIndex ? 'es3d-current' : ''}">
        <div class="es3d-list-title">Level ${i + 1}<br><span class="es3d-note">${levelFoundCount(level)} / ${level.items.length}</span></div>
        <div class="es3d-list-items">${level.items.map((item) => state.found[item.id]
          ? '<span class="es3d-slot es3d-found"><span class="es3d-tick">&#10003;</span>' + esc(item.name) + '</span>'
          : '<span class="es3d-slot">?</span>').join('')}</div>
        ${i === state.levelIndex ? '' : '<button class="es3d-list-go" type="button" data-go="' + i + '">Go</button>'}
      </div>`).join('');
    openPanel(`<h2>Finds</h2><p>${foundCount()} of ${TOTAL_ITEMS} found.</p>${rows}`);
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

  function arriveAtLevel(index) {
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
      preloadLevelSounds();
      preloadLevelPhotos();
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
      if (backgroundEl) set(backgroundEl, { 'background-color': '#f2c230', display: 'flex', 'align-items': 'center', 'justify-content': 'center' });
      set(labelEl, {
        position: 'static', display: 'block', width: '85%', 'max-width': '85%', 'box-sizing': 'border-box', 'text-align': 'center',
        'font-size': '150%', color: '#2b070c', margin: 'auto', 'background-color': 'transparent', padding: '20px',
        'white-space': 'normal', overflow: 'visible'
      });
    } else {
      set(labelEl, {
        display: 'block', width: '100%', 'box-sizing': 'border-box', 'text-align': 'center', 'font-size': '240%',
        color: '#2b070c', margin: '0', 'background-color': '#f2c230', padding: '14px 24px',
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
          const level = LEVELS[state.levelIndex];
          timePopupPhoto(img, level ? matchItem(level, labelEl ? labelEl.textContent : '', img ? img.getAttribute('src') : '') : null);
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

  // The hidden objects must not give themselves away by changing the mouse
  // cursor on hover, so the cursor is pinned to the plain arrow, both on this
  // page and inside the tour's frame where the browser allows it. Whenever the
  // tour itself asks for a busy cursor while something loads, the arrow is
  // hidden altogether and our own spinning wheel follows the mouse instead,
  // so the player can see they need to wait.
  const CURSOR_RULE_PAGE = 'html, body, body *:not(.es3d):not(.es3d *) { cursor: default !important; } ' +
    '#customBillboardFullOverlay [class*="close"] { cursor: pointer !important; }';
  const CURSOR_RULE_FRAME = '* { cursor: default !important; }';
  const CURSOR_RULE_BUSY = '* { cursor: none !important; }';
  let mouseSeen = false;

  function trackMouse(doc, frame) {
    if (doc.__es3dMouse) return;
    doc.__es3dMouse = true;
    doc.addEventListener('mousemove', (e) => {
      const box = frame ? frame.getBoundingClientRect() : { left: 0, top: 0 };
      mouseSeen = true;
      ui.spinner.style.transform = 'translate(' + (box.left + e.clientX) + 'px, ' + (box.top + e.clientY) + 'px)';
    }, { passive: true });
  }

  function steadyCursor() {
    const docs = [[document, CURSOR_RULE_PAGE, null]];
    document.querySelectorAll('iframe').forEach((frame) => {
      try { if (frame.contentDocument && frame.contentDocument.head) docs.push([frame.contentDocument, CURSOR_RULE_FRAME, frame]); } catch (e) {}
    });
    let anyBusy = false;
    const styles = docs.map(([doc, rule, frame]) => {
      if (ui.spinner) trackMouse(doc, frame);
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
      if (probes.some((node) => node && /wait|progress/.test(view.getComputedStyle(node).cursor))) anyBusy = true;
      style.disabled = false;
      return [style, rule];
    });
    // Only swap the arrow for our wheel once we know where the mouse is.
    const showWheel = anyBusy && mouseSeen && !!ui.spinner;
    styles.forEach(([style, rule]) => {
      const wanted = showWheel ? CURSOR_RULE_BUSY : rule;
      if (style.textContent !== wanted) style.textContent = wanted;
    });
    if (ui.spinner) ui.spinner.classList.toggle('es3d-hidden', !showWheel);
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
    setInterval(steadyCursor, 250);
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

  standDownLegacyScript();
  const bootTimer = setInterval(() => {
    if (!document.head || !document.body) return;
    clearInterval(bootTimer);
    buildUI();
    waitForTour();
  }, 50);
})();
