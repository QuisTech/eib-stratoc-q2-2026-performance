"use client"

import { useState, useRef, MouseEvent } from "react"
import { LabeledGraphicData, LabeledGraphicHotspot } from "@/lib/lms-content"
import { Plus, Trash2 } from "lucide-react"

interface GraphicBuilderProps {
  data?: LabeledGraphicData
  onChange: (data?: LabeledGraphicData) => void
}

export function GraphicBuilder({ data, onChange }: GraphicBuilderProps) {
  const [activeTab, setActiveTab] = useState<"image" | "hotspots">("image")
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageChange = (url: string) => {
    if (!url) {
      onChange(undefined)
      return
    }
    onChange({
      imageUrl: url,
      hotspots: data?.hotspots || [],
    })
  }

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (!data?.imageUrl || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newHotspot: LabeledGraphicHotspot = {
      id: `hs-${Date.now()}`,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      title: "New Hotspot",
      content: "",
    }

    onChange({
      ...data,
      hotspots: [...(data.hotspots || []), newHotspot],
    })
    setActiveTab("hotspots")
  }

  const updateHotspot = (index: number, field: keyof LabeledGraphicHotspot, value: any) => {
    if (!data) return
    const updatedHotspots = [...data.hotspots]
    updatedHotspots[index] = { ...updatedHotspots[index], [field]: value }
    onChange({ ...data, hotspots: updatedHotspots })
  }

  const removeHotspot = (index: number) => {
    if (!data) return
    onChange({
      ...data,
      hotspots: data.hotspots.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="rounded-md border bg-muted/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interactive Labeled Graphic</label>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Image URL</label>
        <input
          value={data?.imageUrl || ""}
          onChange={(e) => handleImageChange(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="e.g. https://images.unsplash.com/photo-..."
        />
      </div>

      {data?.imageUrl && (
        <div className="space-y-4">
          <div className="rounded-md border bg-background p-1">
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveTab("image")}
                className={`px-4 py-2 text-sm font-medium ${activeTab === "image" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              >
                Preview & Edit Image
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotspots")}
                className={`px-4 py-2 text-sm font-medium ${activeTab === "hotspots" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              >
                Hotspots List ({data.hotspots?.length || 0})
              </button>
            </div>

            <div className="p-4">
              {activeTab === "image" && (
                <div className="text-center">
                  <p className="mb-4 text-xs text-muted-foreground">Click anywhere on the image below to add a new interactive hotspot.</p>
                  <div className="relative inline-block max-w-full overflow-hidden rounded-md border shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imageRef}
                      src={data.imageUrl}
                      alt="Graphic Preview"
                      onClick={handleImageClick}
                      className="cursor-crosshair block max-w-full h-auto"
                    />
                    {data.hotspots?.map((hs, i) => (
                      <div
                        key={hs.id || i}
                        className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm pointer-events-none"
                        style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "hotspots" && (
                <div className="space-y-4">
                  {(!data.hotspots || data.hotspots.length === 0) ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No hotspots added. Go to the "Preview & Edit Image" tab and click on the image to add one.
                    </div>
                  ) : (
                    data.hotspots.map((hs, i) => (
                      <div key={hs.id || i} className="relative rounded-md border bg-muted/20 p-4">
                        <div className="absolute right-4 top-4 flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {i + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeHotspot(i)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="mb-3 pr-12">
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Hotspot Title</label>
                          <input
                            value={hs.title}
                            onChange={(e) => updateHotspot(i, "title", e.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm font-medium"
                            placeholder="e.g. Server Rack A"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">Popup Content</label>
                          <textarea
                            value={hs.content}
                            onChange={(e) => updateHotspot(i, "content", e.target.value)}
                            className="w-full resize-y rounded-md border bg-background p-2 text-sm"
                            rows={3}
                            placeholder="Detailed explanation that appears when clicked..."
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
