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
    '<symbol id="f-scroll" viewBox="0 0 68 68"><path d="M5 63C5 38 20 15 42 13c13-1 21 9 18 21-3 10-15 14-21 6-4-6 1-13 7-11M13 42q-8-2-9-10 8 1 9 10zM25 23q-3-8-11-9 2 8 11 9zM52 13q6-6 13-4-5 7-13 4zM60 38q7 3 7 11-8-3-7-11zM20 54q8 0 12 7-9 1-12-7zM39 40q-2 7-9 8 1-7 9-8z" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></symbol>'
  ];

  var holder = document.createElement('div');
  holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + SYMBOLS.join('') + '</defs></svg>';
  document.body.insertBefore(holder.firstChild, document.body.firstChild);
})();
