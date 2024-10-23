<script setup>
const tabs = [
  {
    label: "我的專案",
  },
  {
    label: "已申請",
  },
];
const router = useRouter();
const currentTab = ref("我的專案");
router.push("/app-platform/manage-project/my-project");
const onTabChange = async (index) => {
  const tab = tabs[index];
  currentTab.value = tab.label;
  if (currentTab.value === "我的專案") {
    router.push("/app-platform/manage-project/my-project");
  } else if (currentTab.value === "已申請") {
    router.push("/app-platform/manage-project/applied-project");
  }
};
</script>
<template>
  <div class="w-full pt-10">
    <UTabs :items="tabs" @change="onTabChange" class="mb-4" />
    <NuxtPage />
  </div>
</template>
