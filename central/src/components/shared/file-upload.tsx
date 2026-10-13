import {useId,useRef,useState} from 'react'
import {Upload,X,FileCheck2} from 'lucide-react'
import {Button} from '../ui/button'
import {EmptyState} from './empty-state'
export function FileUpload({onChange,maxBytes=5*1024*1024,label="Attach document",variant='dropzone'}:{onChange:(file:File|null)=>void;maxBytes?:number;label?:string;variant?:'compact'|'dropzone'}){
 const limit=`${Math.round(maxBytes/1024/1024)} MB`,id=useId(),input=useRef<HTMLInputElement>(null)
 const [file,setFile]=useState<File|null>(null),[error,setError]=useState(''),[dragging,setDragging]=useState(false)
 const pick=(next:File|null)=>{if(!next)return;if(next.size>maxBytes||!['application/pdf','image/png','image/jpeg'].includes(next.type)){setError(`Use PDF, PNG or JPG up to ${limit}.`);if(input.current)input.current.value='';return}setError('');setFile(next);onChange(next)}
 const remove=()=>{setFile(null);setError('');onChange(null);if(input.current)input.current.value=''}
 return <div className="ds-upload" data-variant={variant} data-dragging={dragging||undefined} onDragOver={variant==='dropzone'?e=>{e.preventDefault();setDragging(true)}:undefined} onDragLeave={()=>setDragging(false)} onDrop={variant==='dropzone'?e=>{e.preventDefault();setDragging(false);pick(e.dataTransfer.files[0]??null)}:undefined}>
 {variant==='compact'&&<label htmlFor={id} className="upload-label">{label}</label>}
 <input tabIndex={variant==='dropzone'?-1:undefined} ref={input} id={id} type="file" className={variant==='dropzone'?'sr-only':undefined} accept=".pdf,.png,.jpg,.jpeg" aria-label={label} aria-describedby={`${id}-help`} aria-invalid={!!error} onChange={e=>pick(e.target.files?.[0]??null)}/>
 {variant==='dropzone'?<EmptyState title={file?file.name:label} description={file?"File selected locally.":"Drop the file here or select it from your device."} icon={file?<FileCheck2 size={24}/>:<Upload size={24}/>} action={<div className="upload-actions"><Button variant="outline" onClick={()=>input.current?.click()}>{file?"Replace file":"Select file"}</Button>{file&&<Button variant="ghost" onClick={remove}><X size={16}/>Remove</Button>}</div>}/>:file&&<div className="upload-file"><span>{file.name}</span><Button variant="ghost" size="icon-sm" aria-label="Remove attachment" onClick={remove}><X size={16}/></Button></div>}
 <p id={`${id}-help`} className="type-caption" role={error?'alert':undefined}>{error||`PDF, PNG or JPG · up to ${limit} · file stays local.`}</p></div>
}
