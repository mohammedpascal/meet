import {
  Loader2,
  PlugZap,
  UserRound,
  VideoOff,
  WifiOff,
} from 'lucide-react'

type Variant =
  | 'connecting'
  | 'waiting'
  | 'reconnecting'
  | 'disconnected'
  | 'camera-off'

type Props = {
  variant: Variant
  title?: string
  description?: string
  participantName?: string
  onRetry?: () => void
}

const defaults: Record<
  Variant,
  { title: string; description: string; icon: typeof UserRound }
> = {
  connecting: {
    title: 'Connecting',
    description: 'Establishing a secure consultation link…',
    icon: Loader2,
  },
  waiting: {
    title: 'Waiting for participant',
    description:
      'You are in the consultation room. The other party will join shortly.',
    icon: UserRound,
  },
  reconnecting: {
    title: 'Reconnecting',
    description: 'Connection was interrupted. Attempting to restore…',
    icon: PlugZap,
  },
  disconnected: {
    title: 'Disconnected',
    description: 'The call has ended or the connection was lost.',
    icon: WifiOff,
  },
  'camera-off': {
    title: 'Camera off',
    description: 'Video is not available for this participant.',
    icon: VideoOff,
  },
}

export default function CallEmptyState({
  variant,
  title,
  description,
  participantName,
  onRetry,
}: Props) {
  const d = defaults[variant]
  const Icon = d.icon
  const spin = variant === 'connecting' || variant === 'reconnecting'

  return (
    <div className="call-empty flex h-full min-h-[280px] flex-col items-center justify-center gap-3 px-8 text-center sm:min-h-[360px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white/90 ring-1 ring-white/15">
        <Icon
          className={`h-7 w-7 ${spin ? 'animate-spin' : ''}`}
          aria-hidden
        />
      </div>
      <div>
        <p className="text-base font-semibold tracking-tight text-white">
          {title ?? d.title}
        </p>
        {participantName ? (
          <p className="mt-1 text-sm font-medium text-white/85">
            {participantName}
          </p>
        ) : null}
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
          {description ?? d.description}
        </p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
