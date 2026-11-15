/**
 * The Ranger's Road: Google Sheet backup.
 *
 * This script is not part of the app. It lives in your Google account and
 * receives the app's entries, then writes them to a Sheet in your Drive.
 *
 * Setup
 * 1. Change PASSPHRASE below to something only you know.
 * 2. Choose the function "setup" in the toolbar and press Run. Approve the
 *    permission prompt. It creates the Sheet "Ranger's Road Log" in your Drive.
 * 3. Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone. Press Deploy.
 * 4. Copy the web app address (it ends in /exec) into the app's Journal page,
 *    together with the passphrase.
 */
var PASSPHRASE = 'change-this-passphrase';

var HEADERS = ['id', 'time', 'day', 'type', 'exercise', 'entry', 'miles', 'total miles', 'bonus'];
var CHUNK = 40000;

function setup() {
  var ss = book_();
  logSheet_(ss);
  Logger.log('Your Sheet: ' + ss.getUrl());
}

function doGet() {
  return out_({ ok: true, app: "The Ranger's Road", note: 'The web app is running.' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var body = JSON.parse(e.postData.contents);
    if (PASSPHRASE === 'change-this-passphrase') return out_({ ok: false, error: 'set your own passphrase in the script first' });
    if (body.key !== PASSPHRASE) return out_({ ok: false, error: 'wrong passphrase' });
    if (body.action === 'sync') return out_(sync_(body));
    if (body.action === 'restore') return out_(restore_());
    return out_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String((err && err.message) || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) { /* nothing to release */ }
  }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* The Sheet this script is attached to, or one it creates and remembers. */
function book_() {
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* it was deleted; make a new one */ }
  }
  var ss = SpreadsheetApp.create("Ranger's Road Log");
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function tab_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function logSheet_(ss) {
  var log = tab_(ss, 'Log');
  if (log.getLastRow() === 0) {
    log.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    log.setFrozenRows(1);
  }
  return log;
}

function sync_(body) {
  var ss = book_();
  var log = logSheet_(ss);
  var have = {};
  var last = log.getLastRow();
  if (last > 1) {
    log.getRange(2, 1, last - 1, 1).getValues().forEach(function (r) { have[String(r[0])] = true; });
  }
  var rows = [];
  (body.entries || []).forEach(function (en) {
    var id = String(en.id);
    if (have[id]) return;
    have[id] = true;
    rows.push([Number(en.id), String(en.t || ''), String(en.day || ''), String(en.type || ''), String(en.ex || ''),
      String(en.text || ''), Number(en.miles || 0), Number(en.total || 0), String(en.bonus || '')]);
  });
  if (rows.length) {
    var start = log.getLastRow() + 1;
    /* Keep the time, day and text columns as plain text so Sheets does not reinterpret them. */
    log.getRange(start, 2, rows.length, 5).setNumberFormat('@');
    log.getRange(start, 9, rows.length, 1).setNumberFormat('@');
    log.getRange(start, 1, rows.length, HEADERS.length).setValues(rows);
  }

  /* The app's current state, split across cells because one cell holds 50,000 characters at most. */
  var st = tab_(ss, 'State');
  st.clearContents();
  var text = String(body.state || '');
  var parts = [];
  for (var i = 0; i < text.length; i += CHUNK) parts.push(['J' + text.substr(i, CHUNK)]);
  if (parts.length) {
    var range = st.getRange(1, 1, parts.length, 1);
    range.setNumberFormat('@');
    range.setValues(parts);
  }
  return { ok: true, added: rows.length };
}

function restore_() {
  var ss = book_();
  var st = tab_(ss, 'State');
  var log = logSheet_(ss);
  var text = '';
  if (st.getLastRow() > 0) {
    text = st.getRange(1, 1, st.getLastRow(), 1).getValues().map(function (r) { return String(r[0]).slice(1); }).join('');
  }
  var entries = [];
  if (log.getLastRow() > 1) {
    log.getRange(2, 1, log.getLastRow() - 1, HEADERS.length).getValues().forEach(function (r) {
      entries.push({ id: Number(r[0]), t: String(r[1]), day: String(r[2]), type: String(r[3]), ex: String(r[4]),
        text: String(r[5]), miles: Number(r[6]), total: Number(r[7]), bonus: String(r[8]) });
    });
  }
  return { ok: true, state: text, log: entries };
}
