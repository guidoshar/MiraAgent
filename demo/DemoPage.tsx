import React, { useState, useMemo, useCallback } from 'react'
import { MiraPanel } from 'mira-agent'
import { MiraAgentAdapter } from '../src/adapter'
import type { MiraTheme } from '../src/types'

/**
 * Demo page — uses a mock adapter (no real @page-agent/core needed)
 * to showcase the MiraPanel UI with simulated agent events.
 */
export const DemoPage: React.FC = () => {
  const [theme, setTheme] = useState<MiraTheme>('light')

  // Create a mock adapter that simulates agent behavior
  const adapter = useMemo(() => {
    const a = new MiraAgentAdapter()

    // Override execute to simulate steps
    const originalExecute = a.execute.bind(a)
    ;(a as any).execute = async (task: string) => {
      // Simulate thinking
      ;(a as any)._setStatus('running')
      ;(a as any)._setActivity({ type: 'thinking' })

      await sleep(1500)

      // Simulate executing
      ;(a as any)._setActivity({ type: 'executing', tool: 'click', input: { index: 0 } })
      await sleep(1000)

      // Simulate executed
      ;(a as any)._setActivity({
        type: 'executed',
        tool: 'click',
        input: { index: 0 },
        output: 'Clicked button "Submit"',
        duration: 120,
      })

      // Add step to history
      ;(a as any)._setHistory([
        {
          type: 'step',
          stepIndex: 0,
          reflection: {
            evaluation_previous_goal: 'N/A - first step',
            memory: 'User wants to ' + task,
            next_goal: 'Click the target element',
          },
          action: {
            name: 'click',
            input: { index: 0 },
            output: 'Successfully clicked button "Submit"',
          },
          usage: { promptTokens: 450, completionTokens: 85, totalTokens: 535 },
        },
      ])

      await sleep(800)

      // Simulate second step
      ;(a as any)._setActivity({ type: 'thinking' })
      await sleep(1000)

      ;(a as any)._setActivity({ type: 'executing', tool: 'done', input: { text: 'Task completed' } })
      await sleep(500)

      ;(a as any)._setHistory([
        ...(a as any)._history,
        {
          type: 'step',
          stepIndex: 1,
          reflection: {
            evaluation_previous_goal: 'Successfully clicked the button',
            memory: 'Button was clicked, form submitted',
            next_goal: 'Task is complete',
          },
          action: {
            name: 'done',
            input: { text: 'Task completed successfully' },
            output: 'Task completed successfully',
          },
          usage: { promptTokens: 520, completionTokens: 42, totalTokens: 562 },
        },
      ])

      ;(a as any)._setActivity(null)
      ;(a as any)._setStatus('completed')

      return {
        success: true,
        data: 'Task completed successfully',
        history: (a as any)._history,
      }
    }

    return a
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>
        MiraAgent Demo
      </h1>
      <p style={{ color: '#5a5f7a', marginBottom: 24 }}>
        Premium GUI Agent UI Panel — powered by @page-agent/core
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setTheme('light')}
          style={btnStyle(theme === 'light')}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          style={btnStyle(theme === 'dark')}
        >
          Dark
        </button>
      </div>

      {/* Sample page content */}
      <div style={{
        padding: 24,
        background: 'white',
        borderRadius: 12,
        border: '1px solid #e2e5ef',
        maxWidth: 600,
      }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Sample Form</h2>
        <input
          type="text"
          placeholder="Name"
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <input
          type="email"
          placeholder="Email"
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button style={{ padding: '8px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Submit
        </button>
      </div>

      {/* MiraAgent Panel */}
      <MiraPanel
        adapter={adapter}
        position="right"
        theme={theme}
        suggestions={[
          'Fill in the form with demo data',
          'Click the Submit button',
          'Scroll to the bottom',
        ]}
        brandName="MiraAgent"
      />
    </div>
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 16px',
    borderRadius: 8,
    border: active ? '2px solid #6366f1' : '2px solid #e2e5ef',
    background: active ? '#eef2ff' : 'white',
    color: active ? '#6366f1' : '#5a5f7a',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 13,
  }
}
