/**
 * MiraAgent — wraps the real PageAgent from `page-agent` package.
 *
 * Strategy: use PageAgent's full DOM RPA engine (PageAgentCore + PageController),
 * but replace its built-in Panel with our MiraPanel React UI.
 *
 * The PageAgent class extends PageAgentCore and auto-creates a Panel.
 * We use PageAgentCore directly to avoid the default Panel, then bind
 * our MiraPanel via the PanelAgentAdapter interface.
 */
import { MiraAgentAdapter } from './adapter'
import type { MiraAgentConfig, MiraExecutionResult } from './types'

/**
 * Dynamic import that bypasses Vite's static analysis.
 * This ensures the module is resolved at runtime, not build time.
 */
function dynamicImport(specifier: string): Promise<any> {
  return new Function('s', 'return import(s)')(specifier)
}

export class MiraAgent {
  readonly adapter: MiraAgentAdapter
  private _config: MiraAgentConfig
  private _disposed = false
  private _initialized = false

  constructor(config: MiraAgentConfig) {
    this._config = config
    this.adapter = new MiraAgentAdapter()
  }

  /**
   * Initialize the real PageAgent core engine.
   * This dynamically imports `page-agent` and creates a PageAgentCore
   * with PageController — giving us full DOM RPA capabilities.
   */
  async init(): Promise<void> {
    if (this._initialized) return

    try {
      // Try importing the full page-agent package first (includes everything)
      const mod = await dynamicImport('page-agent')
      const PageAgentClass = mod.PageAgent ?? mod.default

      if (PageAgentClass) {
        // PageAgent constructor creates core + controller + panel
        // We create it, then hide its default panel and use ours instead
        const agent = new PageAgentClass({
          baseURL: this._config.baseURL,
          apiKey: this._config.apiKey,
          model: this._config.model,
          temperature: this._config.temperature,
          maxRetries: this._config.maxRetries,
          customFetch: this._config.customFetch,
          language: this._config.language ?? 'en-US',
          maxSteps: this._config.maxSteps ?? 20,
          enableMask: this._config.enableMask ?? true,
          ...(this._config.systemInstructions || this._config.getPageInstructions
            ? {
                instructions: {
                  system: this._config.systemInstructions,
                  getPageInstructions: this._config.getPageInstructions,
                },
              }
            : {}),
          ...(this._config.transformPageContent
            ? { transformPageContent: this._config.transformPageContent }
            : {}),
        })

        // Hide the default Panel UI — we use MiraPanel instead
        if (agent.panel?.wrapper) {
          agent.panel.wrapper.style.display = 'none'
        }

        this.adapter.bindCore(agent)
        this._initialized = true
        return
      }
    } catch {
      // page-agent not available, try @page-agent/core directly
    }

    try {
      const coreMod = await dynamicImport('@page-agent/core')
      const PageAgentCore = coreMod.PageAgentCore ?? coreMod.default

      // Also need PageController for DOM operations
      let pageController: any = undefined
      try {
        const pcMod = await dynamicImport('@page-agent/page-controller')
        const PageController = pcMod.PageController ?? pcMod.default
        pageController = new PageController({
          enableMask: this._config.enableMask ?? true,
        })
      } catch {
        // page-controller might be bundled inside core
      }

      const coreConfig: Record<string, unknown> = {
        baseURL: this._config.baseURL,
        apiKey: this._config.apiKey,
        model: this._config.model,
        temperature: this._config.temperature,
        maxRetries: this._config.maxRetries,
        customFetch: this._config.customFetch,
        language: this._config.language ?? 'en-US',
        maxSteps: this._config.maxSteps ?? 20,
        enableMask: this._config.enableMask ?? true,
      }

      if (this._config.systemInstructions || this._config.getPageInstructions) {
        coreConfig.instructions = {
          system: this._config.systemInstructions,
          getPageInstructions: this._config.getPageInstructions,
        }
      }
      if (this._config.transformPageContent) {
        coreConfig.transformPageContent = this._config.transformPageContent
      }
      if (pageController) {
        coreConfig.pageController = pageController
      }

      const core = new PageAgentCore(coreConfig)
      this.adapter.bindCore(core)
      this._initialized = true
    } catch (err) {
      throw new Error(
        '[MiraAgent] Neither `page-agent` nor `@page-agent/core` could be loaded. ' +
        'Install one of them: npm install page-agent'
      )
    }
  }

  /** Execute a natural-language task with real DOM RPA */
  async execute(task: string): Promise<MiraExecutionResult> {
    if (this._disposed) throw new Error('[MiraAgent] Agent has been disposed.')
    if (!this._initialized) await this.init()
    return this.adapter.execute(task)
  }

  /** Clean up resources */
  dispose() {
    this._disposed = true
    this.adapter.dispose()
  }
}
