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
      <div className="relative h-full w-full">
        <CameraStateView stream={stream} videoEnabled={videoEnabled} />
      </div>
    </div>
  )
}
