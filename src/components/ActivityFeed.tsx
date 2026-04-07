/**
 * ActivityFeed — real-time transient activity stream.
 * Shows what the agent is doing RIGHT NOW with animated indicators.
 */
import React from 'react'
import { MiraIcon } from './MiraIcon'
import type { MiraActivity } from '../types'
import type { MiraLocale } from '../i18n/index'
import { cn } from '../utils/cn'

interface Props {
  activity: MiraActivity | null
  locale: MiraLocale
}

export const ActivityFeed: React.FC<Props> = ({ activity, locale }) => {
  if (!activity) return null

  return (
    <div className="mira-activity">
      {activity.type === 'thinking' && (
        <div className="mira-activity__item mira-activity__item--thinking">
          <MiraIcon name="thinking" size={16} className="mira-activity__icon mira-activity__icon--brain" />
          <span className="mira-activity__text">{locale.thinking}</span>
          <span className="mira-activity__dots">
            <span className="mira-activity__dot" style={{ animationDelay: '0s' }} />
            <span className="mira-activity__dot" style={{ animationDelay: '0.15s' }} />
            <span className="mira-activity__dot" style={{ animationDelay: '0.3s' }} />
          </span>
        </div>
      )}

      {activity.type === 'executing' && (
        <div className="mira-activity__item mira-activity__item--executing">
          <MiraIcon name="executing" size={16} className="mira-activity__icon mira-activity__icon--zap" />
          <span className="mira-activity__text">
            {locale.executing}: <code className="mira-activity__tool">{activity.tool}</code>
          </span>
          <div className="mira-activity__progress">
            <div className="mira-activity__progress-bar" />
          </div>
        </div>
      )}

      {activity.type === 'executed' && (
        <div className="mira-activity__item mira-activity__item--executed">
          <MiraIcon name="success" size={16} className="mira-activity__icon" />
          <span className="mira-activity__text">
            <code className="mira-activity__tool">{activity.tool}</code>
            <span className="mira-activity__duration"> ({activity.duration}ms)</span>
          </span>
        </div>
      )}

      {activity.type === 'retrying' && (
        <div className="mira-activity__item mira-activity__item--retrying">
          <MiraIcon name="retry" size={16} className="mira-activity__icon mira-activity__icon--spin" />
          <span className="mira-activity__text">
            {locale.retrying} ({activity.attempt}/{activity.maxAttempts})
          </span>
        </div>
      )}

      {activity.type === 'error' && (
        <div className="mira-activity__item mira-activity__item--error">
          <MiraIcon name="error" size={16} className="mira-activity__icon" />
          <span className="mira-activity__text">{activity.message}</span>
        </div>
      )}
    </div>
  )
}
