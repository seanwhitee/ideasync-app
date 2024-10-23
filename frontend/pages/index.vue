<script setup>
import MenuNav from "~/components/MenuNav.vue";

const featuresData = [
  {
    title: "撰寫提案",
  },
  {
    title: "招募成員",
  },
  {
    title: "找尋指導者",
  },
  {
    title: "完成專案招募",
  },
];
const menuItems = [
  {
    name: "登入",
    path: "/signin",
  },
  {
    name: "立即註冊",
    path: "/signup",
  },
];
const isMenuOpen = ref(false);
</script>
<template>
  <AppNavbar />
  <MenuNav :items="menuItems" v-model="isMenuOpen" />
  <GradientFog />
  <div class="w-full pt-48 bg-white border-b section-1">
    <div
      class="flex flex-col items-start w-full gap-4 px-10 mb-10 text-4xl text-zinc-500 animate-slidein md:items-center md:text-6xl"
    >
      <p>尋找專題成員</p>
      <p class="text-start md:text-center">
        使用Idea<span
          class="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 via-purple-500 to-white/80"
          >Sync</span
        >打造你的專屬團隊
      </p>
    </div>

    <p
      class="px-10 text-base font-light animate-slidein md:text-xl text-start md:text-center"
    >
      專題人員招募系統 從提案發想 收集反饋到專案招募 一站式解決
    </p>
  </div>

  <div class="relative pt-[30rem] md:pt-[20rem] lg:pt-[20rem]">
    <div class="bg-black custom-shape-divider-top-1723259880">
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          class="hidden shape-fill md:block lg:block"
        ></path>
      </svg>

      <div
        class="flex flex-col w-full px-4 py-20 md:flex-row md:px-32 md:py-40"
      >
        <div class="flex flex-col w-1/2 gap-2">
          <div
            v-for="feature in featuresData"
            class="flex items-center gap-2"
            :key="feature.title"
          >
            <Icon
              name="mdi:check-circle-outline"
              style="width: 2rem; height: fit-content"
              :class="feature.title === '完成專案招募' ? 'text-violet-500' : ''"
            ></Icon>
            <p class="text-xl md:text-2xl">
              {{ feature.title }}
            </p>
          </div>
        </div>
        <div class="w-full mt-20 md:w-1/2 lg:w-1/2 md:mt-0">
          <p class="text-4xl md:text-5xl">找尋夥伴從未如此簡單</p>
          <NuxtLink to="/signin"
            ><UButton
              color="primary"
              size="xl"
              variant="soft"
              class="px-6 mt-10 rounded-full"
            >
              <p class="flex items-center justify-center gap-2 h-fit">
                開始使用
                <Icon
                  name="mdi:arrow-right"
                  style="width: 1rem; height: fit-content"
                />
              </p>
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-shape-divider-top-1723259880 {
  position: absolute;
  /* top: 0;
  left: 0; */
  bottom: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.custom-shape-divider-top-1723259880 svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 83px;
}
.custom-shape-divider-top-1723259880 .shape-fill {
  fill: white;
}
.section-1 {
  height: 100vh;
}
</style>
