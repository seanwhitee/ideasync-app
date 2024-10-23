<script setup>
import ApplicantStatusBadge from "~/components/kanban/ApplicantStatusBadge.vue";
import { useAuthStore } from "~/store/auth";
import { useProjectStore } from "~/store/project";

const manageAppliedTableColumns = [
  {
    key: "title",
    label: "專案名稱",
  },
  {
    key: "host",
    label: "提案人",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "projectStatus",
    label: "專案狀態",
  },
  {
    key: "applicantStatus",
    label: "申請狀態",
  },
];
const authStore = useAuthStore();
const projectStore = useProjectStore();
const router = useRouter();
const projects = ref([]);

onMounted(async () => {
  projects.value = await projectStore.getProjectAppliedByUser(
    authStore.userInfo.id
  );
});

const getProjectAppliedTableData = computed(() => {
  return projects.value.map((p) => {
    const applicant = p.applicants.find((applicant) => {
      return applicant.user.id === authStore.userInfo.id;
    });

    if (!applicant) {
      return {
        id: null,
        title: "",
        host: "",
        email: "",
        projectStatus: null,
        applicantStatus: null,
      };
    }

    return {
      id: p.id,
      title: p.title,
      host: p.hostUser.nickName,
      email: p.hostUser.email,
      projectStatus: p.status,
      applicantStatus: applicant.status,
    };
  });
});
</script>
<template>
  <UTable
    :columns="manageAppliedTableColumns"
    :rows="getProjectAppliedTableData"
    class="w-full px-1 bg-white border rounded-md dark:bg-black border-zinc-500/50"
  >
    <template #title-data="{ row }">
      <p
        class="cursor-pointer"
        @click="router.push(`/app-platform/project/${row.id}`)"
      >
        {{ row.title.length > 30 ? row.title.slice(0, 30) + "..." : row.title }}
      </p>
    </template>
    <template #projectStatus-data="{ row }">
      <AppTag
        v-if="row.projectStatus === 'member_recruiting'"
        color="slate"
        tag-name="成員招募"
      />
      <AppTag
        v-if="row.projectStatus === 'mentor_recruiting'"
        color="slate"
        tag-name="指導者招募"
      />
      <AppTag
        v-if="row.projectStatus === 'complete'"
        color="slate"
        tag-name="完成招募"
      />
    </template>
    <template #applicantStatus-data="{ row }">
      <ApplicantStatusBadge :applicant-status="row.applicantStatus" />
    </template>
  </UTable>
</template>
