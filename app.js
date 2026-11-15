/* The Ranger's Road: screens and storage. */
(function () {
  'use strict';
  var D = self.RR_DATA, L = self.RR_LOGIC, EX = D.EXERCISES;
  var KEY = 'rangers-road-v1';
  var VERSION = '1.0.6';

  var view = document.getElementById('view');
  var scrim = document.getElementById('scrim');
  var sheet = document.getElementById('sheet');
  var toastEl = document.getElementById('toast');

  var state = load();
  var tab = 'today';
  var timers = {};
  var syncTimer = null, toastTimer = null, syncBusy = false;

  /* ---------- storage ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return migrate(JSON.parse(raw));
    } catch (e) { /* fall through to a fresh start */ }
    return L.newState(new Date());
  }
  function migrate(s) {
    var fresh = L.newState(new Date());
    for (var k in fresh) if (s[k] === undefined) s[k] = fresh[k];
    for (var id in fresh.ex) {
      if (!s.ex[id]) s.ex[id] = fresh.ex[id];
      for (var f in fresh.ex[id]) if (s.ex[id][f] === undefined) s.ex[id][f] = fresh.ex[id][f];
    }
    for (var st in fresh.settings) if (s.settings[st] === undefined) s.settings[st] = fresh.settings[st];
    return s;
  }
  function saveLocal() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast('Could not save on this phone.'); }
  }
  function save() { saveLocal(); queueSync(); }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(n) { return Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 }); }
  function half(n) { return n === 0.5 ? '½' : fmt(n); }
  function art(id, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><use href="#' + id + '"></use></svg>'; }
  function emblem(pid, size) { return art(D.PEOPLES[pid].emblem, 'emb' + (size ? ' ' + size : '')); }
  function emblems(who, size) { return who.map(function (p) { return emblem(p, size); }).join(''); }
  /* A stage's pen-and-ink scene, or nothing if it has not been drawn yet. */
  function scene(id) {
    var sc = (self.RR_SCENES || {})[id];
    if (!sc) return '';
    return '<figure class="scene"><svg viewBox="0 0 358 150" role="img" aria-label="' + esc(sc.alt) + '"><g class="far">' + sc.far + '</g><g class="mid">' + sc.mid + '</g><g class="near">' + sc.near + '</g></svg></figure>';
  }
  function flo(name) { return art('f-' + name, 'flo'); }
  function section(title) { return '<div class="section"><span>' + title + '</span>' + flo('diamonds') + '</div>'; }
  /* A paragraph's text with a decorated first letter. Screen readers get the plain text. */
  function initialed(text) {
    return '<span aria-hidden="true"><span class="initial">' + art('f-scroll') + '<b>' + esc(text.charAt(0)) + '</b></span>' + esc(text.slice(1)) + '</span><span class="sr">' + esc(text) + '</span>';
  }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4200);
  }
  function openSheet(html) { sheet.innerHTML = html; scrim.hidden = false; sheet.scrollTop = 0; }
  function closeSheet() { scrim.hidden = true; sheet.innerHTML = ''; }
  function nextWaypoint() {
    for (var i = 0; i < D.WAYPOINTS.length; i++) if (D.WAYPOINTS[i].mile > state.miles) return D.WAYPOINTS[i];
    return null;
  }
  function isStandalone() {
    return navigator.standalone === true || (self.matchMedia && matchMedia('(display-mode: standalone)').matches);
  }
  function isIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent); }

  /* ---------- shared pieces ---------- */
  function head() {
    var idx = L.stageIndexAt(state.miles), st = D.STAGES[idx], nw = nextWaypoint();
    var pct = Math.min(100, state.miles / D.TOTAL_MILES * 100);
    return scene(st.scene) + '<header class="head">' +
      '<div class="overline">Stage ' + (idx + 1) + ' of ' + D.STAGES.length + ' · Book ' + ['One', 'Two', 'Three'][st.book - 1] + '</div>' +
      '<h1>' + esc(st.road) + '</h1>' +
      '<div class="miles"><b>' + fmt(state.miles) + '</b><span class="muted it">of ' + fmt(D.TOTAL_MILES) + ' miles · ' + esc(L.title(state.miles)) + '</span></div>' +
      '<div class="bar" role="img" aria-label="' + Math.round(pct) + ' percent of the road walked"><i style="width:' + pct.toFixed(2) + '%"></i><s style="left:' + pct.toFixed(2) + '%"></s></div>' +
      (nw ? '<div class="sub">' + fmt(L.r1(nw.mile - state.miles)) + ' miles to ' + esc(nw.name) + '</div>' : '<div class="sub">The road is walked.</div>') +
      '</header>';
  }
  function exNames(ids) { return ids.map(function (id) { return EX[id].name.toLowerCase(); }).join(', '); }

  /* ---------- Today ---------- */
  function vMuster() {
    var rows = D.EXERCISE_ORDER.map(function (id) {
      var e = EX[id];
      return '<label class="field">' + esc(e.name) + ': ' + esc(e.trial.charAt(0).toLowerCase() + e.trial.slice(1)) +
        '<input type="number" inputmode="decimal" min="0" step="any" id="tr-' + id + '" placeholder="' + esc(e.trialUnit) + '"></label>';
    }).join('');
    return '<header class="head"><div class="overline">The muster</div><h1>The Ranger’s Road</h1>' +
      '<div class="sub">Hobbiton to the Black Gate, ' + fmt(D.TOTAL_MILES) + ' miles, walked one workout at a time.</div></header>' +
      installNote() +
      '<div class="card double"><h2>Your first trials</h2>' +
      '<p class="muted" style="margin-top:6px">' + initialed('After a warm-up, do one all-out set of each with clean form. Your daily sets are built from these numbers. Leave any blank to start on the lowest rung; you can record it later on the Ranger page.') + '</p>' +
      '<div class="stack" style="margin-top:14px">' + rows + '</div>' +
      '<div class="btns"><button class="btn primary" data-act="muster">Begin the road</button></div></div>';
  }
  function installNote() {
    if (!isIOS() || isStandalone()) return '';
    return '<div class="note">To put this on your home screen, tap the Share button in Safari, then <b>Add to Home Screen</b>. Do your setup in the home screen app: it keeps its own data, separate from this browser tab.</div>';
  }

  function blockCard(it, i) {
    var e = EX[it.ex], p = L.rx(state, it.ex), people = D.PEOPLES[e.people];
    var why = it.done ? null : L.bonusFor(state, it.ex, new Date());
    var tag = why === 'company' ? '<span class="tag">+½ company</span>' : (why === 'afar' ? '<span class="tag">Word from afar</span>' : '');
    var h = '<article class="card' + (it.done || it.missed ? ' done' : '') + '">' +
      '<div class="row top"><div class="who">' + emblem(e.people) + '<div><div class="overline">' + esc(people.name) + ' · ' + esc(people.trait) + '</div><h3>' + esc(e.name) + '</h3></div></div>' + tag + '</div>' +
      '<p class="muted">' + esc(p.rung.n) + (p.rung.d ? ' · ' + esc(p.rung.d) : '') + '</p>';
    if (it.done) return h + '<p class="hand" style="margin-top:6px">Done · ' + esc(it.note || '') + ' +' + fmt(it.earned) + ' miles</p></article>';
    if (it.missed) return h + '<p class="it muted" style="margin-top:6px">Fell short today. No miles lost.</p></article>';
    h += '<p class="rx">' + esc(p.text) + '</p>';
    if (it.ex === 'walk') {
      h += '<div class="fields"><label class="field">Minutes<input type="number" inputmode="numeric" min="0" id="wm-' + i + '"></label>' +
        '<label class="field">Miles<input type="number" inputmode="decimal" min="0" step="any" id="wd-' + i + '"></label></div>' +
        '<div class="btns"><button class="btn primary" data-act="walk" data-i="' + i + '">Log the walk</button></div>';
    } else {
      var ready = true;
      if (p.sets > 1) {
        h += '<div class="sets" role="group" aria-label="Sets">';
        for (var n = 1; n <= p.sets; n++) {
          h += '<button class="set' + (n <= it.ticks ? ' on' : '') + '" data-act="tick" data-i="' + i + '" data-n="' + n + '" aria-pressed="' + (n <= it.ticks) + '" aria-label="Set ' + n + ' of ' + p.sets + '">' + n + '</button>';
        }
        h += '</div><div class="rest" data-rest="' + i + '"></div>';
        ready = it.ticks >= p.sets;
      }
      h += '<div class="btns"><button class="btn primary" data-act="finish" data-i="' + i + '"' + (ready ? '' : ' disabled') + '>Finish block</button>' +
        '<button class="btn quiet" data-act="miss" data-i="' + i + '">Fell short</button></div>';
    }
    return h + '<button class="link" data-act="swap" data-i="' + i + '">Swap for another exercise</button></article>';
  }

  function vToday() {
    if (!state.onboarded) return vMuster();
    var now = new Date(), plan = L.ensurePlan(state, now);
    var st = L.stageAt(state.miles);
    var h = head() + installNote();
    if (L.finished(state)) h += '<div class="card double"><h2>The road is walked</h2><p class="muted" style="margin-top:6px">Hobbiton to the Black Gate. Your training carries on; the miles are complete.</p></div>';
    state.trialsPending.forEach(function (wi) {
      var w = D.WAYPOINTS[wi];
      h += '<div class="card double"><div class="overline">' + (w.great ? 'A great trial' : 'A trial') + '</div><h2>' + esc(w.name) + '</h2>' +
        '<p class="muted" style="margin-top:4px">' + esc(w.trial) + ' Retest ' + esc(exNames(L.trialExercises(wi))) + '. A new best is worth ' + D.RULES.prMiles + ' miles.</p>' +
        '<div class="btns"><button class="btn primary" data-act="trial" data-wi="' + wi + '">Begin the trial</button></div></div>';
    });
    var who = st.who.filter(function (p) { return p !== 'wizard'; }), ids = [];
    who.forEach(function (p) { ids = ids.concat(D.PEOPLES[p].ex); });
    h += '<div class="card"><div class="row top"><div><div class="overline">Your company</div><h3>' + esc(st.as) + '</h3></div><div class="embs">' + emblems(st.who, st.who.length > 2 ? '' : 'big') + '</div></div>' +
      '<p class="muted" style="margin-top:4px">' + (who.length >= 4 ? 'Every exercise earns the extra half mile.' : 'Their exercises earn an extra half mile: ' + esc(exNames(ids)) + '.') +
      (L.wizardNear(state.miles) ? ' While the Wizard is near, an unbroken week counts double.' : '') + '</p></div>';
    h += '' + section('Today’s march') + '';
    plan.items.forEach(function (it, i) { h += blockCard(it, i); });
    h += '<div class="btns"><button class="btn" data-act="add">Add another block</button></div>';
    var days = L.sessionDays(state, L.weekKey(now));
    h += '<p class="muted it" style="margin:14px 4px 0">' + days + ' of ' + state.settings.perWeek + ' full marches this week. A full march is ' + D.RULES.sessionBlocks + ' finished blocks in a day.</p>';
    return h;
  }

  /* ---------- Road ---------- */
  function vRoad() {
    var idx = L.stageIndexAt(state.miles), done = L.finished(state);
    var h = '<header class="head"><div class="overline">The Ranger’s Road</div><h1>Hobbiton to the Black Gate</h1>' +
      '<div class="sub">' + fmt(state.miles) + ' of ' + fmt(D.TOTAL_MILES) + ' miles. Tap a place you have reached to read its tale.</div></header><div class="road">';
    D.WAYPOINTS.forEach(function (w, i) {
      var reached = state.miles >= w.mile;
      if (i < D.STAGES.length && (i === 0 || D.STAGES[i].book !== D.STAGES[i - 1].book)) {
        h += '<div class="book"><span>Book ' + ['One', 'Two', 'Three'][D.STAGES[i].book - 1] + '</span>' + flo('knot') + '</div>';
      }
      h += '<div class="wp ' + (reached ? 'reached' : 'unreached') + (w.great ? ' great' : '') + '"><span class="dot"></span>' +
        '<button data-act="tale" data-wi="' + i + '"' + (reached ? '' : ' disabled') + '><span class="name">' + esc(w.name) + '</span><span class="mile">mile ' + fmt(w.mile) + '</span></button></div>';
      if (i < D.STAGES.length) {
        var s = D.STAGES[i], here = !done && i === idx, cls = here ? 'here' : (state.miles >= s.to ? 'walked' : 'ahead');
        h += '<div class="leg ' + cls + '">' + (here ? '<span class="you" role="img" aria-label="You are here"></span>' : '') +
          '<svg aria-hidden="true"><use href="#g-' + s.glyph + '"></use></svg><div><div>' + esc(s.road) + '</div>' +
          '<div class="it">' + (here ? 'You are here, ' + fmt(L.r1(s.to - state.miles)) + ' miles from ' + esc(D.WAYPOINTS[i + 1].name) + ' · ' : fmt(s.to - s.from) + ' miles · ') + 'with ' + esc(s.as) + ' ' + emblems(s.who, 'small') + '</div></div></div>';
      }
    });
    return h + '</div>';
  }

  /* ---------- Ranger ---------- */
  function vRanger() {
    var h = '<header class="head"><div class="overline">Your Ranger</div><h1>' + esc(L.title(state.miles)) + '</h1>' +
      '<div class="sub">' + fmt(state.miles) + ' miles walked · ' + state.weeks.streak + ' unbroken ' + (state.weeks.streak === 1 ? 'week' : 'weeks') + ' running, best ' + state.weeks.best + '</div></header>';
    h += '' + section('Bonds') + '<div class="card">';
    ['hobbits', 'elves', 'dwarves', 'men', 'wizard'].forEach(function (pid) {
      var p = D.PEOPLES[pid], b = L.bond(state, pid);
      var prev = (pid === 'wizard' ? D.WIZARD_RANKS : D.BOND_RANKS)[b.index].at;
      var pct = b.next ? Math.min(100, (b.points - prev) / (b.next.at - prev) * 100) : 100;
      h += '<div class="bond"><div class="row"><div class="who">' + emblem(pid) + '<div><div class="overline">' + esc(p.trait) + '</div><h3>' + esc(p.name) + '</h3></div></div><span class="tag plain">' + esc(b.rank) + '</span></div>' +
        '<div class="meter" role="img" aria-label="' + Math.round(pct) + ' percent to the next rank"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
        '<p class="muted it" style="margin-top:6px">' + (b.next ? (pid === 'wizard' ? 'Best run of ' + b.points + (b.points === 1 ? ' unbroken week; ' : ' unbroken weeks; ') + esc(b.next.name) + ' at ' + b.next.at + '.' : b.points + (b.points === 1 ? ' bond point; ' : ' bond points; ') + esc(b.next.name) + ' at ' + b.next.at + '.') : 'The bond is complete.') + '</p>' +
        '<p style="margin-top:2px">' + (b.gifts.length ? 'Gifts: ' + esc(b.gifts.join(', ')) + '.' : '<span class="muted">No gifts yet.</span>') + '</p></div>';
    });
    h += '</div>' + section('Training') + '<div class="card">';
    D.EXERCISE_ORDER.forEach(function (id) {
      var e = EX[id], s = state.ex[id], p = L.rx(state, id);
      h += '<div class="exrow"><div class="row"><div><h3>' + esc(e.name) + '</h3><p class="muted">Rung ' + (s.rung + 1) + ' of ' + e.rungs.length + ' · ' + esc(p.rung.n) + '</p></div>' +
        '<button class="btn quiet" data-act="adjust" data-ex="' + id + '" aria-label="Adjust ' + esc(e.name) + '">Adjust</button></div>' +
        '<p style="margin-top:4px">' + esc(p.text) + '</p>' +
        '<p class="muted it">' + (s.best != null ? 'Best trial: ' + fmt(s.best) + ' ' + esc(e.trialUnit) : 'No trial yet') + ' · ' + s.blocks + (s.blocks === 1 ? ' block' : ' blocks') + ' done</p></div>';
    });
    return h + '</div>';
  }

  /* ---------- Journal ---------- */
  function vMore() {
    var now = new Date(), s = state.settings;
    var opts = [3, 4, 5, 6, 7].map(function (n) { return '<option value="' + n + '"' + (n === s.perWeek ? ' selected' : '') + '>' + n + ' marches a week</option>'; }).join('');
    var h = '<header class="head"><div class="overline">Journal</div><h1>Records and backup</h1>' +
      '<div class="sub">' + L.sessionDays(state, L.weekKey(now)) + ' of ' + s.perWeek + ' full marches this week</div></header>';
    h += '<div class="card"><label class="field">An unbroken week needs<select id="perweek">' + opts + '</select></label></div>';
    h += '' + section('Google Sheet') + '<div class="card"><p class="muted">Paste the web app address and passphrase from your Sheet’s script. The app then copies every entry to the Sheet whenever you are online.</p>' +
      '<div class="stack" style="margin-top:10px"><label class="field">Web app address<input type="url" id="syncurl" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(s.syncUrl) + '" placeholder="https://script.google.com/macros/s/…/exec"></label>' +
      '<label class="field">Passphrase<input type="password" id="synckey" autocomplete="off" value="' + esc(s.syncKey) + '"></label></div>' +
      '<p class="muted it" style="margin-top:8px" id="syncstatus">' + esc(syncStatus()) + '</p>' +
      '<div class="btns"><button class="btn primary" data-act="sync">Save and sync</button><button class="btn" data-act="restore">Restore</button></div></div>';
    h += '' + section('Backup file') + '<div class="card"><p class="muted">A file copy of everything, kept wherever you save it.</p>' +
      '<div class="btns"><button class="btn" data-act="export">Save a file</button><button class="btn" data-act="import">Load a file</button></div>' +
      '<input type="file" id="importfile" accept=".json,application/json" hidden></div>';
    h += '' + section('Recent entries') + '<div class="card log"><ul>';
    var recent = state.log.slice(-30).reverse();
    if (!recent.length) h += '<li><span class="muted">Nothing yet.</span></li>';
    recent.forEach(function (l) {
      h += '<li><span><span class="muted">' + esc(l.day) + '</span> ' + esc(l.text) + '</span>' + (l.miles ? '<span class="m">+' + fmt(l.miles) + '</span>' : '') + '</li>';
    });
    h += '</ul></div><div class="btns"><button class="btn quiet" data-act="reset">Start over</button></div>' +
      '<p class="muted it" style="margin:14px 4px 0">The Ranger’s Road, version ' + VERSION + '. A personal, non-commercial fan project.</p>';
    return h;
  }
  function syncStatus() {
    if (!state.settings.syncUrl) return 'Not connected. Your data is saved on this phone only.';
    var waiting = state.log.length - state.sync.sent;
    var last = state.sync.lastOk ? 'Last synced ' + new Date(state.sync.lastOk).toLocaleString() + '.' : 'Not synced yet.';
    return last + (waiting > 0 ? ' ' + waiting + ' entries waiting.' : '') + (state.sync.lastError ? ' Last attempt failed: ' + state.sync.lastError : '');
  }

  /* ---------- sheets ---------- */
  function trialSheet(wi) {
    var w = D.WAYPOINTS[wi], ids = L.trialExercises(wi);
    var rows = ids.map(function (id) {
      var e = EX[id], s = state.ex[id];
      return '<label class="field">' + esc(e.name) + ': ' + esc(e.trial.charAt(0).toLowerCase() + e.trial.slice(1)) + (s.best != null ? ' (best ' + fmt(s.best) + ')' : '') +
        '<input type="number" inputmode="decimal" min="0" step="any" id="tr-' + id + '" placeholder="' + esc(e.trialUnit) + '"></label>';
    }).join('');
    openSheet('<div class="overline">' + (w.great ? 'A great trial' : 'A trial') + '</div><h2>' + esc(w.name) + '</h2>' +
      '<p class="muted" style="margin-top:6px">' + esc(w.trial) + ' Warm up, then give each one all-out set. Leave blank any you skip.</p>' +
      '<div class="stack" style="margin-top:14px">' + rows + '</div>' +
      '<div class="btns"><button class="btn primary" data-act="trialsave" data-wi="' + wi + '">Record the trial</button><button class="btn quiet" data-act="close">Not now</button></div>' +
      '<button class="link" data-act="trialskip" data-wi="' + wi + '">Skip this trial altogether</button>');
  }
  function taleSheet(wi, arrived) {
    var w = D.WAYPOINTS[wi];
    openSheet('<div class="overline">' + (arrived ? 'You have reached' : 'Mile ' + fmt(w.mile)) + '</div><h2>' + esc(w.name) + '</h2>' +
      '<p class="tale">' + initialed(w.tale) + '</p><div class="endflo">' + flo('sprig') + '</div>' +
      (arrived && state.trialsPending.indexOf(wi) !== -1 ? '<p class="muted it" style="margin-top:12px">A trial awaits you on the Today page.</p>' : '') +
      '<div class="btns"><button class="btn primary" data-act="close">Onward</button></div>');
  }
  function chooseSheet(i) {
    var rows = D.EXERCISE_ORDER.map(function (id) {
      var e = EX[id], why = L.bonusFor(state, id, new Date());
      return '<button class="btn wide" style="justify-content:space-between" data-act="choose" data-i="' + i + '" data-ex="' + id + '"><span class="who">' + emblem(e.people, 'small') + esc(e.name) + '</span>' +
        (why ? '<span class="tag">' + (why === 'company' ? '+½ company' : 'From afar') + '</span>' : '') + '</button>';
    }).join('');
    openSheet('<h2>' + (i === 'new' ? 'Add a block' : 'Swap this block') + '</h2><div class="stack" style="margin-top:14px">' + rows + '</div>' +
      '<div class="btns"><button class="btn quiet" data-act="close">Cancel</button></div>');
  }
  function adjustSheet(id) {
    var e = EX[id], s = state.ex[id];
    var opts = e.rungs.map(function (r, n) { return '<option value="' + n + '"' + (n === s.rung ? ' selected' : '') + '>' + (n + 1) + '. ' + esc(r.n) + '</option>'; }).join('');
    openSheet('<div class="overline">Adjust</div><h2>' + esc(e.name) + '</h2>' +
      '<p class="muted" style="margin-top:6px">Record a new trial and the app sets your rung and sets for you, or set them by hand.</p>' +
      '<div class="stack" style="margin-top:14px"><label class="field">New trial: ' + esc(e.trial.charAt(0).toLowerCase() + e.trial.slice(1)) +
      '<input type="number" inputmode="decimal" min="0" step="any" id="adj-trial" placeholder="' + esc(e.trialUnit) + '"></label>' +
      '<label class="field">Rung<select id="adj-rung" data-ex="' + id + '">' + opts + '</select></label>' +
      '<label class="field">Working number for each set<input type="number" inputmode="numeric" min="1" id="adj-value" value="' + s.value + '"></label></div>' +
      '<div class="btns"><button class="btn primary" data-act="adjsave" data-ex="' + id + '">Save</button><button class="btn quiet" data-act="close">Cancel</button></div>');
  }

  /* ---------- actions ---------- */
  function afterMiles(res, lead) {
    var bits = [lead];
    if (res.raised) bits.push('Target raised.');
    if (res.climbed) bits.push('You climbed a rung.');
    toast(bits.join(' '));
    if (res.crossed && res.crossed.length) taleSheet(res.crossed[res.crossed.length - 1], true);
  }
  function num(id) { var el = document.getElementById(id); if (!el || el.value === '') return null; var n = parseFloat(el.value); return isFinite(n) && n >= 0 ? n : null; }

  var acts = {
    muster: function () {
      var now = new Date();
      D.EXERCISE_ORDER.forEach(function (id) { var t = num('tr-' + id); if (t != null) L.recordTrial(state, id, t, now, true); });
      state.onboarded = true; state.plan = null; save(); render(); self.scrollTo(0, 0);
    },
    tick: function (el) {
      var it = state.plan.items[+el.dataset.i], n = +el.dataset.n, p = L.rx(state, it.ex);
      var was = it.ticks;
      it.ticks = it.ticks === n ? n - 1 : n;
      if (it.ticks > was && it.ticks < p.sets && p.rest > 0) timers[el.dataset.i] = Date.now() + p.rest * 1000;
      else delete timers[el.dataset.i];
      saveLocal(); render();
    },
    finish: function (el) {
      var it = state.plan.items[+el.dataset.i];
      var res = L.completeBlock(state, it.ex, new Date());
      it.done = true; it.earned = res.miles; delete timers[el.dataset.i];
      save(); render(); afterMiles(res, '+' + fmt(res.miles) + ' miles.');
    },
    miss: function (el) {
      var it = state.plan.items[+el.dataset.i];
      var res = L.missBlock(state, it.ex, new Date());
      it.missed = true; delete timers[el.dataset.i];
      save(); render(); toast(res.dropped ? 'Noted. Your target eases a little next time.' : 'Noted. No miles lost.');
    },
    walk: function (el) {
      var i = +el.dataset.i, it = state.plan.items[i], mins = num('wm-' + i), dist = num('wd-' + i);
      if (mins == null || dist == null) { toast('Enter both minutes and miles.'); return; }
      if (dist > 40) { toast('That is more than 40 miles. Check the number.'); return; }
      var p = L.rx(state, 'walk'), now = new Date(), res;
      if (mins >= p.minutes) {
        res = L.completeBlock(state, 'walk', now, { walkMiles: dist });
        it.done = true; it.earned = res.miles; it.note = fmt(dist) + ' miles walked.';
        save(); render(); afterMiles(res, '+' + fmt(res.miles) + ' miles.');
      } else {
        res = L.shortWalk(state, dist, mins, now);
        save(); render(); afterMiles(res, '+' + fmt(res.miles) + ' miles. Walk ' + p.minutes + ' minutes to finish the block.');
      }
    },
    swap: function (el) { chooseSheet(+el.dataset.i); },
    add: function () { chooseSheet('new'); },
    choose: function (el) {
      var i = el.dataset.i, id = el.dataset.ex, item = { ex: id, ticks: 0, done: false, missed: false, earned: 0 };
      if (i === 'new') state.plan.items.push(item); else { state.plan.items[+i] = item; delete timers[i]; }
      saveLocal(); closeSheet(); render();
    },
    trial: function (el) { trialSheet(+el.dataset.wi); },
    trialsave: function (el) {
      var wi = +el.dataset.wi, now = new Date(), prs = 0, any = 0, crossed = [];
      L.trialExercises(wi).forEach(function (id) {
        var t = num('tr-' + id); if (t == null) return;
        var r = L.recordTrial(state, id, t, now, false); any += 1; if (r.pr) prs += 1; crossed = crossed.concat(r.crossed);
      });
      if (!any) { toast('Enter at least one result, or skip the trial.'); return; }
      L.finishTrial(state, wi); save(); closeSheet(); render();
      toast(prs ? prs + ' new ' + (prs === 1 ? 'best' : 'bests') + ': +' + (prs * D.RULES.prMiles) + ' miles.' : 'Trial recorded. No new bests this time.');
      if (crossed.length) taleSheet(crossed[crossed.length - 1], true);
    },
    trialskip: function (el) { L.finishTrial(state, +el.dataset.wi); save(); closeSheet(); render(); },
    tale: function (el) { taleSheet(+el.dataset.wi, false); },
    adjust: function (el) { adjustSheet(el.dataset.ex); },
    adjsave: function (el) {
      var id = el.dataset.ex, s = state.ex[id], e = EX[id], t = num('adj-trial'), now = new Date();
      if (t != null) {
        var r = L.recordTrial(state, id, t, now, s.best == null);
        save(); closeSheet(); render();
        toast(r.pr ? 'A new best: +' + D.RULES.prMiles + ' miles.' : 'Trial recorded.');
        if (r.crossed.length) taleSheet(r.crossed[r.crossed.length - 1], true);
        return;
      }
      var rung = +document.getElementById('adj-rung').value, v = num('adj-value');
      if (v == null || v < 1) { toast('Enter a working number of 1 or more.'); return; }
      s.rung = Math.max(0, Math.min(e.rungs.length - 1, rung)); s.value = Math.round(v); s.streak = 0; s.misses = 0;
      save(); closeSheet(); render(); toast('Saved.');
    },
    close: function () { closeSheet(); },
    sync: function () {
      state.settings.syncUrl = document.getElementById('syncurl').value.trim();
      state.settings.syncKey = document.getElementById('synckey').value;
      saveLocal();
      if (!state.settings.syncUrl) { render(); toast('Saved. No Sheet is connected.'); return; }
      doSync(true);
    },
    restore: function () {
      var url = document.getElementById('syncurl').value.trim(), key = document.getElementById('synckey').value;
      if (!url) { toast('Enter the web app address first.'); return; }
      if (!confirm('Replace what is on this phone with the copy in your Sheet?')) return;
      post(url, { key: key, action: 'restore' }).then(function (j) {
        if (!j.ok) throw new Error(j.error || 'refused');
        if (!j.state) throw new Error('the Sheet has no saved copy yet');
        var s = migrate(JSON.parse(j.state));
        s.log = j.log || []; s.settings.syncUrl = url; s.settings.syncKey = key;
        s.sync = { sent: s.log.length, lastOk: new Date().toISOString() };
        state = s; saveLocal(); render(); toast('Restored from your Sheet.');
      }).catch(function (e) { toast('Restore failed: ' + e.message); });
    },
    export: function () {
      var blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'rangers-road-' + L.dayKey(new Date()) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    },
    import: function () { document.getElementById('importfile').click(); },
    reset: function () {
      if (!confirm('Erase everything on this phone and start again at Hobbiton? Your Sheet is not touched.')) return;
      var keep = state.settings;
      state = L.newState(new Date()); state.settings.syncUrl = keep.syncUrl; state.settings.syncKey = keep.syncKey;
      saveLocal(); tab = 'today'; render();
    }
  };

  /* ---------- sync ---------- */
  function post(url, body) {
    return fetch(url, { method: 'POST', body: JSON.stringify(body), redirect: 'follow' }).then(function (r) {
      if (!r.ok) throw new Error('the Sheet answered ' + r.status);
      return r.json();
    });
  }
  function queueSync() {
    if (!state.settings.syncUrl) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { doSync(false); }, 4000);
  }
  function doSync(manual) {
    if (!state.settings.syncUrl || syncBusy) return;
    if (navigator.onLine === false) { if (manual) toast('You are offline. It will sync when you are back.'); return; }
    var upto = state.log.length;
    syncBusy = true;
    post(state.settings.syncUrl, L.syncPayload(state)).then(function (j) {
      if (!j.ok) throw new Error(j.error || 'refused');
      state.sync.sent = upto; state.sync.lastOk = new Date().toISOString(); delete state.sync.lastError;
      if (manual) toast('Synced to your Sheet.');
    }).catch(function (e) {
      state.sync.lastError = e.message;
      if (manual) toast('Sync failed: ' + e.message);
    }).then(function () {
      syncBusy = false; saveLocal();
      if (tab === 'more' && scrim.hidden) { var el = document.getElementById('syncstatus'); if (el) el.textContent = syncStatus(); }
    });
  }

  /* ---------- wiring ---------- */
  var views = { today: vToday, road: vRoad, ranger: vRanger, more: vMore };
  function render() {
    view.innerHTML = views[tab]();
    var btns = document.querySelectorAll('#tabs button');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].dataset.tab === tab) btns[i].setAttribute('aria-current', 'page'); else btns[i].removeAttribute('aria-current');
    }
    paintTimers();
  }
  function paintTimers() {
    var els = document.querySelectorAll('[data-rest]'), now = Date.now();
    for (var i = 0; i < els.length; i++) {
      var end = timers[els[i].dataset.rest];
      if (!end) { els[i].textContent = ''; continue; }
      var left = Math.ceil((end - now) / 1000);
      if (left > 0) els[i].textContent = 'Rest ' + Math.floor(left / 60) + ':' + (left % 60 < 10 ? '0' : '') + (left % 60);
      else if (left > -20) els[i].textContent = 'Rest is over. Next set.';
      else { delete timers[els[i].dataset.rest]; els[i].textContent = ''; }
    }
  }
  function weekly() {
    if (!state.onboarded) return;
    var awards = L.evaluateWeeks(state, new Date());
    if (awards.length) {
      var m = awards.reduce(function (a, b) { return a + b.miles; }, 0);
      save(); toast('An unbroken week: +' + fmt(m) + ' miles.');
    } else saveLocal();
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-tab]');
    if (t) { tab = t.dataset.tab; render(); self.scrollTo(0, 0); return; }
    if (ev.target === scrim) { closeSheet(); return; }
    var a = ev.target.closest('[data-act]');
    if (a && !a.disabled && acts[a.dataset.act]) acts[a.dataset.act](a);
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.id === 'perweek') { state.settings.perWeek = +el.value; save(); render(); }
    else if (el.id === 'adj-rung') { document.getElementById('adj-value').value = EX[el.dataset.ex].rungs[+el.value].start; }
    else if (el.id === 'importfile' && el.files && el.files[0]) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var s = JSON.parse(reader.result);
          if (!s || s.v !== 1 || !s.ex || !Array.isArray(s.log)) throw new Error('not a backup file');
          if (!confirm('Replace what is on this phone with this backup?')) return;
          state = migrate(s); saveLocal(); render(); toast('Backup loaded.');
        } catch (e) { toast('Could not read that file.'); }
      };
      reader.readAsText(el.files[0]);
      el.value = '';
    }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !scrim.hidden) closeSheet(); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { weekly(); if (scrim.hidden) render(); doSync(false); }
  });
  self.addEventListener('online', function () { doSync(false); });
  setInterval(paintTimers, 500);

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function () { /* the app still works online */ });
  }

  weekly();
  render();
})();
