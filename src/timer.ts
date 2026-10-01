export type RestTimerHandle = {
  cancel: () => void
}

function playBeep(): void {
  const AudioContextCtor =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioContextCtor()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.frequency.value = 880
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.4)
  oscillator.onended = () => ctx.close()
}

function alertRestOver(): void {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200])
  try {
    playBeep()
  } catch {
    // Web Audio unavailable, vibration alone is fine.
  }
}

export function startRestTimer(
  totalSeconds: number,
  onTick: (secondsLeft: number) => void,
  onDone: () => void,
): RestTimerHandle {
  let secondsLeft = totalSeconds
  onTick(secondsLeft)
  const interval = setInterval(() => {
    secondsLeft -= 1
    if (secondsLeft <= 0) {
      clearInterval(interval)
      onTick(0)
      alertRestOver()
      onDone()
      return
    }
    onTick(secondsLeft)
  }, 1000)

  return {
    cancel: () => clearInterval(interval),
  }
}
