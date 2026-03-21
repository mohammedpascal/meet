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
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-sm ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass[kind]}`}
        aria-hidden
      />
      {copy[kind]}
    </span>
  )
}
