/**
 * InputBar — bottom input area with send button and quick suggestions.
 */
import React, { useState, useRef, useEffect } from 'react'
import { MiraIcon } from './MiraIcon'
import type { MiraAgentStatus } from '../types'
import type { MiraLocale } from '../i18n/index'
import { cn } from '../utils/cn'

interface Props {
  status: MiraAgentStatus
  locale: MiraLocale
  suggestions?: string[]
  onSend: (task: string) => void
  disabled?: boolean
}

export const InputBar: React.FC<Props> = ({ status, locale, suggestions, onSend, disabled }) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isRunning = status === 'running'
  const isDisabled = isRunning || disabled

  useEffect(() => {
    if (status === 'idle' || status === 'completed') {
      inputRef.current?.focus()
    }
  }, [status])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isDisabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className="mira-input">
      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && !isRunning && (
        <div className="mira-input__suggestions">
          <span className="mira-input__suggestions-label">
            <MiraIcon name="sparkle" size={12} />
            {locale.suggestions}
          </span>
          <div className="mira-input__suggestions-list">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="mira-input__suggestion"
                onClick={() => { setValue(s); inputRef.current?.focus() }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="mira-input__bar">
        <textarea
          ref={inputRef}
          className="mira-input__textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={locale.inputPlaceholder}
          rows={1}
          disabled={isDisabled}
        />
        <button
          className={cn('mira-input__send', isRunning && 'mira-input__send--stop')}
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          title={isRunning ? locale.stop : locale.send}
        >
          <MiraIcon name={isRunning ? 'stop' : 'send'} size={18} />
        </button>
      </div>
    </div>
  )
}
