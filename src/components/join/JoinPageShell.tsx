import type { ReactNode } from 'react'
import CallPageShell from '../call/CallPageShell'

type Props = {
  children: ReactNode
}

/** Mirrors in-call layout shell: immersive column ready for `VideoStage`-style content. */
export default function JoinPageShell({ children }: Props) {
  return (
    <CallPageShell variant="immersive">
      <div
        className="flex h-dvh min-h-0 w-full flex-1 flex-row overflow-hidden"
        dir="ltr"
      >
        {children}
      </div>
    </CallPageShell>
  )
}
