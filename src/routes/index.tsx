import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useCallback, useEffect, useState } from 'react'
import LiveKitMeeting from '../components/LiveKitMeeting'
import JoinPageShell from '../components/join/JoinPageShell'
import PreCallExperience from '../components/join/PreCallExperience'
import { usePreviewMedia } from '../components/join/usePreviewMedia'
import { useCallUi } from '../context/call-ui-context'
import { getLiveKitToken } from '../server/livekit-token'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    room: typeof search.room === 'string' ? search.room : '',
    name: typeof search.name === 'string' ? search.name : '',
  }),
  component: MeetPage,
})

function MeetPage() {
  const { room: roomFromUrl, name: nameFromUrl } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const fetchToken = useServerFn(getLiveKitToken)
  const { setCallSession } = useCallUi()

  const [name, setName] = useState(nameFromUrl)
  const room = roomFromUrl
  const [session, setSession] = useState<{
    token: string
    serverUrl: string
    connectMic: boolean
    connectCam: boolean
  } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    stream,
    permissionDenied,
    videoEnabled,
    audioEnabled,
    setVideoEnabled,
    setAudioEnabled,
    replaceInputDevice,
  } = usePreviewMedia(session === null)

  const join = useCallback(
    async (r: string, n: string, connectMic: boolean, connectCam: boolean) => {
      setError(null)
      setBusy(true)
      try {
        const out = await fetchToken({ data: { room: r, name: n } })
        setSession({
          token: out.token,
          serverUrl: out.serverUrl,
          connectMic,
          connectCam,
        })
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
    setName(nameFromUrl)
  }, [nameFromUrl])

  useEffect(() => {
    if (!session) {
      setCallSession({
        active: false,
        roomLabel: '',
        selfDisplayName: '',
      })
      return
    }
    setCallSession({
      active: true,
      roomLabel: room,
      selfDisplayName: name,
    })
    return () => {
      setCallSession({
        active: false,
        roomLabel: '',
        selfDisplayName: '',
      })
    }
  }, [session, room, name, setCallSession])

  const handleJoin = () => {
    void join(roomFromUrl.trim(), name.trim(), audioEnabled, videoEnabled)
  }

  const leave = () => {
    setSession(null)
    void navigate({
      search: { room: roomFromUrl.trim(), name: name.trim() },
      replace: true,
    })
  }

  return (
    <main
      className={
        session
          ? 'call-main-immersive fixed inset-0 z-[1] m-0 min-h-0 w-full max-w-none overflow-hidden p-0'
          : 'join-page join-page--immersive fixed inset-0 z-[1] m-0 min-h-0 w-full max-w-none overflow-hidden p-0'
      }
    >
      {!session ? (
        <JoinPageShell>
          <PreCallExperience
            stream={stream}
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            onToggleVideo={() => setVideoEnabled((v) => !v)}
            onToggleAudio={() => setAudioEnabled((v) => !v)}
            permissionDenied={permissionDenied}
            name={name}
            onNameChange={setName}
            onJoin={handleJoin}
            joinDisabled={!roomFromUrl.trim() || !name.trim()}
            joining={busy}
            error={error}
            replaceInputDevice={replaceInputDevice}
          />
        </JoinPageShell>
      ) : (
        <LiveKitMeeting
          token={session.token}
          serverUrl={session.serverUrl}
          roomLabel={room}
          selfDisplayName={name}
          connectMic={session.connectMic}
          connectCam={session.connectCam}
          onLeave={leave}
        />
      )}
    </main>
  )
}
