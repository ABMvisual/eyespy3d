// =============================================================================
// EYE SPY 3D - LEADERBOARD AND SIGN-UP BACKEND (Google Apps Script)
//
// Setup, about five minutes:
//   1. Create a new Google Sheet. Extensions > Apps Script.
//   2. Replace the sample code with this whole file and save.
//   3. Deploy > New deployment > type "Web app".
//      Execute as: Me.  Who has access: Anyone.
//   4. Copy the web app URL into BACKEND_URL at the top of mashup_es3d.js.
//
// The sheet gains three tabs: Scores, Signups and Feedback.
// =============================================================================

var TOTAL_ITEMS = 53;
var BOARD_SIZE = 10;
var BLOCKED_EXACT = ['ass', 'abo', 'bum', 'cok', 'coc', 'cnt', 'cun', 'cum', 'dik', 'dic', 'dck', 'fgt', 'gai', 'god',
  'hoe', 'jew', 'jiz', 'kkk', 'kik', 'kyk', 'kys', 'naz', 'nig', 'ngr', 'nob', 'pis', 'poo', 'pus', 'rap', 'rape', 'sex',
  'sht', 'spic', 'tit', 'twt', 'vag', 'wog', 'wtf', 'xxx'];
var BLOCKED_PARTS = ['fuck', 'fuk', 'fuc', 'fck', 'fuq', 'shit', 'cunt', 'cock', 'dick', 'fag', 'nigg', 'niga', 'kike',
  'rapist', 'slut', 'whore', 'bitch', 'pussy', 'twat', 'wank', 'piss', 'tits', 'anus', 'arse', 'coon', 'chink', 'gook',
  'nazi', 'hitler', 'penis', 'vagin', 'dildo', 'porn', 'jizz', 'retard', 'paedo', 'pedo'];

function sheet_(name, headers) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function nameAllowed_(name) {
  if (!/^[A-Z0-9_]{2,10}$/.test(name)) return false;
  var map = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' };
  var plain = name.toLowerCase().replace(/_/g, '').replace(/[0134578]/g, function (d) { return map[d]; });
  if (BLOCKED_EXACT.indexOf(plain) !== -1) return false;
  for (var i = 0; i < BLOCKED_PARTS.length; i++) {
    if (plain.indexOf(BLOCKED_PARTS[i]) !== -1) return false;
  }
  return true;
}

// Text typed by players must never be run as a spreadsheet formula.
function plain_(value, maxLength) {
  var text = String(value || '').slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function readBoard_() {
  var rows = sheet_('Scores', ['playerId', 'name', 'found', 'timeMs', 'hints', 'completed', 'updated']).getDataRange().getValues().slice(1);
  var entries = rows.map(function (row) {
    return { playerId: row[0], name: row[1], found: Number(row[2]), total: TOTAL_ITEMS, timeMs: Number(row[3]), hints: Number(row[4]), completed: row[5] === true };
  });
  // Finishers first, fastest at the top. The rest of the board is filled by
  // whoever has found the most.
  entries.sort(function (a, b) {
    return (b.completed ? 1 : 0) - (a.completed ? 1 : 0) || b.found - a.found || a.timeMs - b.timeMs;
  });
  return entries.slice(0, BOARD_SIZE);
}

function doGet() {
  return json_({ ok: true, board: readBoard_() });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad request' });
  }

  if (body.action === 'score') {
    var name = String(body.name || '').toUpperCase();
    var playerId = String(body.playerId || '').slice(0, 40);
    var found = Math.max(0, Math.min(TOTAL_ITEMS, Math.floor(Number(body.found) || 0)));
    var timeMs = Math.max(0, Math.floor(Number(body.timeMs) || 0));
    var hints = Math.max(0, Math.floor(Number(body.hints) || 0));
    if (!nameAllowed_(name) || !/^p[a-z0-9]{6,39}$/.test(playerId) || found === 0) return json_({ ok: false, error: 'rejected' });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = sheet_('Scores', ['playerId', 'name', 'found', 'timeMs', 'hints', 'completed', 'updated']);
      var ids = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
      var rowNumber = -1;
      for (var i = 1; i < ids.length; i++) {
        if (ids[i][0] === playerId) { rowNumber = i + 1; break; }
      }
      var row = [playerId, name, found, timeMs, hints, found === TOTAL_ITEMS, new Date()];
      if (rowNumber === -1) sheet.appendRow(row);
      else sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  }

  // Sign-ups are only stored with the player's explicit consent to be
  // emailed, and the moment they gave it, so there is a record of permission.
  if (body.action === 'signup') {
    var email = String(body.email || '').trim().slice(0, 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false, error: 'bad email' });
    if (body.consent !== true) return json_({ ok: false, error: 'no consent' });
    sheet_('Signups', ['email', 'consented', 'name', 'playerId', 'when'])
      .appendRow([plain_(email, 200), 'yes', plain_(body.name, 10), plain_(body.playerId, 40), new Date()]);
    return json_({ ok: true });
  }

  if (body.action === 'feedback') {
    var feedback = String(body.feedback || '').trim();
    if (!feedback) return json_({ ok: false, error: 'empty' });
    sheet_('Feedback', ['feedback', 'name', 'playerId', 'when'])
      .appendRow([plain_(feedback, 2000), plain_(body.name, 10), plain_(body.playerId, 40), new Date()]);
    return json_({ ok: true });
  }

  return json_({ ok: false, error: 'unknown action' });
}
