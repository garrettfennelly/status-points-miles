import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Offline install. Registered relative to the page so the book also works from
// a sub-directory. Failure is silent and harmless — the book still renders.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('sw.js', window.location.href), { scope: './' }).catch(() => {
      /* http:// or file:// — no service worker, everything else still works */
    })
  })
}
