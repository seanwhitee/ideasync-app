<template>
  <CompleteRecruitSlideOver
    v-if="slideOverSetting.isOpen"
    v-model="slideOverSetting.isOpen"
    :project-id="slideOverSetting.projectId"
    :include-private="true"
  />
  <UTable
    :columns="tableColumns"
    :rows="tableData"
    :loading="projectsLoading"
    class="border border-zinc-500/50"
  >
    <template #loading-state>
      <div class="flex items-center justify-center h-32">
        <i class="loader --6" />
      </div>
    </template>
    <template #status-data="{ row }">
      <UDropdown
        :items="[
          [
            {
              label: '成員招募',
              click: async () =>
                await updateProject({
                  ...row,
                  statusName: 'member_recruiting',
                  projectId: row.id,
                }),
            },
            {
              label: '指導者招募',
              click: async () =>
                await updateProject({
                  ...row,
                  statusName: 'mentor_recruiting',
                  projectId: row.id,
                }),
            },
            {
              label: '完成招募',
              click: async () =>
                await updateProject({
                  ...row,
                  statusName: 'complete',
                  projectId: row.id,
                }),
            },
          ],
        ]"
      >
        <AppTag :tag-name="mapProjectStatus(row.status)" color="violet" />
      </UDropdown>
    </template>

    <template #title-data="{ row }">
      <NuxtLink :to="'/app-platform/project/' + row.id">
        <div class="flex items-center gap-2 pe-4">
          <NuxtImg
            :src="row.image"
            alt="project-img"
            class="w-10 h-10 rounded-md"
          />
          <UTooltip :text="row.description">
            <p class="px-2">
              {{ row.title }}
            </p>
          </UTooltip>
        </div>
      </NuxtLink>
    </template>
    <template #hostuser-data="{ row }">
      <UTooltip :text="row.hostuser.nickName">
        <p>{{ row.hostuser.email }}</p>
      </UTooltip>
    </template>
    <template #public-data="{ row }">
      <UDropdown
        :items="[
          [
            {
              label: '公開',
              click: async () =>
                await updateProject({
                  ...row,
                  public: true,
                  projectId: row.id,
                }),
            },
            {
              label: '私人',
              click: async () =>
                await updateProject({
                  ...row,
                  public: false,
                  projectId: row.id,
                }),
            },
          ],
        ]"
      >
        <AppTag :tag-name="row.public ? '公開' : '私人'" color="green" />
      </UDropdown>
    </template>
    <template #detail-data="{ row }">
      <UButton color="white" @click="setSlideOverOpen(row.id)"
        >團隊資訊</UButton
      >
    </template>
  </UTable>
</template>
<script setup>
import CompleteRecruitSlideOver from "~/components/kanban/CompleteRecruitSlideOver.vue";
import useCustomFetch from "~/composable/useCustomFetch";
import { useAuthStore } from "~/store/auth";
const authStore = useAuthStore();
const { fetch: getProjects, isLoading: projectsLoading } = useCustomFetch(
  "/api/v1/project/getProjects"
);
const projectList = ref([]);
const slideOverSetting = reactive({
  isOpen: false,
  projectId: "",
});
const { fetch: updateSetting } = useCustomFetch(
  "/api/v1/project/updateSetting"
);
const toast = useToast();
const router = useRouter();
onMounted(async () => {
  projectList.value = await getProjects(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    null,
    null,
    "GET"
  );
});
const tableColumns = [
  {
    key: "title",
    label: "專案名稱",
  },
  {
    key: "status",
    label: "狀態",
  },
  {
    key: "hostuser",
    label: "提案者",
  },
  {
    key: "public",
    label: "公開",
  },
  {
    key: "createAt",
    label: "創建時間",
  },
  {
    key: "detail",
    label: "",
  },
];
const updateProject = async (data) => {
  await updateSetting(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    null,
    data,
    "PATCH"
  ).then((d) => {
    projectList.value = projectList.value.map((p) => {
      return p.id === d.id
        ? {
            ...p,
            status: d.status,
            public: d.public,
          }
        : p;
    });
    toast.add({
      title: "成功",
      description: "使用者狀態已更新",
    });
  });
};

const setSlideOverOpen = (projectId) => {
  slideOverSetting.isOpen = true;
  slideOverSetting.projectId = projectId;
};

const tableData = computed(() => {
  const t = projectList.value.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    image: p.images[0],
    hostuser: p.hostUser,
    description: p.description,
    public: p.public,
    createAt: new Date(p.createAt).toISOString().split("T")[0],
  }));
  return t;
});
</script>
