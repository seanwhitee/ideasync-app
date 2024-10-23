<script setup>
const props = defineProps({
  tagName: String,
  color: String,
});

const colorClasses = computed(() => {
  // Explicitly map color props to Tailwind classes
  switch (props.color) {
    case "slate":
      return "shadow-slate-500/50 border-slate-800";
    case "violet":
      return "shadow-violet-500/50 border-violet-800";
    case "indigo":
      return "shadow-indigo-500/50 border-indigo-800";
    case "fuchsia":
      return "shadow-fuchsia-500/50 border-fuchsia-800";
    case "green":
      return "shadow-green-500/50 border-green-800";
    default:
      return ""; // Default case if no color matches
  }
});
</script>
<template>
  <div
    class="flex items-center justify-start px-2 text-xs font-light border shadow-md h-fit w-fit text-start dark:text-white rounded-md gap-1"
    :class="colorClasses"
  >
    <slot />
    {{ props.tagName }}
  </div>
</template>
