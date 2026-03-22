import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function JoinPageShell({ children }: Props) {
  return (
    <div className="relative h-dvh min-h-0 w-full overflow-hidden">
      {children}
    </div>
  )
}
