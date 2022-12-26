<template>
  <q-page-sticky :offset="[32, 32]" class="code-snippet" :position="position === undefined ? 'left' : 'right'">
    <pre v-for="(codeSnippet, index) in codeSnippets"
      :key="index"><code className="language-typescript">{{ codeSnippet }}</code></pre>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-twilight.css';
import 'prismjs/components/prism-typescript';


// export interface CodeSnippet {
//   title?: string;
//   code: string;
//   link?: string;
// }

export interface CodeSnippets {
  codeSnippets: string[]
  position?: string
}
defineProps<CodeSnippets>()

onMounted(() => {
  Prism.highlightAll()
})
</script>
