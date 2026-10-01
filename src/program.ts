export type WarmupStep = {
  type: 'warmup'
  id: string
  label: string
  duration: string
}

export type ExerciseStep = {
  type: 'exercise'
  id: string
  name: string
  sets: number
  reps: string
  restSeconds: number
}

export type Step = WarmupStep | ExerciseStep

export type Seance = {
  id: string
  title: string
  steps: Step[]
}

function warmup(seanceId: string, label: string, duration: string): WarmupStep {
  return { type: 'warmup', id: `${seanceId}-warmup`, label, duration }
}

function exercise(
  seanceId: string,
  name: string,
  sets: number,
  reps: string,
  restSeconds: number,
): ExerciseStep {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return { type: 'exercise', id: `${seanceId}-${slug}`, name, sets, reps, restSeconds }
}

export const program: Seance[] = [
  {
    id: 'seance-1',
    title: 'Pectoraux Triceps',
    steps: [
      warmup('seance-1', 'Elliptique ou rameur', '10 min'),
      exercise('seance-1', 'Développé incliné 30° haltères', 3, '10', 60),
      exercise('seance-1', 'Chest press', 3, '10', 60),
      exercise('seance-1', 'Seated Dip', 3, '10', 60),
      exercise('seance-1', 'Pectoral', 3, '10', 60),
      exercise('seance-1', 'Extension triceps poulie haute', 3, '12', 60),
    ],
  },
  {
    id: 'seance-2',
    title: 'Dos Biceps',
    steps: [
      warmup('seance-2', 'Elliptique ou rameur', '10 min'),
      exercise('seance-2', 'Pull down', 3, '10', 60),
      exercise('seance-2', 'Tirage horizontal', 3, '10', 60),
      exercise('seance-2', 'Lombaires', 3, '10', 60),
      exercise('seance-2', 'Biceps curl haltères', 3, '12', 60),
      exercise('seance-2', 'Biceps', 3, '12', 60),
    ],
  },
  {
    id: 'seance-3',
    title: 'Jambes Épaules',
    steps: [
      warmup('seance-3', 'Elliptique', '10 min'),
      exercise('seance-3', 'Leg press', 3, '10', 60),
      exercise('seance-3', 'Élévations latérales', 3, '10', 60),
      exercise('seance-3', 'Leg extension', 3, '10', 60),
      exercise('seance-3', 'Élévations frontales', 3, '10', 60),
      exercise('seance-3', 'Leg curl', 3, '10', 60),
      exercise('seance-3', 'Oiseau', 3, '10', 60),
      exercise('seance-3', 'Abducteur', 3, '10', 60),
      exercise('seance-3', 'Développé militaire', 3, '10', 60),
    ],
  },
  {
    id: 'seance-abdo',
    title: 'Abdo',
    steps: [
      exercise('seance-abdo', 'Relevé de jambes', 3, 'max', 30),
      exercise('seance-abdo', 'Relevé de buste', 3, 'max', 30),
      exercise('seance-abdo', 'Obliques', 3, 'max', 30),
      exercise('seance-abdo', 'Gainage', 3, 'max', 30),
    ],
  },
]
