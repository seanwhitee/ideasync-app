<script setup></script>
<template>
  <div
    class="relative z-10 justify-center hidden w-full md:flex animate-slidein"
  >
    <div
      class="fixed flex items-center justify-between w-10/12 px-6 py-1 border rounded-full shadow-lg box-border top-3 border-zinc-500/50"
    >
      <div class="flex items-center my-2 font-bold">
        <NuxtLink to="/" external class="flex items-center justify-center"
          ><img
            src="/public/favicon.png"
            class="w-8 rounded-lg me-3"
          />Idea<span class="text-violet-500">Sync</span>
        </NuxtLink>
      </div>
      <div class="flex items-center">
        <NuxtLink
          to="/signin"
          class="flex items-center justify-center px-4 py-2 cursor-pointer"
          >登入</NuxtLink
        >
        <NuxtLink to="/signup"
          ><button
            class="flex items-center px-4 py-2 text-xs font-bold rounded-full cursor-pointer bg-gradient-to-tr from-indigo-500 via-purple-500 to-purple-600 text-white/90 ring-1"
          >
            立即註冊
          </button></NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
