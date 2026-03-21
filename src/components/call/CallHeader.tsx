import { useParticipants } from '@livekit/components-react'
import { useConnectionState } from '@livekit/components-react'
import { useRoomContext } from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'
import { useEffect, useState } from 'react'
import { formatElapsed } from './call-utils'

type Props = {
  roomLabel: string
  selfDisplayName: string
  /** Glass strip over video (absolute inside video column when overlay) */
  variant?: 'card' | 'overlay'
}

function connectionLabel(state: ConnectionState): string {
  switch (state) {
    case ConnectionState.Connected:
      return 'Secure connection'
    case ConnectionState.Connecting:
      return 'Connecting…'
    case ConnectionState.Reconnecting:
      return 'Reconnecting…'
    case ConnectionState.Disconnected:
      return 'Disconnected'
    default:
      return '…'
  }
}

export default function CallHeader({
  roomLabel,
  selfDisplayName,
  variant = 'card',
}: Props) {
  const room = useRoomContext()
  const conn = useConnectionState(room)
  const participants = useParticipants()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (conn !== ConnectionState.Connected) {
      setElapsed(0)
      return
    }
    const start = Date.now()
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => window.clearInterval(id)
  }, [conn])

  const isOverlay = variant === 'overlay'

  const shell = isOverlay
    ? 'absolute left-0 right-0 top-0 z-20 flex flex-col gap-2 border-b border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-black/35 sm:flex-row sm:items-center sm:gap-3 sm:py-3.5'
    : 'flex flex-col gap-3 border-b border-slate-700/80 pb-4 sm:flex-row sm:items-center sm:justify-between'

  const metaLine = isOverlay
    ? 'm-0 text-xs text-white/65'
    : 'm-0 text-xs text-slate-400'

  const strong = isOverlay
    ? 'font-medium text-white/95'
    : 'font-medium text-slate-300'

  const dot = isOverlay ? 'text-white/35' : 'text-slate-600'

  return (
    <header className={shell}>
      <div className="min-w-0 flex-1">
        <p className={metaLine}>
          Room: <span className={strong}>{roomLabel || '—'}</span>
          {selfDisplayName ? (
            <>
              <span className={`mx-1.5 ${dot}`}>·</span>
              You: <span className={strong}>{selfDisplayName}</span>
            </>
          ) : null}
          <span className={`mx-1.5 ${dot}`}>·</span>
          {connectionLabel(conn)}
          <span className={`mx-1.5 ${dot}`}>·</span>
          {participants.length}{' '}
          {participants.length === 1 ? 'participant' : 'participants'}
          <span className={`mx-1.5 ${dot}`}>·</span>
          {formatElapsed(elapsed)}
        </p>
      </div>
    </header>
  )
}
