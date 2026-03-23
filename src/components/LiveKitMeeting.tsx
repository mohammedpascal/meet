import { useEffect, useState } from 'react'
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react'
import '@livekit/components-styles'
import SitanaCallExperience from './call/SitanaCallExperience'

type Props = {
  token: string
  serverUrl: string
  /** Match pre-call mic toggle: publish microphone when connecting */
  connectMic: boolean
  /** Match pre-call camera toggle: publish camera when connecting */
  connectCam: boolean
  onLeave: () => void
}

export default function LiveKitMeeting({
  token,
  serverUrl,
  connectMic,
  connectCam,
  onLeave,
}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-6 py-16 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Preparing secure call…
      </div>
    )
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      audio={connectMic}
      video={connectCam}
      onDisconnected={() => onLeave()}
      onError={(err) => {
        console.error(err)
      }}
      data-lk-theme="default"
      className="call-livekit-root flex h-dvh min-h-0 w-full flex-col"
    >
      <RoomAudioRenderer />
      <StartAudio label="Enable call audio" />
      <SitanaCallExperience onLeave={onLeave} />
    </LiveKitRoom>
  )
}
