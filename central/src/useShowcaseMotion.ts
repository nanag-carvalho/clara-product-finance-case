import { useEffect, type RefObject } from 'react'

/** One-shot reveals keep the reading position stable; reduced motion stays static. */
export function useShowcaseMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const shell = root.current
    if (!shell) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const animations = new Set<Animation>()
    let observer: IntersectionObserver | undefined
    let frame = 0

    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - innerHeight
      shell.style.setProperty(
        '--reading-progress',
        String(available > 0 ? Math.min(1, scrollY / available) : 0),
      )
      frame = 0
    }
    const scheduleProgress = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress)
    }
    const configureReveals = () => {
      observer?.disconnect()
      animations.forEach((animation) => animation.cancel())
      animations.clear()
      if (preference.matches) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            observer?.unobserve(entry.target)
            const animation = entry.target.animate(
              [
                { opacity: 0, transform: 'translateY(16px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 550, easing: 'cubic-bezier(.16,1,.3,1)' },
            )
            animations.add(animation)
            animation.onfinish = () => animations.delete(animation)
          }
        },
        { threshold: 0.08 },
      )
      shell
        .querySelectorAll(
          '.story-comparison, .story-hypotheses, .story-decision, .showcase-process-map, .showcase-visual-comparison, .showcase-component-lab',
        )
        .forEach((element) => observer?.observe(element))
    }
    configureReveals()
    updateProgress()
    window.addEventListener('scroll', scheduleProgress, { passive: true })
    window.addEventListener('resize', scheduleProgress)
    preference.addEventListener('change', configureReveals)
    return () => {
      observer?.disconnect()
      animations.forEach((animation) => animation.cancel())
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleProgress)
      window.removeEventListener('resize', scheduleProgress)
      preference.removeEventListener('change', configureReveals)
    }
  }, [root])
}
