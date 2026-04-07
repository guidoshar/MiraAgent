/**
 * useMiraAgent — creates and manages a real MiraAgent instance.
 * Initializes the PageAgent core engine on mount.
 */
import { useRef, useEffect, useMemo, useState } from 'react'
import { MiraAgent } from '../MiraAgent'
import { MiraAgentAdapter } from '../adapter'
import type { MiraAgentConfig } from '../types'

export function useMiraAgent(config: MiraAgentConfig): {
  adapter: MiraAgentAdapter
  ready: boolean
  error: string | null
} {
  const agentRef = useRef<MiraAgent | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const configKey = `${config.baseURL}|${config.apiKey}|${config.model}`

  const adapter = useMemo(() => {
    agentRef.current?.dispose()
    const agent = new MiraAgent(config)
    agentRef.current = agent
    return agent.adapter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey])

  // Initialize the real PageAgent engine
  useEffect(() => {
    const agent = agentRef.current
    if (!agent) return

    setReady(false)
    setError(null)

    agent.init()
      .then(() => setReady(true))
      .catch((err) => setError(err?.message ?? 'Failed to initialize MiraAgent'))

    return () => {
      agent.dispose()
      agentRef.current = null
    }
  }, [configKey])

  return { adapter, ready, error }
}
