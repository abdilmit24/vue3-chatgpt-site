import type { Chat, Message } from '../types'

export interface SerializedMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SerializedChat {
  id: string
  title: string
  messages: SerializedMessage[]
  createdAt: string
  model: string
  temperature: number
}

// Deep clone an object to ensure it's serializable
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function serializeMessage(message: Message): SerializedMessage {
  return deepClone({
    role: message.role,
    content: message.content
  })
}

export function serializeChat(chat: Chat): SerializedChat {
  return {
    id: chat.id,
    title: chat.title,
    messages: chat.messages.map(serializeMessage),
    createdAt: chat.createdAt.toISOString(),
    model: chat.model,
    temperature: chat.temperature
  }
}

export function deserializeMessage(message: SerializedMessage): Message {
  return {
    role: message.role,
    content: message.content
  }
}

export function deserializeChat(serializedChat: SerializedChat): Chat {
  return {
    id: serializedChat.id,
    title: serializedChat.title,
    messages: serializedChat.messages.map(deserializeMessage),
    createdAt: new Date(serializedChat.createdAt),
    model: serializedChat.model,
    temperature: serializedChat.temperature
  }
}