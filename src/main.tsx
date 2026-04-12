import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/gsap' // register plugins
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
