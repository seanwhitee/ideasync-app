<script setup>
const props = defineProps({
  previewURL: String,
  fileName: String,
})
</script>
<template>
  <a target="_blank" :href="props.previewURL" alt="preview-container" class="w-full px-4 pt-3 pb-6 border
  border-gray-500/30 hover:bg-zinc-800/50 duration-300">
    <h3 class="mb-3 text-xl font-semibold">{{ props.fileName }}</h3>
    <div class="flex items-center justify-start w-full">
      <Icon name="material-symbols:attachment" class="w-6 h-6" />
      <p class="ml-2 text-sm text-gray-500">預覽</p>
    </div>
  </a>
</template>