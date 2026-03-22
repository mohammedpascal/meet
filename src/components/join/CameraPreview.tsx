import { VideoOff } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Props = {
  stream: MediaStream | null
  videoEnabled: boolean
  /** `card` = bounded preview in a form; `fullscreen` = full-bleed layer (absolute inset-0). */
  variant?: 'card' | 'fullscreen'
}

export default function CameraPreview({
  stream,
  videoEnabled,
  variant = 'card',
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (stream && videoEnabled) {
      el.srcObject = stream
      void el.play().catch(() => {})
    } else {
      el.srcObject = null
    }
  }, [stream, videoEnabled])

  const showVideo = Boolean(stream && videoEnabled)

  const badge = (
    <span className="absolute left-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/95 backdrop-blur-sm sm:left-4 sm:top-4">
      Preview
    </span>
  )

  const badgeFullscreen = (
    <span className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/95 backdrop-blur-sm sm:left-4 sm:top-[max(1rem,env(safe-area-inset-top))]">
      Preview
    </span>
  )

  if (variant === 'fullscreen') {
    return (
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-slate-950"
        aria-label="Camera preview"
      >
        {badgeFullscreen}
        {showVideo ? (
          <video
            ref={ref}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            autoPlay
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900 text-slate-400">
            <VideoOff className="h-14 w-14 opacity-80 sm:h-16 sm:w-16" aria-hidden />
            <span className="text-sm font-medium text-slate-300 sm:text-base">
              Camera is off
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-200/90 dark:ring-slate-700/90 sm:max-h-none">
      <div
        className="relative aspect-video w-full max-h-52 sm:max-h-60"
        aria-label="Camera preview"
      >
        {badge}
        {showVideo ? (
          <video
            ref={ref}
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 text-slate-400">
            <VideoOff className="h-11 w-11 opacity-80" aria-hidden />
            <span className="text-sm font-medium text-slate-300">
              Camera is off
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
