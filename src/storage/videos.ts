import { get, set, del } from 'idb-keyval'

const keyFor = (exerciseId: string) => `video:${exerciseId}`

export function getVideo(exerciseId: string): Promise<Blob | undefined> {
  return get(keyFor(exerciseId))
}

export function setVideo(exerciseId: string, blob: Blob): Promise<void> {
  return set(keyFor(exerciseId), blob)
}

export function deleteVideo(exerciseId: string): Promise<void> {
  return del(keyFor(exerciseId))
}
