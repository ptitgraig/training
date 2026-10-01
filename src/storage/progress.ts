type SeanceProgress = Record<string, boolean>

const keyFor = (seanceId: string) => `progress:${seanceId}`

export function loadProgress(seanceId: string): SeanceProgress {
  const raw = localStorage.getItem(keyFor(seanceId))
  if (!raw) return {}
  try {
    return JSON.parse(raw) as SeanceProgress
  } catch {
    return {}
  }
}

export function setSetDone(seanceId: string, stepId: string, setIndex: number, done: boolean): void {
  const progress = loadProgress(seanceId)
  progress[`${stepId}:${setIndex}`] = done
  localStorage.setItem(keyFor(seanceId), JSON.stringify(progress))
}

export function isSetDone(progress: SeanceProgress, stepId: string, setIndex: number): boolean {
  return progress[`${stepId}:${setIndex}`] === true
}

export function resetProgress(seanceId: string): void {
  localStorage.removeItem(keyFor(seanceId))
}
