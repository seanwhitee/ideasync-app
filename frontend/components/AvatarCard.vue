<script setup>
const props = defineProps({
  avatarURL: String,
  username: String,
  email: String,
});
</script>
<template>
  <div class="flex gap-2">
    <NuxtImg
      :src="props.avatarURL"
      alt="user-avatar"
      class="w-8 h-8 border border-white rounded-full"
    />
    <div class="flex flex-col text-xs font-extralight">
      <p class="text-sm font-bold">{{ props.username }}</p>
      <p class="text-[10px]">{{ props.email }}</p>
    </div>
  </div>
</template>
