import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, ArrowUp } from '@phosphor-icons/react'
import {
  BrandMark,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/design-system'
import CaseStory from './CaseStory'
import { useShowcaseMotion } from './useShowcaseMotion'
import './styles.css'
import './tokens.css'
import './showcase.css'

const chapters = [
  ['context', 'Opportunity'],
  ['process', 'Design reasoning'],
  ['experience', 'Experience'],
  ['foundation', 'Making it work'],
] as const

function Showcase() {
  const shellRef = useRef<HTMLDivElement>(null)
  useShowcaseMotion(shellRef)
  const [active, setActive] = useState('')
  const [image, setImage] = useState<{ file: string; alt: string } | null>(null)
  useEffect(() => {
    let canceled = false
    const target = window.location.hash.slice(1)
    if (target)
      void document.fonts.ready.then(() => {
        if (!canceled)
          document
            .getElementById(target)
            ?.scrollIntoView({ behavior: 'instant', block: 'start' })
      })
    return () => {
      canceled = true
    }
  }, [])

  useEffect(() => {
    let frame = 0
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.story-chapters section'),
    )
    // Intermediate chapters belong to the same narrative group in the header.
    const navigationGroup: Record<string, string> = {
      'story-business': 'story-context',
      'story-direction': 'story-context',
      'story-aesthetic': 'story-process',
      'story-validation': 'story-foundation',
      'story-hypotheses': 'story-process',
      'story-artifacts': 'story-foundation',
    }
    const update = () => {
      const header = document.querySelector('.showcase-header')
      const readingLine = (header?.getBoundingClientRect().height ?? 80) + 64
      let current = ''
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine)
          current = section.id
      }
      setActive(navigationGroup[current] ?? current)
      frame = 0
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  return (
    <div className="showcase-shell" id="top" ref={shellRef}>
      <a className="showcase-skip" href="#showcase-main">
        Skip to the case
      </a>
      <header className="showcase-header">
        <div className="showcase-reading-progress" aria-hidden="true" />
        <a
          href="#top"
          className="showcase-brand"
          aria-label="Clara case, back to top"
        >
          <BrandMark wordmark />
          <span>A case by Nágela Carvalho</span>
        </a>
        <nav aria-label="Case chapters">
          {chapters.map(([id, label]) => (
            <a
              key={id}
              href={`#story-${id}`}
              onClick={async (event) => {
                event.preventDefault()
                await document.fonts.ready
                history.replaceState(null, '', `#story-${id}`)
                document.getElementById(`story-${id}`)?.scrollIntoView({
                  behavior: matchMedia('(prefers-reduced-motion: reduce)')
                    .matches
                    ? 'instant'
                    : 'smooth',
                  block: 'start',
                })
              }}
              aria-current={active === `story-${id}` ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="showcase-header-actions">
          <Button size="sm" variant="outline" asChild>
            <a href="/" target="clara-case-hub">
              Case hub <ArrowUpRight size={16} />
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="/prototype.html" target="clara-case-prototype">
              Prototype <ArrowUpRight size={16} />
            </a>
          </Button>
        </div>
      </header>
      <main id="showcase-main">
        <CaseStory
          onImage={(file, alt) =>
            setImage({
              file: file.startsWith('/') ? file : `/research/${file}`,
              alt,
            })
          }
        />
      </main>
      <footer className="showcase-footer">
        <div>
          <strong>Nágela Carvalho</strong>
          <p>Product thinking → interaction craft → working code.</p>
        </div>
        <a href="/" target="clara-case-hub">
          Explore the research hub <ArrowUpRight size={16} />
        </a>
        <a href="#top">
          Back to top <ArrowUp size={16} />
        </a>
      </footer>
      <Dialog
        open={!!image}
        onOpenChange={(open) => {
          if (!open) setImage(null)
        }}
      >
        <DialogContent className="showcase-lightbox">
          <DialogTitle>{image?.alt}</DialogTitle>
          <DialogDescription>
            Interface reference from the case. Proposed screens use fictional
            data.
          </DialogDescription>
          {image && <img src={image.file} alt={image.alt} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Showcase />
  </StrictMode>,
)
