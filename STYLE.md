# Art direction

Every drawing in the app follows these rules, so the work of different sessions looks like one hand.

## Medium

- Dark brown ink on parchment, as if drawn with a dip pen.
- The only colours are ink, parchment and one red accent.
- No gradients, shadows or flat colour fills. A shape may be filled with the parchment colour only to hide lines behind it.

## Line

- Outlines are 1.2 to 1.6px. Hatching is 0.8 to 1px.
- Round caps and round joins.
- Natural forms are slightly irregular, never ruler-straight.

## Shading

- Hatching goes on the side away from the light. Light comes from the upper left.
- Scenes are shaded richly: most landforms carry at least one area of hatching, and the darkest things (deep forest, doorways, storm cloud) are cross-hatched.
- Hatching is drawn with the six patterns in `art.js`: `h1` light, `h2` dense, `h3` cross-hatch, `hh` broken horizontal lines for water, `hv` vertical lines for walls and cliffs, `hd` stipple for mist and far tone.
- Leave a thin rim of bare paper between an outline and its hatching.

## How a scene is built

- A scene has three layers: far, middle and near.
- It is painted back to front. Each landform first hides what is behind it with the paper colour, then takes its hatching, then its outline.
- `scenes.js` has small helpers for repeated things (pines, round trees, rocks, standing stones, clouds, boats), so a scene is mostly a list of landforms and objects.

## Conventions

- Mountains are drawn in profile.
- Trees are simple repeated shapes.
- Water is broken horizontal lines.
- Buildings are small and plain.
- No figures larger than a few pixels, and no lettering inside a drawing.

## Colour in code

- Ink: `currentColor`.
- Accent: `var(--red)`.
- Hiding fills: `var(--paper)`.

Never hard-code a colour in a drawing. This is what lets a second theme recolour everything.

## Sizes

| Drawing | viewBox | Budget |
| --- | --- | --- |
| Stage scene | `0 0 358 150` | About 4 KB each |
| Emblem | `0 0 48 48` | About 1 KB each |
| Gift | `0 0 56 56` | About 2 KB each |
| Terrain glyph | `0 0 42 28` | Under 1 KB each |

## Type

- `Fell` for text.
- `Fell SC` for labels and small capitals.
