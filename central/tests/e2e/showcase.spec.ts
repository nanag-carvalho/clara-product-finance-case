import { expect, test } from '@playwright/test'

test('showcase reveals content, navigates chapters and enlarges the workspace', async ({
  page,
  isMobile,
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
  // Nested evidence must keep its reading width as outer desktop gutters grow.
  for (const width of isMobile ? [390, 320] : [1280, 1600, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 })
    const evaluation = page.locator('.showcase-value-evaluation')
    const intro = evaluation.locator(':scope > p:not(.eyebrow)').first()
    await intro.scrollIntoViewIfNeeded()
    const container = await evaluation.boundingBox()
    expect(container).not.toBeNull()
    for (const paragraph of [
      intro,
      evaluation.locator('.showcase-value-primary dd p'),
    ]) {
      const bounds = await paragraph.boundingBox()
      expect(bounds).not.toBeNull()
      expect(
        bounds!.width,
        `Evaluation text must remain readable at a ${width}px viewport`,
      ).toBeGreaterThanOrEqual(Math.min(400, container!.width - 48))
      expect(bounds!.x).toBeGreaterThanOrEqual(container!.x)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        container!.x + container!.width + 1,
      )
    }
    await expect(
      page.getByRole('link', { name: 'Making it work', exact: true }),
    ).toHaveAttribute('aria-current', 'location')
  }
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
  const preview = page.locator('.showcase-preview img')
  await expect(preview).toBeVisible()
  const ratios = await preview.evaluate((image: HTMLImageElement) => ({
    natural: image.naturalWidth / image.naturalHeight,
    rendered: image.clientWidth / image.clientHeight,
  }))
  expect(Math.abs(ratios.natural - ratios.rendered)).toBeLessThan(0.02)
  // Compare the source and proposal as captured, without stretching either image.
  for (const image of await page
    .locator('.showcase-visual-comparison img')
    .all()) {
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((element: HTMLImageElement) => element.decode())
    const dimensions = await image.evaluate((element: HTMLImageElement) => ({
      natural: element.naturalWidth / element.naturalHeight,
      rendered: element.clientWidth / element.clientHeight,
    }))
    expect(Math.abs(dimensions.natural - dimensions.rendered)).toBeLessThan(
      0.02,
    )
  }
  await expect(
    page.getByRole('heading', {
      name: 'Would removing the funding step help?',
    }),
  ).toBeAttached()
  const evaluation = page.getByRole('region', {
    name: 'Would removing the funding step help?',
  })
  await expect(evaluation).toContainText('Correct completion through Clara')
  await expect(evaluation).toContainText('Voluntary choice and repeat use')
  await expect(evaluation).toContainText('Guardrails')
  const hubOpened = page.context().waitForEvent('page')
  await page
    .getByRole('link', {
      name: 'Read the customer fit and business trade-offs',
    })
    .click()
  const valueHub = await hubOpened
  await expect(
    valueHub.getByRole('heading', {
      name: 'Value and evaluation strategy',
      exact: true,
    }),
  ).toBeInViewport()
  await expect(
    valueHub.getByRole('heading', {
      name: 'What would tell me it is useful',
      exact: true,
    }),
  ).toBeAttached()
  await valueHub.close()
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

test('showcase reuses artifact tabs without replacing the presentation', async ({
  page,
  context,
}) => {
  await page.goto('/showcase.html')
  for (const [name, path] of [
    ['Case hub', '/'],
    ['Design system', '/design-system.html'],
  ]) {
    const link = page.locator('.showcase-header-actions').getByRole('link', {
      name,
      exact: true,
    })
    const opened = context.waitForEvent('page')
    await link.click()
    const artifact = await opened
    await artifact.waitForLoadState('domcontentloaded')
    expect(new URL(artifact.url()).pathname).toBe(path)
    await page.bringToFront()
    await link.click()
    await expect.poll(() => context.pages().length).toBe(2)
    await expect(page).toHaveURL(/showcase.html$/)
    await artifact.close()
  }
})

test('chapter navigation stays aligned when evidence images arrive late', async ({
  page,
}) => {
  let releaseImages!: () => void
  const imagesReady = new Promise<void>((resolve) => {
    releaseImages = resolve
  })
  await page.route('**/*.png', async (route) => {
    await imagesReady
    await route.continue()
  })
  await page.goto('/showcase.html', { waitUntil: 'domcontentloaded' })
  await page.getByRole('link', { name: 'Making it work', exact: true }).click()
  releaseImages()
  await page.waitForLoadState('networkidle')
  await expect(page.locator('#story-foundation')).toBeInViewport()
  await expect(
    page.getByRole('link', { name: 'Making it work', exact: true }),
  ).toHaveAttribute('aria-current', 'location')
})

test('case links open first connection and the scenario explorer in the prototype', async ({
  page,
  context,
}) => {
  await page.goto('/showcase.html#story-experience')
  const opened = context.waitForEvent('page')
  await page
    .getByRole('link', { name: 'Try first connection', exact: true })
    .click()
  const prototype = await opened
  await expect(
    prototype.getByRole('heading', {
      name: 'Which account will fund this Pix?',
      exact: true,
    }),
  ).toBeVisible()
  await prototype
    .getByRole('button', { name: 'Connect Example Bank A', exact: true })
    .click()
  await prototype
    .getByRole('button', {
      name: 'Continue after bank confirmation',
      exact: true,
    })
    .click()
  await prototype
    .getByRole('button', { name: 'Confirm with device', exact: true })
    .click()
  await expect(
    prototype.getByRole('heading', { name: 'Review the payment', exact: true }),
  ).toBeVisible()
  await page.bringToFront()
  await page
    .getByRole('link', { name: 'Explore the 12 scenarios', exact: true })
    .click()
  await expect(
    prototype.getByRole('heading', {
      name: 'Explore the prototype',
      exact: true,
    }),
  ).toBeVisible()
  await prototype.keyboard.press('Escape')
  await expect(
    prototype.getByRole('button', {
      name: 'Explore prototype scenarios',
      exact: true,
    }),
  ).toBeVisible()
  await page.goto('/#/process')
  const explorerLink = page.getByRole('link', {
    name: 'Open the scenario explorer',
    exact: true,
  })
  await expect(explorerLink).toHaveAttribute(
    'href',
    '/prototype.html?explore=scenarios',
  )
  const openPages = context.pages().length
  await explorerLink.click()
  await expect(
    prototype.getByRole('heading', {
      name: 'Explore the prototype',
      exact: true,
    }),
  ).toBeVisible()
  await expect(page).toHaveURL(/#\/process$/)
  expect(context.pages()).toHaveLength(openPages)
  await prototype.close()
})
