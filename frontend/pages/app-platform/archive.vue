<script setup>
import { useAuthStore } from "~/store/auth";
import { useProjectPoolStore } from "~/store/projectPool";

import useCustomFetch from "~/composable/useCustomFetch";

const router = useRouter();
const authStore = useAuthStore();
const projectPoolStore = useProjectPoolStore();

if (!authStore.isLogin || !authStore.userInfo.roleVerified) {
  router.push("/");
}

const { fetch: fetchArchive, isLoading: isArcLoading } = useCustomFetch(
  "/api/v1/archive/getArchives"
);
onMounted(async () => {
  const response = await fetchArchive(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    {
      userId: authStore.userInfo.id,
    },
    null,
    "GET"
  );
  projectPoolStore.archives = response;
});
</script>
<template>
  <h3 class="flex items-center gap-3 text-xl">
    <Icon name="mdi:archive-arrow-down" class="w-8 h-8" />
    我的收藏
  </h3>
  <ProjectPost
    v-for="project in projectPoolStore.archives"
    :key="project.id"
    :project="project"
  />
</template>
