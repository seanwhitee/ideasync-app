<script setup>
import CompleteRecruitSlideOver from "./CompleteRecruitSlideOver.vue";
import ProjectSettingSlideOver from "./ProjectSettingSlideOver.vue";
const props = defineProps({
  projectId: String,
  status: String,
  title: String,
  text: String,
  openApplicantManageModal: Function,
  openProjectStatusChangeModal: Function,
});
const isSlideOverOpen = ref(false);
const isSettingOpen = ref(false);
const items = [
  [
    {
      label: "管理申請者",
      click: () => {
        props.openApplicantManageModal(true, props.projectId);
      },
      disabled: props.status === "complete",
    },
    {
      label: "切換狀態",
      click: () => {
        props.openProjectStatusChangeModal(true, props.projectId);
      },
    },
    {
      label: "團隊成員",
      click: () => {
        isSlideOverOpen.value = true;
      },
      disabled: props.status !== "complete",
    },
    {
      label: "專案設定",
      click: () => {
        isSettingOpen.value = true;
      },
    },
  ],
];
const router = useRouter();
</script>
<template>
  <CompleteRecruitSlideOver
    v-model="isSlideOverOpen"
    :projectId="props.projectId"
  />
  <ProjectSettingSlideOver
    v-model="isSettingOpen"
    :projectId="props.projectId"
    :include-private="true"
  />
  <div
    class="flex flex-col items-center justify-center w-full p-3 border bg-zinc-900 border-zinc-500/40"
  >
    <h3
      class="flex items-start justify-between w-full gap-2 mb-2 h-[24px] overflow-y-hidden"
    >
      <span
        @click="router.push(`/app-platform/project/${props.projectId}`)"
        class="w-full cursor-pointer"
        >{{ props.title }}</span
      >
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <div>
          <Icon name="ph:dots-three-outline-fill" />
        </div>
      </UDropdown>
    </h3>
    <p class="w-full h-10 overflow-hidden text-xs text-white/50">
      {{ props.text }}
    </p>
  </div>
</template>
