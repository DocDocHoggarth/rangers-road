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
  holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;color:var(--ink)" aria-hidden="true"><defs>' + SYMBOLS.join('') + PATTERNS.join('') + '</defs></svg>';
  document.body.insertBefore(holder.firstChild, document.body.firstChild);
})();
