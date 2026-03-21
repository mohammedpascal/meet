import {
  useLocalParticipant,
  useParticipants,
} from '@livekit/components-react'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

export default function ParticipantListPanel() {
  const participants = useParticipants()
  const local = useLocalParticipant().localParticipant

  const sorted = [...participants].sort((a, b) => {
    if (a.identity === local.identity) return -1
    if (b.identity === local.identity) return 1
    return a.identity.localeCompare(b.identity)
  })

  return (
    <ul className="m-0 list-none space-y-2 p-0">
      {sorted.map((p) => {
        const isLocal = p.identity === local.identity
        const micOn = p.isMicrophoneEnabled
        const camOn = p.isCameraEnabled
        return (
          <li
            key={p.identity}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/90 bg-slate-900/60 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">
                {p.name || p.identity}
                {isLocal ? (
                  <span className="ml-1.5 text-xs font-normal text-teal-400">
                    (you)
                  </span>
                ) : null}
              </p>
              <p className="truncate font-mono text-[11px] text-slate-400">
                {p.identity}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-slate-400">
              {micOn ? (
                <Mic className="h-4 w-4 text-teal-400" aria-label="Mic on" />
              ) : (
                <MicOff className="h-4 w-4 text-rose-500" aria-label="Mic off" />
              )}
              {camOn ? (
                <Video className="h-4 w-4 text-teal-400" aria-label="Camera on" />
              ) : (
                <VideoOff className="h-4 w-4 text-slate-500" aria-label="Camera off" />
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
