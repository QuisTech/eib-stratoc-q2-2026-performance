"use client"

import { useState } from "react"
import { Play, Film, Clock, Sparkles, AlertCircle } from "lucide-react"

interface LessonVideoPlayerProps {
  videoUrl?: string
  minutes?: number
  hasLabeledGraphic?: boolean
}

export function LessonVideoPlayer({ videoUrl, minutes = 15, hasLabeledGraphic }: LessonVideoPlayerProps) {
  const [showNotification, setShowNotification] = useState(false)

  // Check if videoUrl is a real video link vs static PNG/JPG image
  const isImageFile = videoUrl && /\.(png|jpg|jpeg|webp)($|\?)/i.test(videoUrl)
  const isRealVideoUrl = videoUrl && !isImageFile

  // If there's an actual video embed (e.g. YouTube/Vimeo/mp4), render the video iframe!
  if (isRealVideoUrl) {
    return (
      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm bg-black">
        <iframe
          src={videoUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Otherwise, render the industry-standard Video Placeholder!
  return (
    <div className="mt-6 relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 p-6 md:p-8 flex flex-col justify-between shadow-lg text-white group">
      {/* Background Subtle Grid & Mesh Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      {/* Top Badges */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 backdrop-blur-md">
            <Film className="h-3.5 w-3.5" /> Video Module
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700 backdrop-blur-md">
            <Clock className="h-3.5 w-3.5" /> ~{minutes} mins
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" /> Studio Production In Progress
        </span>
      </div>

      {/* Center Animated Play Button & Info */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center text-center">
        <button
          type="button"
          onClick={() => setShowNotification(true)}
          className="group/btn relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-xl shadow-blue-900/30 transition-all duration-300 hover:scale-110 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/40"
          title="Play Preview"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-2 rounded-full border border-blue-500/40 animate-ping opacity-75" />
          <Play className="h-7 w-7 fill-current ml-1" />
        </button>

        <h3 className="mt-4 font-heading text-lg md:text-xl font-bold tracking-tight text-slate-100">
          HD Video Narration Coming Soon
        </h3>
        <p className="mt-1.5 max-w-lg text-xs md:text-sm text-slate-400 leading-relaxed">
          Our broadcast media team is finalizing high-definition video narration for this lesson. Use the audio read-through player or interactive hotspots below.
        </p>

        {showNotification && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-950/80 border border-blue-500/40 px-4 py-2 text-xs text-blue-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <AlertCircle className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Video studio release scheduled. Complete the audio & text content below to earn lesson credit.</span>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
        <span>EIB Group Media Studio</span>
        <span>Text & Audio Available Below</span>
      </div>
    </div>
  )
}
