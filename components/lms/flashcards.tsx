"use client"

import { useState } from "react"
import { Repeat } from "lucide-react"

export function Flashcards({ takeaways }: { takeaways: string[] }) {
  if (!takeaways || takeaways.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {takeaways.map((takeaway, i) => (
        <Flashcard key={i} index={i + 1} text={takeaway} />
      ))}
    </div>
  )
}

function Flashcard({ index, text }: { index: number; text: string }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="group relative h-48 w-full cursor-pointer perspective-[1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setIsFlipped(!isFlipped)
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
    >
      <div
        className={`absolute h-full w-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
            <Repeat className="h-6 w-6" />
          </div>
          <h4 className="text-center font-heading text-lg font-bold">Key Concept {index}</h4>
          <p className="mt-1 text-center text-xs text-muted-foreground">Click to flip</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary text-primary-foreground p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-center text-sm font-medium leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}
