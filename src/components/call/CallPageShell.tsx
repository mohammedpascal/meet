import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** `call` reserves space for the floating control dock */
  variant?: 'call' | 'join'
}

export default function CallPageShell({
  children,
  variant = 'call',
}: Props) {
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
