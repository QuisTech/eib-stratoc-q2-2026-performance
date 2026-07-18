"use client"

import { useState, useRef, MouseEvent } from "react"
import { LabeledGraphicData, LabeledGraphicHotspot } from "@/lib/lms-content"
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react"

interface GraphicBuilderProps {
  data?: LabeledGraphicData
  onChange: (data?: LabeledGraphicData) => void
}

export function GraphicBuilder({ data, onChange }: GraphicBuilderProps) {
  const [activeTab, setActiveTab] = useState<"image" | "hotspots">("image")
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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

  const handleFileUpload = async (file: File) => {
    setUploadError(null)
    
    // Client-side pre-flight validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      let uploadFile = file;

      // Client-side compression for large images (e.g. > 700KB) to ensure Vercel compatibility
      // This bypasses the need for backend sharp processing entirely.
      if (file.size > 700 * 1024 && file.type.startsWith("image/")) {
        uploadFile = await new Promise<File>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 1200;
            
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(file);
            
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" }));
                else resolve(file);
              },
              "image/jpeg",
              0.6 // Aggressive compression for Base64 injection
            );
          };
          img.onerror = () => resolve(file);
          img.src = URL.createObjectURL(file);
        });
      }

      const formData = new FormData()
      formData.append("file", uploadFile)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Upload failed")
      
      handleImageChange(result.url)
    } catch (e: any) {
      setUploadError(e.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file)
    }
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
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Image</label>
        
        {!data?.imageUrl ? (
          <>
            <div
              className={`relative rounded-md border-2 border-dashed p-8 text-center transition-colors ${
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/30 bg-muted/20 hover:border-muted-foreground/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              
              <div className="flex flex-col items-center gap-3">
                {isUploading ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Uploading image...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Upload an image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </button>
                  </>
                )}
              </div>
              
              {uploadError && (
                <p className="mt-3 text-xs text-destructive">{uploadError}</p>
              )}
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground">Or provide a direct Image URL</label>
              <input
                value={data?.imageUrl || ""}
                onChange={(e) => handleImageChange(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g. https://images.unsplash.com/photo-..."
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={data.imageUrl}
                alt="Uploaded image"
                className="h-20 w-20 rounded-md border object-cover"
              />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Image uploaded</p>
                <p className="text-xs text-muted-foreground truncate max-w-xs">
                  {data.imageUrl}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleImageChange("")}
                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 disabled:opacity-50"
            >
              <Upload className="h-3 w-3" />
              Replace image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        )}
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
