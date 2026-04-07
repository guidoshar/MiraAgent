/**
 * MiraAgent type definitions
 * Bridges @page-agent/core types with MiraAgent UI layer
 */

// ─── Agent Status ────────────────────────────────────────────
export type MiraAgentStatus = 'idle' | 'running' | 'completed' | 'error'

// ─── Activity (transient, for UI feedback) ───────────────────
export type MiraActivity =
  | { type: 'thinking' }
  | { type: 'executing'; tool: string; input: unknown }
  | { type: 'executed'; tool: string; input: unknown; output: string; duration: number }
  | { type: 'retrying'; attempt: number; maxAttempts: number }
  | { type: 'error'; message: string }

// ─── Reflection (agent reasoning per step) ───────────────────
export interface MiraReflection {
  evaluation_previous_goal: string
  memory: string
  next_goal: string
}

// ─── Step Event ──────────────────────────────────────────────
export interface MiraStepEvent {
  type: 'step'
  stepIndex: number
  reflection: Partial<MiraReflection>
  action: { name: string; input: unknown; output: string }
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cachedTokens?: number
    reasoningTokens?: number
  }
}

// ─── Historical Events ──────────────────────────────────────
export interface MiraObservationEvent {
  type: 'observation'
  content: string
}

export interface MiraUserTakeoverEvent {
  type: 'user_takeover'
}

export interface MiraRetryEvent {
  type: 'retry'
  message: string
  attempt: number
  maxAttempts: number
}

export interface MiraErrorEvent {
  type: 'error'
  message: string
  rawResponse?: unknown
}

export type MiraHistoricalEvent =
  | MiraStepEvent
  | MiraObservationEvent
  | MiraUserTakeoverEvent
  | MiraRetryEvent
  | MiraErrorEvent

// ─── Execution Result ────────────────────────────────────────
export interface MiraExecutionResult {
  success: boolean
  data: string
  history: MiraHistoricalEvent[]
}

// ─── Theme & Position ────────────────────────────────────────
export type MiraTheme = 'light' | 'dark' | 'auto'
export type MiraPanelPosition = 'left' | 'right'

// ─── Config ──────────────────────────────────────────────────
export interface MiraAgentConfig {
  /** LLM API base URL */
  baseURL: string
  /** LLM API key */
  apiKey: string
  /** LLM model name */
  model: string
  /** Temperature for LLM */
  temperature?: number
  /** Max retries for LLM calls */
  maxRetries?: number
  /** Custom fetch implementation */
  customFetch?: typeof fetch

  /** UI language */
  language?: 'en-US' | 'zh-CN'
  /** Max steps per task (default: 20) */
  maxSteps?: number
  /** Enable visual mask during automation (default: true) */
  enableMask?: boolean
  /** System-level instructions */
  systemInstructions?: string
  /** Page-level instructions callback */
  getPageInstructions?: (url: string) => string | undefined | null
  /** Transform page content before sending to LLM */
  transformPageContent?: (content: string) => Promise<string> | string
}

// ─── Panel Props ─────────────────────────────────────────────
export interface MiraPanelProps {
  /** MiraAgentAdapter instance (from useMiraAgent hook) */
  adapter: import('./adapter').MiraAgentAdapter
  /** Panel position */
  position?: MiraPanelPosition
  /** Theme */
  theme?: MiraTheme
  /** Default collapsed state */
  defaultCollapsed?: boolean
  /** Panel width in px (default: 380) */
  width?: number
  /** Custom class name */
  className?: string
  /** Quick command suggestions */
  suggestions?: string[]
  /** Custom brand name (default: "MiraAgent") */
  brandName?: string
  /** Called when panel collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
}
