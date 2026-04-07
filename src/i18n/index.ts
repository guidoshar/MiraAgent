export type SupportedLocale = 'en-US' | 'zh-CN'

export interface MiraLocale {
  brand: string
  inputPlaceholder: string
  send: string
  stop: string
  collapse: string
  expand: string
  thinking: string
  executing: string
  executed: string
  retrying: string
  error: string
  idle: string
  completed: string
  running: string
  stepLabel: string
  reflectionLabel: string
  actionLabel: string
  outputLabel: string
  memoryLabel: string
  nextGoalLabel: string
  askUserTitle: string
  askUserSubmit: string
  askUserCancel: string
  noHistory: string
  tokenUsage: string
  duration: string
  suggestions: string
}

const enUS: MiraLocale = {
  brand: 'MiraAgent',
  inputPlaceholder: 'Tell the agent what to do...',
  send: 'Send',
  stop: 'Stop',
  collapse: 'Collapse',
  expand: 'Expand',
  thinking: 'Thinking',
  executing: 'Executing',
  executed: 'Done',
  retrying: 'Retrying',
  error: 'Error',
  idle: 'Ready',
  completed: 'Completed',
  running: 'Running',
  stepLabel: 'Step',
  reflectionLabel: 'Reflection',
  actionLabel: 'Action',
  outputLabel: 'Output',
  memoryLabel: 'Memory',
  nextGoalLabel: 'Next Goal',
  askUserTitle: 'Agent needs your input',
  askUserSubmit: 'Submit',
  askUserCancel: 'Cancel',
  noHistory: 'No activity yet. Send a command to get started.',
  tokenUsage: 'Tokens',
  duration: 'Duration',
  suggestions: 'Suggestions',
}

const zhCN: MiraLocale = {
  brand: 'MiraAgent',
  inputPlaceholder: '告诉 Agent 你想做什么...',
  send: '发送',
  stop: '停止',
  collapse: '收起',
  expand: '展开',
  thinking: '思考中',
  executing: '执行中',
  executed: '已完成',
  retrying: '重试中',
  error: '错误',
  idle: '就绪',
  completed: '已完成',
  running: '运行中',
  stepLabel: '步骤',
  reflectionLabel: '反思',
  actionLabel: '动作',
  outputLabel: '输出',
  memoryLabel: '记忆',
  nextGoalLabel: '下一步目标',
  askUserTitle: 'Agent 需要你的输入',
  askUserSubmit: '提交',
  askUserCancel: '取消',
  noHistory: '暂无活动。发送指令开始使用。',
  tokenUsage: 'Token 用量',
  duration: '耗时',
  suggestions: '建议指令',
}

const locales: Record<SupportedLocale, MiraLocale> = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

export function getLocale(lang?: SupportedLocale | string): MiraLocale {
  if (lang && lang in locales) return locales[lang as SupportedLocale]
  return enUS
}
