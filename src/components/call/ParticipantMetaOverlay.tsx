import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

type Props = {
  name: string
  microphoneEnabled: boolean
  cameraEnabled: boolean
  className?: string
}

export default function ParticipantMetaOverlay({
  name,
  microphoneEnabled,
  cameraEnabled,
  className = '',
}: Props) {
  const display = name.trim() || 'Participant'
  const MicIcon = microphoneEnabled ? Mic : MicOff
  const CamIcon = cameraEnabled ? Video : VideoOff
  const onClass = 'text-emerald-400'
  const offClass = 'text-red-400'

  return (
    <div
      className={`pointer-events-none absolute bottom-0 left-0 right-0 z-[15] px-4 pb-4 pt-16 ${className}`}
      style={{
        background:
          'linear-gradient(to top, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.45) 45%, transparent 100%)',
      }}
    >
      <div className="flex flex-wrap items-end gap-2">
        <p className="text-base font-normal tracking-tight text-white/95 drop-shadow-sm sm:text-lg">
          {display}
        </p>
        <span
          className="inline-flex items-center gap-1.5"
          aria-label={`Microphone ${microphoneEnabled ? 'on' : 'muted'}, camera ${cameraEnabled ? 'on' : 'off'}`}
        >
          <MicIcon
            className={`h-4 w-4 shrink-0 ${microphoneEnabled ? onClass : offClass}`}
            strokeWidth={2}
            aria-hidden
          />
          <CamIcon
            className={`h-4 w-4 shrink-0 ${cameraEnabled ? onClass : offClass}`}
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </div>
    </div>
  )
}
