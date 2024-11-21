import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Chat, Message } from '../types'
import { db } from '../db'
import { 
  serializeChat, 
  deserializeChat, 
  serializeMessage 
} from '../utils/serialization'

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const currentChatId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentChat = computed(() => 
    chats.value.find(chat => chat.id === currentChatId.value)
  )

  async function loadChats() {
    try {
      const savedChats = await db.chats.toArray()
      chats.value = savedChats.map(deserializeChat)
      
      if (chats.value.length === 0) {
        await createNewChat()
      } else {
        currentChatId.value = chats.value[0].id
      }
    } catch (err) {
      console.error('Failed to load chats:', err)
      error.value = '加载对话历史失败'
    }
  }

  async function createNewChat() {
    const newChat: Chat = {
      id: uuidv4(),
      title: '新对话',
      messages: [{
        role: 'assistant',
        content: '你好！我是AI助手，有什么我可以帮你的吗？'
      }],
      createdAt: new Date(),
      model: 'qwen-plus',
      temperature: 0.7
    }
    
    try {
      const serializedChat = serializeChat(newChat)
      await db.chats.add(serializedChat)
      chats.value.unshift(newChat)
      currentChatId.value = newChat.id
      return newChat
    } catch (err) {
      console.error('Failed to create new chat:', err)
      error.value = '创建新对话失败'
      throw err
    }
  }

  async function deleteChat(chatId: string) {
    try {
      const index = chats.value.findIndex(chat => chat.id === chatId)
      if (index !== -1) {
        chats.value.splice(index, 1)
        await db.chats.delete(chatId)
        if (currentChatId.value === chatId) {
          currentChatId.value = chats.value[0]?.id || null
          if (!currentChatId.value) {
            await createNewChat()
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err)
      error.value = '删除对话失败'
      throw err
    }
  }

  async function updateChat(chatId: string, updates: Partial<Chat>) {
    try {
      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        const updatedChat: Chat = {
          ...chat,
          ...updates
        }
        const serializedChat = serializeChat(updatedChat)
        await db.chats.update(chatId, serializedChat)
        Object.assign(chat, updates)
      }
    } catch (err) {
      console.error('Failed to update chat:', err)
      error.value = '更新对话失败'
      throw err
    }
  }

  async function addMessage(chatId: string, message: Message) {
    try {
      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        chat.messages.push({ ...message })
        await db.chats.update(chatId, serializeChat(chat))
      }
    } catch (err) {
      console.error('Failed to add message:', err)
      error.value = '添加消息失败'
      throw err
    }
  }

  async function updateMessage(chatId: string, message: Message) {
    try {
      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage && lastMessage.role === message.role) {
          lastMessage.content = message.content
          await db.chats.update(chatId, serializeChat(chat))
        }
      }
    } catch (err) {
      console.error('Failed to update message:', err)
      error.value = '更新消息失败'
      throw err
    }
  }

  async function clearChats() {
    try {
      chats.value = []
      await db.chats.clear()
      await createNewChat()
    } catch (err) {
      console.error('Failed to clear chats:', err)
      error.value = '清除对话失败'
      throw err
    }
  }

  return {
    chats,
    currentChatId,
    currentChat,
    isLoading,
    error,
    loadChats,
    createNewChat,
    deleteChat,
    updateChat,
    addMessage,
    updateMessage,
    clearChats
  }
})