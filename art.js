/* The Ranger's Road: drawings. Original inline SVG, added to the page at start-up. See STYLE.md. */
(function () {
  'use strict';

  /* Terrain glyphs for the Road page, viewBox 0 0 42 28. */
  var SYMBOLS = [
    '<symbol id="g-hills" viewBox="0 0 42 28"><path d="M3 22q7-10 14 0M14 16q8-11 16 0M26 22q7-9 14 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></symbol>',
    '<symbol id="g-plain" viewBox="0 0 42 28"><path d="M5 22v-6M8 22V12M11 22v-7M19 17v-6M22 17V7M25 17v-7M31 23v-6M34 23v-9M37 23v-5M14 25h8M27 20h3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></symbol>',
    '<symbol id="g-woods" viewBox="0 0 42 28"><path d="M5 18a5 5.5 0 1 1 10 0m-5 0v5M16 14a5 5.5 0 1 1 10 0m-5 0v5M27 19a5 5.5 0 1 1 10 0m-5 0v5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></symbol>',
    '<symbol id="g-peaks" viewBox="0 0 42 28"><path d="M2 24l9-17 9 17M11 7l2 7m1-3l2 8M20 24l8-14 8 14M28 10l2 6m1-3l2 7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="g-cave" viewBox="0 0 42 28"><path d="M4 24l8-15 6 7 5-10 6 9 4-5 5 14M17 24v-5a4 4 0 0 1 8 0v5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="g-river" viewBox="0 0 42 28"><path d="M3 9c5-4 8 4 13 0s8 4 13 0 6 2 10 0M3 16c5-4 8 4 13 0s8 4 13 0 6 2 10 0M3 23c5-4 8 4 13 0s8 4 13 0 6 2 10 0" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></symbol>',
    '<symbol id="g-tower" viewBox="0 0 42 28"><path d="M17 24V8h8v16M15 8h12M17 8V5h2v3m2 0V5h2v3M21 24v-5M4 24h34M8 24l3-6 3 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    /* Flourishes, viewBox 0 0 40 12. */
    '<symbol id="f-diamonds" viewBox="0 0 40 12"><path d="M9 6l3-2.6L15 6l-3 2.6zM16.5 6L20 2l3.5 4L20 10zM25 6l3-2.6L31 6l-3 2.6zM2 6h3.5M34.5 6H38" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="f-knot" viewBox="0 0 40 12"><path d="M4 6C9 .5 15 .5 20 6s11 5.5 16 0C31 .5 25 .5 20 6S9 11.5 4 6z" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="6" r="1.6" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="f-sprig" viewBox="0 0 40 12"><path d="M2 6.6C12 5 28 5 38 6.6M12 5.8q1.5-4.6 6-4.2-1 4-6 4.2zM12 6.4q1.5 4.6 6 4.4-1-4-6-4.4zM28 5.8q-1.5-4.6-6-4.2 1 4 6 4.2zM28 6.4q-1.5 4.6-6 4.4 1-4 6-4.4z" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    /* Leaf scroll behind a decorated initial, viewBox 0 0 68 68. */
    '<symbol id="f-scroll" viewBox="0 0 68 68"><path d="M5 63C5 38 20 15 42 13c13-1 21 9 18 21-3 10-15 14-21 6-4-6 1-13 7-11M13 42q-8-2-9-10 8 1 9 10zM25 23q-3-8-11-9 2 8 11 9zM52 13q6-6 13-4-5 7-13 4zM60 38q7 3 7 11-8-3-7-11zM20 54q8 0 12 7-9 1-12-7zM39 40q-2 7-9 8 1-7 9-8z" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    /* Emblems of the peoples, viewBox 0 0 48 48. Plain objects in designs made for this app. */
    '<symbol id="e-hobbits" viewBox="0 0 48 48"><path d="M3 41C6 4 42 4 45 41M2 41.5h44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="30.5" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="30.5" r="1.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.5 22.5v16M28.5 22.5v16M17 13.5l-1.5-4M24 12V7.500M31 13.5l1.5-4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="e-elves" viewBox="0 0 48 48"><path d="M30 5C39 16 35 31 20 36 11 25 16 10 30 5zM20 36c-2 5-8 7-10 3-1-3 2-5 4-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 8C27 18 24 28 20 36M27.5 15l4.5-1M25.5 21.5l6-.5M23.5 27.5l5 .5M26.5 15.5l-5-1.5M24.5 22l-6-1.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="e-dwarves" viewBox="0 0 48 48"><path d="M9 27h31v3.500c-4 .2-7 2-7.5 5.500V39l5 4.500H13.500l5-4.500v-3c-.5-3.5-4-5.3-9.5-5.500zM9 27l-6 1.7 6 1.800M14 26L34 12.500M30 6.500l9 5.3-4 7-9-5.300z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 34.500h6M17 41h14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="e-men" viewBox="0 0 48 48"><path d="M8 13C6 30 16 42 28 40c8-1 14-10 16-23M33 13c-1 9-5 16-11 17-6 .5-11-6-12-17h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="38.5" cy="15" rx="5.9" ry="2.3" transform="rotate(20 38.5 15)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 21.5l10.5 4.5M23.5 30l2 10M11.5 23l-4 1.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>',
    '<symbol id="e-wizard" viewBox="0 0 48 48"><path d="M17 45L24.5 15c1-5 7-5.5 7.5-1 .3 2.5-2.5 3.5-3.5 2M31 1.5l1.5 3.5L36 6.5 32.5 8 31 11.5 29.5 8 26 6.5l3.5-1.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 29l3 1.5M19.3 36l2.7 1.3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>'
  ];

  function gift(id, inner) {
    return '<symbol id="gf-' + id + '" viewBox="0 0 56 56"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + inner + '</g></symbol>';
  }
  var GIFTS = [
    /* Gifts, viewBox 0 0 56 56. */
    gift('stick', '<path d="M14 50L36 12c2-5 10-4 10 1 0 4-5 6-8 3"/><path stroke-width="1" d="M22 36l3 1M27 27l3 1M9 52h11M17 48l-5 1"/>'),
    gift('pouch', '<path d="M19 24c-8 8-8 24 9 24s17-16 9-24M17 24c5-2 17-2 22 0M19 24l-4-9 7 3 3-7 3 6 3-6 3 7 7-3-4 9"/><path stroke-width="1" d="M37 24c6 2 8 6 6 10M43 34l-2 4M43 34l3 3"/><path fill="url(#h2)" stroke="none" d="M30 27c4 0 7 1 7 1 5 8 2 18-7 19z"/>'),
    gift('pack', '<path d="M14 24q0-8 8-8h12q8 0 8 8v20q0 4-4 4H18q-4 0-4-4zM14 28q14 8 28 0M16 16q0-6 6-6h12q6 0 6 6"/><path stroke-width="1" d="M23 31v9M33 31v9M21 36h4M31 36h4M20 13h16M42 30q5 1 5 7t-5 7"/><path fill="url(#h2)" stroke="none" d="M34 33q4-1 7-3v14q0 3-3 3h-4z"/>'),
    gift('seat', '<path d="M6 32h18M9 32L7 48M21 32l2 16M9 40h13M40 48c-9-2-9-11-3-15 0 4 3 4 3 0 2-6 0-9-1-12 7 3 11 11 9 16 1-1 2-2 2-4 3 6 0 13-6 15z"/><path stroke-width="1" d="M30 50l22-3M30 46l22 4M40 44c-2-2-1-5 1-6 1 3 3 3 2 6"/>'),
    gift('cloak', '<path d="M28 6c-8 0-12 6-12 12L8 48c8 4 32 4 40 0L40 18c0-6-4-12-12-12zM21 18c0-7 14-7 14 0-3 4-11 4-14 0z"/><path stroke-width="1" d="M19 26l-4 21M28 25v25M37 26l4 21"/><path fill="url(#h1)" stroke="none" d="M30 25h8l7 22c-5 2-9 3-15 3z"/>'),
    gift('rope', '<path d="M12 22a16 6 0 1 0 32 0a16 6 0 1 0-32 0M12 22v16a16 6 0 0 0 32 0V22M12 30a16 6 0 0 0 32 0M44 24c7-1 8-9 2-12l-4-1"/><path stroke-width="1" d="M18 29l2 6M26 31l1 6M34 30l-1 7M40 28l-2 6M18 37l2 5M28 39l1 5M38 37l-2 5M22 22a6 2 0 1 0 12 0a6 2 0 1 0-12 0"/>'),
    gift('bow', '<path d="M18 6c24 6 24 38 0 44"/><path stroke-width="2.6" d="M18 6v44"/><path stroke-width="1" d="M32 22l4-1M33 34l4 1M14 6h8M14 50h8M35 26v4"/>'),
    gift('brooch', '<path d="M28 8c13 9 14 25 0 38-14-13-13-29 0-38zM28 46c-1 4-5 5-7 2"/><path stroke-width="1" d="M28 13v29M28 20l6-4M28 27l8-4M28 34l6-3M28 20l-6-4M28 27l-8-4M28 34l-6-3M9 46l8-7M39 19l9-8"/>'),
    gift('whetstone', '<path d="M8 32l24-10 16 7-24 10zM8 32v7l16 7v-7M24 46l24-10v-7"/><path stroke-width="1" d="M18 30l14-6M22 33l14-6M40 10l-3 6M46 14l-5 4M34 8l-1 6"/><path fill="url(#h2)" stroke="none" d="M25 40l22-9.5v5L25 45z"/>'),
    gift('boots', '<path d="M14 8h11v22l11 6q4 2 4 6v4H14zM14 42h26M31 8h10v22M38 37q4 1 8 4v5h-6"/><path stroke-width="1" d="M14 14h11M17 46v2M22 46v2M27 46v2M32 46v2M37 46v2M33 34q-2 4 0 8"/><path fill="url(#h2)" stroke="none" d="M20 16h4v15l10 6q3 2 3 4H20z"/>'),
    gift('mail', '<path fill="url(#h3)" stroke="none" d="M19 12q9 5 18 0l8 6-3 5-5-4v27H19V19l-5 4-3-5z"/><path d="M18 9l-11 8 5 9 6-4v26h20V22l6 4 5-9-11-8q-10 7-20 0z"/><path stroke-width="1" d="M22 48v3M28 48v3M34 48v3"/>'),
    gift('axe', '<path d="M27 6v46M31 6v46M27 6h4M27 52h4M31 12q11-5 19-1c-4 8-4 14 0 22q-8 4-19-1M27 17l-9 4 9 5"/><path stroke-width="1" d="M27 40h4M27 44h4"/><path fill="url(#h2)" stroke="none" d="M40 12q5-1 9 0c-3 8-3 13 0 21q-4 1-9 0z"/>'),
    gift('horn', '<path d="M9 16C7 34 18 46 31 44c9-1 15-11 17-25M37 15c-1 10-6 17-12 18-7 .5-12-6-13-17H9"/><ellipse cx="42.5" cy="17" rx="6.2" ry="2.5" transform="rotate(20 42.5 17)"/><path stroke-width="1" d="M36 24l11 5M26 33l2 11M13 26l-4 2M20 31l-2 9"/>'),
    gift('spear', '<path d="M10 52L40 14M38 16l3-13 8 10-6 5z"/><path stroke-width="1" d="M41 4l2 9M33 23l3 2M31 26l3 2M34 20q9-1 12 5-6-2-13 1"/>'),
    gift('shield', '<circle cx="28" cy="28" r="20"/><circle cx="28" cy="28" r="15"/><circle cx="28" cy="28" r="4.5"/><path stroke-width="1" d="M28 13v10.5M28 32.5V43M13 28h10.5M32.5 28H43"/><path stroke-width="2.4" d="M17.5 17.5h.1M38.5 17.5h.1M17.5 38.5h.1M38.5 38.5h.1"/><path fill="url(#h1)" stroke="none" d="M28 8a20 20 0 0 1 0 40a27 27 0 0 0 0-40z"/>'),
    gift('banner', '<path d="M13 8v46M13 11c10-3 18 3 30 0l-6 9 6 9c-12 3-20-3-30 0"/><circle cx="13" cy="5.5" r="2.2"/><path stroke-width="1" d="M24 15.5l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z"/><path fill="url(#h1)" stroke="none" d="M31 12c4 1 8 1 12-1l-6 9 6 9c-4 2-8 2-12 1z"/>'),
    gift('scroll', '<path d="M12 10h32q4 0 4 4t-4 4H12q-4 0-4-4t4-4zM13 18v22M43 18v22M12 40h32q4 0 4 4t-4 4H12q-4 0-4-4t4-4z"/><path stroke-width="1" d="M19 24h18M19 29h14M19 34h18M12 14h3M12 44h3"/>'),
    gift('fireworks', '<path d="M10 32h26v18H10zM10 37h26M16 32V17l3.5-6 3.5 6v15M26 32V21l3-5 3 5v11"/><path stroke-width="1" d="M46 14V7M46 14l5-5M46 14h7M46 14l5 5M46 14v7M46 14l-5 5M46 14h-7M46 14l-5-5M16 22h7M26 25h6M19.5 11c0-3 2-4 3-6"/>'),
    gift('staff', '<path d="M20 53L29 14c1-6 10-6 10-1 0 5-6 5-6 1"/><path stroke-width="1" d="M24 36l4 2M22 44l3 1.5M27 24l-4-3M23 21q-4-1-5-5 4 0 5 5zM39 13q3-4 8-3-2 5-8 3z"/>'),
    gift('horse', '<path d="M14 50c1-12 5-21 14-27l-3-11 7 6c7 2 12 8 14 17l-5 7-7-5c-5 3-8 8-8 13"/><circle cx="33" cy="25" r="1.3"/><path stroke-width="1" d="M22 28c-5 6-7 13-7 20M19 30c-4 5-6 11-6 16M42 37l1 1M27 14l2 6"/>')
  ];

  /* Hatching for the scenes: h1 light, h2 dense, h3 cross-hatch, hh water, hv vertical, hd stipple. */
  var PATTERNS = [
    '<pattern id="h1" width="24" height="12.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-56)"><path d="M0 2h24M0 6.2h9M12 6.2h12M0 10.4h17M20 10.4h4" fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"/></pattern>',
    '<pattern id="h2" width="24" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-56)"><path d="M0 1.2h24M0 3.7h13M16 3.7h8M0 6.2h24M0 8.7h5M8 8.7h16" fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"/></pattern>',
    '<pattern id="h3" width="24" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-56)"><path d="M0 1.2h24M0 3.7h13M16 3.7h8M0 6.2h24M0 8.7h5M8 8.7h16M3 0v10M9 0v10M15 0v4M15 6v4M21 0v10" fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"/></pattern>',
    '<pattern id="hh" width="40" height="9" patternUnits="userSpaceOnUse"><path d="M0 2.2h13M17 2.2h7M29 2.2h11M5 6.7h11M21 6.7h14" fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"/></pattern>',
    '<pattern id="hv" width="10" height="30" patternUnits="userSpaceOnUse"><path d="M1.5 0v30M5 0v12M5 16v14M8.5 0v22M8.5 26v4" fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"/></pattern>',
    '<pattern id="hd" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M2 3h.1M8 1.5h.1M11.5 7h.1M5 8.5h.1M1.5 12h.1M9 12.5h.1" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></pattern>'
  ];

  var holder = document.createElement('div');
  holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;color:var(--ink)" aria-hidden="true"><defs>' + SYMBOLS.join('') + GIFTS.join('') + PATTERNS.join('') + '</defs></svg>';
  document.body.insertBefore(holder.firstChild, document.body.firstChild);
})();
