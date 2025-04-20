import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import './index.css'

function renderApp() {
  const $root = document.getElementById('root')!

  if (!$root) {
    throw new Error('root is not defiend')
  }

  createRoot($root).render(<App />)
}

renderApp()
