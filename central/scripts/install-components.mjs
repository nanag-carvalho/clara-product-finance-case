import {mkdtemp,readdir,copyFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
const dir='src/components/ui'
const backup=await mkdtemp(path.join(tmpdir(),'case-ui-primitives-'))
const files=await readdir(dir)
for(const f of files)await copyFile(path.join(dir,f),path.join(backup,f))
try{
 const result=spawnSync('npx',['shadcn@4.21.4','add','command','item','alert','alert-dialog','field','label','select','table','pagination','tooltip','textarea','calendar','input-otp','--yes','--overwrite'],{stdio:'inherit'})
 if(result.status)process.exitCode=result.status
}finally{for(const f of files)await copyFile(path.join(backup,f),path.join(dir,f))}
