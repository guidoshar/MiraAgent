/**
 * StepCard — displays a single agent step with reflection + action + output.
 * Expandable/collapsible with spring animation.
 */
import React, { useState } from 'react'
import { MiraIcon, type MiraIconName } from './MiraIcon'
import type { MiraStepEvent } from '../types'
import type { MiraLocale } from '../i18n/index'
import { cn } from '../utils/cn'

interface Props {
  step: MiraStepEvent
  locale: MiraLocale
  defaultExpanded?: boolean
}

const actionIconMap: Record<string, MiraIconName> = {
  click: 'click',
  input_text: 'type',
  scroll: 'scroll',
  select_option: 'click',
  ask_user: 'message',
  wait: 'loading',
  done: 'success',
  go_back: 'retry',
}

export const StepCard: React.FC<Props> = ({ step, locale, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const actionName = step.action.name
  const iconName = actionIconMap[actionName] ?? 'executing'

  return (
    <div className={cn('mira-step', expanded && 'mira-step--expanded')}>
      {/* Header */}
      <button
        className="mira-step__header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <MiraIcon name={iconName} size={16} className="mira-step__action-icon" />
        <span className="mira-step__title">
          {locale.stepLabel} {step.stepIndex + 1}: <code>{actionName}</code>
        </span>
        <span className="mira-step__tokens">
          {step.usage.totalTokens} tokens
        </span>
        <MiraIcon
          name={expanded ? 'collapse' : 'chevronRight'}
          size={14}
          className="mira-step__chevron"
        />
      </button>

      {/* Body */}
      {expanded && (
        <div className="mira-step__body">
          {/* Reflection */}
          {step.reflection.next_goal && (
            <div className="mira-step__section">
              <div className="mira-step__section-label">
                <MiraIcon name="thinking" size={12} />
                {locale.nextGoalLabel}
              </div>
              <p className="mira-step__section-text">{step.reflection.next_goal}</p>
            </div>
          )}

          {step.reflection.evaluation_previous_goal && (
            <div className="mira-step__section">
              <div className="mira-step__section-label">
                <MiraIcon name="observe" size={12} />
                {locale.reflectionLabel}
              </div>
              <p className="mira-step__section-text">{step.reflection.evaluation_previous_goal}</p>
            </div>
          )}

          {step.reflection.memory && (
            <div className="mira-step__section">
              <div className="mira-step__section-label">
                <MiraIcon name="sparkle" size={12} />
                {locale.memoryLabel}
              </div>
              <p className="mira-step__section-text">{step.reflection.memory}</p>
            </div>
          )}

          {/* Action output */}
          <div className="mira-step__section mira-step__section--output">
            <div className="mira-step__section-label">
              <MiraIcon name="message" size={12} />
              {locale.outputLabel}
            </div>
            <pre className="mira-step__output">{step.action.output}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
