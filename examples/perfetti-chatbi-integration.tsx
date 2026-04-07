/**
 * MiraAgent integration example for Perfetti_chatbi (不凡帝 ChatBI)
 *
 * Usage:
 *   1. In Perfetti_chatbi root, install mira-agent:
 *      npm install ../mira-agent   (or publish to npm and install normally)
 *
 *   2. Import and use in your App.tsx:
 */

import React from 'react'
import { MiraPanel, useMiraAgent } from 'mira-agent'
import 'mira-agent/styles' // import MiraAgent CSS

/**
 * Wrap your existing app layout with MiraAgent panel.
 * The panel floats on the right side and does not interfere
 * with existing ChatBI UI.
 */
export function AppWithMiraAgent({ children }: { children: React.ReactNode }) {
  const adapter = useMiraAgent({
    // Point to your LLM proxy endpoint
    baseURL: '/api/llm-proxy',
    apiKey: import.meta.env.VITE_LLM_API_KEY ?? '',
    model: 'qwen-max',
    language: 'zh-CN',
    maxSteps: 20,
    enableMask: true,
    systemInstructions:
      '你是不凡帝 ChatBI 的 AI 助手。帮助用户操作页面上的表单、按钮和导航。',
  })

  return (
    <>
      {children}
      <MiraPanel
        adapter={adapter}
        position="right"
        theme="auto"
        brandName="MiraAgent"
        suggestions={[
          '帮我上传一个 Excel 文件',
          '切换到 SQL 编辑器页面',
          '在聊天页输入"本月销售额"并发送',
          '切换到暗色模式',
        ]}
      />
    </>
  )
}

/**
 * In your existing App.tsx, wrap the router:
 *
 * import { AppWithMiraAgent } from './integrations/mira-agent-integration'
 *
 * function App() {
 *   return (
 *     <AppWithMiraAgent>
 *       <Theme theme={currentTheme}>
 *         <BrowserRouter>
 *           <Routes>
 *             ...existing routes...
 *           </Routes>
 *         </BrowserRouter>
 *       </Theme>
 *     </AppWithMiraAgent>
 *   )
 * }
 */
