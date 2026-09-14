/**
 * Acceptance checks that can be made without a browser.
 * Run after `npm run build`:  npm run verify [-- --embargo "Host Name"]
 *
 * The embargo check takes the name on the command line on purpose. Writing it
 * into a repo file to test for it would be the leak it is meant to prevent.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const full = join(dir, n)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const files = walk(dist).map((f) => relative(dist, f).split(sep).join('/'))
const textFiles = files.filter((f) => /\.(html|js|css|webmanifest|json|svg)$/.test(f))
const text = Object.fromEntries(textFiles.map((f) => [f, readFileSync(join(dist, f), 'utf8')]))
const allText = textFiles.map((f) => text[f]).join('\n')

/* 2. Zero external requests: nothing in the bundle points off-origin over http(s). */
const externals = new Set()
for (const [, body] of Object.entries(text)) {
  for (const m of body.matchAll(/https?:\/\/[^\s'"`)\\]+/g)) externals.add(m[0])
}
// Namespace URIs and React's error-decoder message string are identifiers and
// message text, never fetched — the browser issues no request for either.
const IGNORE = [/^http:\/\/www\.w3\.org\//, /^https:\/\/reactjs\.org\/docs\/error-decoder/]
const realExternals = [...externals].filter((u) => !IGNORE.some((re) => re.test(u)))
check('No external http(s) references in the bundle', realExternals.length === 0, realExternals.join(', '))

/* 1/A. No webfont, no CDN, no analytics, no runtime fetch of remote data. */
check('No webfont link or @font-face src', !/fonts\.(googleapis|gstatic)|@font-face/.test(allText))
check('System faces only', /-apple-system/.test(allText))
check('No analytics or tag manager', !/gtag\(|googletagmanager|google-analytics|analytics\.js|cdn\.segment\.com|plausible\.io|hotjar|mixpanel/.test(allText))

/* 3. Installable, full-screen. */
const html = text['index.html'] ?? ''
const manifest = JSON.parse(text['manifest.webmanifest'] ?? '{}')
check('index.html links the manifest', /rel="manifest"/.test(html))
check('index.html links an apple-touch-icon', /rel="apple-touch-icon"/.test(html))
check('apple-mobile-web-app-capable is set', /apple-mobile-web-app-capable"\s+content="yes"/.test(html))
check('viewport-fit=cover for the iPad safe area', /viewport-fit=cover/.test(html))
check('manifest display is standalone', manifest.display === 'standalone', String(manifest.display))
check('manifest start_url is relative', typeof manifest.start_url === 'string' && manifest.start_url.startsWith('./'))
check(
  'every manifest icon is bundled',
  (manifest.icons ?? []).every((i) => files.includes(i.src.replace(/^\.\//, ''))),
)

/* 1. Service worker precaches every emitted file. */
const sw = text['sw.js'] ?? ''
const precache = JSON.parse(sw.match(/const PRECACHE = (\[[\s\S]*?\n\])/)?.[1] ?? '[]')
const missing = files.filter((f) => f !== 'sw.js' && !precache.includes(`./${f}`))
check('Service worker precaches every built file', missing.length === 0, missing.join(', '))
check('Service worker serves cache-first', /caches\.match\(request/.test(sw))
check('Service worker ignores off-origin requests', /url\.origin !== self\.location\.origin/.test(sw))

/* 4. Mexico City clock, no DST, device clock. */
check('Fixed UTC−6 offset, no tz database', /utcOffsetHours/.test(allText) && !/Intl\.DateTimeFormat\([^)]*timeZone/.test(allText))

/* 6. Unlocked fields are dashed, never filled. */
const bookSrc = readFileSync(join(root, 'src', 'data', 'shootbook.ts'), 'utf8')
const openCount = (bookSrc.match(/\bopen\(/g) ?? []).length
check('Seed carries open fields', openCount > 0, `${openCount} open() calls in the seed`)
check('Dashed border style exists for open fields', /border:\s*2px dashed/.test(allText))

/* 5. Embargo. */
check('Host renders as "On-camera host"', /On-camera host/.test(allText))
check('No host-name value in the seed file', !/hostName\s*:\s*['"][^'"]+['"]/.test(bookSrc))
const embargoArg = process.argv.indexOf('--embargo')
if (embargoArg !== -1 && process.argv[embargoArg + 1]) {
  const name = process.argv[embargoArg + 1]
  const hit = files.filter((f) => readFileSync(join(dist, f)).toString('latin1').toLowerCase().includes(name.toLowerCase()))
  check(`Embargoed name absent from the build`, hit.length === 0, hit.join(', '))
} else {
  check('Embargoed name check (pass --embargo "Name" to run it)', true, 'skipped — no name supplied')
}

/* 8. Tap targets. */
check('56px minimum tap target', /--tap:\s*56px/.test(allText))

let failed = 0
for (const r of results) {
  if (!r.ok) failed++
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  [${r.detail}]` : ''}`)
}
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed === 0 ? 0 : 1)
