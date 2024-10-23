<script setup>
import { useAuthStore } from "~/store/auth";

const props = defineProps({
  items: Array,
});

const emit = defineEmits(["click"]);

const hover = ref(false);

const authStore = useAuthStore();

const navigationItems = computed(() => {
  return props.items.filter((item) => {
    return item.path && item.rule;
  });
});
const functionalItems = computed(() => {
  return props.items.filter((item) => {
    return !item.path && item.rule;
  });
});
</script>
<template>
  <Transition name="slide-fade">
    <div
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="hover ? 'md:w-56 ease-linear' : ''"
      class="bottom-0 md:top-0 left-0 h-16 md:h-full w-full md:w-20 flex md:flex-col items-center justify-center border-t md:border-r border-gray-500/50 px-2 bg-black fixed overflow-y-scroll z-[2]"
    >
      <NuxtLink
        to="/app-platform/projects"
        external
        class="items-center justify-start hidden w-full text-2xl text-white ps-4 md:flex"
      >
        <img
          src="/public/favicon.png"
          alt="logo"
          class="hidden w-8 h-8 rounded-md md:flex"
        />
        <h2 v-if="hover" class="font-light ps-4">
          Idea<span class="text-violet-500">Sync</span>
        </h2>
      </NuxtLink>
      <div
        class="flex items-center justify-center w-full pt-4 pb-2 h-4/5 md:flex-col"
      >
        <ul
          class="flex items-center justify-start w-full h-full pt-4 pb-2 mb-2 md:flex-col md:overflow-y-scroll"
        >
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.name"
            class="py-1 mb-2 transition duration-300 ease-in-out rounded-lg w-14 md:w-full hover:bg-zinc-800 focus:outline-none"
            :to="item.path"
            @click="toggler = false"
          >
            <BarItem
              :name="item.name"
              :icon="item.icon"
              :isTextVisible="hover"
            />
          </NuxtLink>
          <button
            v-for="item in functionalItems"
            :key="item.name"
            class="py-1 mb-2 transition duration-300 ease-in-out rounded-lg w-14 md:w-full hover:bg-zinc-800 focus:outline-none"
            @click="emit('click', item.name)"
          >
            <BarItem
              :name="item.name"
              :icon="item.icon"
              :isTextVisible="hover"
            />
          </button>
        </ul>

        <div
          class="items-center justify-start hidden w-20 gap-4 pb-2 bg-black rounded-full ps-3 md:flex md:w-full h-14 md:translate-y-14"
        >
          <NuxtImg
            v-if="!hover"
            :src="authStore.userInfo.avatarUrl"
            alt="user-avatar"
            class="w-0 rounded-full md:w-10 md:h-10"
          />
          <AvatarCard
            v-if="hover"
            :avatarURL="authStore.userInfo.avatarUrl"
            :username="authStore.userInfo.nickName"
            :email="authStore.userInfo.email"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
