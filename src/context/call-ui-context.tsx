import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CallSessionInfo = {
  active: boolean
  roomLabel: string
  selfDisplayName: string
}

const defaultInfo: CallSessionInfo = {
  active: false,
  roomLabel: '',
  selfDisplayName: '',
}

const CallUiContext = createContext<{
  info: CallSessionInfo
  setCallSession: (info: CallSessionInfo) => void
} | null>(null)

export function CallUiProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<CallSessionInfo>(defaultInfo)

  const setCallSession = useCallback((next: CallSessionInfo) => {
    setInfo(next)
  }, [])

  const value = useMemo(
    () => ({ info, setCallSession }),
    [info, setCallSession],
  )

  return (
    <CallUiContext.Provider value={value}>{children}</CallUiContext.Provider>
  )
}

export function useCallUi() {
  const ctx = useContext(CallUiContext)
  if (!ctx) {
    throw new Error('useCallUi must be used within CallUiProvider')
  }
  return ctx
}
