<template>
  <div class="flex flex-col items-center justify-center gap-5 px-3 pt-48">
    <p class="text-3xl font-bold text-center md:text-6xl">Build your team</p>

    <p class="text-xs font-semibold text-center md:text-xl">
      Open source HR platform
    </p>

    <div class="flex items-center gap-2">
      <NuxtLink to="/signup"
        ><UButton trailing-icon="i-lucide-arrow-right"
          >Getting start</UButton
        ></NuxtLink
      >
    </div>
  </div>
</template>
<script setup lang="ts"></script>
