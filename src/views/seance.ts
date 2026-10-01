import { program, type ExerciseStep, type Step } from '../program'
import { loadProgress, setSetDone, isSetDone, resetProgress } from '../storage/progress'
import { getVideo, setVideo } from '../storage/videos'
import { startRestTimer, type RestTimerHandle } from '../timer'

function renderWarmupStep(step: Extract<Step, { type: 'warmup' }>, done: boolean): string {
  return `
    <div class="step step-warmup">
      <label class="warmup-row">
        <input type="checkbox" class="warmup-checkbox" data-step="${step.id}" ${done ? 'checked' : ''} />
        <span>${step.label} — ${step.duration}</span>
      </label>
    </div>
  `
}

function renderExerciseStep(step: ExerciseStep, progress: Record<string, boolean>): string {
  const setCheckboxes = Array.from({ length: step.sets }, (_, i) => {
    const checked = isSetDone(progress, step.id, i)
    return `
      <label class="set-checkbox">
        <input type="checkbox" data-step="${step.id}" data-set="${i}" ${checked ? 'checked' : ''} />
        <span>Série ${i + 1}</span>
      </label>
    `
  }).join('')

  return `
    <div class="step step-exercise" data-exercise-id="${step.id}">
      <div class="exercise-header">
        <h3>${step.name}</h3>
        <span class="exercise-scheme">${step.sets} × ${step.reps} — repos ${step.restSeconds}s</span>
      </div>
      <div class="video-slot" data-video-slot="${step.id}">
        <p class="video-loading">Chargement…</p>
      </div>
      <div class="sets-row">${setCheckboxes}</div>
    </div>
  `
}

async function mountVideoSlot(slot: HTMLElement, exerciseId: string): Promise<void> {
  const blob = await getVideo(exerciseId)
  if (blob) {
    const url = URL.createObjectURL(blob)
    slot.innerHTML = `
      <video controls playsinline src="${url}"></video>
      <label class="replace-video-btn">
        Remplacer la vidéo
        <input type="file" accept="video/*" class="video-input" data-exercise-id="${exerciseId}" hidden />
      </label>
    `
  } else {
    slot.innerHTML = `
      <label class="add-video-btn">
        Ajouter vidéo
        <input type="file" accept="video/*" class="video-input" data-exercise-id="${exerciseId}" hidden />
      </label>
    `
  }
}

export function renderSeance(container: HTMLElement, seanceId: string): void {
  const seance = program.find((s) => s.id === seanceId)
  if (!seance) {
    container.innerHTML = `
      <p>Séance introuvable.</p>
      <a href="#/">Retour</a>
    `
    return
  }

  const progress = loadProgress(seance.id)
  let activeTimer: RestTimerHandle | null = null

  container.innerHTML = `
    <header class="app-header">
      <a class="back-link" href="#/">← Séances</a>
      <h1>${seance.title}</h1>
      <button class="reset-btn" type="button">Réinitialiser</button>
    </header>
    <div class="steps-list">
      ${seance.steps
        .map((step) => (step.type === 'warmup' ? renderWarmupStep(step, isSetDone(progress, step.id, 0)) : renderExerciseStep(step, progress)))
        .join('')}
    </div>
    <div class="rest-bar" hidden>
      <span class="rest-bar-label"></span>
      <button class="rest-bar-cancel" type="button">Annuler</button>
    </div>
  `

  for (const step of seance.steps) {
    if (step.type !== 'exercise') continue
    const slot = container.querySelector<HTMLElement>(`[data-video-slot="${step.id}"]`)
    if (slot) void mountVideoSlot(slot, step.id)
  }

  const restBar = container.querySelector<HTMLElement>('.rest-bar')!
  const restBarLabel = container.querySelector<HTMLElement>('.rest-bar-label')!
  const restBarCancel = container.querySelector<HTMLElement>('.rest-bar-cancel')!

  function hideRestBar() {
    restBar.hidden = true
    activeTimer = null
  }

  function startRest(seconds: number) {
    activeTimer?.cancel()
    restBar.hidden = false
    activeTimer = startRestTimer(
      seconds,
      (secondsLeft) => {
        restBarLabel.textContent = `Repos : ${secondsLeft}s`
      },
      hideRestBar,
    )
  }

  restBarCancel.addEventListener('click', () => {
    activeTimer?.cancel()
    hideRestBar()
  })

  container.querySelector('.reset-btn')!.addEventListener('click', () => {
    resetProgress(seance.id)
    renderSeance(container, seanceId)
  })

  container.addEventListener('change', (event) => {
    const target = event.target as HTMLElement

    if (target.matches('.warmup-checkbox')) {
      const input = target as HTMLInputElement
      const stepId = input.dataset.step!
      setSetDone(seance.id, stepId, 0, input.checked)
      return
    }

    if (target.matches('.sets-row input[type="checkbox"]')) {
      const input = target as HTMLInputElement
      const stepId = input.dataset.step!
      const setIndex = Number(input.dataset.set)
      setSetDone(seance.id, stepId, setIndex, input.checked)

      const step = seance.steps.find((s): s is ExerciseStep => s.type === 'exercise' && s.id === stepId)
      if (step && input.checked && setIndex < step.sets - 1) {
        startRest(step.restSeconds)
      }
      return
    }

    if (target.matches('.video-input')) {
      const input = target as HTMLInputElement
      const exerciseId = input.dataset.exerciseId!
      const file = input.files?.[0]
      if (!file) return
      void setVideo(exerciseId, file).then(() => {
        const slot = container.querySelector<HTMLElement>(`[data-video-slot="${exerciseId}"]`)
        if (slot) void mountVideoSlot(slot, exerciseId)
      })
    }
  })
}
