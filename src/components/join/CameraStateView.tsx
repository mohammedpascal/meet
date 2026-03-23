import { VideoOff } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Props = {
  stream: MediaStream | null
  videoEnabled: boolean
}

/**
 * Full-bleed preview: live video or a structured camera-off state aligned with in-call empty states.
 */
export default function CameraStateView({ stream, videoEnabled }: Props) {
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

  if (showVideo) {
    return (
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
        muted
        playsInline
        autoPlay
        aria-label="Your camera preview"
      />
    )
  }

  return (
    <div
      className="call-empty flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 px-8 text-center"
      aria-live="polite"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white/90 ring-1 ring-white/15">
        <VideoOff className="h-7 w-7" aria-hidden />
      </div>
      <div className="max-w-sm">
        <p className="text-base font-semibold tracking-tight text-white">
          Camera is off
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Turn on your camera for a clearer, more personal consultation. You can
          still join with audio only.
        </p>
      </div>
    </div>
  )
}
