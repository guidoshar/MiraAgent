/**
 * MiraIcon — unified icon component wrapping Lucide React.
 * Maps agent states and actions to professional vector icons.
 */
import React from 'react'
import {
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  User,
  Bot,
  MousePointer,
  Keyboard,
  ArrowUpDown,
  Send,
  Square,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  PanelRightOpen,
  PanelRightClose,
  Loader2,
  MessageSquare,
  Eye,
  RotateCcw,
  Sparkles,
  CircleDot,
  Copy,
  X,
  Settings,
  Globe,
  type LucideProps,
} from 'lucide-react'

export type MiraIconName =
  | 'thinking' | 'executing' | 'success' | 'error' | 'warning'
  | 'user' | 'bot' | 'click' | 'type' | 'scroll'
  | 'send' | 'stop' | 'collapse' | 'expand' | 'chevronRight'
  | 'panelOpen' | 'panelClose' | 'loading' | 'message'
  | 'observe' | 'retry' | 'sparkle' | 'dot'
  | 'copy' | 'close' | 'settings' | 'globe'

const iconMap: Record<MiraIconName, React.FC<LucideProps>> = {
  thinking: Brain,
  executing: Zap,
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertTriangle,
  user: User,
  bot: Bot,
  click: MousePointer,
  type: Keyboard,
  scroll: ArrowUpDown,
  send: Send,
  stop: Square,
  collapse: ChevronDown,
  expand: ChevronUp,
  chevronRight: ChevronRight,
  panelOpen: PanelRightOpen,
  panelClose: PanelRightClose,
  loading: Loader2,
  message: MessageSquare,
  observe: Eye,
  retry: RotateCcw,
  sparkle: Sparkles,
  dot: CircleDot,
  copy: Copy,
  close: X,
  settings: Settings,
  globe: Globe,
}

export interface MiraIconProps extends LucideProps {
  name: MiraIconName
}

export const MiraIcon: React.FC<MiraIconProps> = ({ name, ...props }) => {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon {...props} />
}
