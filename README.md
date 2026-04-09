<p align="center">
  <img src="https://img.shields.io/badge/MiraAgent-v0.1.0-6366f1?style=for-the-badge" alt="version" />
  <img src="https://img.shields.io/badge/React-%3E%3D18-61dafb?style=for-the-badge&logo=react" alt="react" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript" alt="typescript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="license" />
</p>

# ✨ MiraAgent

> Premium GUI Agent UI Panel — 用自然语言操控网页，powered by [page-agent](https://github.com/anthropics/page-agent).

MiraAgent 封装了 `page-agent` 的 DOM RPA 引擎，提供一套开箱即用的 **React 浮动面板 UI**，让你的 Web 应用瞬间拥有 AI Agent 能力：用户输入自然语言指令，Agent 自动规划并执行页面操作（点击、输入、滚动、选择等）。

---

## 🎯 Features

- **🧠 自然语言 → DOM 操作** — 用户说"帮我填写表单"，Agent 自动完成
- **🎨 Candy Design** — 糖果色渐变、流光动效、弹性过渡，视觉体验一流
- **🌗 Light / Dark / Auto** — 完整的主题系统，CSS 变量驱动
- **🖱️ 可拖拽浮动面板** — FAB 触发，自由拖拽定位，不干扰宿主页面
- **📜 时间线对话视图** — 每一步展示 Agent 的反思（Reflection）、动作、输出
- **💬 Ask User** — Agent 遇到歧义时主动向用户提问
- **🌐 i18n** — 内置 `en-US` / `zh-CN` 双语
- **📦 Library Mode** — Vite 打包为 ESM + CJS，可直接 `npm install`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  Your App                    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │           MiraPanel (UI)            │    │
│  │  ChatView · StepCard · InputBar     │    │
│  │  ActivityFeed · StatusIndicator     │    │
│  └──────────────┬──────────────────────┘    │
│                 │                            │
│  ┌──────────────▼──────────────────────┐    │
│  │       MiraAgentAdapter (Bridge)     │    │
│  │  Events: status / history / activity│    │
│  └──────────────┬──────────────────────┘    │
│                 │                            │
│  ┌──────────────▼──────────────────────┐    │
│  │     page-agent / @page-agent/core   │    │
│  │  DOM RPA Engine (click, input, etc) │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 📦 Installation

```bash
npm install mira-agent page-agent
```

> `page-agent` 是 peer dependency，提供底层 DOM RPA 引擎。

---

## 🚀 Quick Start

### 方式一：使用 `useMiraAgent` Hook（推荐）

```tsx
import { MiraPanel, useMiraAgent } from 'mira-agent'
import 'mira-agent/styles'

function App() {
  const { adapter, ready, error } = useMiraAgent({
    baseURL: '/api/llm-proxy',
    apiKey: 'your-api-key',
    model: 'gpt-4o',
    language: 'zh-CN',
    maxSteps: 20,
  })

  return (
    <div>
      {/* 你的应用内容 */}
      <MiraPanel
        adapter={adapter}
        ready={ready}
        error={error}
        theme="auto"
        position="right"
        suggestions={['帮我填写表单', '点击提交按钮', '滚动到页面底部']}
      />
    </div>
  )
}
```

### 方式二：手动控制 MiraAgent 实例

```tsx
import { MiraAgent, MiraPanel } from 'mira-agent'
import 'mira-agent/styles'

const agent = new MiraAgent({
  baseURL: '/api/llm-proxy',
  apiKey: 'your-api-key',
  model: 'gpt-4o',
})

await agent.init()

// 在 React 中渲染面板
<MiraPanel adapter={agent.adapter} theme="light" />

// 也可以通过代码直接执行任务
const result = await agent.execute('点击登录按钮')
console.log(result.success, result.data)

// 清理
agent.dispose()
```

---

## ⚙️ Configuration

### `MiraAgentConfig`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `baseURL` | `string` | — | LLM API 地址 |
| `apiKey` | `string` | — | LLM API Key |
| `model` | `string` | — | 模型名称（如 `gpt-4o`, `qwen-max`） |
| `temperature` | `number` | — | LLM 温度参数 |
| `language` | `'en-US' \| 'zh-CN'` | `'en-US'` | UI 语言 |
| `maxSteps` | `number` | `20` | 单次任务最大步数 |
| `enableMask` | `boolean` | `true` | 自动化时是否显示遮罩 |
| `systemInstructions` | `string` | — | 系统级指令 |
| `getPageInstructions` | `(url) => string` | — | 页面级指令回调 |
| `transformPageContent` | `(content) => string` | — | 页面内容预处理 |
| `customFetch` | `typeof fetch` | — | 自定义 fetch 实现 |

### `MiraPanelProps`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `adapter` | `MiraAgentAdapter` | — | Adapter 实例（必填） |
| `position` | `'left' \| 'right'` | `'right'` | 面板位置 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 主题 |
| `defaultCollapsed` | `boolean` | `true` | 默认折叠 |
| `width` | `number` | `380` | 面板宽度 (px) |
| `suggestions` | `string[]` | — | 快捷指令建议 |
| `brandName` | `string` | `'MiraAgent'` | 品牌名称 |
| `ready` | `boolean` | `true` | 引擎是否就绪 |
| `error` | `string \| null` | `null` | 错误信息 |

---

## 🧩 Exports

```ts
// Core
import { MiraAgent, MiraAgentAdapter } from 'mira-agent'

// React Hooks
import { useMiraAgent, useAgentState } from 'mira-agent'

// Components (可单独使用)
import {
  MiraPanel,
  ChatView,
  StepCard,
  InputBar,
  StatusIndicator,
  ActivityFeed,
  AskUserDialog,
  MiraIcon,
} from 'mira-agent'

// i18n
import { getLocale } from 'mira-agent'

// Styles
import 'mira-agent/styles'
```

---

## 🎨 Theming

MiraAgent 使用 CSS 变量驱动主题，你可以覆盖任意变量：

```css
[data-mira-theme="light"] {
  --mira-primary: #6366f1;
  --mira-primary-light: #8b5cf6;
  --mira-bg: #ffffff;
  --mira-text: #1a1a2e;
  --mira-border: #e2e5ef;
  --mira-radius: 12px;
}
```

暗色模式通过 `data-mira-theme="dark"` 自动切换，或设置 `theme="auto"` 跟随系统。

---

## 🛠️ Development

```bash
# 安装依赖
npm install

# 启动 Demo（含模拟 Agent）
npm run dev

# 构建库
npm run build
```

Demo 页面使用 mock adapter 模拟 Agent 行为，无需真实 LLM 即可预览完整 UI。

---

## 📁 Project Structure

```
src/
├── index.ts              # Public exports
├── MiraAgent.ts          # 主入口类，封装 PageAgent
├── adapter.ts            # MiraAgentAdapter 桥接层
├── types.ts              # TypeScript 类型定义
├── components/
│   ├── MiraPanel.tsx      # 浮动面板 + FAB
│   ├── ChatView.tsx       # 时间线对话视图
│   ├── StepCard.tsx       # 步骤卡片（反思/动作/输出）
│   ├── ActivityFeed.tsx   # 实时活动流
│   ├── InputBar.tsx       # 输入栏 + 快捷建议
│   ├── StatusIndicator.tsx
│   ├── AskUserDialog.tsx
│   └── MiraIcon.tsx       # Lucide 图标封装
├── hooks/
│   ├── useMiraAgent.ts    # 管理 Agent 生命周期
│   └── useAgentState.ts   # 订阅 Adapter 状态
├── i18n/                  # en-US / zh-CN
├── theme/                 # CSS 变量 + 动画 + 暗色模式
└── utils/
```

---

## 🤝 Integration Example

将 MiraAgent 集成到现有 React 应用：

```tsx
import { MiraPanel, MiraAgentAdapter } from 'mira-agent'
import 'mira-agent/styles'

export function AppWithMiraAgent({ children }) {
  const { adapter, ready, error } = useMiraAgent({
    baseURL: '/api/llm-proxy',
    apiKey: import.meta.env.VITE_LLM_API_KEY,
    model: 'qwen-max',
    language: 'zh-CN',
    systemInstructions: '你是一个网页操作助手，帮助用户完成页面上的操作。',
  })

  return (
    <>
      {children}
      <MiraPanel
        adapter={adapter}
        ready={ready}
        error={error}
        theme="auto"
        position="right"
        suggestions={['帮我上传文件', '切换到设置页面', '填写并提交表单']}
      />
    </>
  )
}
```

---

## 📄 License

[MIT](./LICENSE)

---

<p align="center">
  <sub>Mira — from Latin, meaning "wonder" ✨</sub>
</p>
