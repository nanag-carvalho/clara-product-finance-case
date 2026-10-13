import {Toaster as Sonner,type ToasterProps} from 'sonner'
export {toast} from 'sonner'
export function Toaster(props:ToasterProps){return <Sonner theme="light" position="bottom-right" closeButton {...props} toastOptions={{className:'ds-toast',closeButtonAriaLabel:"Dismiss notification",...props.toastOptions}}/>}
