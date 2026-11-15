/* The Ranger's Road: rules. Pure functions over a plain state object, so they can be tested without a browser. */
(function (root) {
  'use strict';
  var D = root.RR_DATA || (typeof require !== 'undefined' ? require('./data.js') : null);
  var EX = D.EXERCISES, STAGES = D.STAGES, WAYPOINTS = D.WAYPOINTS, RULES = D.RULES, TOTAL = D.TOTAL_MILES;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDay(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function weekKey(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = (x.getDay() + 6) % 7; /* Monday = 0 */
    x.setDate(x.getDate() - dow);
    return dayKey(x);
  }
  function nextWeek(k) { var x = parseDay(k); x.setDate(x.getDate() + 7); return dayKey(x); }
  function r1(n) { return Math.round(n * 10) / 10; }

  function newState(now) {
    var s = {
      v: 1, created: now.toISOString(), onboarded: false, miles: 0, seq: 0,
      ex: {}, log: [], trialsPending: [], trialsDone: {}, tales: { 0: true },
      weeks: { through: null, streak: 0, best: 0 }, afar: {}, plan: null,
      settings: { perWeek: 5, syncUrl: '', syncKey: '' },
      sync: { sent: 0, lastOk: null }
    };
    D.EXERCISE_ORDER.forEach(function (id) {
      var sug = EX[id].suggest(0);
      s.ex[id] = { rung: sug[0], value: sug[1], streak: 0, misses: 0, best: null, prs: 0, blocks: 0, last: null };
    });
    return s;
  }

  function pushLog(state, now, entry) {
    state.seq += 1;
    entry.id = state.seq;
    entry.t = now.toISOString();
    entry.day = dayKey(now);
    entry.total = state.miles;
    state.log.push(entry);
    return entry;
  }

  function stageIndexAt(miles) {
    for (var i = 0; i < STAGES.length; i++) if (miles < STAGES[i].to) return i;
    return STAGES.length - 1;
  }
  function stageAt(miles) { return STAGES[stageIndexAt(miles)]; }
  function finished(state) { return state.miles >= TOTAL; }

  function inCompany(exId, miles) { return stageAt(miles).who.indexOf(EX[exId].people) !== -1; }
  function wizardNear(miles) { return stageAt(miles).who.indexOf('wizard') !== -1; }

  function milesSinceCompany(people, miles) {
    var idx = stageIndexAt(miles);
    if (STAGES[idx].who.indexOf(people) !== -1) return 0;
    for (var j = idx - 1; j >= 0; j--) if (STAGES[j].who.indexOf(people) !== -1) return miles - STAGES[j].to;
    return miles;
  }
  function afarEligible(state, people, now) {
    if (D.TRAINING_PEOPLES.indexOf(people) === -1) return false;
    if (milesSinceCompany(people, state.miles) < RULES.afarMiles) return false;
    return state.afar[people] !== weekKey(now);
  }
  /* 'company', 'afar' or null: why a block of this exercise would earn the bonus right now. */
  function bonusFor(state, exId, now) {
    if (inCompany(exId, state.miles)) return 'company';
    if (afarEligible(state, EX[exId].people, now)) return 'afar';
    return null;
  }

  function rx(state, exId) {
    var s = state.ex[exId], r = EX[exId].rungs[s.rung], v = s.value, sets = r.sets, text;
    if (r.unit === 'reps' && r.sets === 3 && v < 5) sets = 5;
    if (r.bow) {
      text = sets + ' rounds: ' + v + ' pull-aparts, ' + Math.round(0.75 * v) + ' rows, ' + Math.round(0.6 * v) + ' archer draws per side';
    } else if (r.per) {
      text = v + ' minutes, ' + r.per + ' swings each minute (' + (v * r.per) + ' swings)';
    } else if (exId === 'walk') {
      text = r.unit === 'lb' ? '60 minutes carrying ' + v + ' lb' : v + ' minutes';
    } else if (sets > 1) {
      var u = r.unit === 'sec' ? ' seconds' : (r.unit === 'taps' ? ' taps' : '');
      text = sets + ' × ' + v + u + (r.side ? ' per side' : '');
    } else {
      text = v + ' ' + (r.unit === 'min' ? 'minutes' : r.unit);
    }
    return { sets: sets, value: v, rung: r, text: text, rest: r.rest, minutes: exId === 'walk' ? (r.minutes || v) : null };
  }

  function addMiles(state, n, now) {
    var before = state.miles;
    var after = Math.min(TOTAL, r1(before + n));
    state.miles = after;
    var crossed = [];
    WAYPOINTS.forEach(function (w, i) {
      if (i > 0 && w.mile > before && w.mile <= after) {
        crossed.push(i);
        state.tales[i] = true;
        if (!state.trialsDone[i] && state.trialsPending.indexOf(i) === -1) state.trialsPending.push(i);
      }
    });
    return crossed;
  }
  function logCrossed(state, now, crossed) {
    crossed.forEach(function (i) {
      pushLog(state, now, { type: 'waypoint', text: 'Reached ' + WAYPOINTS[i].name, miles: 0 });
    });
  }

  function completeBlock(state, exId, now, opts) {
    opts = opts || {};
    var s = state.ex[exId], p = rx(state, exId), e = EX[exId];
    var why = bonusFor(state, exId, now);
    var bonus = why ? RULES.companyBonus : 0;
    if (why === 'afar') state.afar[e.people] = weekKey(now);
    var walked = exId === 'walk' ? Math.max(0, +opts.walkMiles || 0) : 0;
    var miles = RULES.blockMiles + bonus + walked;

    s.blocks += 1; s.last = now.toISOString(); s.streak += 1; s.misses = 0;
    var raised = false, climbed = false;
    if (s.streak >= RULES.raiseAfter) {
      s.streak = 0;
      if (s.value < p.rung.top) { s.value = Math.min(p.rung.top, s.value + p.rung.step); raised = true; }
      else if (s.rung < e.rungs.length - 1) { s.rung += 1; s.value = e.rungs[s.rung].start; climbed = true; }
    }
    var crossed = addMiles(state, miles, now);
    pushLog(state, now, { type: 'block', ex: exId, text: p.rung.n + ': ' + p.text + (walked ? ' (' + r1(walked) + ' miles walked)' : ''), miles: r1(miles), bonus: why || '' });
    logCrossed(state, now, crossed);
    return { miles: r1(miles), bonus: why, raised: raised, climbed: climbed, crossed: crossed };
  }

  /* A walk shorter than the target still moves you its real distance, but is not a finished block. */
  function shortWalk(state, walkMiles, minutes, now) {
    var m = Math.max(0, +walkMiles || 0);
    var crossed = addMiles(state, m, now);
    pushLog(state, now, { type: 'walk', ex: 'walk', text: 'Walked ' + r1(m) + ' miles in ' + minutes + ' minutes', miles: r1(m) });
    logCrossed(state, now, crossed);
    return { miles: r1(m), crossed: crossed };
  }

  function missBlock(state, exId, now) {
    var s = state.ex[exId], r = EX[exId].rungs[s.rung], dropped = false;
    s.misses += 1; s.streak = 0;
    if (s.misses >= RULES.dropAfter) {
      s.misses = 0;
      if (r.start !== r.top || s.value > r.start) {
        var floor = r.unit === 'reps' ? 1 : r.step;
        var nv = Math.max(floor, s.value - Math.max(r.step, Math.round(s.value * 0.1)));
        if (r.step > 1) nv = Math.max(floor, Math.round(nv / r.step) * r.step);
        if (nv < s.value) { s.value = nv; dropped = true; }
      }
    }
    pushLog(state, now, { type: 'miss', ex: exId, text: r.n + ': fell short', miles: 0 });
    return { dropped: dropped };
  }

  function recordTrial(state, exId, t, now, baseline) {
    var s = state.ex[exId], e = EX[exId];
    t = +t;
    var pr = !baseline && s.best != null && t > s.best;
    var adopted = false, crossed = [];
    if (s.best == null || t > s.best) s.best = t;
    var sug = e.suggest(t);
    if (baseline || sug[0] > s.rung || (sug[0] === s.rung && sug[1] > s.value)) {
      s.rung = sug[0]; s.value = sug[1]; s.streak = 0; s.misses = 0; adopted = true;
    }
    if (pr) { s.prs += 1; crossed = addMiles(state, RULES.prMiles, now); }
    pushLog(state, now, { type: baseline ? 'baseline' : 'trial', ex: exId, text: e.name + ' trial: ' + t + ' ' + e.trialUnit + (pr ? ' (new best)' : ''), miles: pr ? RULES.prMiles : 0 });
    logCrossed(state, now, crossed);
    return { pr: pr, adopted: adopted, crossed: crossed };
  }

  function trialExercises(wi) {
    if (WAYPOINTS[wi].great) return D.EXERCISE_ORDER.slice();
    var who = STAGES[wi - 1].who, out = [];
    D.EXERCISE_ORDER.forEach(function (id) { if (who.indexOf(EX[id].people) !== -1) out.push(id); });
    return out;
  }
  function finishTrial(state, wi) {
    state.trialsDone[wi] = true;
    state.trialsPending = state.trialsPending.filter(function (i) { return i !== wi; });
  }

  function sessionDays(state, wk) {
    var end = nextWeek(wk), counts = {};
    state.log.forEach(function (l) {
      if (l.type === 'block' && l.day >= wk && l.day < end) counts[l.day] = (counts[l.day] || 0) + 1;
    });
    var n = 0;
    for (var k in counts) if (counts[k] >= RULES.sessionBlocks) n += 1;
    return n;
  }

  function evaluateWeeks(state, now) {
    var cur = weekKey(now), awards = [];
    var w = state.weeks.through ? nextWeek(state.weeks.through) : weekKey(new Date(state.created));
    var guard = 0;
    while (w < cur && guard++ < 520) {
      if (sessionDays(state, w) >= state.settings.perWeek) {
        state.weeks.streak += 1;
        state.weeks.best = Math.max(state.weeks.best, state.weeks.streak);
        var m = RULES.weekMiles * (wizardNear(state.miles) ? 2 : 1);
        var crossed = addMiles(state, m, now);
        pushLog(state, now, { type: 'week', text: 'An unbroken week (' + state.weeks.streak + ' running)', miles: m });
        logCrossed(state, now, crossed);
        awards.push({ week: w, miles: m, streak: state.weeks.streak });
      } else {
        state.weeks.streak = 0;
      }
      state.weeks.through = w;
      w = nextWeek(w);
    }
    return awards;
  }

  function leastRecent(state, ids) {
    return ids.slice().sort(function (a, b) {
      var la = state.ex[a].last || '', lb = state.ex[b].last || '';
      if (la !== lb) return la < lb ? -1 : 1;
      return D.EXERCISE_ORDER.indexOf(a) - D.EXERCISE_ORDER.indexOf(b);
    });
  }

  function buildPlan(state, now) {
    var who = stageAt(state.miles).who.filter(function (p) { return D.TRAINING_PEOPLES.indexOf(p) !== -1; });
    var picks = [];
    if (who.length >= 4) {
      picks = leastRecent(state, D.EXERCISE_ORDER).slice(0, 3);
    } else {
      if (who.length === 1) picks = leastRecent(state, D.PEOPLES[who[0]].ex).slice(0, 2);
      else who.forEach(function (p) { picks.push(leastRecent(state, D.PEOPLES[p].ex)[0]); });
      var rest = D.EXERCISE_ORDER.filter(function (id) { return who.indexOf(EX[id].people) === -1; });
      var afar = rest.filter(function (id) { return afarEligible(state, EX[id].people, now); });
      var third = leastRecent(state, afar.length ? afar : rest)[0];
      if (third) picks.push(third);
    }
    return { day: dayKey(now), items: picks.map(function (id) { return { ex: id, ticks: 0, done: false, missed: false, earned: 0 }; }) };
  }
  function ensurePlan(state, now) {
    if (!state.plan || state.plan.day !== dayKey(now)) state.plan = buildPlan(state, now);
    return state.plan;
  }

  function rankOf(points, ranks) {
    var idx = 0;
    for (var i = 0; i < ranks.length; i++) if (points >= ranks[i].at) idx = i;
    return idx;
  }
  function bond(state, people) {
    var points, ranks;
    if (people === 'wizard') { points = state.weeks.best; ranks = D.WIZARD_RANKS; }
    else {
      points = 0; ranks = D.BOND_RANKS;
      D.PEOPLES[people].ex.forEach(function (id) { points += state.ex[id].blocks + 5 * state.ex[id].prs; });
    }
    var idx = rankOf(points, ranks);
    var next = ranks[idx + 1] || null;
    return { points: points, rank: ranks[idx].name, index: idx, next: next, gifts: D.PEOPLES[people].gifts.slice(0, idx) };
  }
  function title(miles) { return D.TITLES[rankOf(miles, D.TITLES)].name; }

  function syncPayload(state) {
    var copy = JSON.parse(JSON.stringify(state));
    delete copy.log;
    copy.settings.syncKey = '';
    return { key: state.settings.syncKey, action: 'sync', state: JSON.stringify(copy), entries: state.log.slice(state.sync.sent) };
  }

  var L = {
    dayKey: dayKey, weekKey: weekKey, nextWeek: nextWeek, r1: r1,
    newState: newState, stageIndexAt: stageIndexAt, stageAt: stageAt, finished: finished,
    inCompany: inCompany, wizardNear: wizardNear, milesSinceCompany: milesSinceCompany,
    afarEligible: afarEligible, bonusFor: bonusFor, rx: rx, addMiles: addMiles,
    completeBlock: completeBlock, shortWalk: shortWalk, missBlock: missBlock,
    recordTrial: recordTrial, trialExercises: trialExercises, finishTrial: finishTrial,
    sessionDays: sessionDays, evaluateWeeks: evaluateWeeks, buildPlan: buildPlan, ensurePlan: ensurePlan,
    bond: bond, title: title, syncPayload: syncPayload, pushLog: pushLog
  };
  root.RR_LOGIC = L;
  if (typeof module !== 'undefined' && module.exports) module.exports = L;
})(typeof self !== 'undefined' ? self : this);
