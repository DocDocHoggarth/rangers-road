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
    '<symbol id="g-tower" viewBox="0 0 42 28"><path d="M17 24V8h8v16M15 8h12M17 8V5h2v3m2 0V5h2v3M21 24v-5M4 24h34M8 24l3-6 3 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>'
  ];

  var holder = document.createElement('div');
  holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + SYMBOLS.join('') + '</defs></svg>';
  document.body.insertBefore(holder.firstChild, document.body.firstChild);
})();
