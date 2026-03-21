import { useRouterState } from '@tanstack/react-router'
import { useCallUi } from '../context/call-ui-context'

export default function Footer() {
  const year = new Date().getFullYear()
  const {
    info: { active: inCall },
  } = useCallUi()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const onJoinLounge = pathname === '/' && !inCall

  if (inCall || onJoinLounge) {
    return null
  }

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Your name here. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
    </footer>
  )
}
