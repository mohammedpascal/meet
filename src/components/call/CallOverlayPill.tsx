import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Status dot classes; ignored when `showDot` is false */
  dotClassName?: string
  className?: string
  /** When false, render text-only pill (e.g. timer) */
  showDot?: boolean
  'aria-label'?: string
}

/** Frosted pill over video (optional leading status dot). */
export default function CallOverlayPill({
  children,
  dotClassName = '',
  className = '',
  showDot = true,
  'aria-label': ariaLabel,
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-sm ${className}`}
      aria-label={ariaLabel}
    >
      {showDot ? (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}`}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  )
}
