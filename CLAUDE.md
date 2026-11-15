# Working rules for The Ranger's Road

A personal web app with no build step. It installs to an iPhone home screen and works offline. Read `STYLE.md` before drawing anything.

## Structure

- No build step, no frameworks, and no network requests at runtime. Files the app loads stay in the repository root.
- `data.js` holds the route, peoples, ladders and rule numbers. `logic.js` holds the rules as pure functions. `app.js` holds screens, storage and sync. `art.js` holds the drawings.
- Visual work must not change the rules or numbers in `data.js` and `logic.js`.

## Offline

- Every new file the app loads is added to `SHELL` in `sw.js`.
- `CACHE` in `sw.js` is raised on every change, and `VERSION` in `app.js` is raised with it, so phones pick up the new files.

## Saved data

- Saved data lives in `localStorage` under `rangers-road-v1`.
- Never change the meaning of an existing field. A new field needs a default in `newState()` in `logic.js` so that `migrate()` in `app.js` fills it in for existing saves.

## Artwork

- All artwork is original inline SVG drawn for this app.
- Do not copy or imitate any existing map, book illustration, film image, logo or emblem, and do not draw recognisable characters. Places are drawn as landscapes.

## Quality bar

- Respect `prefers-reduced-motion`.
- Keep text contrast at 4.5:1 or better and touch targets at 44px or larger.
- Keep the layout usable at 320px wide, with no sideways scroll.

## Before committing

1. Run `node tests/logic.test.js`.
2. Load the app in a headless browser at 390 by 844 and confirm there are no console errors.
3. Commit to `main` with a clear message.
