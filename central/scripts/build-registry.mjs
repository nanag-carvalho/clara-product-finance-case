import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
/** Materialize the documented shadcn registry-item format from the generated local source registry. */
export async function buildRegistry(
  root,
  output = path.join(root, 'public/r'),
) {
  const registry = JSON.parse(
    await readFile(path.join(root, 'registry.json'), 'utf8'),
  )
  assert(
    Array.isArray(registry.items) && registry.items.length > 0,
    'Registry must declare items',
  )
  await mkdir(output, { recursive: true })
  const names = new Set()
  for (const item of registry.items) {
    assert(/^[a-z][a-z0-9-]*$/.test(item.name), 'Invalid registry item name')
    assert(!names.has(item.name), 'Duplicate registry item: ' + item.name)
    names.add(item.name)
    const files = await Promise.all(
      (item.files ?? []).map(async (file) => {
        const source = path.resolve(root, file.path)
        assert(
          source.startsWith(path.resolve(root) + path.sep),
          'Registry source must stay inside the project',
        )
        return { ...file, content: await readFile(source, 'utf8') }
      }),
    )
    await writeFile(
      path.join(output, item.name + '.json'),
      JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema/registry-item.json',
          ...item,
          files,
        },
        null,
        2,
      ) + '\n',
    )
  }
  return names.size
}
if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url))
  console.log(
    'Built ' +
      (await buildRegistry(root)) +
      ' registry items from local sources.',
  )
}
