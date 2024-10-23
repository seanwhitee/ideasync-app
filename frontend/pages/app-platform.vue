<script setup>
import { useAuth } from "~/composable/useAuth";
import { useAuthStore } from "~/store/auth";
definePageMeta({
  colorMode: "dark",
});

const isAccountSwitchModalOpen = ref(false);

const authStore = useAuthStore();
const { logout } = useAuth();

const click = (name) => {
  if (name === "切換帳號") {
    isAccountSwitchModalOpen.value = true;
  } else if (name === "登出") {
    logout();
  }
};

const items = computed(() => [
  {
    name: "創建提案",
    icon: "ic:sharp-create",
    path: "/app-platform/create-project",
    rule: true,
  },
  {
    name: "瀏覽提案",
    icon: "material-symbols:visibility-rounded",
    path: "/app-platform/projects",
    rule: true,
  },
  {
    name: "管理提案",
    icon: "ic:sharp-folder",
    path: "/app-platform/manage-project/my-project",
    rule: true,
  },
  {
    name: "個人檔案",
    icon: "ic:baseline-account-circle",
    path: `/app-platform/user-profile/${authStore.userInfo.id}`,
    rule: true,
  },
  {
    name: "收藏",
    icon: "mdi:archive-arrow-down",
    path: "/app-platform/archive",
    rule: true,
  },
  {
    name: "儀表板",
    icon: "ic:baseline-space-dashboard",
    path: "/app-platform/admin/users",
    rule: authStore.userInfo.roleName === "admin",
  },
  {
    name: "切換帳號",
    icon: "mdi:account-switch-outline",
    rule: true,
  },
  {
    name: "登出",
    icon: "mdi:logout",
    rule: true,
  },
]);
</script>
<template>
  <UModal v-model="isAccountSwitchModalOpen">
    <div class="p-10">
      <h3 class="mb-2 text-2xl font-bold">切換帳號</h3>
      <p class="mb-6 text-sm text-zinc-500">輸入您的帳號密碼以切換帳號</p>
      <LoginForm />
    </div>
  </UModal>
  <AppSidebar :items="items" @click="click" />
  <div class="flex flex-col w-full gap-4 px-4 pt-4 pb-24 md:py-4 md:ps-24">
    <NuxtPage />
  </div>
</template>
