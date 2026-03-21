import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useCallback, useEffect, useState } from 'react'
import LiveKitMeeting from '../components/LiveKitMeeting'
import { getLiveKitToken } from '../server/livekit-token'

export const Route = createFileRoute('/room')({
  validateSearch: (search: Record<string, unknown>) => ({
    room: typeof search.room === 'string' ? search.room : '',
    name: typeof search.name === 'string' ? search.name : '',
  }),
  component: RoomPage,
})

function RoomPage() {
  const { room: roomFromUrl, name: nameFromUrl } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const fetchToken = useServerFn(getLiveKitToken)

  const [room, setRoom] = useState(roomFromUrl)
  const [name, setName] = useState(nameFromUrl)
  const [session, setSession] = useState<{
    token: string
    serverUrl: string
  } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const join = useCallback(
    async (r: string, n: string) => {
      setError(null)
      setBusy(true)
      try {
        const out = await fetchToken({ data: { room: r, name: n } })
        setSession({ token: out.token, serverUrl: out.serverUrl })
        void navigate({
          search: { room: r, name: n },
          replace: true,
        })
      } catch (e) {
        setSession(null)
        setError(e instanceof Error ? e.message : 'Could not join the room')
      } finally {
        setBusy(false)
      }
    },
    [fetchToken, navigate],
  )

  useEffect(() => {
    setRoom(roomFromUrl)
    setName(nameFromUrl)
  }, [roomFromUrl, nameFromUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void join(room.trim(), name.trim())
  }

  const leave = () => {
    setSession(null)
    void navigate({ search: { room: '', name: '' }, replace: true })
  }

  return (
    <main className="page-wrap px-4 pb-10 pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="island-kicker mb-2">LiveKit</p>
          <h1 className="display-title m-0 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
            Video room
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--sea-ink-soft)]">
            Connects to your server at{' '}
            <span className="font-medium text-[var(--lagoon-deep)]">
              meet.successta.co
            </span>
            . Set <code>LIVEKIT_URL</code>, <code>LIVEKIT_API_KEY</code>, and{' '}
            <code>LIVEKIT_API_SECRET</code> in <code>.env</code> for token
            minting.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:bg-[var(--link-bg-hover)]"
        >
          Back home
        </Link>
      </div>

      {!session ? (
        <form
          onSubmit={handleSubmit}
          className="island-shell rise-in max-w-md rounded-2xl p-6 sm:p-8"
        >
          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-[var(--sea-ink-soft)] uppercase">
              Room
            </span>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. standup"
              required
              autoComplete="off"
              className="w-full rounded-xl border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--sea-ink)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[rgba(79,184,178,0.35)]"
            />
          </label>
          <label className="mb-6 block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-[var(--sea-ink-soft)] uppercase">
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--sea-ink)] outline-none transition focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[rgba(79,184,178,0.35)]"
            />
          </label>
          {error ? (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[linear-gradient(90deg,var(--lagoon),#7ed3bf)] px-5 py-3 text-sm font-bold text-[#0f2a2e] shadow-[0_12px_28px_rgba(50,143,151,0.35)] transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_16px_34px_rgba(50,143,151,0.42)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Connecting…' : 'Join room'}
          </button>
        </form>
      ) : (
        <LiveKitMeeting
          token={session.token}
          serverUrl={session.serverUrl}
          onLeave={leave}
        />
      )}
    </main>
  )
}
