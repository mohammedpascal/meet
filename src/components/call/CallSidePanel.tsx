import { Chat } from '@livekit/components-react/prefabs'
import { ChevronRight, Mic, Settings2, Video, X } from 'lucide-react'
import ParticipantListPanel from './ParticipantListPanel'

export type SidePanelTab = 'chat' | 'participants' | 'settings'

type Props = {
  tab: SidePanelTab
  onTabChange: (tab: SidePanelTab) => void
  onClose: () => void
  onOpenMicDevices: () => void
  onOpenCameraDevices: () => void
  className?: string
}

const tabs: { id: SidePanelTab; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'participants', label: 'Participants' },
  { id: 'settings', label: 'Settings' },
]

export default function CallSidePanel({
  tab,
  onTabChange,
  onClose,
  onOpenMicDevices,
  onOpenCameraDevices,
  className = '',
}: Props) {
  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-slate-700/90 bg-slate-950 text-slate-100 shadow-[inset_1px_0_0_rgba(255,255,255,0.04)] ${className}`}
      aria-label="Call side panel"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-700/90 px-3 py-2 sm:px-4">
        <div
          role="tablist"
          aria-label="Panel sections"
          className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              id={`side-tab-${t.id}`}
              aria-controls={`side-panel-${t.id}`}
              onClick={() => onTabChange(t.id)}
              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                tab === t.id
                  ? 'bg-teal-950/80 text-teal-100 ring-1 ring-teal-700/50'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-slate-950 p-3 sm:p-4">
        {tab === 'chat' ? (
          <div
            id="side-panel-chat"
            role="tabpanel"
            aria-labelledby="side-tab-chat"
            className="call-side-panel-chat"
          >
            <Chat />
          </div>
        ) : null}

        {tab === 'participants' ? (
          <div
            id="side-panel-participants"
            role="tabpanel"
            aria-labelledby="side-tab-participants"
            className="h-full overflow-y-auto"
          >
            <ParticipantListPanel />
          </div>
        ) : null}

        {tab === 'settings' ? (
          <div
            id="side-panel-settings"
            role="tabpanel"
            aria-labelledby="side-tab-settings"
            className="space-y-4"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Devices
              </p>
              <button
                type="button"
                onClick={onOpenMicDevices}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700/90 bg-slate-900/60 px-3 py-2.5 text-left text-sm font-medium text-slate-100 transition hover:bg-slate-800/90"
              >
                <span className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-slate-400" aria-hidden />
                  Microphone
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              </button>
              <button
                type="button"
                onClick={onOpenCameraDevices}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700/90 bg-slate-900/60 px-3 py-2.5 text-left text-sm font-medium text-slate-100 transition hover:bg-slate-800/90"
              >
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-slate-400" aria-hidden />
                  Camera
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              </button>
            </div>
            <p className="flex items-start gap-2 text-xs text-slate-500">
              <Settings2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              More options may be added here later.
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
