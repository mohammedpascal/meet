import { useEffect, useState } from 'react'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import { VideoConference } from '@livekit/components-react/prefabs'
import '@livekit/components-styles'

type Props = {
  token: string
  serverUrl: string
  onLeave: () => void
}

export default function LiveKitMeeting({
  token,
  serverUrl,
  onLeave,
}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-16 text-sm text-[var(--sea-ink-soft)]">
        Preparing media…
      </div>
    )
  }

  return (
    <div className="lk-room-wrap overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--sand)] shadow-[0_22px_44px_rgba(30,90,72,0.12)]">
      <LiveKitRoom
        serverUrl={serverUrl}
        token={token}
        connect
        audio
        video
        onDisconnected={() => onLeave()}
        onError={(err) => {
          console.error(err)
        }}
        className="lk-room-inner"
      >
        <div className="flex max-h-[min(72vh,calc(100vh-12rem))] min-h-[420px] flex-col">
          <VideoConference />
          <RoomAudioRenderer />
        </div>
      </LiveKitRoom>
      <div className="flex justify-end border-t border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2">
        <button
          type="button"
          onClick={onLeave}
          className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-white"
        >
          Leave room
        </button>
      </div>
    </div>
  )
}
