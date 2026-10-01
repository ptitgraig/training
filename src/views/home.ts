import { program } from '../program'

export function renderHome(container: HTMLElement): void {
  container.innerHTML = `
    <header class="app-header">
      <h1>Suivi Salle</h1>
    </header>
    <div class="seance-list">
      ${program
        .map(
          (seance) => `
        <a class="seance-card" href="#/seance/${seance.id}">
          <span class="seance-card-title">${seance.title}</span>
          <span class="seance-card-count">${seance.steps.length} étapes</span>
        </a>
      `,
        )
        .join('')}
    </div>
  `
}
