type Props = {
  roomLabel: string
}

/**
 * Minimal top bar consistent with in-call `CallHeader` overlay (room + secure context).
 */
export default function PreCallHeader({ roomLabel }: Props) {
  const strong = 'font-medium text-white/95'
  const meta = 'm-0 text-xs text-white/65'
  const dot = 'text-white/35'

  return (
    <header className="absolute left-0 right-0 top-0 z-30 flex flex-col gap-1 border-b border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-black/35 sm:flex-row sm:items-center sm:gap-3 sm:py-3.5">
      <div className="min-w-0 flex-1">
        <p className={meta}>
          Consultation room:{' '}
          <span className={strong}>{roomLabel.trim() || '—'}</span>
          <span className={`mx-1.5 ${dot}`}>·</span>
          <span className={strong}>Secure connection</span>
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-white/45">
          End-to-end encrypted session
        </p>
      </div>
    </header>
  )
}
