import { test as base, expect, type Page } from '@playwright/test'
const test = base.extend({
  page: async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await use(page)
    expect(
      errors,
      'Interactions must not throw browser runtime errors',
    ).toEqual([])
  },
})
async function populated(page: Page) {
  await page.goto('/prototype.html')
  await page
    .getByRole('button', { name: 'Explore prototype scenarios', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'View populated workspace', exact: true })
    .click()
}
async function continueDetails(page: Page) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('heading', {
      name: 'Which account will fund this Pix?',
      exact: true,
    })
    .waitFor()
}

test('new payment completes entry, company approval and secure payment confirmation', async ({
  page,
}) => {
  await populated(page)
  await page.getByRole('button', { name: 'New payment', exact: true }).click()
  await page
    .getByRole('button', {
      name: 'Business bank account Pix using funds at another bank',
      exact: true,
    })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Who are you paying?', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Find recipient', exact: true })
    .click()
  await expect(
    page.getByRole('status', { name: 'Identified Pix recipient' }),
  ).toBeVisible()
  await continueDetails(page)
  await page
    .getByRole('button', { name: 'Review payment', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Review the payment', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Request approval', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Request sent', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Carlos is next', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Back to payments', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Review request', exact: true })
    .first()
    .click()
  await page
    .getByRole('button', { name: 'Approve request', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Approval recorded', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Back to payments', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Ready to authorize 3', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'View payment', exact: true })
    .first()
    .click()
  await page
    .getByRole('button', { name: 'Authorize payment', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Confirm with device', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Paid', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('R$1,750.00 paid to Example Supplier Ltd.', { exact: true }),
  ).toBeVisible()
})

test('company approval records a decision without settling a payment', async ({
  page,
}) => {
  await page.goto('/prototype.html?scenario=approval')
  await page
    .getByRole('button', { name: 'Approve request', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Approval recorded', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Paid', exact: true }),
  ).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Back to payments', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Ready to authorize 1', exact: true }),
  ).toBeVisible()
})

test('approved request requires device confirmation before the paid result', async ({
  page,
}) => {
  await page.goto('/prototype.html?scenario=authorization')
  await page
    .getByRole('button', { name: 'Authorize payment', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Confirm payment', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Confirm with device', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Paid', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Payment completed', exact: true }),
  ).toBeVisible()
})

test('correction preserves the recipient and permits a new company review', async ({
  page,
}) => {
  await page.goto('/prototype.html?scenario=rejected')
  await page
    .getByRole('button', { name: 'Correct request', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Correct payment details', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByLabel('Pix key or Copia e Cola code', { exact: true }),
  ).toHaveValue('billing@atlas.test')
  await page.getByLabel('Amount in BRL', { exact: true }).fill('7000.00')
  await continueDetails(page)
  await page
    .getByRole('button', { name: 'Review payment', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Request approval', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Request sent', exact: true }),
  ).toBeVisible()
})

test('bulk approval empties the pending queue and exposes individual authorization', async ({
  page,
}, testInfo) => {
  await populated(page)
  await page
    .getByRole('button', { name: 'Pending approval 3', exact: true })
    .click()
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Select', exact: true }).click()
  await page
    .getByRole('checkbox', {
      name: 'Select payments on this page',
      exact: true,
    })
    .check()
  await page
    .getByRole('button', { name: 'Approve selected', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Approve 3 requests?', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Confirm approval', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Pending approval 0', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Ready to authorize 5', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('3 requests approved', { exact: true }),
  ).toBeVisible()
})

test('unknown result is checked on the same request instead of creating another payment', async ({
  page,
}) => {
  await page.goto('/prototype.html?scenario=unknown')
  await page
    .getByRole('button', { name: 'Check payment status', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Paid', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('dialog').getByText('DEMO-001', { exact: true }),
  ).toBeVisible()
})

test('mobile filters and selection remain usable without horizontal overflow', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile',
    'Mobile-specific interaction layout',
  )
  await page.goto('/prototype.html')
  await page.getByRole('button', { name: 'Open product navigation' }).click()
  const navigation = page.getByRole('dialog', {
    name: 'Product navigation',
    exact: true,
  })
  await navigation
    .getByRole('button', { name: 'Digital account', exact: true })
    .click()
  await expect(navigation).toBeVisible()
  await expect(
    navigation.getByRole('button', { name: /Connected banks/ }),
  ).toBeVisible()
  await navigation
    .getByRole('button', { name: 'Accounts payable', exact: true })
    .click()
  const paymentsLink = navigation.getByRole('button', { name: /^Payments/ })
  const bounds = await paymentsLink.boundingBox()
  expect(bounds?.height).toBeGreaterThanOrEqual(44)
  await paymentsLink.click()
  await expect(navigation).not.toBeVisible()
  await page.setViewportSize({ width: 320, height: 720 })
  for (const route of ['/#/overview', '/showcase.html']) {
    await page.goto(route)
    await page.locator('h1').first().waitFor()
    expect(
      await page
        .locator('main')
        .first()
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true)
  }
  await page.goto('/#/sources')
  const comparison = page
    .getByRole('region', { name: 'Scrollable comparison table' })
    .first()
  await expect(comparison).toBeVisible()
  expect(
    await comparison.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true)
  await comparison.evaluate((element) => {
    element.scrollLeft = element.scrollWidth
  })
  expect(
    await comparison.evaluate((element) => element.scrollLeft),
  ).toBeGreaterThan(0)
  await page
    .getByRole('button', { name: 'Open navigation', exact: true })
    .click()
  await page
    .getByRole('dialog', { name: 'Hub navigation', exact: true })
    .getByRole('link', { name: 'Overview', exact: true })
    .click()
  await expect(
    page.getByRole('dialog', { name: 'Hub navigation', exact: true }),
  ).not.toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await populated(page)
  await page.getByRole('button', { name: 'Filters', exact: true }).click()
  await expect(
    page.getByRole('dialog', { name: 'Filter payments', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('combobox', { name: 'Filter by source bank', exact: true })
    .click()
  await page
    .getByRole('option', { name: 'Example Bank B', exact: true })
    .click()
  await page.getByRole('button', { name: 'Done', exact: true }).click()
  await expect(page.getByText('5 payments', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Select', exact: true }).click()
  await expect(
    page.getByRole('checkbox', {
      name: 'Select payments on this page',
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(
    page.getByRole('checkbox', {
      name: 'Select payments on this page',
      exact: true,
    }),
  ).toHaveCount(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
})
