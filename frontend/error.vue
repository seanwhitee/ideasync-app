<script setup>
const props = defineProps({
  error: Object,
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full py-52">
    <h1 class="px-20 py-10 text-8xl">{{ error.statusCode }}</h1>
		<p class="mb-10">{{ error.statusMessage }}</p>
    <NuxtLink to="/" class="py-5 border px-14 bg-zinc-950/50 border-zinc-900 rounded-xl">Go back home</NuxtLink>
  </div>
</template>
