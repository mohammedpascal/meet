import { Chat } from '@livekit/components-react/prefabs'
import { useCallback, useState } from 'react'
import CallHeader from './CallHeader'
import CallPageShell from './CallPageShell'
import DevicePopover from './DevicePopover'
import FloatingControlsDock from './FloatingControlsDock'
import LeaveConsultationDialog from './LeaveConsultationDialog'
import VideoStage from './VideoStage'

type Props = {
  roomLabel: string
  selfDisplayName: string
  onLeave: () => void
}

export default function SitanaCallExperience({
  roomLabel,
  selfDisplayName,
  onLeave,
}: Props) {
  const [devicePanelKind, setDevicePanelKind] = useState<
    'audioinput' | 'videoinput' | null
  >(null)
  const [chatOpen, setChatOpen] = useState(false)
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

  return (
    <CallPageShell>
      <CallHeader roomLabel={roomLabel} selfDisplayName={selfDisplayName} />

      <div className="relative mt-5 sm:mt-6">
        <VideoStage />
        <FloatingControlsDock
          onLeave={handleLeaveClick}
          onOpenMicDevices={openMicDevices}
          onOpenCameraDevices={openCameraDevices}
          chatOpen={chatOpen}
          onChatToggle={() => setChatOpen((o) => !o)}
        />
      </div>

      {devicePanelKind ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-slate-900/25 backdrop-blur-[2px]"
            aria-label="Close device list"
            onClick={() => setDevicePanelKind(null)}
          />
          <div className="fixed bottom-[max(6rem,18%)] left-1/2 z-[70] w-[min(calc(100vw-1.5rem),20rem)] -translate-x-1/2 sm:bottom-[7.5rem]">
            <DevicePopover kind={devicePanelKind} />
          </div>
        </>
      ) : null}

      <LeaveConsultationDialog
        open={leaveDialogOpen}
        onCancel={() => setLeaveDialogOpen(false)}
        onConfirm={handleConfirmLeave}
      />

      {chatOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-slate-900/25 backdrop-blur-[2px]"
            aria-label="Close chat"
            onClick={() => setChatOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-slate-200/90 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200/90 px-4 py-3 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Consultation chat
              </h2>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden p-2">
              <Chat className="lk-chat-custom flex h-full min-h-[200px] flex-col rounded-lg border border-slate-200/80 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/50" />
            </div>
          </aside>
        </>
      ) : null}
    </CallPageShell>
  )
}
