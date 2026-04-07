/**
 * useAgentState — React hook that subscribes to MiraAgentAdapter events
 * and returns reactive state for components.
 */
import { useState, useEffect, useCallback } from 'react'
import type { MiraAgentAdapter } from '../adapter'
import type {
  MiraAgentStatus,
  MiraActivity,
  MiraHistoricalEvent,
} from '../types'

export interface AgentState {
  status: MiraAgentStatus
  history: MiraHistoricalEvent[]
  activity: MiraActivity | null
  task: string
  execute: (task: string) => Promise<void>
}

export function useAgentState(adapter: MiraAgentAdapter): AgentState {
  const [status, setStatus] = useState<MiraAgentStatus>(adapter.status)
  const [history, setHistory] = useState<MiraHistoricalEvent[]>([...adapter.history])
  const [activity, setActivity] = useState<MiraActivity | null>(adapter.activity)
  const [task, setTask] = useState(adapter.task)

  useEffect(() => {
    const unsubs = [
      adapter.onStatus((s) => setStatus(s)),
      adapter.onHistory((h) => setHistory(h)),
      adapter.onActivity((a) => setActivity(a)),
    ]
    return () => unsubs.forEach((u) => u())
  }, [adapter])

  // Sync task from adapter when status changes
  useEffect(() => {
    setTask(adapter.task)
  }, [adapter, status])

  const execute = useCallback(
    async (t: string) => {
      setTask(t)
      await adapter.execute(t)
    },
    [adapter],
  )

  return { status, history, activity, task, execute }
}
