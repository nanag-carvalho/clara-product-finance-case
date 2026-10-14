import React from 'react'
import ReactDOM from 'react-dom/client'
import DesignSystem from './DesignSystem'
import './styles.css'
import './tokens.css'
import './design-system.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesignSystem />
  </React.StrictMode>,
)

// A stable same-origin destination lets the showcase reuse this tab.
window.name = 'clara-case-design-system'
