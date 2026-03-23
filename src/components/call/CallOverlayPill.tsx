import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  dotClassName: string
  className?: string
}

/** Frosted pill over video; pairs with `CallStatusBadge` styling. */
export default function CallOverlayPill({
  children,
  dotClassName,
  className = '',
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-sm ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}`}
        aria-hidden
      />
      {children}
    </span>
  )
}
