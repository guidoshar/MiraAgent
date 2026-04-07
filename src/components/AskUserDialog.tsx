/**
 * AskUserDialog — modal dialog when the agent needs user input.
 */
import React, { useState, useRef, useEffect } from 'react'
import { MiraIcon } from './MiraIcon'
import type { MiraLocale } from '../i18n/index'

interface Props {
  question: string
  locale: MiraLocale
  onSubmit: (answer: string) => void
  onCancel: () => void
}

export const AskUserDialog: React.FC<Props> = ({ question, locale, onSubmit, onCancel }) => {
  const [answer, setAnswer] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim())
      setAnswer('')
    }
  }

  return (
    <div className="mira-ask-overlay" onClick={onCancel}>
      <div className="mira-ask" onClick={(e) => e.stopPropagation()}>
        <div className="mira-ask__header">
          <MiraIcon name="message" size={18} className="mira-ask__icon" />
          <span className="mira-ask__title">{locale.askUserTitle}</span>
          <button className="mira-ask__close" onClick={onCancel}>
            <MiraIcon name="close" size={16} />
          </button>
        </div>
        <div className="mira-ask__body">
          <p className="mira-ask__question">{question}</p>
          <textarea
            ref={inputRef}
            className="mira-ask__input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            rows={3}
            placeholder="..."
          />
        </div>
        <div className="mira-ask__footer">
          <button className="mira-ask__btn mira-ask__btn--cancel" onClick={onCancel}>
            {locale.askUserCancel}
          </button>
          <button
            className="mira-ask__btn mira-ask__btn--submit"
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            <MiraIcon name="send" size={14} />
            {locale.askUserSubmit}
          </button>
        </div>
      </div>
    </div>
  )
}
