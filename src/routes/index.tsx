import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useCallback, useEffect, useState } from 'react'
import LiveKitMeeting from '../components/LiveKitMeeting'
import JoinPageShell from '../components/join/JoinPageShell'
import PreCallCard from '../components/join/PreCallCard'
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

  const [room, setRoom] = useState(roomFromUrl)
  const [name, setName] = useState(nameFromUrl)
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
    setRoom(roomFromUrl)
    setName(nameFromUrl)
  }, [roomFromUrl, nameFromUrl])

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
    void join(room.trim(), name.trim(), audioEnabled, videoEnabled)
  }

  const leave = () => {
    setSession(null)
    void navigate({
      search: { room: room.trim(), name: name.trim() },
      replace: true,
    })
  }

  return (
    <main
      className={
        session
          ? 'page-wrap min-h-screen px-4 pb-10 pt-6'
          : 'join-page min-h-screen px-0 pb-8 pt-4 sm:pt-6'
      }
    >
      {!session ? (
        <JoinPageShell>
          <PreCallCard
            stream={stream}
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            onToggleVideo={() => setVideoEnabled((v) => !v)}
            onToggleAudio={() => setAudioEnabled((v) => !v)}
            permissionDenied={permissionDenied}
            room={room}
            name={name}
            onRoomChange={setRoom}
            onNameChange={setName}
            onJoin={handleJoin}
            joinDisabled={!room.trim() || !name.trim()}
            joining={busy}
            error={error}
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
