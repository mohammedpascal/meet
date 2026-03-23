import { ParticipantContextIfNeeded } from '@livekit/components-react'
import { VideoTrack } from '@livekit/components-react'
import { useLocalParticipant } from '@livekit/components-react'
import { useParticipantTracks } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

export default function LocalPreviewCard() {
  const {
    localParticipant,
    isMicrophoneEnabled,
    isCameraEnabled,
  } = useLocalParticipant()
  const tracks = useParticipantTracks([Track.Source.Camera], {
    participantIdentity: localParticipant.identity,
  })
  const cam = tracks[0]
  const displayName =
    localParticipant.name?.trim() ||
    localParticipant.identity ||
    'Participant'

  const MicIcon = isMicrophoneEnabled ? Mic : MicOff
  const CamIcon = isCameraEnabled ? Video : VideoOff
  const onClass = 'text-emerald-400'
  const offClass = 'text-red-400'

  return (
    <div
      className="absolute right-3 top-3 z-20 w-[28%] min-w-[120px] max-w-[220px] sm:right-4 sm:top-4"
      style={{ aspectRatio: '16 / 10' }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-950/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-2 ring-white/25 ring-offset-2 ring-offset-slate-950/0">
        {isCameraEnabled && cam?.publication?.track ? (
          <ParticipantContextIfNeeded participant={localParticipant}>
            <VideoTrack
              trackRef={cam}
              className="h-full w-full scale-x-[-1] object-cover"
            />
          </ParticipantContextIfNeeded>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-900 text-white/70">
            <VideoOff className="h-8 w-8 opacity-80" aria-hidden />
            <span className="text-[11px] font-medium">Camera off</span>
          </div>
        )}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 pt-6">
          <div className="inline-flex max-w-full min-w-0 items-center gap-1.5">
            <p className="m-0 min-w-0 truncate text-[11px] font-normal leading-none tracking-tight text-white/95">
              {displayName}
            </p>
            <span
              className="inline-flex shrink-0 items-center gap-1"
              aria-label={`Microphone ${isMicrophoneEnabled ? 'on' : 'muted'}, camera ${isCameraEnabled ? 'on' : 'off'}`}
            >
              <MicIcon
                className={`h-3.5 w-3.5 shrink-0 ${isMicrophoneEnabled ? onClass : offClass}`}
                strokeWidth={2}
                aria-hidden
              />
              <CamIcon
                className={`h-3.5 w-3.5 shrink-0 ${isCameraEnabled ? onClass : offClass}`}
                strokeWidth={2}
                aria-hidden
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
