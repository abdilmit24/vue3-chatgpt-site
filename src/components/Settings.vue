<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'

const { t, locale } = useI18n()
const showModal = ref(false)
const apiKey = useStorage('api-key', '')
const temperature = useStorage('temperature', 0.7)
const model = useStorage('model', 'qwen-plus')
const theme = useStorage('theme', 'system')

const languages = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ug-CN', label: 'ئۇيغۇرچە' }
]

const models = [
  { value: 'qwen-plus', label: 'Qwen Plus' },
  { value: 'qwen-max', label: 'Qwen Max' },
  { value: 'qwen-max-longcontext', label: 'Qwen Max (长文本)' }
]

const themes = [
  { value: 'light', label: t('light') },
  { value: 'dark', label: t('dark') },
  { value: 'system', label: t('system') }
]

watch(theme, (newTheme) => {
  if (newTheme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', isDark)
  } else {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
})

const toggleModal = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <div>
    <button
      @click="toggleModal"
      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <div v-if="showModal" class="modal" @click.self="toggleModal">
      <div class="modal-content">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">{{ t('settings') }}</h2>
          <button @click="toggleModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- API Key -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">API Key</label>
            <input
              type="password"
              v-model="apiKey"
              class="input-primary"
              :placeholder="t('enterApiKey')"
            />
          </div>

          <!-- Language -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">{{ t('language') }}</label>
            <select v-model="locale" class="input-primary">
              <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>

          <!-- Theme -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">{{ t('theme') }}</label>
            <select v-model="theme" class="input-primary">
              <option v-for="t in themes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>

          <!-- Model -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">{{ t('model') }}</label>
            <select v-model="model" class="input-primary">
              <option v-for="m in models" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
          </div>

          <!-- Temperature -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">{{ t('temperature') }}</label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model="temperature"
                min="0"
                max="1"
                step="0.1"
                class="flex-1"
              />
              <span class="text-sm">{{ temperature }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ t('temperatureDescription') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>