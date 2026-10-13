import { readFile, writeFile, mkdir, cp } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const research = path.resolve(root, '../docs/clara-as-is')
await mkdir(path.join(root, 'src/data'), { recursive: true })
await mkdir(path.join(root, 'public/research'), { recursive: true })
await cp(research, path.join(root, 'public/research'), { recursive: true })
const markdown = await readFile(path.join(research, 'README.md'), 'utf8')
const sections = markdown.split(/^## /m).slice(1).map((section, index) => {
  const [title, ...body] = section.split('\n')
  return { id: `section-${index}`, title: title.trim(), body: body.join('\n').trim() }
})
await writeFile(path.join(root, 'src/data/research.json'), JSON.stringify(sections, null, 2))
console.log(`Synced ${sections.length} research sections and source assets`)
