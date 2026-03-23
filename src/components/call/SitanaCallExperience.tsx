import { useCallback, useRef, useState } from 'react'
import CallPageShell from './CallPageShell'
import CallSidePanel, { type SidePanelTab } from './CallSidePanel'
import DevicePopover from './DevicePopover'
import FloatingControlsDock from './FloatingControlsDock'
import LeaveCallDialog from './LeaveCallDialog'
import VideoStage from './VideoStage'

type Props = {
  onLeave: () => void
}

export default function SitanaCallExperience({ onLeave }: Props) {
  const videoColumnRef = useRef<HTMLDivElement>(null)
  const [devicePanelKind, setDevicePanelKind] = useState<
    'audioinput' | 'videoinput' | null
  >(null)
  const [sidePanel, setSidePanel] = useState<{
    open: boolean
    tab: SidePanelTab
  }>({ open: false, tab: 'chat' })
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)

  const openMicDevices = useCallback(() => {
    setDevicePanelKind((k) => (k === 'audioinput' ? null : 'audioinput'))
  }, [])

  const openCameraDevices = useCallback(() => {
    setDevicePanelKind((k) => (k === 'videoinput' ? null : 'videoinput'))
  }, [])

  const handleLeaveClick = useCallback(() => {
    setLeaveDialogOpen(true)
  }, [])

  const handleConfirmLeave = useCallback(() => {
    setLeaveDialogOpen(false)
    onLeave()
  }, [onLeave])

  const selectSidePanelTab = useCallback((t: SidePanelTab) => {
    setSidePanel((s) => {
      if (s.open && s.tab === t) return { open: false, tab: s.tab }
      return { open: true, tab: t }
    })
  }, [])

  return (
    <CallPageShell variant="immersive">
      <div
        className="flex h-dvh min-h-0 w-full flex-1 flex-row overflow-hidden"
        dir="ltr"
      >
        <div
          ref={videoColumnRef}
          className="relative min-h-0 min-w-0 flex-1"
        >
          <VideoStage immersive />
          <FloatingControlsDock
            dockBoundsRef={videoColumnRef}
            onLeave={handleLeaveClick}
            onOpenMicDevices={openMicDevices}
            onOpenCameraDevices={openCameraDevices}
            sidePanelOpen={sidePanel.open}
            sidePanelTab={sidePanel.tab}
            onSelectSidePanelTab={selectSidePanelTab}
          />
        </div>

        {sidePanel.open ? (
          <CallSidePanel
            tab={sidePanel.tab}
            onTabChange={(tab) => setSidePanel((s) => ({ ...s, tab }))}
            onClose={() => setSidePanel((s) => ({ ...s, open: false }))}
            onOpenMicDevices={openMicDevices}
            onOpenCameraDevices={openCameraDevices}
            className="h-dvh min-h-0 w-[min(24rem,calc(100vw-6rem))] min-w-[16rem] shrink-0 border-l border-slate-700/90 sm:min-w-[18rem]"
          />
        ) : null}
      </div>

      {devicePanelKind ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-slate-900/25 backdrop-blur-[2px]"
            aria-label="Close device list"
            onClick={() => setDevicePanelKind(null)}
          />
          <div className="fixed bottom-[max(8rem,28vh)] left-1/2 z-[70] w-[min(calc(100vw-1.5rem),20rem)] -translate-x-1/2 sm:bottom-[32vh]">
            <DevicePopover kind={devicePanelKind} />
          </div>
        </>
      ) : null}

      <LeaveCallDialog
        open={leaveDialogOpen}
        onCancel={() => setLeaveDialogOpen(false)}
        onConfirm={handleConfirmLeave}
      />
    </CallPageShell>
  )
}
