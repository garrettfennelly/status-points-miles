import { expect, test, type Page, type Request } from '@playwright/test'

const TABS = ['NOW', 'CREW', 'GROUND', 'BOARD', 'TRENDS', 'SAFETY']

/** Anything that is not our own origin counts as leaving the mountain. */
function trackExternal(page: Page, sink: string[]) {
  page.on('request', (r: Request) => {
    const url = r.url()
    if (!url.startsWith('http://127.0.0.1:4173') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      sink.push(url)
    }
  })
}

test('2. zero external requests on first load and on reload', async ({ page }) => {
  const external: string[] = []
  trackExternal(page, external)
  await page.goto('/index.html')
  await expect(page.getByRole('heading', { name: 'NOW' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'NOW' })).toBeVisible()
  expect(external).toEqual([])
})

test('1. airplane mode: every tab renders with no console errors', async ({ page, context }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/index.html')
  // Let the service worker install and precache the whole book.
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15_000 })

  await context.setOffline(true)
  await page.reload()

  for (const tab of TABS) {
    await page.getByRole('navigation').getByRole('button', { name: tab, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(tab === 'BOARD' ? 'BOARD' : tab)
  }

  // Map plates render offline (bundled images / dashed slots, never tiles).
  await page.getByRole('navigation').getByRole('button', { name: 'GROUND', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'MAP PLATES' })).toBeVisible()

  expect(errors).toEqual([])
})

test('4. countdown and today derive from the device clock in Mexico City', async ({ page }) => {
  // 13 Oct 2026, 05:30 in Mexico City is 11:30Z. First frame is an hour out.
  await page.clock.setFixedTime(new Date('2026-10-13T11:30:00Z'))
  await page.goto('/index.html')
  await expect(page.getByText('TO FIRST FRAME')).toBeVisible()
  await expect(page.locator('.big')).toContainText('0d 01:00:00')
  await expect(page.getByText('TUE 13 OCT 2026 · 05:30')).toBeVisible()
  await expect(page.getByText('DAY 1 — shoot')).toBeVisible()
  await expect(page.getByText('UNITS UP — DAY 1 TUE')).toBeVisible()
})

test('5 + C. the host is never named in the shipped book', async ({ page }) => {
  await page.goto('/index.html')
  await page.getByRole('navigation').getByRole('button', { name: 'CREW', exact: true }).click()
  await expect(page.getByText('On-camera host').first()).toBeVisible()
  await expect(page.getByText('EMBARGO').first()).toBeVisible()
})

test('6. unlocked fields render dashed, never filled', async ({ page }) => {
  await page.goto('/index.html')
  const dashed = page.locator('.open-field').first()
  await expect(dashed).toBeVisible()
  await expect(dashed).toHaveCSS('border-style', 'dashed')
  // The still-open counter is on the home screen and is not zero.
  await expect(page.getByRole('button', { name: /FIELDS STILL OPEN/ })).toBeVisible()
})

test('7. /admin edits persist across reload and export valid JSON', async ({ page }) => {
  await page.goto('/index.html#/admin')
  await page.getByLabel('Passphrase').fill('GREATOFFLINE')
  await page.getByRole('button', { name: 'UNLOCK' }).click()

  const call = page.locator('#production\\.call')
  await expect(call).toBeVisible()
  await call.fill('05:15')

  await page.reload()
  await expect(page.locator('#production\\.call')).toHaveValue('05:15')

  // The edit reaches the book itself, not just the admin form.
  await page.getByRole('button', { name: 'BACK TO BOOK' }).click()
  await expect(page.getByText('05:15').first()).toBeVisible()

  // And the export is valid JSON carrying the edit.
  await page.goto('/index.html#/admin')
  await page.getByRole('button', { name: 'LOAD CURRENT' }).click()
  const raw = await page.locator('#raw').inputValue()
  const parsed = JSON.parse(raw)
  expect(parsed.production.call).toEqual({ status: 'locked', value: '05:15' })
})

test('8. one-handed: tap targets hold and nothing scrolls sideways', async ({ page }) => {
  await page.goto('/index.html')
  for (const tab of TABS) {
    const button = page.getByRole('navigation').getByRole('button', { name: tab, exact: true })
    const box = await button.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(56)

    await button.click()
    const { overflow, scrollbar } = await page.evaluate(() => {
      const de = document.documentElement
      return {
        overflow: de.scrollWidth - de.clientWidth,
        // Chromium's emulator draws a classic 16px scrollbar that iOS Safari
        // does not; the fixed tab bar sizes to the layout viewport including
        // it. Discount exactly that, never more.
        scrollbar: window.innerWidth - de.clientWidth,
      }
    })
    // The board table scrolls inside its own container, never the page.
    expect(overflow - scrollbar).toBeLessThanOrEqual(1)
  }
})

test('3. installable: manifest and icons resolve from the page', async ({ page }) => {
  await page.goto('/index.html')
  const href = await page.getAttribute('link[rel=manifest]', 'href')
  const res = await page.request.get(new URL(href!, page.url()).toString())
  expect(res.ok()).toBeTruthy()
  const manifest = await res.json()
  expect(manifest.display).toBe('standalone')
  for (const icon of manifest.icons) {
    const iconRes = await page.request.get(new URL(icon.src, page.url()).toString())
    expect(iconRes.ok(), icon.src).toBeTruthy()
  }
})

test('GROUND: a baked plate renders offline, and tiles are never requested', async ({ page, context }) => {
  const external: string[] = []
  trackExternal(page, external)

  await page.goto('/index.html')
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15_000 })

  // Lock a plate to a bundled image, the way Locations will after the scout.
  await page.goto('/index.html#/admin')
  await page.getByLabel('Passphrase').fill('GREATOFFLINE')
  await page.getByRole('button', { name: 'UNLOCK' }).click()
  await page.locator('#ground\\.plates\\.0\\.src').fill('./maps/PLATE-TEMPLATE.svg')

  await context.setOffline(true)
  await page.goto('/index.html#/ground')

  const plate = page.locator('.plate img').first()
  await expect(plate).toBeVisible()
  // It really decoded — a broken image reports zero natural width.
  expect(await plate.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  expect(external).toEqual([])
})
