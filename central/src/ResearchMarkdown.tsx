import {Alert, AlertDescription, Pressable, Table, TableHeader, TableBody, TableRow, TableHead, TableCell} from '@/design-system'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowUpRight, ExternalLink, Lightbulb } from 'lucide-react'

export default function ResearchMarkdown({body,onImage}:{body:string;onImage:(file:string,alt:string)=>void}) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    blockquote:({children})=><Alert variant="note" className="research-callout"><Lightbulb aria-hidden="true"/><AlertDescription>{children}</AlertDescription></Alert>,
    img:({src,alt})=>{
      const [file,fragment] = String(src).split('#')
      const url = file.startsWith('https://')||file.startsWith('/')?file:`/research/${file}`
      const params = new URLSearchParams(fragment)
      const crop = params.get('crop')?.split(',').map(Number)
      const size = params.get('size')?.split(',').map(Number)
      const hasCrop = crop?.length===4 && size?.length===2 && [...crop,...size].every(Number.isFinite) && crop[2]>0 && crop[3]>0
      return <Pressable className="doc-image" aria-label={`Open full screenshot: ${alt||"Visual reference"}`} onClick={()=>onImage(file,alt||"Visual reference")}>
        {hasCrop?<svg className="doc-evidence-crop" viewBox={crop.join(' ')} role="img" aria-label={alt||'Evidence crop'}><image href={url} width={size[0]} height={size[1]}/></svg>:<img src={url} alt={alt||''} loading="lazy"/>}
        <span>{alt} <ArrowUpRight size={14}/></span>
      </Pressable>
    },
    a:({href,children})=>href?.startsWith('http')?<a href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={11}/></a>:<a href={href?.includes('reconstrucoes')?'#/screens':`/research/${href}`} target={href?.includes('reconstrucoes')?undefined:'_blank'} rel="noreferrer">{children}</a>,
    table:({children})=><Table>{children}</Table>,
    thead:({children})=><TableHeader>{children}</TableHeader>,tbody:({children})=><TableBody>{children}</TableBody>,tr:({children})=><TableRow>{children}</TableRow>,th:({children})=><TableHead>{children}</TableHead>,td:({children})=><TableCell>{children}</TableCell>,
  }}>{body}</ReactMarkdown>
}
