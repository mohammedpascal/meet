import { ParticipantContextIfNeeded } from '@livekit/components-react'
import { VideoTrack } from '@livekit/components-react'
import { useLocalParticipant } from '@livekit/components-react'
import { useParticipantTracks } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { VideoOff } from 'lucide-react'

type Props = {
  topOffset?: 'default' | 'below-header'
}

export default function LocalPreviewCard({
  topOffset = 'default',
}: Props) {
  const { localParticipant, isCameraEnabled } = useLocalParticipant()
  const tracks = useParticipantTracks([Track.Source.Camera], {
    participantIdentity: localParticipant.identity,
  })
  const cam = tracks[0]
  const displayName =
    localParticipant.name?.trim() ||
    localParticipant.identity ||
    'Participant'

  const topClass =
    topOffset === 'below-header'
      ? 'right-3 top-20 z-20 sm:right-4 sm:top-24'
      : 'right-3 top-3 z-20 sm:right-4 sm:top-4'

  return (
    <div
      className={`absolute w-[28%] min-w-[120px] max-w-[220px] ${topClass}`}
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
          <span className="text-[11px] font-semibold tracking-wide text-white/95">
            {displayName}
          </span>
        </div>
      </div>
    </div>
  )
}
