import CallOverlayPill from './CallOverlayPill'

type StatusKind =
  | 'connected'
  | 'connecting'
  | 'waiting'
  | 'reconnecting'
  | 'disconnected'

type Props = {
  kind: StatusKind
  className?: string
}

const copy: Record<StatusKind, string> = {
  connected: 'Connected',
  connecting: 'Connecting…',
  waiting: 'Waiting for participant',
  reconnecting: 'Reconnecting…',
  disconnected: 'Disconnected',
}

const dotClass: Record<StatusKind, string> = {
  connected: 'bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]',
  connecting: 'bg-amber-400 animate-pulse',
  waiting: 'bg-sky-400 animate-pulse',
  reconnecting: 'bg-amber-400 animate-pulse',
  disconnected: 'bg-zinc-400',
}

export default function CallStatusBadge({ kind, className = '' }: Props) {
  return (
    <CallOverlayPill dotClassName={dotClass[kind]} className={className}>
      {copy[kind]}
    </CallOverlayPill>
  )
}
