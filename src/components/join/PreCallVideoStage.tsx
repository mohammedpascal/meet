import CameraStateView from './CameraStateView'

type Props = {
  stream: MediaStream | null
  videoEnabled: boolean
}

/**
 * Full-viewport video stage matching in-call `VideoStage` immersive shell (gradient, slate base).
 */
export default function PreCallVideoStage({ stream, videoEnabled }: Props) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-18 h-28 bg-linear-to-b from-black/50 via-black/20 to-transparent"
        aria-hidden
      />
      <span className="absolute left-3 top-[max(4.25rem,env(safe-area-inset-top))] z-10 rounded-md bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm sm:left-4">
        Your camera
      </span>
      <div className="relative h-full w-full">
        <CameraStateView stream={stream} videoEnabled={videoEnabled} />
      </div>
    </div>
  )
}
