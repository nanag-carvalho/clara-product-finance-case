import {readFile,access} from 'node:fs/promises'
import {designSystem as ds} from '../src/design-system/registry.ts'
import assert from 'node:assert/strict'
import postcss from 'postcss'
assert.deepEqual(ds.spacing,[2,4,8,16,24])
assert.deepEqual(ds.controlSizes,{sm:24,md:32,lg:40})
assert.equal(ds.radii.control,10)
const names=new Set(ds.components.map(c=>c.name));assert.equal(names.size,ds.components.length)
for(const c of ds.components)await access(c.file)
const grouped=ds.groups.flatMap(g=>g.components);assert.equal(new Set(grouped).size,grouped.length);for(const name of grouped)assert(names.has(name),`Not registered: ${name}`);for(const name of names)assert(grouped.includes(name),`No group: ${name}`)
for(const file of ['src/App.tsx','src/DesignSystem.tsx','src/ComponentCatalog.tsx','src/ResearchMarkdown.tsx','src/Prototype.tsx','src/Solution.tsx','src/Wireflow.tsx'])assert(!/from ['"]@\/components\/(ui|shared)\//.test(await readFile(file,'utf8')),`${file}: import through the API`)
for(const file of ['src/App.tsx','src/DesignSystem.tsx','src/ComponentCatalog.tsx','src/ResearchMarkdown.tsx','src/Prototype.tsx','src/Solution.tsx','src/Wireflow.tsx'])assert(!/<(?:button|input|select|textarea|table)(?:\s|>)/.test(await readFile(file,'utf8')),`${file}: control outside the API`)
function spacingErrors(source){const errors=[];postcss.parse(source).walkDecls(d=>{if(/^(padding|margin|gap|row-gap|column-gap)(-|$)/.test(d.prop)&&/\d+px/.test(d.value)&&!(d.prop==='margin-left'&&['.ds-shell','.main-shell'].includes(d.parent.selector)))errors.push(d.toString()); for(const token of d.value.matchAll(/var\(--space-(\d+)\)/g))if(!ds.spacing.includes(Number(token[1])))errors.push(`Unregistered token: ${token[0]}`)});return errors}
assert.equal(spacingErrors('.x{gap:12px}').length,1)
assert.equal(spacingErrors('.x{gap:var(--space-12)}').length,1)
assert.equal(spacingErrors('.x{gap:var(--space-8);padding:0}').length,0)
for(const file of ['src/styles.css','src/tokens.css','src/design-system.css','src/prototype.css','src/wireflow.css'])assert.deepEqual(spacingErrors(await readFile(file,'utf8')),[],`${file}: use spacing tokens`)
for(const file of ['src/styles.css','src/tokens.css','src/design-system.css','src/prototype.css','src/wireflow.css']){const css=postcss.parse(await readFile(file,'utf8'));css.walkDecls(d=>{if(d.prop==='font-size'||d.prop==='border-radius')assert(!/\d+px/.test(d.value),`${file}: ${d.prop} outside tokens`);assert(!/#[0-9a-f]{3,8}\b/i.test(d.value),`${file}: cor outside tokens`)})}
for(const file of ['src/styles.css','src/tokens.css']){const css=postcss.parse(await readFile(file,'utf8'));css.walkRules(r=>{assert(!/\.library-search\s*(?:>|\s)\s*(?:input|svg|button)\b/.test(r.selector),`${file}: search composition outside InputGroup`)})}
console.log('Contract verified: scale, dimensions, registry, imports and DS spacing.')
