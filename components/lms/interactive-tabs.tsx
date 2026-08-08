"use client"

import { useState } from "react"
import { parseMarkdown } from "@/lib/markdown"
import { BookOpen, ChevronRight, Sparkles } from "lucide-react"

export type TabItem = {
  tabTitle: string
  content: string
}

export function InteractiveTabs({ tabs }: { tabs: TabItem[] }) {
  const safeTabs = Array.isArray(tabs) ? tabs.filter((t) => t && (t.tabTitle || t.content)) : []
  const [activeIdx, setActiveIdx] = useState(0)

  if (safeTabs.length === 0) return null

  const currentTab = safeTabs[activeIdx] || safeTabs[0]

  // Render content with proper paragraphs, bullet points, and headers
  function renderFormattedContent(rawText: string) {
    if (!rawText) return null

    // Split by double newlines or single newlines with headers/bullets
    const blocks = rawText.split(/\n\s*\n/).filter((b) => b.trim().length > 0)

    return (
      <div className="flex flex-col gap-4 text-foreground/90">
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim()

          // Check if block is a list (bullets or numbers)
          if (trimmed.startsWith("•") || trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed)) {
            const lines = trimmed.split("\n").filter((l) => l.trim().length > 0)
            return (
              <ul key={bIdx} className="my-2 flex flex-col gap-2 rounded-xl bg-muted/40 p-4 border border-border/60">
                {lines.map((line, lIdx) => {
                  const lineClean = line.replace(/^[•\-\d\.]+\s*/, "").trim()
                  return (
                    <li key={lIdx} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span
                        className="flex-1"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(lineClean) }}
                      />
                    </li>
                  )
                })}
              </ul>
            )
          }

          // Check if block is a heading / section title (e.g. BACKGROUND & CHALLENGE:, FORMULA:)
          if (/^[A-Z0-9\s\&\:\-\(\)]{3,50}:$/.test(trimmed) || trimmed.startsWith("###") || trimmed.startsWith("##")) {
            const headingText = trimmed.replace(/^#+\s*/, "").replace(/:$/, "")
            return (
              <h4 key={bIdx} className="mt-3 text-base font-bold tracking-tight text-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-primary/80" />
                {headingText}
              </h4>
            )
          }

          // Standard paragraph
          return (
            <p
              key={bIdx}
              className="text-sm md:text-base leading-relaxed text-muted-foreground text-pretty"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(trimmed) }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden mt-6">
      {/* Header */}
      <div className="border-b border-border/60 bg-muted/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-bold uppercase tracking-wider text-foreground/80">
            Interactive Deep Dive
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/50">
          Module {activeIdx + 1} of {safeTabs.length}
        </span>
      </div>

      {/* Adaptive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] divide-y md:divide-y-0 md:divide-x divide-border/60 min-h-[380px]">
        {/* Navigation Sidebar / Pills */}
        <div className="bg-muted/10 p-3 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
          {safeTabs.map((t, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`group relative flex items-center justify-between gap-3 rounded-xl p-3.5 text-left text-xs md:text-sm font-medium transition-all w-full shrink-0 md:shrink ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-background"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate flex-1 font-medium">{t.tabTitle || `Topic ${i + 1}`}</span>
                </div>
                <ChevronRight
                  className={`hidden md:block h-4 w-4 shrink-0 transition-transform ${
                    isActive ? "translate-x-0.5 text-primary-foreground" : "opacity-0 group-hover:opacity-50"
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 bg-card flex flex-col justify-between">
          <div>
            <div className="mb-5 pb-3 border-b border-border/40 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
              <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                {currentTab.tabTitle}
              </h3>
            </div>

            <div className="mt-4">
              {renderFormattedContent(currentTab.content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
