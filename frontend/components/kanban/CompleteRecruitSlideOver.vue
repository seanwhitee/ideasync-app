<script setup>
import { useAuthStore } from "~/store/auth";
import { useProjectStore } from "~/store/project";

const props = defineProps({
  projectId: String,
  disabled: Boolean,
  includePrivate: Boolean,
});
const memberTableColumn = [
  {
    key: "nickName",
    label: "使用者",
  },
  {
    key: "email",
    label: "Email",
  },
];
const authStore = useAuthStore();
const projectDetail = reactive({
  allowApplicantsNum: undefined,
  applicants: [],
  commentChunks: [],
  createAt: "",
  description: "",
  graduationProject: undefined,
  hostUser: undefined,
  id: "",
  images: [],
  public: undefined,
  requireSkills: "",
  school: "",
  status: "",
  tags: [],
  title: "",
});
const projectStore = useProjectStore();
onMounted(async () => {
  const detail = await projectStore.getProjectById(
    authStore.userInfo.id,
    props.projectId,
    props.includePrivate
  );
  Object.assign(projectDetail, detail);
});

const teamPeoples = computed(() => {
  const applicants = projectDetail.applicants;

  if (!applicants) {
    return;
  }
  return {
    mentors: applicants
      .map((a) =>
        a.user.roleName === "mentor" && a.status === 1 ? a.user : null
      )
      .filter((user) => user),
    members: applicants
      .map((a) => (a.user.roleName === "creator" ? a.user : null))
      .filter((user) => user),
  };
});

const isSlideOverOpen = defineModel();
</script>

<template>
  <USlideover
    v-if="teamPeoples && projectDetail"
    prevent-close
    v-model="isSlideOverOpen"
  >
    <div class="pb-4 overflow-y-scroll">
      <div class="flex justify-end w-full p-4">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class=""
          @click="isSlideOverOpen = false"
        />
      </div>
      <div class="flex-col flex-1 px-6">
        <h3 class="mb-6 text-2xl font-bold text-zinc-300">
          {{ projectDetail.title }}
        </h3>

        <p class="mb-3 text-sm font-bold text-white">{{ "指導者" }}</p>
        <AvatarCard
          v-if="teamPeoples.mentors.length > 0"
          :avatarURL="teamPeoples.mentors[0].avatarUrl"
          :username="teamPeoples.mentors[0].nickName"
          :email="teamPeoples.mentors[0].email"
          class="px-2 py-1 mb-6 border rounded-md border-white/50 w-fit pe-4 bg-zinc-800"
        />
        <h4 class="mb-3 text-sm font-bold text-white">{{ "所需技能" }}</h4>
        <p class="mb-6 text-zinc-500">
          {{
            projectDetail.requireSkills.length > 100
              ? projectDetail.requireSkills.slice(0, 100) + "..."
              : projectDetail.requireSkills
          }}
        </p>
        <h4 class="mb-3 text-sm font-bold text-white">{{ "團隊成員" }}</h4>
        <UTable
          :rows="teamPeoples.members"
          :columns="memberTableColumn"
          class="h-[425px] overflow-scroll border rounded-md border-white/50"
        >
          <template #nickName-data="{ row }">
            <NuxtLink :to="'/app-platform/user-profile/' + row.id">
              {{ row.nickName }}</NuxtLink
            >
          </template>
        </UTable>
      </div>
    </div>
  </USlideover>
</template>
