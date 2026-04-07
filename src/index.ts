// MiraAgent — Premium GUI Agent UI Panel
// Powered by @page-agent/core with Candy Design aesthetics

// Core
export { MiraAgent } from './MiraAgent'
export type { MiraAgentConfig, MiraTheme, MiraPanelPosition } from './types'

// Adapter
export { MiraAgentAdapter } from './adapter'

// React Hooks
export { useMiraAgent } from './hooks/useMiraAgent'
export { useAgentState } from './hooks/useAgentState'

// Components
export { MiraPanel } from './components/MiraPanel'
export { ChatView } from './components/ChatView'
export { StepCard } from './components/StepCard'
export { InputBar } from './components/InputBar'
export { StatusIndicator } from './components/StatusIndicator'
export { ActivityFeed } from './components/ActivityFeed'
export { MiraIcon } from './components/MiraIcon'
export { AskUserDialog } from './components/AskUserDialog'

// i18n
export { getLocale, type SupportedLocale } from './i18n/index'
