/**
 * StatusIndicator — shows current agent status with animated icon + label.
 */
import React from 'react'
import { MiraIcon } from './MiraIcon'
import type { MiraAgentStatus, MiraActivity } from '../types'
import type { MiraLocale } from '../i18n/index'
import { cn } from '../utils/cn'

interface Props {
  status: MiraAgentStatus
  activity: MiraActivity | null
  locale: MiraLocale
}

export const StatusIndicator: React.FC<Props> = ({ status, activity, locale }) => {
  const getDisplay = () => {
    if (activity) {
      switch (activity.type) {
        case 'thinking':
          return { icon: 'thinking' as const, label: locale.thinking, cls: 'mira-status--thinking' }
        case 'executing':
          return { icon: 'executing' as const, label: `${locale.executing}: ${activity.tool}`, cls: 'mira-status--executing' }
        case 'executed':
          return { icon: 'success' as const, label: locale.executed, cls: 'mira-status--executed' }
        case 'retrying':
          return { icon: 'retry' as const, label: `${locale.retrying} (${activity.attempt}/${activity.maxAttempts})`, cls: 'mira-status--retrying' }
        case 'error':
          return { icon: 'error' as const, label: locale.error, cls: 'mira-status--error' }
      }
    }
    switch (status) {
      case 'idle':      return { icon: 'dot' as const, label: locale.idle, cls: 'mira-status--idle' }
      case 'running':   return { icon: 'loading' as const, label: locale.running, cls: 'mira-status--running' }
      case 'completed': return { icon: 'success' as const, label: locale.completed, cls: 'mira-status--completed' }
      case 'error':     return { icon: 'error' as const, label: locale.error, cls: 'mira-status--error' }
    }
  }

  const d = getDisplay()

  return (
    <div className={cn('mira-status', d.cls)}>
      <MiraIcon
        name={d.icon}
        size={14}
        className={cn(
          'mira-status__icon',
          d.icon === 'loading' && 'mira-status__icon--spin',
          d.icon === 'thinking' && 'mira-status__icon--brain',
          d.icon === 'executing' && 'mira-status__icon--zap',
        )}
      />
      <span className="mira-status__label">{d.label}</span>
      {(status === 'running' || activity?.type === 'thinking') && (
        <span className="mira-status__pulse" />
      )}
    </div>
  )
}
