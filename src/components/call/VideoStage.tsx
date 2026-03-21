import {
  useConnectionState,
  useRemoteParticipants,
  useRoomContext,
} from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'
import type { ReactNode } from 'react'
import CallEmptyState from './CallEmptyState'
import CallStatusBadge from './CallStatusBadge'
import LocalPreviewCard from './LocalPreviewCard'
import RemoteParticipantView from './RemoteParticipantView'

function videoStatusKind(
  conn: ConnectionState,
  remoteCount: number,
): 'connected' | 'connecting' | 'waiting' | 'reconnecting' | 'disconnected' {
  if (conn === ConnectionState.Disconnected) return 'disconnected'
  if (conn === ConnectionState.Connecting) return 'connecting'
  if (conn === ConnectionState.Reconnecting) return 'reconnecting'
  if (remoteCount === 0) return 'waiting'
  return 'connected'
}

type Props = {
  /** Full viewport video (in-call immersive layout) */
  immersive?: boolean
}

export default function VideoStage({ immersive = false }: Props) {
  const room = useRoomContext()
  const conn = useConnectionState(room)
  const remotes = useRemoteParticipants()
  const primary = remotes[0]

  const badgeKind = videoStatusKind(conn, remotes.length)

  let body: ReactNode
  if (conn === ConnectionState.Disconnected) {
    body = <CallEmptyState variant="disconnected" />
  } else if (conn === ConnectionState.Connecting) {
    body = <CallEmptyState variant="connecting" />
  } else if (conn === ConnectionState.Reconnecting) {
    body = <CallEmptyState variant="reconnecting" />
  } else if (!primary) {
    body = <CallEmptyState variant="waiting" />
  } else {
    body = <RemoteParticipantView participant={primary} />
  }

  const showLocalPip =
    conn === ConnectionState.Connected ||
    conn === ConnectionState.Reconnecting ||
    (conn === ConnectionState.Connecting && remotes.length > 0)

  const shellClass = immersive
    ? 'absolute inset-0 z-0 overflow-hidden bg-slate-950'
    : 'relative w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-200/90 shadow-[0_24px_56px_-16px_rgba(15,23,42,0.28)] dark:ring-slate-700/80'

  const shellStyle = immersive
    ? undefined
    : {
        aspectRatio: '16 / 9' as const,
        maxHeight: 'min(68vh, calc(100vh - 14rem))',
      }

  const badgeTop = immersive
    ? 'left-3 top-20 z-[22] sm:left-4 sm:top-24'
    : 'left-3 top-3 z-[22] sm:left-4 sm:top-4'

  return (
    <div className={shellClass} style={shellStyle}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[18] h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
        aria-hidden
      />
      <div className={`absolute ${badgeTop}`}>
        <CallStatusBadge kind={badgeKind} />
      </div>

      <div className="relative h-full w-full">{body}</div>

      {showLocalPip ? (
        <LocalPreviewCard topOffset={immersive ? 'below-header' : 'default'} />
      ) : null}
    </div>
  )
}
