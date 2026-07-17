"use client"

import { useState, useRef } from "react"
import { Loader2, Upload, ImageIcon, X } from "lucide-react"

interface ImageUploadFieldProps {
  name: string
  defaultValue?: string
  label?: string
}

export function ImageUploadField({ name, defaultValue = "", label = "Thumbnail Image (Optional)" }: ImageUploadFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Pre-flight checks
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setImageUrl(data.url)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      
      {/* Hidden input to pass the value to the form action/submission */}
      <input type="hidden" name={name} value={imageUrl} />

      {!imageUrl ? (
        <div className="flex flex-col items-start gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-4 w-4 text-muted-foreground" />
            )}
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
          
          <div className="text-xs text-muted-foreground">
             Alternatively, you can provide a direct URL:
          </div>
          <input 
            type="text" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" 
            placeholder="e.g. https://images.unsplash.com/..." 
          />

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-md border p-2">
            <img
              src={imageUrl}
              alt="Thumbnail preview"
              className="h-12 w-16 rounded object-cover border"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs text-muted-foreground">{imageUrl}</p>
            </div>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
