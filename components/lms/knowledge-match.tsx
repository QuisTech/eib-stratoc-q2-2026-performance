"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Lightbulb, RotateCcw } from "lucide-react"

type MatchingQuestion = {
  id: string
  prompt: string
  pairs: { left: string; right: string }[]
  explanation: string
}

export function KnowledgeMatch({ question, onPassed }: { question: MatchingQuestion; onPassed?: (passed: boolean) => void }) {
  const [answers, setAnswers] = useState<{ left: string; right: string }[]>([])
  const [shuffledLeft, setShuffledLeft] = useState<string[]>([])
  const [shuffledRight, setShuffledRight] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const buildShuffled = () => {
    const lefts = question.pairs.map(p => p.left)
    const rights = question.pairs.map(p => p.right)
    
    for (let i = lefts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[lefts[i], lefts[j]] = [lefts[j], lefts[i]]
    }
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rights[i], rights[j]] = [rights[j], rights[i]]
    }
    return { lefts, rights }
  }

  useEffect(() => {
    const { lefts, rights } = buildShuffled()
    setShuffledLeft(lefts)
    setShuffledRight(rights)
    setIsMounted(true)
  }, []) // Only run once on mount

  if (!isMounted) return null

  const pairsArray = Array.isArray(question?.pairs) ? question.pairs : []
  const pool = shuffledRight.filter(r => !answers.some(a => a.right === r))
  const isComplete = answers.length === pairsArray.length

  const handleDragStart = (e: React.DragEvent, rightItem: string, sourceLeft?: string) => {
    if (isSubmitted) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("text/plain", JSON.stringify({ rightItem, sourceLeft }))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDropSlot = (e: React.DragEvent, targetLeft: string) => {
    e.preventDefault()
    if (isSubmitted) return
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"))
      const { rightItem, sourceLeft } = data
      
      setAnswers((prev) => {
        let currentAnswers = [...prev]
        if (sourceLeft) {
          currentAnswers = currentAnswers.filter(a => a.left !== sourceLeft)
        }
        currentAnswers = currentAnswers.filter(a => a.left !== targetLeft)
        currentAnswers.push({ left: targetLeft, right: rightItem })
        return currentAnswers
      })
    } catch {}
  }

  const handleDropPool = (e: React.DragEvent) => {
    e.preventDefault()
    if (isSubmitted) return
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"))
      const { sourceLeft } = data
      if (sourceLeft) {
        setAnswers((prev) => prev.filter(a => a.left !== sourceLeft))
      }
    } catch {}
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const checkAnswers = () => {
    setIsSubmitted(true)
  }

  const reset = () => {
    const { lefts, rights } = buildShuffled()
    setShuffledLeft(lefts)
    setShuffledRight(rights)
    setAnswers([])
    setIsSubmitted(false)
  }

  let isAllCorrect = false
  let pairResults: Record<string, boolean> = {}

  if (isSubmitted) {
    isAllCorrect = true
    answers.forEach(a => {
      const correctPair = question.pairs.find(p => p.left === a.left)
      const isCorrect = correctPair?.right === a.right
      pairResults[a.left] = isCorrect
      if (!isCorrect) isAllCorrect = false
    })
    
    // Notify parent component when passed
    if (isAllCorrect && onPassed) {
      onPassed(true)
    }
  }

  return (
    <Card className={`mt-6 mb-8 border-l-4 ${isSubmitted ? (isAllCorrect ? "border-[var(--chart-1)]" : "border-destructive") : "border-primary"}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-6">
          <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h3 className="font-heading text-lg font-bold">Knowledge Check</h3>
            <p className="text-muted-foreground">{question.prompt}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div 
            className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-4 min-h-[90px]"
            onDrop={handleDropPool}
            onDragOver={handleDragOver}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drag from here</p>
            <div className="flex flex-wrap gap-2">
              {pool.map((r) => (
                <div
                  key={r}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, r)}
                  className={`cursor-grab active:cursor-grabbing rounded border bg-background px-4 py-2.5 text-sm shadow-sm transition-colors ${
                    isSubmitted ? "opacity-50 cursor-not-allowed" : "hover:border-primary"
                  }`}
                >
                  {r}
                </div>
              ))}
              {pool.length === 0 && <span className="text-sm text-muted-foreground italic flex items-center h-[42px]">All items placed</span>}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {shuffledLeft.map(left => {
              const matched = answers.find(a => a.left === left)
              const isCorrectPair = pairResults[left]

              let slotClass = "flex-1 rounded-md border border-dashed p-2 min-h-[50px] transition-colors"
              if (matched) {
                if (isSubmitted) {
                  if (isCorrectPair) {
                    slotClass = "flex-1 rounded-md border border-[var(--chart-1)] bg-[var(--chart-1)]/10"
                  } else {
                    slotClass = "flex-1 rounded-md border border-destructive bg-destructive/10"
                  }
                } else {
                  slotClass = "flex-1 rounded-md border border-primary bg-primary/5"
                }
              }

              return (
                <div key={left} className="flex flex-col sm:flex-row sm:items-stretch gap-3">
                  <div className="flex-1 rounded-md border bg-muted/30 px-4 py-3 text-sm flex items-center leading-relaxed">
                    {left}
                  </div>
                  <div className="hidden sm:flex items-center text-muted-foreground px-2">→</div>
                  <div 
                    className={slotClass}
                    onDrop={(e) => handleDropSlot(e, left)}
                    onDragOver={handleDragOver}
                  >
                    {matched ? (
                      <div 
                        draggable={!isSubmitted}
                        onDragStart={(e) => handleDragStart(e, matched.right, left)}
                        className={`flex h-full min-h-[34px] items-center justify-between cursor-grab active:cursor-grabbing rounded border bg-background px-4 py-2 text-sm shadow-sm ${
                          isSubmitted ? "cursor-default" : ""
                        }`}
                      >
                        <span className="flex-1 leading-relaxed">{matched.right}</span>
                        {isSubmitted && isCorrectPair && <CheckCircle2 className="h-5 w-5 text-[var(--chart-1)] ml-3 shrink-0" />}
                        {isSubmitted && !isCorrectPair && <XCircle className="h-5 w-5 text-destructive ml-3 shrink-0" />}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground italic min-h-[34px]">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            {!isSubmitted ? (
              <Button onClick={checkAnswers} disabled={!isComplete}>
                Check Answers
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2 font-medium">
                  {isAllCorrect ? (
                     <span className="text-[var(--chart-1)] flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Correct! Great job.</span>
                  ) : (
                     <span className="text-destructive flex items-center gap-2"><XCircle className="h-5 w-5" /> Not quite. Try again!</span>
                  )}
                </div>
                {!isAllCorrect && (
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {isSubmitted && isAllCorrect && question.explanation && (
             <div className="mt-2 rounded-md bg-muted/40 p-4 text-sm text-muted-foreground border border-border">
               <strong className="text-foreground">Explanation:</strong> {question.explanation}
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
