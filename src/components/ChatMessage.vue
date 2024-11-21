<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import CodeBlock from './CodeBlock.vue'
import type { Message } from '../types'

const props = defineProps<{
  message: Message
}>()

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

const formattedContent = computed(() => {
  const tokens = marked.lexer(props.message.content)
  return tokens.map(token => {
    if (token.type === 'code') {
      return {
        type: 'code',
        content: token.text,
        language: token.lang || 'plaintext'
      }
    }
    return {
      type: 'text',
      content: marked.parser([token])
    }
  })
})

const messageClass = computed(() => 
  props.message.role === 'user' ? 'user-message' : 'ai-message'
)

const avatar = computed(() => 
  props.message.role === 'user' ? '🧑' : '🤖'
)
</script>

<template>
  <div :class="['message message-appear flex gap-4', messageClass]">
    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
      {{ avatar }}
    </div>
    <div class="flex-1 overflow-hidden">
      <div class="markdown-body">
        <template v-for="(part, index) in formattedContent" :key="index">
          <CodeBlock 
            v-if="part.type === 'code'"
            :code="part.content"
            :language="part.language"
            class="my-4"
          />
          <div 
            v-else
            v-html="part.content"
            class="prose dark:prose-invert"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>