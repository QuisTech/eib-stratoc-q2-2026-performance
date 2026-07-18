"use client"

import { useState } from "react"
import { LabeledGraphicData, LabeledGraphicHotspot } from "@/lib/lms-content"
import { X, Plus } from "lucide-react"

export function LabeledGraphic({ data }: { data: LabeledGraphicData }) {
  const [activeHotspot, setActiveHotspot] = useState<LabeledGraphicHotspot | null>(null)

  if (!data || !data.imageUrl) return null

  return (
    <div className="my-8 rounded-lg border bg-card p-4 shadow-sm relative">
      <h3 className="mb-4 text-lg font-semibold text-primary">Interactive Diagram</h3>
      
      <div className="relative w-full mx-auto overflow-hidden rounded-md border border-muted-foreground/20 bg-muted/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.imageUrl}
          alt="Interactive Diagram"
          className="w-full h-auto block"
        />

        {data.hotspots?.map((hotspot, i) => (
          <button
            key={hotspot.id || i}
            onClick={() => setActiveHotspot(hotspot)}
            className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            aria-label={`View details for ${hotspot.title}`}
          >
            <Plus className="h-5 w-5" />
          </button>
        ))}

        {/* Overlay Popup */}
        {activeHotspot && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-xl animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveHotspot(null)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              <h4 className="mb-2 text-xl font-semibold leading-none tracking-tight">
                {activeHotspot.title}
              </h4>
              <div className="text-sm text-muted-foreground">
                {activeHotspot.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
