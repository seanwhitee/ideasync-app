<script setup>
const props = defineProps({
  title: String,
});
const chooseBorderColor = computed(() => {
  switch (props.title) {
    case "成員招募":
      return "border-violet-500/50";
    case "指導者招募":
      return "border-fuchsia-500/50";
    default:
      return "border-green-500/50";
  }
});
</script>
<template>
  <div
    class="flex flex-col w-full px-3 pt-6 pb-3 bg-black border border-white/50 gap-3"
  >
    <div class="flex items-center justify-start mb-4 font-bold ps-3 gap-3">
      <!--circle-->
      <div
        class="w-5 h-5 border-2 rounded-full bg-zinc-500/10"
        :class="chooseBorderColor"
      ></div>
      <h3>{{ props.title }}</h3>
    </div>
    <div class="flex flex-col gap-2 h-[400px] overflow-scroll">
      <slot />
    </div>
  </div>
</template>
