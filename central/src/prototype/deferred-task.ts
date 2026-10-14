type Timer = ReturnType<typeof setTimeout>
type Clock = {
  schedule: (callback: () => void, delay: number) => Timer
  cancel: (timer: Timer) => void
}
const browserClock: Clock = {
  schedule: (callback, delay) => setTimeout(callback, delay),
  cancel: (timer) => clearTimeout(timer),
}
/** A single in-flight operation. Cancellation invalidates callbacks even if the clock
 * has already queued them; repeated starts cannot submit the same operation twice. */
export function createDeferredTask(clock: Clock = browserClock) {
  let timer: Timer | undefined
  let generation = 0
  return {
    run(work: () => void, delay: number): boolean {
      if (timer !== undefined) return false
      const expected = generation
      timer = clock.schedule(() => {
        if (expected !== generation) return
        timer = undefined
        work()
      }, delay)
      return true
    },
    cancel() {
      generation += 1
      if (timer !== undefined) clock.cancel(timer)
      timer = undefined
    },
  }
}
