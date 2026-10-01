import './style.css'
import { renderHome } from './views/home'
import { renderSeance } from './views/seance'

const app = document.querySelector<HTMLDivElement>('#app')!

function render(): void {
  const hash = window.location.hash
  const seanceMatch = hash.match(/^#\/seance\/(.+)$/)
  if (seanceMatch) {
    renderSeance(app, seanceMatch[1])
  } else {
    renderHome(app)
  }
}

window.addEventListener('hashchange', render)
render()

if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }))
}
