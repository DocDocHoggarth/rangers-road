# The Ranger's Road

A personal training journal. Every workout moves a Ranger along the road from Hobbiton to the Black Gate: 2,703 miles in 18 stages. It is a private, non-commercial fan project.

It is a plain web app with no build step. It installs to a phone's home screen, works offline, and keeps its data on the phone. It can also copy every entry to a Google Sheet.

## Files

| File | What it is |
| --- | --- |
| `index.html`, `styles.css` | The page and its look |
| `data.js` | The route, the peoples and the exercise ladders |
| `logic.js` | The rules: sets, progression, miles, trials, weekly streaks |
| `app.js` | The screens, storage and sync |
| `scenes.js` | The stage scenes, one pen-and-ink landscape per stage. The Road page shows a strip of each, in ink once walked and in pencil ahead, and reaching a waypoint opens a full page with the scene, the tale and a wax seal. |
| `art.js` | The drawings, as inline SVG. `STYLE.md` describes the art direction. |
| `tests/logic.test.js` | Tests for the rules. Run them with `node tests/logic.test.js`. |
| `CLAUDE.md` | Working rules for anyone, or any assistant, changing the app |
| `sw.js`, `manifest.webmanifest`, `*.png` | Home screen install and offline support |
| `fell*.woff2`, `numerals*.woff2`, `hand.woff2` | Fonts: IM Fell English for text, digits from EB Garamond, and Caveat for handwriting. All are under the SIL Open Font License; see the `FONT-LICENSE*.txt` files. |
| `paper.png`, `tools/make-paper.py` | The paper grain tile and the script that made it |
| `sheet-script.gs` | The Google Apps Script for the Sheet backup. It is not loaded by the app. |

## Put it online with GitHub Pages

1. Put these files in the root of a public repository.
2. In the repository, open Settings, then Pages. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, and save.
3. After a minute the app is live at `https://<your-username>.github.io/<repository-name>/`.

## Install on an iPhone

1. Open the address above in Safari.
2. Tap the Share button, then "Add to Home Screen".
3. Open the app from the home screen and do the first trials there. The home screen app keeps its own data, separate from the Safari tab.

## Back up to a Google Sheet

1. On a computer, go to script.google.com and start a new project.
2. Replace the sample code with the contents of `sheet-script.gs`.
3. Change `PASSPHRASE` near the top to something only you know.
4. Choose the function `setup` in the toolbar and press Run. Approve the permission prompt. This creates a Sheet called "Ranger's Road Log" in your Drive.
5. Press Deploy, then New deployment. Choose the type "Web app". Set "Execute as" to Me and "Who has access" to Anyone. Press Deploy.
6. Copy the web app address, which ends in `/exec`.
7. In the app, open Journal, paste the address and your passphrase, and press "Save and sync".

"Anyone" means anyone who has the address can reach the script, which is why it checks the passphrase before reading or writing anything. Keep both private. Neither is stored in this repository.

## Changing the rules

The mileage rules sit at the bottom of `data.js` under `RULES`. The stages, waypoints and ladders are in the same file. After any change, raise the version in `sw.js` (`CACHE`) so phones pick up the new files.
