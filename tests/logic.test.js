/* Rule tests. Run with: node tests/logic.test.js */
'use strict';
var assert = require('assert');
var D = require('../data.js');
var L = require('../logic.js');

var count = 0;
function ok(cond, msg) { assert.ok(cond, msg); count += 1; }
function day(y, m, d, h) { return new Date(y, m - 1, d, h || 9); }
var MON = day(2026, 11, 16); /* a Monday */

/* The route */
D.STAGES.forEach(function (s, i) {
  ok(s.from === (i ? D.STAGES[i - 1].to : 0), 'stage ' + (i + 1) + ' starts where the last one ended');
  ok(D.WAYPOINTS[i + 1].mile === s.to, 'a waypoint stands at the end of stage ' + (i + 1));
});
D.STAGES.forEach(function (s, i) { ok(typeof s.scene === 'string' && s.scene.length > 0, 'stage ' + (i + 1) + ' names its scene'); });
ok(D.STAGES.length === 18 && D.STAGES[17].to === 2703 && D.TOTAL_MILES === 2703, '18 stages ending at 2,703 miles');
ok(D.WAYPOINTS.length === 19 && D.WAYPOINTS.filter(function (w) { return w.great; }).length === 6, '19 waypoints, six great');

/* Trials set the working sets */
var s = L.newState(MON);
L.recordTrial(s, 'pullup', 3, MON, true);
var p = L.rx(s, 'pullup');
ok(s.ex.pullup.rung === 2 && p.sets === 5 && p.value === 2, 'a pull-up trial of 3 gives 5 sets of 2');
L.recordTrial(s, 'pushup', 20, MON, true);
ok(L.rx(s, 'pushup').text === '3 × 12', 'a push-up trial of 20 gives 3 sets of 12');
ok(s.miles === 0, 'baseline trials earn no miles');
ok(s.roadSeen === 0, 'a new save has not seen the road yet');
ok(s.settings.theme === 'auto', 'a new save follows the phone for its theme');

/* Miles */
var r = L.completeBlock(s, 'plank', MON);
ok(r.miles === 2.5 && r.bonus === 'company', 'a company block earns 2.5 miles');
r = L.completeBlock(s, 'pushup', MON);
ok(r.miles === 2 && r.bonus === null, 'another block earns 2 miles');
r = L.completeBlock(s, 'walk', MON, { walkMiles: 1.6 });
ok(r.miles === 4.1 && s.miles === 8.6, 'a walk adds its real distance');

/* Progression */
L.completeBlock(s, 'pushup', day(2026, 11, 17));
ok(s.ex.pushup.value === 12, 'two clean sessions do not raise the target');
r = L.completeBlock(s, 'pushup', day(2026, 11, 18));
ok(r.raised && s.ex.pushup.value === 13, 'three clean sessions raise the target');
L.missBlock(s, 'pushup', day(2026, 11, 19));
ok(s.ex.pushup.value === 13, 'one miss holds the target');
r = L.missBlock(s, 'pushup', day(2026, 11, 20));
ok(r.dropped && s.ex.pushup.value === 12, 'two misses lower the target');
s.ex.pullup.value = 4; s.ex.pullup.streak = 2;
r = L.completeBlock(s, 'pullup', day(2026, 11, 20));
ok(r.climbed && s.ex.pullup.rung === 3 && s.ex.pullup.value === 5, 'the top of a rung leads to the next rung');

/* Waypoints and trials */
var w = L.newState(MON); w.miles = 134;
r = L.completeBlock(w, 'plank', MON);
ok(r.crossed[0] === 1 && w.trialsPending[0] === 1 && w.tales[1], 'crossing a waypoint queues a trial and unlocks its tale');
ok(L.trialExercises(1).join() === 'walk,plank', 'a stage trial retests the company exercises');
ok(L.trialExercises(3).length === 9, 'a great trial retests all nine');
w.ex.plank.best = 60;
var before = w.miles;
r = L.recordTrial(w, 'plank', 80, MON);
ok(r.pr && w.miles === L.r1(before + 10), 'a new best in a trial earns 10 miles');

/* Word from afar */
var a = L.newState(MON); a.miles = 440;
ok(L.bonusFor(a, 'plank', MON) === 'afar', 'a people absent for 300 miles sends word');
L.completeBlock(a, 'plank', MON);
ok(L.bonusFor(a, 'walk', day(2026, 11, 17)) === null, 'word from afar counts once a week');

/* Weeks */
var k = L.newState(MON);
for (var d = 16; d <= 20; d++) ['plank', 'pushup', 'squat'].forEach(function (e) { L.completeBlock(k, e, day(2026, 11, d)); });
before = k.miles;
var aw = L.evaluateWeeks(k, day(2026, 11, 23));
ok(aw.length === 1 && aw[0].miles === 5 && k.miles === L.r1(before + 5), 'an unbroken week earns 5 miles');
ok(L.evaluateWeeks(k, day(2026, 11, 23)).length === 0, 'a week is only counted once');
var z = L.newState(MON); z.miles = 820;
for (d = 16; d <= 20; d++) ['plank', 'band', 'squat'].forEach(function (e) { L.completeBlock(z, e, day(2026, 11, d)); });
aw = L.evaluateWeeks(z, day(2026, 11, 23));
ok(aw[0].miles === 10, 'the week counts double while the Wizard is in the company');

/* The band ladder */
var bd = L.newState(MON);
L.recordTrial(bd, 'band', 25, MON, true);
ok(bd.ex.band.rung === 0 && L.rx(bd, 'band').text === '3 rounds: 15 pull-aparts, 11 rows with handles, 9 archer draws per side', 'a band trial of 25 starts on the light band: ' + L.rx(bd, 'band').text);
L.recordTrial(bd, 'band', 40, MON, true);
ok(bd.ex.band.rung === 2 && bd.ex.band.value === 12, 'a band trial of 40 starts on the medium band');
ok(D.EXERCISES.band.rungs.length === 6, 'the band ladder has six rungs');

/* Bonds and gifts */
Object.keys(D.PEOPLES).forEach(function (p) {
  ok(D.PEOPLES[p].gifts.length === 4 && D.PEOPLES[p].gifts.every(function (g) { return g.name && /^gf-/.test(g.art); }), p + ' has four gifts, each with a name and a drawing');
});
var g = L.newState(MON);
ok(L.noteBonds(g, MON).length === 0, 'a new Ranger has no gifts');
g.ex.pushup.blocks = 8; g.ex.swing.blocks = 3;
var fresh = L.noteBonds(g, day(2026, 11, 20));
ok(fresh.length === 1 && fresh[0].people === 'dwarves' && fresh[0].gift.name === 'A whetstone' && g.bondDates['dwarves:1'] === '2026-11-20', 'ten bond points earn the first gift and record the day');
ok(L.noteBonds(g, day(2026, 11, 21)).length === 0 && g.bondDates['dwarves:1'] === '2026-11-20', 'a gift is only announced once');

/* The end of the road */
var e = L.newState(MON); e.miles = 2702;
L.completeBlock(e, 'jog', MON);
ok(e.miles === 2703 && L.finished(e), 'miles stop at the Black Gate');

/* Every ladder is well formed */
D.EXERCISE_ORDER.forEach(function (id) {
  var ex = D.EXERCISES[id];
  ex.rungs.forEach(function (g, i) { ok(g.start <= g.top && g.step > 0, id + ' rung ' + (i + 1)); });
  for (var t = 0; t <= 120; t++) {
    var sug = ex.suggest(t);
    ok(sug[0] >= 0 && sug[0] < ex.rungs.length && sug[1] >= 1 && sug[1] <= ex.rungs[sug[0]].top, id + ' trial of ' + t);
  }
});

console.log('all ' + count + ' checks passed');
