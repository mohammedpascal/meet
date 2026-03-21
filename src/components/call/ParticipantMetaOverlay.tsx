type Props = {
  name: string
  role: string
  muted?: boolean
  className?: string
}

export default function ParticipantMetaOverlay({
  name,
  role,
  muted,
  className = '',
}: Props) {
  return (
    <div
      className={`pointer-events-none absolute bottom-0 left-0 right-0 z-[15] px-4 pb-4 pt-16 ${className}`}
      style={{
        background:
          'linear-gradient(to top, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.45) 45%, transparent 100%)',
      }}
    >
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <p className="text-lg font-semibold tracking-tight text-white drop-shadow-sm sm:text-xl">
            {name || 'Participant'}
          </p>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/60">
            {role}
          </p>
        </div>
        {muted ? (
          <span className="rounded-md bg-black/35 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/90 ring-1 ring-white/20">
            Muted
          </span>
        ) : null}
      </div>
    </div>
  )
}
