/**
 * Bake the precache list into dist/sw.js after `vite build`.
 *
 * Every emitted file is listed, so a cold install in airplane mode has
 * everything: HTML, the single JS bundle, CSS, manifest and icons.
 */
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const files = walk(dist)
  .map((f) => relative(dist, f).split(sep).join('/'))
  .filter((f) => f !== 'sw.js')
  .sort()

const hash = createHash('sha256')
for (const f of files) hash.update(f).update(readFileSync(join(dist, f)))
const version = hash.digest('hex').slice(0, 12)

const precache = ['./', ...files.map((f) => `./${f}`)]

const sw = readFileSync(join(root, 'scripts', 'sw-template.js'), 'utf8')
  .replace("const VERSION = '__VERSION__'", `const VERSION = '${version}'`)
  .replace('const PRECACHE = __PRECACHE__', `const PRECACHE = ${JSON.stringify(precache, null, 2)}`)

writeFileSync(join(dist, 'sw.js'), sw)
console.log(`sw.js  cache p27-${version}  ${precache.length} entries`)
