<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatStore } from './stores/chat'
import { useStorage } from '@vueuse/core'
import ChatMessage from './components/ChatMessage.vue'
import ChatInput from './components/ChatInput.vue'
import Sidebar from './components/Sidebar.vue'
import Settings from './components/Settings.vue'

const { t } = useI18n()
const chatStore = useChatStore()
const apiKey = useStorage('api-key', '')
const temperature = useStorage('temperature', 0.7)
const model = useStorage('model', 'qwen-plus')

const isSidebarOpen = ref(false)
const isTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const abortController = ref<AbortController | null>(null)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleUserMessage = async (content: string) => {
  if (!apiKey.value) {
    chatStore.error = t('error.apiKey')
    return
  }

  if (!chatStore.currentChat) return
  
  // Add user message
  await chatStore.addMessage(chatStore.currentChatId!, {
    role: 'user',
    content
  })

  // Update chat title if it's a new chat
  if (chatStore.currentChat.title === '新对话') {
    await chatStore.updateChat(chatStore.currentChatId!, {
      title: content.slice(0, 30)
    })
  }

  await scrollToBottom()
  await generateResponse(content)
}

const generateResponse = async (userInput: string) => {
  if (!chatStore.currentChat) return

  isTyping.value = true
  chatStore.error = null
  
  // Create new abort controller
  abortController.value = new AbortController()

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`,
      },
      body: JSON.stringify({
        model: model.value,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides accurate, informative, and engaging responses."
          },
          ...chatStore.currentChat.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: temperature.value,
        stream: true
      }),
      signal: abortController.value.signal
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    // Initialize assistant message
    const assistantMessage = {
      role: 'assistant' as const,
      content: ''
    }
    
    // Add initial empty message
    await chatStore.addMessage(chatStore.currentChatId!, assistantMessage)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Response body reader not available')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = new TextDecoder().decode(value)
      const lines = text.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        const message = line.replace(/^data: /, '').trim()
        if (message === '[DONE]') continue

        try {
          const parsed = JSON.parse(message)
          const content = parsed.choices[0]?.delta?.content || ''
          
          // Update the message content
          assistantMessage.content += content
          
          // Force update the chat with the new message content
          await chatStore.updateMessage(chatStore.currentChatId!, assistantMessage)
          
          await scrollToBottom()
        } catch (e) {
          console.error('Error parsing SSE message:', e)
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Request aborted')
    } else {
      console.error('Error in AI response:', err)
      chatStore.error = t('error.network')
    }
  } finally {
    isTyping.value = false
    abortController.value = null
    await scrollToBottom()
  }
}

const stopGenerating = () => {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
    isTyping.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(async () => {
  await chatStore.loadChats()
})

// Watch for changes in current chat and scroll to bottom
watch(() => chatStore.currentChat?.messages, () => {
  scrollToBottom()
}, { deep: true })

// Save chats to localStorage when they change
watch(() => chatStore.chats, () => {
  localStorage.setItem('chats', JSON.stringify(chatStore.chats))
}, { deep: true })
</script>

<template>
  <div class="flex h-screen bg-[var(--chat-bg)] text-[var(--text-primary)]">
    <!-- Sidebar -->
    <Sidebar
      :class="[
        'fixed md:relative w-72 h-full z-30 transform transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
      :chats="chatStore.chats"
      :current-chat-id="chatStore.currentChatId"
      @new-chat="chatStore.createNewChat"
      @select-chat="chatStore.currentChatId = $event"
      @delete-chat="chatStore.deleteChat($event)"
      @clear-conversations="chatStore.clearChats"
    >
      <template #settings>
        <Settings />
      </template>
    </Sidebar>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-[var(--header-bg)] p-4 border-b border-[var(--border-color)] flex items-center">
        <button
          class="md:hidden mr-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          @click="toggleSidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-center flex-1">
          {{ chatStore.currentChat?.title || t('newChat') }}
        </h1>
      </header>

      <!-- Chat Messages -->
      <main 
        ref="chatContainer"
        class="flex-1 overflow-y-auto scrollbar p-4 space-y-4"
      >
        <ChatMessage
          v-for="(message, index) in chatStore.currentChat?.messages"
          :key="index"
          :message="message"
        />
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="bg-[var(--ai-bg)] p-4 rounded-lg animate-pulse">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>

        <!-- Error Message -->
        <div 
          v-if="chatStore.error"
          class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg"
        >
          {{ chatStore.error }}
        </div>
      </main>

      <!-- Chat Input -->
      <div class="border-t border-[var(--border-color)] p-4">
        <div class="max-w-3xl mx-auto">
          <ChatInput
            @send-message="handleUserMessage"
            :disabled="isTyping"
            @stop-generating="stopGenerating"
            :is-generating="isTyping"
          />
        </div>
      </div>
    </div>
  </div>
</template>