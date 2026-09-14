/**
 * Home-screen icons, generated with nothing but node's zlib.
 *
 * Committed output lives in public/icons. Regenerate with `npm run icons`.
 * No design tool, no CDN, no binary blob anybody has to trust — the icon is
 * the source.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

const INK = [13, 13, 13]
const PAPER = [244, 242, 237]

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/** 8-bit RGB PNG from a flat [r,g,b] pixel getter. */
function png(size, pixel) {
  const raw = Buffer.alloc(size * (size * 3 + 1))
  let o = 0
  for (let y = 0; y < size; y++) {
    raw[o++] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixel(x, y)
      raw[o++] = r
      raw[o++] = g
      raw[o++] = b
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/**
 * The mark: a ruled frame with four bars — one per shoot day, the last one
 * short, because the last day is the one with no retry behind it.
 */
function mark(size, inset) {
  const pad = Math.round(size * inset)
  const inner = size - pad * 2
  const frame = Math.max(2, Math.round(inner * 0.055))
  const barH = Math.round(inner * 0.1)
  const gap = Math.round(inner * 0.075)
  const top = pad + Math.round(inner * 0.25)
  const left = pad + Math.round(inner * 0.2)
  const widths = [0.6, 0.6, 0.6, 0.32].map((w) => Math.round(inner * w))

  return (x, y) => {
    if (x < pad || y < pad || x >= size - pad || y >= size - pad) return INK
    const onFrame =
      x < pad + frame || y < pad + frame || x >= size - pad - frame || y >= size - pad - frame
    if (onFrame) return PAPER
    for (let i = 0; i < widths.length; i++) {
      const by = top + i * (barH + gap)
      if (y >= by && y < by + barH && x >= left && x < left + widths[i]) return PAPER
    }
    return INK
  }
}

mkdirSync(OUT, { recursive: true })
const files = [
  ['icon-192.png', 192, 0.04],
  ['icon-512.png', 512, 0.04],
  ['icon-maskable-512.png', 512, 0.14],
  ['apple-touch-icon.png', 180, 0.0],
]
for (const [name, size, inset] of files) {
  writeFileSync(join(OUT, name), png(size, mark(size, inset)))
  console.log(`icons/${name}  ${size}x${size}`)
}
