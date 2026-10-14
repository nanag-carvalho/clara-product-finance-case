import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { buildRegistry } from '../scripts/build-registry.mjs'

async function fixture(items: unknown[]) {
  const root = await mkdtemp(path.join(tmpdir(), 'clara-registry-'))
  await mkdir(path.join(root, 'src'))
  await writeFile(
    path.join(root, 'src/button.tsx'),
    'export const Button = () => null\n',
  )
  await writeFile(path.join(root, 'registry.json'), JSON.stringify({ items }))
  return root
}

test('published registry includes installable source and dependency metadata', async () => {
  const item = {
    name: 'button',
    type: 'registry:ui',
    dependencies: ['react'],
    registryDependencies: ['https://example.test/r/tokens.json'],
    files: [
      {
        path: 'src/button.tsx',
        type: 'registry:ui',
        target: 'components/button.tsx',
      },
    ],
  }
  const root = await fixture([item])
  try {
    assert.equal(await buildRegistry(root), 1)
    const result = JSON.parse(
      await readFile(path.join(root, 'public/r/button.json'), 'utf8'),
    )
    assert.deepEqual(result.dependencies, item.dependencies)
    assert.deepEqual(result.registryDependencies, item.registryDependencies)
    assert.equal(result.files[0].target, 'components/button.tsx')
    assert.equal(result.files[0].content, 'export const Button = () => null\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('registry refuses sources outside the project', async () => {
  const root = await fixture([
    { name: 'unsafe', files: [{ path: '../outside.ts' }] },
  ])
  try {
    await assert.rejects(buildRegistry(root), /stay inside the project/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('registry rejects duplicate item names instead of silently replacing components', async () => {
  const root = await fixture([
    { name: 'button', files: [] },
    { name: 'button', files: [] },
  ])
  try {
    await assert.rejects(buildRegistry(root), /Duplicate registry item/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
