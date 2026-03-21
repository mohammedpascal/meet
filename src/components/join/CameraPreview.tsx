import { VideoOff } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Props = {
  stream: MediaStream | null
  videoEnabled: boolean
}

export default function CameraPreview({ stream, videoEnabled }: Props) {
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

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-200/90 dark:ring-slate-700/90 sm:max-h-none">
      <div
        className="relative aspect-video w-full max-h-52 sm:max-h-60"
        aria-label="Camera preview"
      >
        <span className="absolute left-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/95 backdrop-blur-sm">
          Preview
        </span>
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
