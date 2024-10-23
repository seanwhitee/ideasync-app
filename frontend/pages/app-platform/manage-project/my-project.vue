<script setup>
import ApplicantStatusBadge from "~/components/kanban/ApplicantStatusBadge.vue";
import { useAuthStore } from "~/store/auth";
import { useProjectStore } from "~/store/project";

const projectStatus = [
  { name: "成員招募", status: "member_recruiting" },
  { name: "指導者招募", status: "mentor_recruiting" },
  { name: "完成招募", status: "complete" },
];

const manageApplicantTableColumns = [
  {
    key: "nickName",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "status",
    label: "狀態",
  },
  {
    key: "actions",
    label: "審核",
  },
];
const authStore = useAuthStore();
const projectStore = useProjectStore();
const toast = useToast();

// needs to be reactive because when kanban card status change,
// we need to move it to another column
const projects = ref([]);

// states for applicants manage modal
const openProjectStatusChangeModal = ref(false);
const openApplicantManageModal = ref(false);
const openApplicantConfirmModal = ref(false);

const changeToNextOrPrevious = ref("");
const nextStatus = ref("mentor_recruiting");
const previousStatus = ref("");
const applicants = ref([]);
const modalProjectId = ref("");
const projectInfo = ref({});
const applicantInfo = ref({});

onMounted(async () => {
  projects.value = await projectStore.getProjectByUserId(
    authStore.userInfo.id,
    true
  );
});

const rejectOrAccept = "";

const changeProjectStatus = async () => {
  let statusChangeTo = 0;
  if (changeToNextOrPrevious.value === "next") {
    statusChangeTo = nextStatus.value;
  } else if (changeToNextOrPrevious.value === "previous") {
    statusChangeTo = previousStatus.value;
  }
  const projectResponse = await projectStore.changeProjectStatus(
    modalProjectId.value,
    statusChangeTo,
    changeToNextOrPrevious.value
  );

  if (projectResponse) {
    projects.value = projects.value.map((project) => {
      if (project.id === projectResponse.id) {
        return projectResponse;
      } else {
        return project;
      }
    });
  }
};

const setOpenProjectStatusChangeModal = async (value, projectId) => {
  changeToNextOrPrevious.value = "";
  openProjectStatusChangeModal.value = value;
  modalProjectId.value = projectId;

  // get project info
  projectInfo.value = await projectStore.getProjectById(
    authStore.userInfo.id,
    projectId,
    true
  );

  applicants.value = projectInfo.value.applicants.map((applicant) => {
    const { id, nickName, email } = applicant.user;
    const status = applicant.status;
    return { id, nickName, email, status };
  });

  const projectStatus = projectInfo.value.status;
  nextStatus.value =
    projectStatus === "member_recruiting" ? "mentor_recruiting" : "complete";
  previousStatus.value =
    projectStatus === "complete" ? "mentor_recruiting" : "member_recruiting";
};

const setOpenApplicantManageModal = async (value, projectId) => {
  // set modal to open
  openApplicantManageModal.value = value;
  modalProjectId.value = projectId;

  // get project info
  projectInfo.value = await projectStore.getProjectById(
    authStore.userInfo.id,
    projectId,
    true
  );

  applicants.value = projectInfo.value.applicants.map((applicant) => {
    const { id, nickName, email } = applicant.user;
    const status = applicant.status;
    return { id, nickName, email, status };
  });
};

const findApplicantInfo = (applicatId) => {
  applicantInfo.value = applicants.value.find((applicant) => {
    return applicant.id === applicatId;
  });
  return applicantInfo.value;
};

const countAccepted = computed(() => {
  return applicants.value.filter((applicant) => applicant.status === 1).length;
});

const applicantAccept = async () => {
  const res = await projectStore.acceptApplicant(
    modalProjectId.value,
    applicantInfo.value.id
  );

  if (!res) {
    toast.add({ title: `接受 ${res.user.nickName} 之申請失敗` });
  } else {
    toast.add({ title: `接受 ${res.user.nickName} 之申請成功` });
    applicants.value = applicants.value.map((applicant) => {
      if (applicant.id === res.user.id) {
        const { id, nickName, email } = res.user;
        const status = res.status;
        return { id, nickName, email, status };
      }
      return applicant;
    });
  }
  openApplicantConfirmModal.value = false;
};

const applicantReject = async () => {
  const res = await projectStore.rejectApplicant(
    modalProjectId.value,
    applicantInfo.value.id
  );

  if (!res) {
    toast.add({ title: `拒絕 ${res.user.nickName} 申請失敗` });
  } else {
    toast.add({ title: `拒絕 ${res.user.nickName} 申請成功` });
    applicants.value = applicants.value.map((applicant) => {
      if (applicant.id === res.user.id) {
        const { id, nickName, email } = res.user;
        const status = res.status;
        return { id, nickName, email, status };
      }
      return applicant;
    });
  }
  openApplicantConfirmModal.value = false;
};

const allowChangeStatus = computed(() => {
  if (changeToNextOrPrevious.value === "next") {
    return (
      (projectInfo.value.status === "member_recruiting" &&
        projectInfo.value.allowApplicantsNum >= countAccepted.value &&
        applicants.value.every((applicant) => applicant.status !== 0)) ||
      (projectInfo.value.status === "mentor_recruiting" &&
        countAccepted.value === 1 &&
        applicants.value.every((applicant) => applicant.status !== 0))
    );
  } else if (changeToNextOrPrevious.value === "previous") {
    return true;
  }
  return false;
});
</script>
<template>
  <!--change status model-->
  <UModal v-model="openProjectStatusChangeModal">
    <div class="p-10">
      <h4 class="mb-4 text-2xl font-bold">變更專案狀態</h4>
      <p
        v-if="!allowChangeStatus"
        class="flex flex-col px-4 py-2 mb-4 text-xs text-yellow-300 border border-yellow-500 border-dotted bg-yellow-500/50"
      >
        <Icon
          class="w-6 h-6 text-yellow-300"
          name="material-symbols-light:warning-outline"
        />
        <span> 1. 如果為成員招募：請確認申請者都已審核完成 </span>
        <span>
          2. 如果為指導者招募：請確認已找到一位指導者&申請者都已審核完成
        </span>
      </p>
      <div class="flex items-center justify-between mb-10">
        <UButton
          v-if="projectInfo.status !== 'member_recruiting'"
          class="w-[210px]"
          size="lg"
          :color="changeToNextOrPrevious === 'previous' ? 'gray' : 'white'"
          @click="changeToNextOrPrevious = 'previous'"
          >{{
            previousStatus === "mentor_recruiting" ? "指導者招募" : "成員招募"
          }}</UButton
        >
        <UButton
          v-if="projectInfo.status !== 'complete'"
          class="w-[210px]"
          size="lg"
          :color="changeToNextOrPrevious === 'next' ? 'gray' : 'white'"
          @click="changeToNextOrPrevious = 'next'"
          >{{
            nextStatus === "mentor_recruiting" ? "指導者招募" : "完成招募"
          }}</UButton
        >
      </div>
      <UButton
        :disabled="!changeToNextOrPrevious || !allowChangeStatus"
        @click="changeProjectStatus(), (openProjectStatusChangeModal = false)"
        >確認變更</UButton
      >
    </div>
  </UModal>

  <!--applicant manage confirm modal-->
  <UModal v-model="openApplicantConfirmModal">
    <div class="p-10">
      <div class="flex items-center justify-between">
        <h4 class="mb-2 text-2xl font-bold">
          確認{{ rejectOrAccept }}{{ applicantInfo.nickName }}
        </h4>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="openApplicantConfirmModal = false"
        />
      </div>
      <p class="mb-10 text-sm text-zinc-500">按下確認將不得再次修改此筆申請</p>
      <UButton
        @click="
          rejectOrAccept === '接受' ? applicantAccept() : applicantReject()
        "
        >確認{{ rejectOrAccept }}</UButton
      >
    </div>
  </UModal>

  <!--applicant manage modal-->
  <UModal v-model="openApplicantManageModal" prevent-close>
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="mb-2 text-2xl font-bold">申請者</h4>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="openApplicantManageModal = false"
        />
      </div>
      <p class="mb-10 text-sm text-zinc-500">接受或拒絕申請者加入專案</p>
      <!--get require and accept-->
      <div class="flex w-full gap-4 mb-6 text-zinc-500">
        <UContainer class="w-1/2 px-4 py-6 border border-zinc-800 rounded-xl"
          >需求人數<span class="font-mono text-xl ps-2">{{
            projectInfo.status === "member_recruiting"
              ? projectInfo.allowApplicantsNum
              : 1
          }}</span>
        </UContainer>
        <UContainer
          class="w-1/2 px-4 py-6 border border-green-800/50 rounded-xl"
          >錄取人數<span class="font-mono text-xl ps-2">{{
            countAccepted
          }}</span></UContainer
        >
      </div>
      <UTable
        :columns="manageApplicantTableColumns"
        :rows="applicants"
        class="border border-zinc-500/50"
      >
        <template #nickName-data="{ row }">
          <NuxtLink :to="'/app-platform/user-profile/' + row.id">{{
            row.nickName.length > 7
              ? row.nickName.slice(0, 7) + "..."
              : row.nickName
          }}</NuxtLink>
        </template>
        <template #email-data="{ row }">
          {{
            row.email.length > 15 ? row.email.slice(0, 15) + "..." : row.email
          }}
        </template>
        <template #status-data="{ row }">
          <ApplicantStatusBadge :applicantStatus="row.status" />
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-3" v-if="row.status === 0">
            <button
              v-if="
                (projectInfo.status === 'member_recruiting' &&
                  projectInfo.allowApplicantsNum > countAccepted) ||
                (projectInfo.status === 'mentor_recruiting' &&
                  countAccepted < 1)
              "
              @click="
                (openApplicantConfirmModal = true),
                  (rejectOrAccept = '接受'),
                  (applicantInfo = findApplicantInfo(row.id))
              "
              class="bg-white shadow-lg px-2 py-0.5 rounded-md text-xs text-green-800 border border-green-800"
            >
              接受
            </button>
            <button
              @click="
                (openApplicantConfirmModal = true),
                  (rejectOrAccept = '拒絕'),
                  (applicantInfo = findApplicantInfo(row.id))
              "
              class="bg-white shadow-lg px-2 py-0.5 rounded-md text-xs text-red-800 border border-red-800"
            >
              拒絕
            </button>
          </div>
          <AppTag v-else tag-name="已審核" color="indigo" />
        </template>
      </UTable>
    </div>
  </UModal>

  <!--kanban-->
  <div
    class="flex flex-col items-center w-full gap-4 px-4 py-10 overflow-auto bg-white md:flex-row dark:bg-zinc-900"
  >
    <KanbanColumn v-for="s in projectStatus" :title="s.name" :key="s.status">
      <KanbanCard
        v-for="p in projects.filter((p) => p.status === s.status)"
        :key="p.id"
        :projectId="p.id"
        :status="p.status"
        :title="p.title"
        :text="p.description"
        :openApplicantManageModal="setOpenApplicantManageModal"
        :openProjectStatusChangeModal="setOpenProjectStatusChangeModal"
      />
    </KanbanColumn>
  </div>
</template>
