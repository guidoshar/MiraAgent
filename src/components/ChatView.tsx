/**
 * ChatView — conversation view with timeline-style step display.
 * Shows events in chronological order with connecting lines.
 */
import React, { useRef, useEffect } from 'react'
import { MiraIcon } from './MiraIcon'
import { StepCard } from './StepCard'
import { ActivityFeed } from './ActivityFeed'
import type {
  MiraHistoricalEvent,
  MiraActivity,
  MiraAgentStatus,
  MiraStepEvent,
} from '../types'
import type { MiraLocale } from '../i18n/index'

interface Props {
  task: string
  history: MiraHistoricalEvent[]
  activity: MiraActivity | null
  status: MiraAgentStatus
  locale: MiraLocale
}

export const ChatView: React.FC<Props> = ({ task, history, activity, status, locale }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history.length, activity])

  const hasContent = task || history.length > 0
  const steps = history.filter((e): e is MiraStepEvent => e.type === 'step')

  return (
    <div className="mira-chat" ref={scrollRef}>
      {!hasContent && (
        <div className="mira-chat__empty">
          <div className="mira-chat__empty-icon">
            <MiraIcon name="sparkle" size={28} />
          </div>
          <p className="mira-chat__empty-text">{locale.noHistory}</p>
        </div>
      )}

      {/* User task bubble */}
      {task && (
        <div className="mira-chat__message mira-chat__message--user">
          <div className="mira-chat__avatar mira-chat__avatar--user">
            <MiraIcon name="user" size={14} />
          </div>
          <div className="mira-chat__bubble mira-chat__bubble--user">
            {task}
          </div>
        </div>
      )}

      {/* Agent timeline */}
      {task && (
        <div className="mira-chat__timeline">
          {/* Timeline header */}
          <div className="mira-chat__timeline-header">
            <div className="mira-chat__timeline-dot mira-chat__timeline-dot--agent">
              <MiraIcon name="bot" size={14} />
            </div>
            <span className="mira-chat__timeline-label">{locale.brand}</span>
            {status === 'running' && <span className="mira-chat__timeline-pulse" />}
          </div>

          {/* Timeline events */}
          <div className="mira-chat__timeline-body">
            {history.map((event, i) => {
              if (event.type === 'step') {
                const stepIdx = steps.indexOf(event as MiraStepEvent)
                return (
                  <div key={i} className="mira-chat__timeline-item">
                    <div className="mira-chat__timeline-line" />
                    <div className="mira-chat__timeline-node" />
                    <StepCard
                      step={event as MiraStepEvent}
                      locale={locale}
                      defaultExpanded={stepIdx === steps.length - 1}
                    />
                  </div>
                )
              }
              if (event.type === 'observation') {
                return (
                  <div key={i} className="mira-chat__timeline-item">
                    <div className="mira-chat__timeline-line" />
                    <div className="mira-chat__timeline-node mira-chat__timeline-node--info" />
                    <div className="mira-chat__observation">
                      <MiraIcon name="observe" size={13} />
                      <span>{(event as any).content}</span>
                    </div>
                  </div>
                )
              }
              if (event.type === 'error') {
                return (
                  <div key={i} className="mira-chat__timeline-item">
                    <div className="mira-chat__timeline-line" />
                    <div className="mira-chat__timeline-node mira-chat__timeline-node--error" />
                    <div className="mira-chat__error">
                      <MiraIcon name="error" size={13} />
                      <span>{(event as any).message}</span>
                    </div>
                  </div>
                )
              }
              if (event.type === 'retry') {
                return (
                  <div key={i} className="mira-chat__timeline-item">
                    <div className="mira-chat__timeline-line" />
                    <div className="mira-chat__timeline-node mira-chat__timeline-node--warning" />
                    <div className="mira-chat__retry">
                      <MiraIcon name="retry" size={13} />
                      <span>{locale.retrying} ({(event as any).attempt}/{(event as any).maxAttempts})</span>
                    </div>
                  </div>
                )
              }
              return null
            })}

            {/* Live activity at the end of timeline */}
            {activity && (
              <div className="mira-chat__timeline-item mira-chat__timeline-item--live">
                <div className="mira-chat__timeline-line mira-chat__timeline-line--dashed" />
                <div className="mira-chat__timeline-node mira-chat__timeline-node--live" />
                <ActivityFeed activity={activity} locale={locale} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
