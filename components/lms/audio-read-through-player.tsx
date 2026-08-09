"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, Play, Pause, RotateCcw, VolumeX, Sparkles, FastForward } from "lucide-react"

interface Section {
  heading?: string
  body?: string[] | string
}

interface AudioReadThroughPlayerProps {
  lessonTitle: string
  sections: Section[]
}

export function AudioReadThroughPlayer({ lessonTitle, sections }: AudioReadThroughPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1) // 1x, 1.25x, 1.5x, 2x
  const [isSupported, setIsSupported] = useState(true)
  const [progressPercent, setProgressPercent] = useState(0)
  const [currentParagraph, setCurrentParagraph] = useState(0)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const fullTextRef = useRef<string[]>([])

  // Prepare full speech text array from lesson sections
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false)
      return
    }

    const textBlocks: string[] = [lessonTitle]
    if (Array.isArray(sections)) {
      sections.forEach((sec) => {
        if (sec.heading) textBlocks.push(sec.heading)
        if (Array.isArray(sec.body)) {
          sec.body.forEach((p) => {
            if (p) textBlocks.push(p.replace(/[*_#\[\]]/g, "")) // Strip markdown symbols for clean speech
          })
        } else if (typeof sec.body === "string" && sec.body) {
          textBlocks.push(sec.body.replace(/[*_#\[\]]/g, ""))
        }
      })
    }

    fullTextRef.current = textBlocks
  }, [lessonTitle, sections])

  // Stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const startSpeakingFromIndex = (index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

    if (index >= fullTextRef.current.length) {
      setIsPlaying(false)
      setIsPaused(false)
      setProgressPercent(100)
      setCurrentParagraph(0)
      return
    }

    const textToSpeak = fullTextRef.current.slice(index).join(". ")
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = rate
    utterance.pitch = 1.0

    // Try selecting a natural sounding English voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Enhanced"))
    ) || voices.find((v) => v.lang.startsWith("en"))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onboundary = (event) => {
      if (event.name === "sentence" || event.name === "word") {
        // Calculate rough progress percentage
        const charLen = textToSpeak.length
        if (charLen > 0) {
          const pct = Math.min(100, Math.round((event.charIndex / charLen) * 100))
          setProgressPercent(pct)
        }
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgressPercent(100)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)
  }

  const handlePlayPause = () => {
    if (!isSupported) return

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    } else if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      startSpeakingFromIndex(0)
    }
  }

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setIsPaused(false)
    setProgressPercent(0)
  }

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 2]
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length
    const newRate = rates[nextIdx]
    setRate(newRate)

    if (isPlaying && !isPaused) {
      startSpeakingFromIndex(0)
    }
  }

  if (!isSupported) return null

  return (
    <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-4 md:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info & audio waveform */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isPlaying && !isPaused ? (
              <Volume2 className="h-5 w-5 animate-pulse text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Audio Read-Through
              </span>
              {isPlaying && !isPaused && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Playing ({rate}x)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Listen to the complete lesson text spoken in natural audio playback.
            </p>
          </div>
        </div>

        {/* Right audio controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cycleRate}
            className="flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Change Speech Speed"
          >
            <FastForward className="h-3.5 w-3.5" /> {rate}x
          </button>

          {/* Stop / Reset Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center justify-center rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Stop Audio"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Primary Play / Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
              isPlaying && !isPaused
                ? "bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-600/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="h-4 w-4 fill-current" /> Pause
              </>
            ) : isPaused ? (
              <>
                <Play className="h-4 w-4 fill-current" /> Resume
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> Listen to Lesson
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar when playing */}
      {isPlaying && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
