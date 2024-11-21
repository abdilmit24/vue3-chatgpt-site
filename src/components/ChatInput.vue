<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  disabled?: boolean
  isGenerating?: boolean
}>()

const emit = defineEmits<{
  (e: 'sendMessage', message: string): void
  (e: 'stopGenerating'): void
}>()

const { t } = useI18n()
const textarea = ref<HTMLTextAreaElement | null>(null)
const input = ref('')

const adjustTextareaHeight = async () => {
  if (!textarea.value) return
  await nextTick()
  textarea.value.style.height = 'auto'
  textarea.value.style.height = `${textarea.value.scrollHeight}px`
}

const handleInput = () => {
  adjustTextareaHeight()
}

const handleSubmit = () => {
  if (!input.value.trim() || props.disabled) return
  emit('sendMessage', input.value.trim())
  input.value = ''
  if (textarea.value) {
    textarea.value.style.height = 'auto'
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}
</script>

<template>
  <div class="relative">
    <textarea
      ref="textarea"
      v-model="input"
      rows="1"
      class="input-primary resize-none max-h-36"
      :class="{ 'opacity-50': disabled }"
      :placeholder="t('enterMessage')"
      @input="handleInput"
      @keydown="handleKeydown"
      :disabled="disabled"
    ></textarea>
    
    <div class="absolute right-2 bottom-2 flex gap-2">
      <button
        v-if="isGenerating"
        @click="emit('stopGenerating')"
        class="p-2 text-red-500 hover:text-red-600 rounded-lg"
        :title="t('stop')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button
        @click="handleSubmit"
        class="p-2 text-blue-500 hover:text-blue-600 rounded-lg disabled:opacity-50"
        :disabled="disabled || !input.trim()"
        :title="t('send')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>