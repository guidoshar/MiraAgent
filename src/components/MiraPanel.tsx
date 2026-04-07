/**
 * MiraPanel — draggable floating panel with FAB trigger.
 * Combines the best of both versions:
 *   - FAB trigger (collapsed state)
 *   - Draggable, freely positioned panel (expanded state)
 *   - Timeline-based step display (content)
 */
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { MiraIcon } from './MiraIcon'
import { ChatView } from './ChatView'
import { InputBar } from './InputBar'
import { StatusIndicator } from './StatusIndicator'
import { AskUserDialog } from './AskUserDialog'
import { useAgentState } from '../hooks/useAgentState'
import { getLocale } from '../i18n/index'
import type { MiraAgentAdapter } from '../adapter'
import type { MiraPanelPosition, MiraTheme } from '../types'
import { cn } from '../utils/cn'

import '../theme/tokens.css'
import '../theme/animations.css'
import '../theme/dark.css'
import './MiraPanel.scss'

export interface MiraPanelProps {
  adapter: MiraAgentAdapter
  position?: MiraPanelPosition
  theme?: MiraTheme
  defaultCollapsed?: boolean
  width?: number
  className?: string
  suggestions?: string[]
  brandName?: string
  language?: 'en-US' | 'zh-CN'
  ready?: boolean
  error?: string | null
  onCollapseChange?: (collapsed: boolean) => void
}

export const MiraPanel: React.FC<MiraPanelProps> = ({
  adapter,
  position = 'right',
  theme = 'light',
  defaultCollapsed = true,
  width = 380,
  className,
  suggestions,
  brandName = 'MiraAgent',
  language = 'en-US',
  ready = true,
  error = null,
  onCollapseChange,
}) => {
  const { status, history, activity, task, execute } = useAgentState(adapter)
  const locale = getLocale(language)

  const [open, setOpen] = useState(!defaultCollapsed)
  const [askState, setAskState] = useState<{
    question: string
    respond: (answer: string) => void
  } | null>(null)

  // Drag state
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const hasDragged = useRef(false)

  // Initialize position based on panel position prop
  useEffect(() => {
    if (!open) return
    const vw = window.innerWidth
    const x = position === 'right' ? vw - width - 16 : 16
    setPos({ x, y: 12 })
  }, [open, position, width])

  const resolvedTheme = theme === 'auto'
    ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  useEffect(() => {
    const unsub = adapter.onAskUser((question, respond) => {
      setAskState({ question, respond })
    })
    return unsub
  }, [adapter])

  useEffect(() => {
    if (status === 'running' && !open) {
      setOpen(true)
      onCollapseChange?.(false)
    }
  }, [status])

  const toggleOpen = useCallback(() => {
    setOpen((o) => {
      const next = !o
      onCollapseChange?.(!next)
      return next
    })
  }, [onCollapseChange])

  const handleStop = useCallback(() => {
    adapter.stop()
  }, [adapter])

  // ── Drag handlers (header only) ───────────────────────
  const onDragStart = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    hasDragged.current = false
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    hasDragged.current = true
    const x = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x))
    const y = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.current.y))
    setPos({ x, y })
  }, [dragging])

  const onDragEnd = useCallback(() => {
    setDragging(false)
  }, [])

  const isRunning = status === 'running'

  return (
    <div
      data-mira-theme={resolvedTheme}
      className={cn('mira-root', className)}
    >
      {/* ── FAB ──────────────────────────────────────────── */}
      {!open && (
        <button
          className={cn('mira-fab', isRunning && 'mira-fab--active')}
          onClick={toggleOpen}
          title={`${brandName}`}
        >
          <MiraIcon name="sparkle" size={20} className="mira-fab__icon" />
          {isRunning && <span className="mira-fab__badge" />}
        </button>
      )}

      {/* ── Panel ────────────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          className={cn('mira-panel', dragging && 'mira-panel--dragging')}
          style={{
            width,
            left: pos.x,
            top: pos.y,
            bottom: 12,
          }}
        >
          {/* Progress line */}
          {isRunning ? (
            <div className="mira-panel__progress-track">
              <div className="mira-panel__progress-line" />
            </div>
          ) : (
            <div className="mira-panel__gradient-bar" />
          )}

          {/* Header — draggable */}
          <div
            className="mira-panel__header"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          >
            <div className="mira-panel__brand">
              <div className="mira-panel__brand-orb">
                <MiraIcon name="sparkle" size={14} />
              </div>
              <span className="mira-panel__brand-name">{brandName}</span>
            </div>
            <StatusIndicator status={status} activity={activity} locale={locale} />
            <div className="mira-panel__header-actions">
              {isRunning && (
                <button className="mira-panel__stop" onClick={handleStop} title={locale.stop}>
                  <MiraIcon name="stop" size={12} />
                </button>
              )}
              <button className="mira-panel__close" onClick={toggleOpen} title={locale.collapse}>
                <MiraIcon name="close" size={14} />
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mira-panel__error-banner">
              <MiraIcon name="error" size={13} />
              <span>{error}</span>
            </div>
          )}

          {/* Chat body */}
          <ChatView
            task={task}
            history={history}
            activity={activity}
            status={status}
            locale={locale}
          />

          {/* Input */}
          <InputBar
            status={status}
            locale={locale}
            suggestions={suggestions}
            onSend={execute}
            disabled={!ready}
          />

          {/* Ask user dialog */}
          {askState && (
            <AskUserDialog
              question={askState.question}
              locale={locale}
              onSubmit={(answer) => { askState.respond(answer); setAskState(null) }}
              onCancel={() => { askState.respond(''); setAskState(null) }}
            />
          )}
        </div>
      )}
    </div>
  )
}
