import {useEffect,useRef,type ReactNode} from 'react'
import {ArrowLeft} from 'lucide-react'
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/scroll-area'
export type WizardProps={open:boolean;onOpenChange:(open:boolean)=>void;title:string;steps:string[];current:number;eyebrow?:ReactNode;description?:string;context?:ReactNode;children:ReactNode;actions?:ReactNode;onBack?:()=>void;footerNote?:string;closeLabel?:string}
/** Controlled task shell. The consumer owns validation, authorization and transitions. */
export function Wizard({open,onOpenChange,title,steps,current,eyebrow,description,context,children,actions,onBack,footerNote='Progress kept in this session',closeLabel='Save and close'}:WizardProps){
 const titleRef=useRef<HTMLHeadingElement>(null)
 useEffect(()=>{if(open)titleRef.current?.focus()},[open,current,title])
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="ds-wizard" onOpenAutoFocus={event=>{event.preventDefault();titleRef.current?.focus()}}><DialogHeader>{eyebrow&&<div className="ds-wizard-eyebrow">{eyebrow}</div>}<DialogTitle ref={titleRef} tabIndex={-1} className="type-h1">{title}</DialogTitle><DialogDescription>{description??`Step ${current+1} of ${steps.length} · ${steps[current]}`}</DialogDescription></DialogHeader><ol className="ds-wizard-progress" aria-label="Task progress">{steps.map((name,i)=><li key={name} aria-current={i===current?'step':undefined} className={i<=current?'complete':''}><span className="sr-only">{i<current?'Previous phase: ':i===current?'Current phase: ':'Next phase: '}{name}</span></li>)}</ol>{context}<ScrollArea className="ds-wizard-scroll"><div className="ds-wizard-body">{children}</div></ScrollArea><div className="ds-wizard-footer">{onBack?<Button variant="ghost" onClick={onBack}><ArrowLeft size={16}/>Back</Button>:<Button variant="ghost" onClick={()=>onOpenChange(false)}>{closeLabel}</Button>}<div className="ds-wizard-actions" aria-label="Step actions">{actions??<span className="type-caption">{footerNote}</span>}</div></div></DialogContent></Dialog>
}
