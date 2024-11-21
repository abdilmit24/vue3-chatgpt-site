<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markdown'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers'

const props = defineProps<{
  code: string
  language: string
}>()

const copied = ref(false)
const codeElement = ref<HTMLElement | null>(null)
const showCopyButton = ref(false)

const copyCode = async () => {
  try {
    const decodedCode = decodeURIComponent(props.code)
    await navigator.clipboard.writeText(decodedCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

const handleMouseEnter = () => {
  showCopyButton.value = true
}

const handleMouseLeave = () => {
  if (!copied.value) {
    showCopyButton.value = false
  }
}

const highlightCode = async () => {
  await nextTick() // 确保 DOM 更新完成
  if (codeElement.value) {
    const decodedCode = decodeURIComponent(props.code)
    console.log('Decoded code:', decodedCode)
    const grammar = Prism.languages[props.language] || Prism.languages.text
    const highlightedCode = Prism.highlight(decodedCode, grammar, props.language)
    console.log('Highlighted code:', highlightedCode)
    codeElement.value.innerHTML = highlightedCode
    Prism.highlightElement(codeElement.value)
  } else {
    console.error('codeElement is not defined')
  }
}

onMounted(() => {
  highlightCode()
})

watch([() => props.code, () => props.language], () => {
  highlightCode()
})
</script>

<template>
  <div 
    class="relative group rounded-lg overflow-hidden"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Code Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-700 ">
      <!-- Language Badge -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-white">{{ language }}</span>
      </div>
      
      <!-- Copy Button -->
      <button
        @click="copyCode"
        class="copy-button transition-all duration-200 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs"
        :class="{
          'opacity-0 group-hover:opacity-100': !copied && !showCopyButton,
          'bg-green-600/10 text-green-500': copied,
          'hover:bg-gray-700/50': !copied
        }"
      >
        <template v-if="copied">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>已复制</span>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>复制代码</span>
        </template>
      </button>
    </div>

    <!-- Code Content -->
    <div class="overflow-x-auto">
      <pre class="line-numbers !bg-gray-900 !m-0 !p-2"><code
        ref="codeElement"
        :class="`language-${language} !bg-transparent`"
      ></code></pre>
    </div>
  </div>
</template>

<style>
.copy-button {
  @apply text-white;
}

.copy-button:hover {
  @apply text-gray-200;
}

/* Prism Line Numbers */
.line-numbers .line-numbers-rows {
  @apply border-r border-gray-700;
  padding: 1em 0;
}

.line-numbers-rows > span:before {
  @apply text-gray-600;
}

pre[class*="language-"].line-numbers {
  @apply p-0;
  padding-left: 3.8em;
}

/* Scrollbar Styling */
pre {
  @apply scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900;
}

::-webkit-scrollbar {
  @apply w-2 h-2;
}

::-webkit-scrollbar-track {
  @apply bg-gray-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-700 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600;
}
</style>