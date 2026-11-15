/* The Ranger's Road: route, peoples and exercise ladders. */
(function (root) {
  'use strict';

  var round = Math.round;
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  var PEOPLES = {
    hobbits: { name: 'Hobbits', trait: 'Endurance', emblem: 'e-hobbits', ex: ['walk', 'plank'],
      gifts: ['A walking stick', 'A pouch of pipe-weed', 'A well-stocked pack', 'A seat by the fire'] },
    elves: { name: 'Elves', trait: 'Grace', emblem: 'e-elves', ex: ['pullup', 'band'],
      gifts: ['A grey cloak', 'A coil of fine rope', 'A new bowstring', 'A leaf-shaped brooch'] },
    dwarves: { name: 'Dwarves', trait: 'Strength', emblem: 'e-dwarves', ex: ['pushup', 'swing'],
      gifts: ['A whetstone', 'Iron-shod boots', 'A shirt of mail', 'An axe from the Mountain'] },
    men: { name: 'Men', trait: 'Vigor', emblem: 'e-men', ex: ['squat', 'jacks', 'jog'],
      gifts: ['A hunting horn', 'A tall spear', 'A round shield', 'A banner of your own'] },
    wizard: { name: 'The Wizard', trait: 'Constancy', emblem: 'e-wizard', ex: [],
      gifts: ['A word of counsel', 'A box of fireworks', 'A staff of ash', 'A swift horse'] }
  };
  var TRAINING_PEOPLES = ['hobbits', 'elves', 'dwarves', 'men'];
  var BOND_RANKS = [
    { at: 0, name: 'Stranger' },
    { at: 10, name: 'Guest' },
    { at: 25, name: 'Companion' },
    { at: 50, name: 'Friend' },
    { at: 100, name: 'Sworn friend' }
  ];
  var WIZARD_RANKS = [
    { at: 0, name: 'Stranger' },
    { at: 1, name: 'Guest' },
    { at: 4, name: 'Companion' },
    { at: 8, name: 'Friend' },
    { at: 16, name: 'Sworn friend' }
  ];

  var TITLES = [
    { at: 0, name: 'Wanderer' },
    { at: 458, name: 'Ranger' },
    { at: 920, name: 'Pathfinder' },
    { at: 1309, name: 'Captain' },
    { at: 1779, name: 'Warden' },
    { at: 2565, name: 'Captain of the West' },
    { at: 2703, name: 'Renowned in the West' }
  ];

  /* who: the people in the company; as: how they appear in this stage. */
  var STAGES = [
    { road: 'Hobbiton to Bree', from: 0, to: 135, who: ['hobbits'], as: 'Hobbits', scene: 'shire', glyph: 'hills', book: 1 },
    { road: 'Bree to Weathertop', from: 135, to: 240, who: ['men'], as: 'Rangers', scene: 'marsh', glyph: 'plain', book: 1 },
    { road: 'Weathertop to Rivendell', from: 240, to: 458, who: ['elves'], as: 'Elves', scene: 'ford', glyph: 'woods', book: 1 },
    { road: 'Rivendell to Hollin', from: 458, to: 660, who: ['men'], as: 'Gondor', scene: 'hollin', glyph: 'hills', book: 1 },
    { road: 'Hollin, Caradhras and the West-gate', from: 660, to: 815, who: ['dwarves'], as: 'Dwarves', scene: 'pass', glyph: 'peaks', book: 1 },
    { road: 'Through Moria', from: 815, to: 855, who: ['dwarves', 'wizard'], as: 'Dwarves and the Wizard', scene: 'mines', glyph: 'cave', book: 1 },
    { road: 'Dimrill Dale to Lothlórien', from: 855, to: 920, who: ['elves'], as: 'Elves', scene: 'lake', glyph: 'woods', book: 1 },
    { road: 'The Great River to Sarn Gebir', from: 920, to: 1240, who: ['elves', 'hobbits'], as: 'Elves and Hobbits', scene: 'river', glyph: 'river', book: 1 },
    { road: 'Sarn Gebir to Parth Galen', from: 1240, to: 1309, who: ['men'], as: 'Gondor', scene: 'rapids', glyph: 'river', book: 1 },
    { road: 'The chase across Rohan to Fangorn', from: 1309, to: 1474, who: ['elves', 'dwarves'], as: 'Elves and Dwarves', scene: 'plains', glyph: 'plain', book: 2 },
    { road: 'Fangorn to Edoras', from: 1474, to: 1604, who: ['wizard', 'men'], as: 'The Wizard and the Riders', scene: 'forest', glyph: 'woods', book: 2 },
    { road: 'Edoras to Helm’s Deep', from: 1604, to: 1723, who: ['men', 'dwarves'], as: 'Riders and Dwarves', scene: 'gorge', glyph: 'plain', book: 2 },
    { road: 'Helm’s Deep to Isengard', from: 1723, to: 1779, who: ['hobbits'], as: 'Hobbits', scene: 'ringwall', glyph: 'tower', book: 2 },
    { road: 'Isengard to Dunharrow', from: 1779, to: 2110, who: ['men', 'elves'], as: 'Rangers and Elves', scene: 'stair', glyph: 'peaks', book: 3 },
    { road: 'The Paths of the Dead to Erech', from: 2110, to: 2160, who: ['dwarves'], as: 'Dwarves', scene: 'door', glyph: 'cave', book: 3 },
    { road: 'Erech to Pelargir', from: 2160, to: 2439, who: ['elves', 'dwarves'], as: 'Elves and Dwarves', scene: 'descent', glyph: 'hills', book: 3 },
    { road: 'Pelargir to Minas Tirith', from: 2439, to: 2565, who: ['men'], as: 'Gondor', scene: 'fleet', glyph: 'river', book: 3 },
    { road: 'Minas Tirith to the Black Gate', from: 2565, to: 2703, who: ['hobbits', 'elves', 'dwarves', 'men', 'wizard'], as: 'All the free peoples', scene: 'gate', glyph: 'tower', book: 3 }
  ];
  var TOTAL_MILES = 2703;

  /* great: retest all nine. tale: original narration, unlocked on arrival. */
  var WAYPOINTS = [
    { mile: 0, name: 'Hobbiton', great: false,
      tale: 'The Shire sleeps easily because Rangers walk its borders unseen. Tonight the watch is yours, and four hobbits are about to need it.' },
    { mile: 135, name: 'Bree', great: false, trial: 'You take up the hobbits’ guard.',
      tale: 'At the inn the hobbits eye the weathered stranger in the corner. By morning they have agreed to follow you into the wild.' },
    { mile: 240, name: 'Weathertop', great: false, trial: 'Hold the hilltop through the night.',
      tale: 'On the broken crown of the hill, shadows climb toward your fire. You hold the height with flame and steel until the night gives way.' },
    { mile: 458, name: 'Rivendell', great: true, trial: 'A great trial while the company forms.',
      tale: 'The ford is behind you and the lights of the valley are ahead. In the Last Homely House a company is chosen, and you are counted in it.' },
    { mile: 660, name: 'Hollin', great: false, trial: 'A trial among the holly trees.',
      tale: 'Holly trees and silent stone. The land still remembers the elves, and crows wheel overhead like spies.' },
    { mile: 815, name: 'The West-gate of Moria', great: false, trial: 'A trial before the doors.',
      tale: 'Snow turned you back from the high pass. Now a door in the cliff waits for a word, and dark water stirs behind you.' },
    { mile: 855, name: 'The Bridge of Khazad-dûm', great: false, trial: 'Hold the bridge.',
      tale: 'Drums sound in the deep. On a narrow span above the abyss your guide stands alone, and you lead the others out into daylight without him.' },
    { mile: 920, name: 'Lothlórien', great: true, trial: 'A great trial under the golden trees.',
      tale: 'Among the golden trees grief is given time. The elves send you on with cloaks, boats and gifts for the road.' },
    { mile: 1240, name: 'Sarn Gebir', great: false, trial: 'A trial at the portage.',
      tale: 'The river quickens into rapids and arrows fly from the eastern bank. You carry the boats along the old portage way.' },
    { mile: 1309, name: 'Parth Galen', great: true, trial: 'A great trial as the company breaks.',
      tale: 'A horn sounds in the woods and falls silent. The company is broken, and you choose to hunt the captors of your friends.' },
    { mile: 1474, name: 'Fangorn', great: false, trial: 'A trial at the forest’s edge.',
      tale: 'Forty-five leagues on foot in under four days. At the eaves of the forest an old man in white steps from the trees, and hope returns with him.' },
    { mile: 1604, name: 'Edoras', great: false, trial: 'A trial in the golden hall.',
      tale: 'A golden hall stands on a green hill. A king shakes off a long shadow, and the Riders muster.' },
    { mile: 1723, name: 'Helm’s Deep', great: false, trial: 'Hold the wall until dawn.',
      tale: 'Rain, ladders and a sea of spears break against the wall. You hold until dawn, when horns answer from the hills.' },
    { mile: 1779, name: 'Isengard', great: true, trial: 'A great trial among the ruins.',
      tale: 'The ring of stone lies drowned and broken. Two hobbits sit on the wreckage, smoking, entirely pleased with themselves.' },
    { mile: 2110, name: 'Dunharrow', great: false, trial: 'A trial before the dark door.',
      tale: 'Your kinsmen have ridden south to find you, grey-cloaked and grim. Above the mountain camp a dark door waits.' },
    { mile: 2160, name: 'The Stone of Erech', great: false, trial: 'A trial at the black stone.',
      tale: 'Under the mountain the dead followed at your heels. At the black stone you call them to fulfil their oath.' },
    { mile: 2439, name: 'Pelargir', great: false, trial: 'A trial on the quays.',
      tale: 'Ninety-three leagues of hard riding bring you to the river port. The black fleet is taken, and the dead are released at last.' },
    { mile: 2565, name: 'Minas Tirith', great: true, trial: 'A great trial on the Pelennor Fields.',
      tale: 'Black sails come up the river, and a king’s banner breaks from the mast. The field before the white city is won by nightfall.' },
    { mile: 2703, name: 'The Black Gate', great: true, trial: 'The final trial.',
      tale: 'A small host stands before the gates of the dark land, buying time for two hobbits far away. The ground shakes, the towers fall, and your road ends.' }
  ];

  function rung(o) {
    var r = { n: '', d: '', unit: 'reps', sets: 3, start: 8, top: 15, step: 1, rest: 75, side: false };
    for (var k in o) r[k] = o[k];
    return r;
  }

  var EXERCISES = {
    pushup: {
      name: 'Push-ups', people: 'dwarves',
      trial: 'Most full push-ups in one set', trialUnit: 'reps',
      rungs: [
        rung({ n: 'Incline push-ups', d: 'Hands on a counter or bench', start: 8, top: 15 }),
        rung({ n: 'Knee push-ups', start: 8, top: 15 }),
        rung({ n: 'Full push-ups', start: 5, top: 20 }),
        rung({ n: 'Feet-raised push-ups', d: 'Feet on a chair', start: 8, top: 15 }),
        rung({ n: 'Archer push-ups', side: true, start: 3, top: 8 })
      ],
      suggest: function (t) {
        if (t >= 34) return [3, 8];
        if (t >= 5) return [2, clamp(round(0.6 * t), 3, 20)];
        if (t >= 1) return [1, 8];
        return [0, 8];
      }
    },
    swing: {
      name: 'Kettlebell swings', people: 'dwarves',
      trial: 'Two-hand swings in 60 seconds', trialUnit: 'swings',
      rungs: [
        rung({ n: 'Two-hand swings', d: 'Five sets, 60 seconds rest', sets: 5, start: 6, top: 10, rest: 60 }),
        rung({ n: 'Two-hand swings, longer sets', d: 'Five sets, 60 seconds rest', sets: 5, start: 11, top: 15, rest: 60 }),
        rung({ n: 'Swings on the minute', d: '10 swings at the top of every minute', unit: 'min', sets: 1, start: 5, top: 10, rest: 0, per: 10 }),
        rung({ n: 'Heavy minutes', d: '15 swings at the top of every minute', unit: 'min', sets: 1, start: 5, top: 10, rest: 0, per: 15 }),
        rung({ n: 'One-hand swings on the minute', d: '10 swings every minute, switching hands each minute', unit: 'min', sets: 1, start: 5, top: 10, rest: 0, per: 10 })
      ],
      suggest: function (t) {
        if (t >= 35) return [2, 5];
        if (t >= 25) return [1, clamp(round(0.5 * t), 11, 15)];
        return [0, clamp(round(0.5 * t), 5, 10)];
      }
    },
    pullup: {
      name: 'Pull-ups', people: 'elves',
      trial: 'Most strict pull-ups from a dead hang', trialUnit: 'reps',
      rungs: [
        rung({ n: 'Band-assisted pull-ups', start: 5, top: 8, rest: 90 }),
        rung({ n: 'Slow lowerings', d: 'Step to the top, lower for 5 seconds', start: 3, top: 5, rest: 90 }),
        rung({ n: 'Full pull-ups, short sets', d: 'Finish with one band-assisted set of 6 to 8', sets: 5, start: 1, top: 4, rest: 120 }),
        rung({ n: 'Full pull-ups', start: 5, top: 8, rest: 120 }),
        rung({ n: 'Pause pull-ups', d: '2-second hold at the top', start: 3, top: 6, rest: 120 }),
        rung({ n: 'Chest-to-bar pull-ups', start: 3, top: 6, rest: 120 }),
        rung({ n: 'Weighted pull-ups', d: 'Start with 10 lb in a backpack', start: 3, top: 5, rest: 150 })
      ],
      suggest: function (t) {
        if (t >= 14) return [4, 4];
        if (t >= 7) return [3, clamp(round(0.6 * t), 5, 8)];
        if (t >= 2) return [2, clamp(round(0.6 * t), 1, 4)];
        if (t >= 1) return [1, 3];
        return [0, 5];
      }
    },
    band: {
      name: 'Band work', people: 'elves',
      trial: 'Most pull-aparts with your lightest band', trialUnit: 'reps',
      rungs: [
        rung({ n: 'Bow drills, lightest band', d: 'Pull-aparts, rows and archer draws', start: 12, top: 20, rest: 60, bow: true }),
        rung({ n: 'Bow drills with a pause', d: '2-second pause at full draw', start: 12, top: 20, rest: 60, bow: true }),
        rung({ n: 'Bow drills, next band up', d: 'Add the pause again once you reach the top', start: 12, top: 20, rest: 60, bow: true })
      ],
      suggest: function (t) { return [0, clamp(round(0.6 * t), 8, 20)]; }
    },
    walk: {
      name: 'Walking', people: 'hobbits',
      trial: 'Miles covered in 30 minutes at a brisk pace', trialUnit: 'miles',
      rungs: [
        rung({ n: '20-minute walk', unit: 'min', sets: 1, start: 20, top: 20, rest: 0 }),
        rung({ n: '30-minute walk', unit: 'min', sets: 1, start: 30, top: 30, rest: 0 }),
        rung({ n: '45-minute walk', unit: 'min', sets: 1, start: 45, top: 45, rest: 0 }),
        rung({ n: '60-minute walk', unit: 'min', sets: 1, start: 60, top: 60, rest: 0 }),
        rung({ n: '60-minute walk with a pack', d: 'The number is the weight of the pack', unit: 'lb', sets: 1, start: 10, top: 20, step: 2, rest: 0, minutes: 60 })
      ],
      suggest: function () { return [1, 30]; }
    },
    plank: {
      name: 'Planks', people: 'hobbits',
      trial: 'Longest forearm plank, in seconds', trialUnit: 'seconds',
      rungs: [
        rung({ n: 'Knee plank', unit: 'sec', start: 20, top: 45, step: 5, rest: 60 }),
        rung({ n: 'Forearm plank', unit: 'sec', start: 20, top: 60, step: 5, rest: 60 }),
        rung({ n: 'Plank with shoulder taps', d: 'On your hands', unit: 'taps', start: 10, top: 20, step: 2, rest: 60 }),
        rung({ n: 'Side plank', unit: 'sec', side: true, start: 20, top: 45, step: 5, rest: 60 }),
        rung({ n: 'Feet-raised plank', unit: 'sec', start: 30, top: 60, step: 5, rest: 60 })
      ],
      suggest: function (t) {
        if (t >= 100) return [2, 10];
        if (t >= 20) return [1, clamp(round(0.6 * t / 5) * 5, 15, 60)];
        return [0, 20];
      }
    },
    squat: {
      name: 'Squats', people: 'men',
      trial: 'Most unbroken bodyweight squats, up to 50', trialUnit: 'reps',
      rungs: [
        rung({ n: 'Chair squats', d: 'Sit and stand', start: 8, top: 15, rest: 60 }),
        rung({ n: 'Bodyweight squats', start: 10, top: 25, rest: 60 }),
        rung({ n: 'Tempo squats', d: '3 seconds down, 1-second pause', start: 8, top: 15, rest: 75 }),
        rung({ n: 'Split squats', side: true, start: 6, top: 12, rest: 75 }),
        rung({ n: 'Single-leg squats to a chair', side: true, start: 3, top: 6, rest: 90 })
      ],
      suggest: function (t) {
        if (t >= 42) return [2, 8];
        if (t >= 10) return [1, clamp(round(0.6 * t), 6, 25)];
        return [0, 8];
      }
    },
    jacks: {
      name: 'Jumping jacks', people: 'men',
      trial: 'Jumping jacks in 60 seconds', trialUnit: 'jacks',
      rungs: [
        rung({ n: 'Step jacks', d: 'No jump', unit: 'sec', start: 30, top: 45, step: 5, rest: 45 }),
        rung({ n: 'Jumping jacks', unit: 'sec', start: 20, top: 30, step: 5, rest: 45 }),
        rung({ n: 'Jumping jacks, long sets', unit: 'sec', start: 35, top: 60, step: 5, rest: 45 }),
        rung({ n: 'Jack intervals', d: '40 seconds on, 20 seconds off', unit: 'rounds', sets: 1, start: 3, top: 6, rest: 0 }),
        rung({ n: 'Long jack intervals', d: '40 seconds on, 20 seconds off', unit: 'rounds', sets: 1, start: 7, top: 10, rest: 0 })
      ],
      suggest: function (t) {
        if (t >= 40) return [2, 40];
        if (t >= 1) return [1, 20];
        return [0, 30];
      }
    },
    jog: {
      name: 'Jogging in place', people: 'men',
      trial: 'Minutes of continuous jogging in place, up to 10', trialUnit: 'minutes',
      rungs: [
        rung({ n: 'March in place', unit: 'min', sets: 1, start: 3, top: 5, rest: 0 }),
        rung({ n: 'Jog and march', d: 'Jog 1 minute, march 1 minute', unit: 'rounds', sets: 1, start: 3, top: 5, rest: 0 }),
        rung({ n: 'Continuous jog', unit: 'min', sets: 1, start: 3, top: 5, rest: 0 }),
        rung({ n: 'Longer jog', unit: 'min', sets: 1, start: 6, top: 10, rest: 0 }),
        rung({ n: 'Long jog', unit: 'min', sets: 1, start: 11, top: 15, rest: 0 }),
        rung({ n: 'Jog with bursts', d: '20-second high-knee burst every 2 minutes', unit: 'min', sets: 1, start: 10, top: 15, rest: 0 })
      ],
      suggest: function (t) {
        if (t >= 10) return [3, 6];
        if (t >= 3) return [2, clamp(round(0.6 * t), 3, 5)];
        if (t >= 1) return [1, 3];
        return [0, 3];
      }
    }
  };
  var EXERCISE_ORDER = ['walk', 'plank', 'pullup', 'band', 'pushup', 'swing', 'squat', 'jacks', 'jog'];

  var RULES = {
    blockMiles: 2,          /* a finished block */
    companyBonus: 0.5,      /* the block belongs to your current company */
    prMiles: 10,            /* a new best in a trial */
    weekMiles: 5,           /* an unbroken week; doubled while the Wizard travels with you */
    sessionBlocks: 3,       /* blocks that make a full day's march */
    afarMiles: 300,         /* absence after which a people sends word */
    raiseAfter: 3,          /* clean sessions before the target rises */
    dropAfter: 2            /* missed sessions before the target drops */
  };

  var DATA = {
    PEOPLES: PEOPLES, TRAINING_PEOPLES: TRAINING_PEOPLES, BOND_RANKS: BOND_RANKS, WIZARD_RANKS: WIZARD_RANKS,
    TITLES: TITLES, STAGES: STAGES, WAYPOINTS: WAYPOINTS, TOTAL_MILES: TOTAL_MILES,
    EXERCISES: EXERCISES, EXERCISE_ORDER: EXERCISE_ORDER, RULES: RULES
  };
  root.RR_DATA = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof self !== 'undefined' ? self : this);
