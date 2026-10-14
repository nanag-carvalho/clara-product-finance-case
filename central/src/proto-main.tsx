import React from 'react'
import ReactDOM from 'react-dom/client'
import Prototype from './Prototype'
import './styles.css'
import './tokens.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Prototype />
  </React.StrictMode>,
)

// A stable same-origin destination lets the showcase reuse this tab.
window.name = 'clara-case-prototype'
