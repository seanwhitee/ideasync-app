<script setup>
import useCustomFetch from "~/composable/useCustomFetch";
import { useAuthStore } from "~/store/auth";
import { useProjectStore } from "~/store/project";

const props = defineProps({
  projectId: String,
  includePrivate: Boolean,
});
const isSettingOpen = defineModel();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const toast = useToast();

const projectDetail = ref({});
const setting = reactive({
  projectId: props.projectId,
  isPublic: undefined,
  statusName: "",
});
const { fetch: update, isLoading: updateIsLoading } = useCustomFetch(
  "/api/v1/project/updateSetting"
);
const updateSetting = async () => {
  await update(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    null,
    setting,
    "PATCH"
  ).then((r) => {
    projectDetail.value = r;
    toast.add({
      title: "成功",
      description: "專案設定已更新",
    });
  });
};
onMounted(async () => {
  projectDetail.value = await projectStore.getProjectById(
    authStore.userInfo.id,
    props.projectId,
    props.includePrivate
  );
  setting.isPublic = projectDetail.value.public;
  setting.statusName = projectDetail.value.status;
});
</script>

<template>
  <USlideover prevent-close v-model="isSettingOpen">
    <div class="flex justify-end w-full p-4">
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class=""
        @click="isSettingOpen = false"
      />
    </div>
    <div class="flex-col flex-1 px-6">
      <h3 class="mb-6 text-2xl font-bold text-zinc-300">專案設定</h3>
      <div class="flex items-center justify-start w-full">
        <label class="gap-2 cursor-pointer label">
          <span class="text-white label-text">是否公開</span>
          <span class="text-sm">否</span>
          <input
            v-model="setting.isPublic"
            :value="projectDetail.public"
            type="checkbox"
            class="toggle"
            checked
          />
          <span class="text-sm">是</span>
        </label>
      </div>
    </div>
    <div class="px-6 mb-6">
      <UButton
        @click="updateSetting"
        class="flex justify-center w-full py-3"
        color="black"
        ><p v-if="!updateIsLoading">儲存</p>
        <AppLoader v-else
      /></UButton>
    </div>
  </USlideover>
</template>
