<script setup>
const props = defineProps({
  name: String,
  icon: String,
  isTextVisible: Boolean,
});
</script>
<template>
  <div class="flex items-center justify-start ps-4 py-1.5 rounded-lg">
    <Icon :name="props.icon" class="w-8 h-8 text-white me-4" />
    <p
      v-if="isTextVisible"
      class="hidden text-lg font-light text-white md:flex"
    >
      {{ props.name }}
    </p>
  </div>
</template>
