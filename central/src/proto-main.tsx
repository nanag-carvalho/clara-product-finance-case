import React from 'react'
import ReactDOM from 'react-dom/client'
import Prototype from './Prototype'
import './styles.css'
import './tokens.css'
const path='direct' as const
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Prototype initialPath={path}/></React.StrictMode>)
