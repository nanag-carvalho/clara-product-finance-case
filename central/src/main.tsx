import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './tokens.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// A stable same-origin destination lets the showcase reuse this tab.
window.name = 'clara-case-hub'
