<script setup>
const props = defineProps({
  avatarURL: String,
  comment: String,
  nickName: String,
  date: String,
});
</script>
<template>
  <div class="flex items-start w-full gap-2 ps-2">
    <NuxtImg
      :src="props.avatarURL"
      class="w-6 h-6 border border-white rounded-full"
    />
    <div class="flex flex-col w-full">
      <p class="flex items-center gap-2">
        <span class="text-sm">{{ props.nickName }}</span>
        <span class="text-xs font-light opacity-50">{{ props.date }}</span>
      </p>
      <p class="text-xs font-light">{{ props.comment }}</p>
    </div>
  </div>
</template>
