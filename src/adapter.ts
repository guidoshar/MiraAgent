/**
 * MiraAgentAdapter — bridges page-agent core events to MiraPanel UI.
 *
 * Implements the same PanelAgentAdapter interface that @page-agent/ui expects,
 * so it's a drop-in replacement for the default Panel.
 */
import type {
  MiraAgentStatus,
  MiraActivity,
  MiraHistoricalEvent,
  MiraExecutionResult,
} from './types'

type StatusListener = (status: MiraAgentStatus) => void
type HistoryListener = (history: MiraHistoricalEvent[]) => void
type ActivityListener = (activity: MiraActivity | null) => void
type AskUserListener = (question: string, respond: (answer: string) => void) => void

export class MiraAgentAdapter extends EventTarget {
  private _status: MiraAgentStatus = 'idle'
  private _history: MiraHistoricalEvent[] = []
  private _activity: MiraActivity | null = null
  private _task = ''

  private _statusListeners = new Set<StatusListener>()
  private _historyListeners = new Set<HistoryListener>()
  private _activityListeners = new Set<ActivityListener>()
  private _askUserListener: AskUserListener | null = null

  private _coreAgent: any = null

  get status() { return this._status }
  get history(): readonly MiraHistoricalEvent[] { return this._history }
  get activity() { return this._activity }
  get task() { return this._task }

  /** Bind to a real PageAgent or PageAgentCore instance */
  bindCore(core: any) {
    this._coreAgent = core

    core.addEventListener('statuschange', () => {
      this._setStatus(core.status as MiraAgentStatus)
    })

    core.addEventListener('historychange', () => {
      this._setHistory([...core.history] as MiraHistoricalEvent[])
    })

    core.addEventListener('activity', (e: any) => {
      const detail = (e as CustomEvent).detail ?? e
      this._setActivity(detail as MiraActivity)
    })

    // Wire up ask_user — the core agent calls this when it needs user input
    core.onAskUser = (question: string): Promise<string> => {
      return new Promise((resolve) => {
        if (this._askUserListener) {
          this._askUserListener(question, resolve)
        } else {
          const answer = window.prompt(question) || ''
          resolve(answer)
        }
      })
    }
  }

  /** Execute a task via the real agent engine */
  async execute(task: string): Promise<MiraExecutionResult> {
    if (!this._coreAgent) {
      throw new Error('[MiraAgent] No core agent bound. Call init() first.')
    }
    this._task = task
    this._setHistory([])
    this._setActivity(null)

    try {
      const result = await this._coreAgent.execute(task)
      return result as MiraExecutionResult
    } catch (err: any) {
      this._setStatus('error')
      this._setActivity({ type: 'error', message: err?.message ?? String(err) })
      return { success: false, data: err?.message ?? String(err), history: this._history as MiraHistoricalEvent[] }
    }
  }

  /** Stop the current running task */
  stop() {
    this._coreAgent?.stop?.()
  }

  /** Dispose the agent completely */
  dispose() {
    this._coreAgent?.dispose?.()
    this._coreAgent = null
    this._statusListeners.clear()
    this._historyListeners.clear()
    this._activityListeners.clear()
    this._askUserListener = null
  }

  // ── Subscribe helpers ─────────────────────────────────
  onStatus(fn: StatusListener) {
    this._statusListeners.add(fn)
    return () => { this._statusListeners.delete(fn) }
  }
  onHistory(fn: HistoryListener) {
    this._historyListeners.add(fn)
    return () => { this._historyListeners.delete(fn) }
  }
  onActivity(fn: ActivityListener) {
    this._activityListeners.add(fn)
    return () => { this._activityListeners.delete(fn) }
  }
  onAskUser(fn: AskUserListener) {
    this._askUserListener = fn
    return () => { this._askUserListener = null }
  }

  // ── Internal setters (also used by mock in demo mode) ──
  _setStatus(s: MiraAgentStatus) {
    this._status = s
    this._statusListeners.forEach((fn) => fn(s))
  }
  _setHistory(h: MiraHistoricalEvent[]) {
    this._history = h
    this._historyListeners.forEach((fn) => fn(h))
  }
  _setActivity(a: MiraActivity | null) {
    this._activity = a
    this._activityListeners.forEach((fn) => fn(a))
  }
}
