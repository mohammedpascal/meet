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

export default function VideoStage() {
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

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-200/90 shadow-[0_24px_56px_-16px_rgba(15,23,42,0.28)] dark:ring-slate-700/80"
      style={{
        aspectRatio: '16 / 9',
        maxHeight: 'min(68vh, calc(100vh - 14rem))',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[18] h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
        aria-hidden
      />
      <div className="absolute left-3 top-3 z-[22] sm:left-4 sm:top-4">
        <CallStatusBadge kind={badgeKind} />
      </div>

      <div className="relative h-full w-full">{body}</div>

      {showLocalPip ? <LocalPreviewCard /> : null}
    </div>
  )
}
