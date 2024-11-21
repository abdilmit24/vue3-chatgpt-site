<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Chat } from '../types'

const { t } = useI18n()

const props = defineProps<{
  chats: Chat[]
  currentChatId: string | null
}>()

const emit = defineEmits<{
  (e: 'newChat'): void
  (e: 'selectChat', chatId: string): void
  (e: 'deleteChat', chatId: string): void
  (e: 'clearConversations'): void
}>()

const sortedChats = computed(() => {
  return [...props.chats].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  )
})
</script>
<template>
  <aside class="h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col">
    <!-- Header -->
    <div class="p-3 flex items-center justify-between border-b border-[var(--border-color)]">
      <h1 class="text-lg font-bold">{{ t('site_title')}}</h1>
      <slot name="settings"></slot>
    </div>

    <!-- New Chat Button -->
    <button
      @click="emit('newChat')"
      class="mx-2 my-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 justify-center text-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {{ t('newChat') }}
    </button>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto scrollbar">
      <div 
        v-for="chat in sortedChats" 
        :key="chat.id"
        class="relative group"
      >
        <button
          @click="emit('selectChat', chat.id)"
          class="w-full p-4 text-left hover:bg-[var(--user-bg)] transition-colors flex items-center gap-2 text-sm"
          :class="{ 'bg-[var(--user-bg)]': chat.id === currentChatId }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span class="truncate">{{ chat.title }}</span>
        </button>
        <button
          @click="emit('deleteChat', chat.id)"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          :title="t('delete')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-[var(--border-color)] p-2">
      <button
        @click="emit('clearConversations')"
        class="w-full p-2 text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 justify-center text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {{ t('clearConversations') }}
      </button>
    </div>
  </aside>
</template>