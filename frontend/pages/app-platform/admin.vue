<script setup>
const tabs = [
  {
    label: "使用者",
  },
  {
    label: "提案",
  },
];
const router = useRouter();
const currentTab = ref("使用者管理");

const onTabChange = async (index) => {
  const tab = tabs[index];
  currentTab.value = tab.label;
  if (currentTab.value === "使用者") {
    router.push("/app-platform/admin/users");
  } else if (currentTab.value === "提案") {
    router.push("/app-platform/admin/projects");
  }
};
</script>
<template>
  <div class="w-full">
    <UTabs :items="tabs" @change="onTabChange" class="mb-4" />
    <NuxtPage />
  </div>
</template>
