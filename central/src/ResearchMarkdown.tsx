import {Pressable, Table, TableHeader, TableBody, TableRow, TableHead, TableCell} from '@/design-system'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

export default function ResearchMarkdown({body,onImage}:{body:string;onImage:(file:string,alt:string)=>void}) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    img:({src,alt})=><Pressable className="doc-image" onClick={()=>onImage(String(src),alt||"Visual reference")}><img src={(String(src).startsWith('https://')||String(src).startsWith('/'))?String(src):`/research/${src}`} alt={alt||''} loading="lazy"/><span>{alt} <ArrowUpRight size={14}/></span></Pressable>,
    a:({href,children})=>href?.startsWith('http')?<a href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={11}/></a>:<a href={href?.includes('reconstrucoes')?'#/screens':`/research/${href}`} target={href?.includes('reconstrucoes')?undefined:'_blank'} rel="noreferrer">{children}</a>,
    table:({children})=><Table>{children}</Table>,
    thead:({children})=><TableHeader>{children}</TableHeader>,tbody:({children})=><TableBody>{children}</TableBody>,tr:({children})=><TableRow>{children}</TableRow>,th:({children})=><TableHead>{children}</TableHead>,td:({children})=><TableCell>{children}</TableCell>,
  }}>{body}</ReactMarkdown>
}
