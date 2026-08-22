<script setup>
const props = defineProps({
  status: String,
});
</script>
<template>
  <div
    class="flex items-center justify-center px-4 py-1 text-xs border rounded-full gap-2 w-fit border-white/50 font-extralight"
  >
    <p
      :class="
        props.status === 'member_recruiting'
          ? 'font-bold border-b-white/70 border-b'
          : ''
      "
    >
      成員招募
    </p>
    <span>></span>
    <p
      :class="
        props.status === 'mentor_recruiting'
          ? 'font-bold border-b-white/70 border-b'
          : ''
      "
    >
      指導者招募
    </p>
    <span>></span>
    <p
      :class="
        props.status === 'complete'
          ? 'font-bold border-b-white/70 border-b'
          : ''
      "
    >
      完成招募
    </p>
  </div>
</template>
