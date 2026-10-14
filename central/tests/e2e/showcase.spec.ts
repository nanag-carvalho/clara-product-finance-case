import { expect, test } from '@playwright/test'

test('showcase reveals content, navigates chapters and enlarges the workspace', async ({
  page,
}) => {
  await page.goto('/showcase.html')
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toHaveCSS('opacity', '1')
  await page
    .getByRole('button', {
      name: 'Enlarge the proposed workspace',
      exact: true,
    })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.getByRole('link', { name: 'Opportunity', exact: true }).click()
  await expect(page).toHaveURL(/#story-context$/)
  await expect(page.locator('#story-context')).toBeInViewport()
  await expect(page.locator('.showcase-reading-progress')).not.toHaveCSS(
    'transform',
    'matrix(0, 0, 0, 1, 0, 0)',
  )
})

test('reduced motion presents the story immediately without entrance animations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/showcase.html')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'animation-name',
    'none',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'opacity',
    '1',
  )
  await page.getByRole('link', { name: 'Experience', exact: true }).click()
  await expect(page.locator('#story-experience')).toBeInViewport()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('shared component proof changes variants and responds to activation', async ({
  page,
}) => {
  await page.goto('/showcase.html#story-foundation')
  await page.getByRole('tab', { name: 'Secondary', exact: true }).click()
  await expect(
    page.getByRole('tab', { name: 'Secondary', exact: true }),
  ).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.showcase-code').first()).toContainText(
    'variant="outline"',
  )
  await page
    .getByRole('button', { name: 'Try shared action', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Action received')
  await expect(
    page.getByRole('link', { name: 'Examples, code and API', exact: true }),
  ).toHaveAttribute('href', '/design-system.html#/components/button')
})

test('experience screens scroll independently and open a full preview', async ({
  page,
}) => {
  await page.goto('/showcase.html#story-experience')
  const screen = page.getByRole('region', {
    name: 'Make the next action visible. — scroll to inspect the screen',
    exact: true,
  })
  await screen.focus()
  const overflows = await screen.evaluate(
    (element) => element.scrollHeight > element.clientHeight,
  )
  if (overflows) {
    await screen.press('End')
    await expect
      .poll(() => screen.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(0)
  } else {
    await expect(screen.getByRole('img')).toBeVisible()
  }
  await page
    .getByRole('button', { name: 'Enlarge screen', exact: true })
    .first()
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page
      .getByRole('dialog')
      .getByRole('img', { name: 'Make the next action visible.', exact: true }),
  ).toHaveAttribute('src', '/proposal/overview.png')
})

test('showcase reuses its hub tab without replacing the presentation', async ({
  page,
  context,
}) => {
  await page.goto('/showcase.html')
  const hubLink = page.getByRole('link', { name: 'Case hub', exact: true })
  const opened = context.waitForEvent('page')
  await hubLink.click()
  const hub = await opened
  await hub.waitForLoadState('domcontentloaded')
  await expect(hub).toHaveURL(/\/$/)
  await page.bringToFront()
  await hubLink.click()
  await expect.poll(() => context.pages().length).toBe(2)
  await expect(page).toHaveURL(/showcase.html$/)
  await hub.close()
})
