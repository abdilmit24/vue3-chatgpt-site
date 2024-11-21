export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  model: string
  temperature: number
}

export interface ChatState {
  chats: Chat[]
  currentChatId: string | null
}

export interface Settings {
  apiKey: string
  theme: 'light' | 'dark'
  language: string
  model: string
  temperature: number
}