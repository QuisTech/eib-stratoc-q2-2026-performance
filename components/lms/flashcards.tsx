"use client"

import { useState } from "react"
import { Lightbulb, Target, Compass, Shield, Zap, BookOpen, Flag, Key, Star, CheckCircle } from "lucide-react"

const ICONS = [Lightbulb, Target, Compass, Shield, Zap, BookOpen, Flag, Key, Star, CheckCircle]

export function Flashcards({ takeaways }: { takeaways: string[] }) {
  if (!takeaways || takeaways.length === 0) return null

  return (
    <ol className="block-flashcards__wrapper" role="list">
      {takeaways.map((takeaway, i) => (
        <Flashcard key={i} index={i + 1} text={takeaway} />
      ))}
    </ol>
  )
}

function Flashcard({ index, text }: { index: number; text: string }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const Icon = ICONS[(index - 1) % ICONS.length]

  const handleFlip = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setIsFlipped(!isFlipped)
  }

  return (
    <li
      className={`flashcard flashcard--large ${isFlipped ? "flashcard--flipped" : ""}`}
      role="listitem"
    >
      {/* FRONT OF CARD */}
      <div
        aria-hidden={isFlipped ? "true" : "false"}
        className="flashcard-side flashcard-side--front block-card bg--range-light block-card--white"
        tabIndex={-1}
        role="group"
      >
        <span className="visually-hidden-always">Front of card</span>
        <div className="flashcard-side__content flashcard-side__content--large flashcard-side__content--front">
          <div className="flashcard-side__description font-heading text-lg font-bold text-primary dark:text-slate-100 brand--head brand--linkColor flex flex-col items-center justify-center gap-4">
            <Icon className="w-12 h-12 opacity-80" strokeWidth={1.5} />
            <div className="fr-view"><p>Key Concept {index}</p></div>
          </div>
          <div className="flashcard-side-flip">
            <button
              aria-label="Click to flip"
              className="flashcard-side-flip__btn flashcard-side-flip__btn--prefers-keyboard text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
              tabIndex={isFlipped ? -1 : 0}
              type="button"
              onClick={handleFlip}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleFlip(e)
                }
              }}
            >
              <svg aria-hidden="true" fill="currentColor" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 17" className="flashcard-side-flip__icon">
                <path d="M19.347 8.275l1.88 1.714a.727.727 0 0 0 .98-1.074l-3.225-2.941a.727.727 0 0 0-1.027.047l-2.94 3.224a.727.727 0 0 0 1.075.98l1.802-1.976a6.545 6.545 0 0 1-11.56 4.288.727.727 0 1 0-1.114.935 8 8 0 0 0 14.129-5.197zm-16.039.162l-1.79-1.633a.727.727 0 1 0-.98 1.074l3.223 2.94c.297.272.757.25 1.028-.046l2.94-3.224a.727.727 0 0 0-1.075-.98L4.768 8.636a6.545 6.545 0 0 1 11.555-4.482.727.727 0 1 0 1.114-.936A8 8 0 0 0 3.308 8.437z" fillRule="nonzero"></path>
              </svg>
            </button>
            <div aria-hidden="true" className="flashcard-side-flip__tooltip">Click to flip</div>
          </div>
        </div>
      </div>

      {/* BACK OF CARD */}
      <div
        aria-hidden={isFlipped ? "false" : "true"}
        className="flashcard-side flashcard-side--back block-card bg--range-light block-card--white"
        tabIndex={-1}
        role="group"
      >
        <span className="visually-hidden-always">Back of card</span>
        <div className="flashcard-side__content flashcard-side__content--large">
          <div className="flashcard-side__description flashcard-side__description--long flashcard-side__description--large brand--head">
            <div className="brand--linkColor text-slate-800 dark:text-slate-200 text-sm font-medium">
              <div className="fr-view"><p>{text}</p></div>
            </div>
          </div>
          <div className="flashcard-side-flip">
            <button
              aria-label="Click to flip"
              className="flashcard-side-flip__btn flashcard-side-flip__btn--prefers-keyboard text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
              tabIndex={isFlipped ? 0 : -1}
              type="button"
              onClick={handleFlip}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleFlip(e)
                }
              }}
            >
              <svg aria-hidden="true" fill="currentColor" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 17" className="flashcard-side-flip__icon">
                <path d="M19.347 8.275l1.88 1.714a.727.727 0 0 0 .98-1.074l-3.225-2.941a.727.727 0 0 0-1.027.047l-2.94 3.224a.727.727 0 0 0 1.075.98l1.802-1.976a6.545 6.545 0 0 1-11.56 4.288.727.727 0 1 0-1.114.935 8 8 0 0 0 14.129-5.197zm-16.039.162l-1.79-1.633a.727.727 0 1 0-.98 1.074l3.223 2.94c.297.272.757.25 1.028-.046l2.94-3.224a.727.727 0 0 0-1.075-.98L4.768 8.636a6.545 6.545 0 0 1 11.555-4.482.727.727 0 1 0 1.114-.936A8 8 0 0 0 3.308 8.437z" fillRule="nonzero"></path>
              </svg>
            </button>
            <div aria-hidden="true" className="flashcard-side-flip__tooltip">Click to flip</div>
          </div>
        </div>
      </div>
    </li>
  )
}
