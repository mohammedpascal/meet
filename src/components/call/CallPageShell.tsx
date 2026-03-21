import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** `call` = card layout with dock padding; `join` = pre-call; `immersive` = full-bleed call (fixed dock) */
  variant?: 'call' | 'join' | 'immersive'
}

export default function CallPageShell({
  children,
  variant = 'call',
}: Props) {
  if (variant === 'immersive') {
    return (
      <div className="call-page-shell--immersive relative flex min-h-0 min-h-dvh w-full flex-1 flex-col">
        {children}
      </div>
    )
  }

  const padding =
    variant === 'join'
      ? 'pb-8 pt-4 sm:pb-10 sm:pt-5'
      : 'pb-28 pt-4 sm:pb-32 sm:pt-6'

  return (
    <div
      className={`call-page-shell mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200/90 bg-white px-3 shadow-md ring-1 ring-black/[0.03] dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/[0.04] sm:px-5 ${padding} ${variant === 'call' ? 'min-h-[calc(100dvh-2rem)]' : 'min-h-0'}`}
    >
      {children}
    </div>
  )
}
