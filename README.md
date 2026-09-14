# PREDICTS 27 SHOOT BOOK

Crew-facing production reference for the Pinterest Predicts 2027 "The Great Offline"
shoot — Mexico City, October 2026. Deployed to 15 iPads (5 client, 10 crew) and phones.

It has to work on a mountain with no signal, so it makes **no network requests at all**
once it is installed. No webfonts, no CDN, no map tiles, no analytics, no API.

## Run it

```bash
npm install
npm run dev        # local development
npm run build      # production build into dist/
npm run verify     # static acceptance checks against dist/
npm run test:e2e   # browser acceptance tests against the production build
```

Deploy `dist/` to any static host. `base` is relative, so it also works from a
sub-directory.

## The three non-negotiables

**Offline-first.** Type is native system faces. All content ships in the bundle. A
service worker (`scripts/sw-template.js`, baked by `scripts/build-sw.mjs`) precaches
every emitted file on install and serves cache-first; off-origin requests are never
touched. `manifest.webmanifest` plus the iOS meta tags install it to the home screen
in standalone mode.

**Never guess.** Every value is either `locked` or `open` — there is no third state
and no placeholders. An open field renders as a dashed slot naming what is missing
and who owns it, and it counts towards the "still open" figure on NOW and in every
footer. 139 fields ship open, including every crew contact, so the crew list doubles
as the collection tracker. The full list is at `#/open`.

**Embargo.** The on-camera host is never named in the shipped build — her name is not
in the seed file, not in any component, and not in an exported book. She appears as
"On-camera host". After the announcement clears, a producer enters the name once in
`/admin`; it is stored under its own key on that device only. Verify with:

```bash
npm run verify -- --embargo "Her Name"
```

## Editing the book — no rebuild required

All content lives in `src/data/shootbook.ts`. Nothing is hardcoded in a component.

The tech scout closes the location on 30 Sep and the book is reissued. That reissue is
a **data edit**, not a rebuild:

1. Open `#/admin` (passphrase `GREATOFFLINE`, changeable in the same screen).
2. Edit any field. A value locks the field; clearing it returns the dashed slot.
   Anything the field editors do not reach is editable as raw JSON.
3. **EXPORT JSON**, then **IMPORT JSON** on the other fourteen iPads.
4. Bump the version and "as of" date in BOOK STAMP — both print in every footer, so
   nobody on the mountain reads a stale book without knowing it.

Edits persist to `localStorage` and are deep-merged over the shipped seed, so a later
build can add sections without wiping a producer's edits.

### Map plates

`GROUND` renders bundled images — never tiles. Export the scout plates into
`public/maps/PLATE-TEMPLATE.svg`'s frame, bundle them under `public/maps/`, and point
each plate at its file in `/admin`. The Apple/Google Maps buttons are OS hand-offs and
only resolve if the region is already downloaded on the device.

### Icons

`npm run icons` regenerates `public/icons/` from `scripts/gen-icons.mjs` using nothing
but node's zlib — the icon is source code, not a binary anyone has to trust.

## Acceptance tests

`tests/acceptance.spec.ts` covers all eight, on iPad 11" portrait, iPad 11" landscape
and iPhone: airplane-mode reload of every tab, zero external requests, installability,
device-clock countdown in `America/Mexico_City` (fixed UTC−6 — Mexico abolished DST in
2022), the embargo, dashed unlocked fields, `/admin` persistence and export, and
one-handed layout with 56px tap targets.

They run against Chromium. This container ships no WebKit build, so **re-run them under
WebKit on a machine that has it before the book goes on the iPads** — drop the
`browserName` override in `playwright.config.ts`.
