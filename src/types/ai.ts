export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  isDemo?: boolean
}

export interface AIGuideResponse {
  reply: string
  model?: string
  fallback?: boolean
  error?: string
}
