import { useSyncExternalStore } from 'react'
const query = '(max-width: 700px)'
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
/** Match the shared mobile breakpoint without reading dimensions during render or layout effects. */
export const useCompactViewport = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
