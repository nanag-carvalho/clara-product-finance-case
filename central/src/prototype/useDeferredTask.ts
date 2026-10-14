import { useCallback, useEffect, useRef, useState } from 'react'
import { createDeferredTask } from './deferred-task'
/** Owns the lifetime of a simulated task, keeping timers out of the view. */
export function useDeferredTask() {
  const task = useRef<ReturnType<typeof createDeferredTask> | null>(null)
  if (!task.current) task.current = createDeferredTask()
  const [label, setLabel] = useState<string | null>(null)
  const run = useCallback(
    (nextLabel: string, work: () => void, delay: number) => {
      const started = task.current!.run(() => {
        setLabel(null)
        work()
      }, delay)
      if (started) setLabel(nextLabel)
      return started
    },
    [],
  )
  const cancel = useCallback(() => {
    task.current!.cancel()
    setLabel(null)
  }, [])
  useEffect(() => () => task.current?.cancel(), [])
  return { label, run, cancel }
}
