import {
  ParticipantContextIfNeeded,
  VideoTrack,
  useParticipantTracks,
} from '@livekit/components-react'
import type { RemoteParticipant } from 'livekit-client'
import { Track } from 'livekit-client'
import CallEmptyState from './CallEmptyState'
import ParticipantMetaOverlay from './ParticipantMetaOverlay'

type Props = {
  participant: RemoteParticipant
}

export default function RemoteParticipantView({ participant }: Props) {
  const screen = useParticipantTracks([Track.Source.ScreenShare], {
    participantIdentity: participant.identity,
  })
  const camera = useParticipantTracks([Track.Source.Camera], {
    participantIdentity: participant.identity,
  })

  const screenRef = screen[0]
  const camRef = camera[0]

  const screenLive =
    screenRef?.publication?.track &&
    screenRef.publication.isSubscribed &&
    !screenRef.publication.isMuted
  const camLive =
    camRef?.publication?.track &&
    camRef.publication.isSubscribed &&
    !camRef.publication.isMuted

  const trackRef = screenLive ? screenRef : camLive ? camRef : null
  const isScreen = Boolean(screenLive)

  const displayName =
    participant.name?.trim() || participant.identity || 'Participant'

  if (!trackRef) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-slate-950">
        <CallEmptyState
          variant="camera-off"
          title="No video"
          description="The other participant has not shared video yet, or their camera is off."
        />
        <ParticipantMetaOverlay
          name={displayName}
          role="Clinician"
          muted={!participant.isMicrophoneEnabled}
          className="z-[25]"
        />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-slate-950">
      <ParticipantContextIfNeeded participant={participant}>
        <VideoTrack
          trackRef={trackRef}
          className={`h-full w-full ${isScreen ? 'object-contain' : 'object-cover'}`}
        />
      </ParticipantContextIfNeeded>
      <ParticipantMetaOverlay
        name={displayName}
        role="Clinician"
        muted={!participant.isMicrophoneEnabled}
      />
    </div>
  )
}
