"use client"

import { useState, useRef } from "react"
import { Play, Film, Clock, Sparkles, Volume2, VolumeX, AlertCircle } from "lucide-react"

interface LessonVideoPlayerProps {
  videoUrl?: string
  minutes?: number
  hasLabeledGraphic?: boolean
}

// Lightweight corporate trailer loop video URL
const DEFAULT_TEASER_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-corporate-team-working-together-in-an-office-42898-large.mp4"

export function LessonVideoPlayer({ videoUrl, minutes = 15 }: LessonVideoPlayerProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Check if videoUrl is a real video link vs static PNG/JPG image
  const isImageFile = videoUrl && /\.(png|jpg|jpeg|webp)($|\?)/i.test(videoUrl)
  const isRealVideoUrl = videoUrl && !isImageFile

  // If there's an actual full lesson video embed (e.g. YouTube/Vimeo/mp4), render the iframe!
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Render the looping video teaser placeholder across all lessons!
  return (
    <div className="mt-6 relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 flex flex-col justify-between shadow-xl text-white group">
      {/* HTML5 Auto-Looping Background Video Trailer */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster="/eiblogo_blue.png"
        className="absolute inset-0 h-full w-full object-cover opacity-35 filter blur-[0.5px] scale-105 transition-all duration-700 group-hover:scale-100 group-hover:opacity-45 pointer-events-none"
      >
        <source src={DEFAULT_TEASER_VIDEO_URL} type="video/mp4" />
      </video>

      {/* Dark Gradient Overlay for Typography Contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />

      {/* Top Badges */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 backdrop-blur-md">
            <Film className="h-3.5 w-3.5" /> Video Module Trailer
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700/80 backdrop-blur-md">
            <Clock className="h-3.5 w-3.5" /> ~{minutes} mins
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30 backdrop-blur-md animate-pulse">
          <Sparkles className="h-3.5 w-3.5" /> HD Studio Release Coming Soon
        </span>
      </div>

      {/* Center Animated Play Button & Info */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center text-center">
        <button
          type="button"
          onClick={() => setShowNotification(true)}
          className="group/btn relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-xl shadow-blue-900/50 transition-all duration-300 hover:scale-110 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/40"
          title="Play Preview"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-2 rounded-full border border-blue-400/50 animate-ping opacity-75" />
          <Play className="h-7 w-7 fill-current ml-1" />
        </button>

        <h3 className="mt-4 font-heading text-lg md:text-xl font-bold tracking-tight text-slate-100 drop-shadow-sm">
          Interactive Video Production in Progress
        </h3>
        <p className="mt-1.5 max-w-lg text-xs md:text-sm text-slate-300 leading-relaxed drop-shadow-sm">
          Our broadcast media studio is producing high-definition video narration for this module. You can use the audio read-through player or interactive hotspots below.
        </p>

        {showNotification && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900/90 border border-blue-500/50 px-4 py-2 text-xs text-blue-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            <AlertCircle className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Studio video release scheduled. Complete the audio & text content below to earn your lesson credit.</span>
          </div>
        )}
      </div>

      {/* Bottom Status Bar with Trailer Audio Mute Toggle */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800/80 pt-3">
        <span>EIB Group Media Studio</span>

        <button
          type="button"
          onClick={toggleMute}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors backdrop-blur-sm"
        >
          {isMuted ? (
            <>
              <VolumeX className="h-3.5 w-3.5 text-slate-400" /> Unmute Teaser Audio
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5 text-blue-400 animate-pulse" /> Teaser Audio On
            </>
          )}
        </button>
      </div>
    </div>
  )
}
