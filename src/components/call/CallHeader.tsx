import { useParticipants } from '@livekit/components-react'
import { useConnectionState } from '@livekit/components-react'
import { useRoomContext } from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'
import { useEffect, useState } from 'react'
import ThemeToggle from '../ThemeToggle'
import { formatElapsed } from './call-utils'

type Props = {
  roomLabel: string
  selfDisplayName: string
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

  return (
    <header className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
          Room:{' '}
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {roomLabel || '—'}
          </span>
          {selfDisplayName ? (
            <>
              <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
              You:{' '}
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {selfDisplayName}
              </span>
            </>
          ) : null}
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
          {connectionLabel(conn)}
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
          {participants.length}{' '}
          {participants.length === 1 ? 'participant' : 'participants'}
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
          {formatElapsed(elapsed)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
