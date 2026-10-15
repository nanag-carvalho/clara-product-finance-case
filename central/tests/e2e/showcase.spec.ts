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
  const preview = page.locator('.showcase-preview img')
  await expect(preview).toBeVisible()
  const ratios = await preview.evaluate((image: HTMLImageElement) => ({
    natural: image.naturalWidth / image.naturalHeight,
    rendered: image.clientWidth / image.clientHeight,
  }))
  expect(Math.abs(ratios.natural - ratios.rendered)).toBeLessThan(0.02)
  await expect(
    page.getByRole('heading', {
      name: 'Does this route help the team complete its work?',
    }),
  ).toBeAttached()
  await page
    .getByText('Compare funding routines and time assumptions', { exact: true })
    .click()
  const model = page.getByRole('region', {
    name: 'What changes for this team?',
  })
  await expect(model).toContainText('One funding dependency is removed.')
  await model
    .getByText('Explore the assumed preparation time', { exact: true })
    .click()
  await expect(model).toContainText('1m 50s less active time')
  await model
    .getByRole('spinbutton', {
      name: 'Bank access, top-up and return',
      exact: true,
    })
    .fill('180')
  await expect(model).toContainText('2m 50s less active time')
  await model
    .getByRole('spinbutton', {
      name: 'Bank access, top-up and return',
      exact: true,
    })
    .fill('0')
  await expect(model).toContainText('10s more active time')
  await model
    .getByRole('spinbutton', { name: 'Choose the source account', exact: true })
    .fill('0')
  await expect(model).toContainText('Same active time')
  await model
    .getByRole('button', { name: 'Reset assumptions', exact: true })
    .click()
  await expect(model).toContainText('1m 50s less active time')
  await model.getByRole('combobox').click()
  await page
    .getByRole('option', {
      name: 'One top-up funds 5 payments',
      exact: true,
    })
    .click()
  await expect(model).toContainText('14s less active time')
  await model.getByRole('combobox').click()
  await page
    .getByRole('option', {
      name: 'The bank needs a first connection',
      exact: true,
    })
    .click()
  await expect(model).toContainText('10s more active time')
  await expect(model).toContainText('Connect the bank, then choose the source')
  await model.getByRole('combobox').click()
  await page
    .getByRole('option', {
      name: 'Clara already has enough funds',
      exact: true,
    })
    .click()
  await expect(model).toContainText(
    'There is no funding dependency to remove for this request.',
  )
  await expect(
    model.getByRole('spinbutton', {
      name: 'Bank access, top-up and return',
      exact: true,
    }),
  ).toBeDisabled()
  await expect(
    model.getByRole('spinbutton', {
      name: 'First bank connection',
      exact: true,
    }),
  ).toBeDisabled()
  await expect(model).toContainText('10s more active time')
  const hubOpened = page.context().waitForEvent('page')
  await model
    .getByRole('link', { name: 'Customer fit, measures and validation plan' })
    .click()
  const baselineHub = await hubOpened
  await expect(
    baselineHub.getByRole('heading', {
      name: 'Value and evaluation strategy',
      exact: true,
    }),
  ).toBeInViewport()
  await expect(
    baselineHub.getByRole('heading', {
      name: 'What would tell me it is useful',
      exact: true,
    }),
  ).toBeAttached()
  await baselineHub.close()
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
