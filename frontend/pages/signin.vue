<script setup>
import LoginForm from "~/components/LoginForm.vue";
</script>
<template>
  <GradientFog />
  <div class="py-20 text-black md:py-32 lg:py-32 dark:text-white">
    <div
      class="flex flex-col items-start w-10/12 max-w-lg px-0 py-5 mx-auto bg-white md:px-10 md:w-1/2 lg:w-1/2 dark:bg-zinc-950 rounded-2xl md:py-20 lg:py-10"
    >
      <img
        src="/public/favicon.png"
        alt="favicon"
        class="w-20 mb-6 translate-x-4 shadow-xl rounded-3xl"
      />
      <div
        class="flex items-center justify-start w-full px-4 mb-8 text-lg font-semibold md:text-2xl lg:text-2xl"
      >
        <h1>登入</h1>
        <NuxtLink to="/" external
          >Idea<span class="text-violet-500" style="z-index: 1">Sync</span>
        </NuxtLink>
      </div>
      <div class="w-full p-4">
        <LoginForm />
      </div>
      <div
        class="flex justify-start w-full mt-4 text-xs pe-2 text-whit font-extralight"
      >
        <div class="flex items-center justify-center w-full gap-4">
          <NuxtLink to="/signup" class="hover:underline">註冊</NuxtLink>
          <!-- <span>|</span>
          <NuxtLink to="/forgot-password" class="hover:underline"
            >忘記密碼</NuxtLink
          > -->
        </div>
      </div>
    </div>
  </div>
</template>
