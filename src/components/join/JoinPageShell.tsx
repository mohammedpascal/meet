import type { ReactNode } from 'react'
import CallPageShell from '../call/CallPageShell'
import JoinHeader from './JoinHeader'

type Props = {
  children: ReactNode
}

export default function JoinPageShell({ children }: Props) {
  return (
    <div className="join-page-inner mx-auto w-full max-w-3xl px-3 pt-2 pb-6 sm:px-5 sm:pt-3">
      <CallPageShell variant="join">
        <JoinHeader />
        {children}
      </CallPageShell>
    </div>
  )
}
