<script setup>
const props = defineProps({
  label: { type: String, required: false },
});
const clicked = ref(false);
const getIcon = computed(() => {
  if (!clicked.value) {
    return "ic:baseline-keyboard-arrow-down";
  }
  return "ic:baseline-keyboard-arrow-up";
});
</script>

<template>
  <div
    @click="clicked = !clicked"
    class="flex items-center justify-center px-3 py-2 font-medium text-blue-400 rounded-full cursor-pointer gap-4 hover:bg-blue-800/50 w-fit"
  >
    <Icon :name="getIcon" />
    <p>{{ props.label }}</p>
  </div>
</template>
