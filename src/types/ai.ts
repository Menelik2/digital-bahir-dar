export type ChatRole = 'user' | 'assistant' | 'system'

export interface GuideAction {
  label: string
  to: string
  /** optional external */
  external?: boolean
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  isDemo?: boolean
  actions?: GuideAction[]
}

export interface AIGuideResponse {
  reply: string
  model?: string
  fallback?: boolean
  error?: string
  actions?: GuideAction[]
  grounded?: boolean
}
