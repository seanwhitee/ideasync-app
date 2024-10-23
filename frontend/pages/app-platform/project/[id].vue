<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/store/auth";
import { useProjectStore } from "~/store/project";
import { useComment } from "~/composable/useComment";
import { formatDate } from "~/utils/formatDate";
import useCustomFetch from "~/composable/useCustomFetch";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const toast = useToast();
const { commentChuncks, addComment, addReply } = useComment();
const { fetch: getProjectDetail } = useCustomFetch(
  "/api/v1/project/getProjectById"
);
const { fetch: add } = useCustomFetch("/api/v1/applicant/addApplicant");
const { fetch: deleteAppli } = useCustomFetch(
  "/api/v1/applicant/deleteApplicant"
);

const avatarURL = ref("");
const username = ref("");
const email = ref("");
const applyButtonName = ref("申請");
const getApplicantCount = computed(() => {
  return projectStore.applicants.length;
});

onMounted(async () => {
  await getProjectDetail(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    {
      userId: authStore.userInfo.id,
      projectId: route.params.id,
      includePrivate: false,
    },
    null,
    "GET"
  )
    .then((response) => {
      projectStore.hostId = response.hostUser.id;
      projectStore.title = response.title;
      projectStore.description = response.description;
      projectStore.status = response.status;
      projectStore.isGraduationProject = response.graduationProject;
      projectStore.school = response.school;
      projectStore.allowApplicantsNum = response.allowApplicantsNum;
      projectStore.projectImages = response.images;
      projectStore.tags = response.tags;
      projectStore.requireSkills = response.requireSkills;
      projectStore.createAt = formatDate(response.createAt);
      projectStore.isPublic = response.public;
      commentChuncks.value = response.commentChunks;
      projectStore.applicants = response.applicants;
      if (
        projectStore.applicants.find(
          (applicant) => applicant.user.id === authStore.userInfo.id
        )
      ) {
        applyButtonName.value = "取消申請";
      }

      avatarURL.value = response.hostUser.avatarUrl;
      username.value = response.hostUser.nickName;
      email.value = response.hostUser.email;
    })
    .then(() => {
      const currProjectId = route.params.id;
      projectStore.getRelatedProjects(currProjectId);
    });
});

const handleAdd = async () => {
  const res = await add(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    {
      projectId: route.params.id,
      userId: authStore.userInfo.id,
    },
    null,
    "POST"
  );
  switch (res) {
    case "User is already an applicant":
      toast.add({
        title: "此專案已經申請",
      });
      break;
    case "Applicant added successfully":
      toast.add({
        title: "申請送出，等待審核",
      });
      projectStore.applicants.push(authStore.userInfo);
      applyButtonName.value = "取消申請";
      break;
    default:
      break;
  }
};
const handleDelete = async () => {
  const res = await deleteAppli(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    {
      projectId: route.params.id,
      userId: authStore.userInfo.id,
    },
    null,
    "DELETE"
  );
  switch (res) {
    case "Applicant deleted successfully":
      toast.add({
        title: "取消申請成功",
      });
      projectStore.applicants.splice(
        projectStore.applicants.findIndex(
          (user) => user.id === authStore.userInfo.id
        ),
        1
      );
      applyButtonName.value = "申請";
      break;
    default:
      break;
  }
};
</script>
<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-between w-full gap-2">
      <div class="flex flex-col items-start w-full gap-6 md:w-6/12">
        <ProjectStatusVisualizer class="" :status="projectStore.status" />
        <div class="flex flex-col items-start justify-center p-1">
          <NuxtImg
            :src="projectStore.projectImages[0]"
            alt="project-image"
            class="flex rounded-md w-14 h-14"
          />
          <h1 class="text-2xl font-bold">
            <Icon
              v-if="!projectStore.isPublic"
              name="ic:outline-disabled-visible"
              class="w-6 h-6"
            />
            <p>{{ projectStore.title }}</p>
          </h1>
          <p class="text-xs opacity-50 font-extralight">
            {{ projectStore.createAt }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <AvatarCard
            @click="
              router.push(`/app-platform/user-profile/${projectStore.hostId}`)
            "
            class="hover:cursor-pointer"
            :avatarURL="avatarURL"
            :username="username"
            :email="email"
          />
          <button
            v-if="
              projectStore.hostId !== authStore.userInfo.id &&
              ((projectStore.status === 'member_recruiting' &&
                authStore.userInfo.roleName === 'creator' &&
                authStore.userInfo.allowProjectApply) ||
                (projectStore.status === 'mentor_recruiting' &&
                  authStore.userInfo.roleName === 'mentor' &&
                  authStore.userInfo.allowProjectApply))
            "
            @click="applyButtonName === '申請' ? handleAdd() : handleDelete()"
            class="flex items-center justify-center px-6 py-4 text-sm font-light text-black bg-white rounded-md h-3/5"
            :class="applyButtonName === '申請' ? '' : 'text-red-500'"
          >
            {{ applyButtonName }}
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex gap-3">
            <Icon name="material-symbols:school-rounded" class="w-5 h-5" />
            <p class="">{{ projectStore.school }}</p>
          </div>
          <p>需求人數：{{ projectStore.allowApplicantsNum }}</p>
          <p>申請人數：{{ getApplicantCount }}</p>
        </div>
        <div class="flex flex-wrap gap-1">
          <AppTag
            v-if="projectStore.isGraduationProject"
            tagName="畢業專題"
            color="indigo"
          />
          <AppTag
            v-for="tag in projectStore.tags"
            :key="tag"
            :tagName="tag"
            color="violet"
          />
        </div>
        <div class="flex flex-col">
          <h2 class="text-lg font-bold">所需技能：</h2>
          <p class="opacity-80">{{ projectStore.requireSkills }}</p>
        </div>
        <div class="flex flex-col gap-2 mb-10">
          <h2 class="text-lg font-bold">提案說明：</h2>
          <p class="opacity-80">{{ projectStore.description }}</p>
        </div>
      </div>
      <div class="flex-col hidden gap-2 md:flex lg:flex md:w-5/12">
        <ProjectCard
          v-for="project in projectStore.relatedProjects"
          @click="router.push(`/app-platform/project/${project.id}`)"
          :key="project.id"
          :status="project.status"
          :isGraduationProject="project.graduationProject"
          :title="project.title"
          :school="project.school"
          :allowApplicantsNum="project.allowApplicantsNum"
          :applicantCount="project.applicants.length"
          :tags="project.tags"
          :imageURL="project.images[0]"
        />
      </div>
    </div>
    <h2 class="mb-4 text-lg font-bold">{{ commentChuncks.length }} 則留言</h2>
    <div class="flex items-start justify-start w-full gap-2">
      <NuxtImg
        :src="authStore.userInfo.avatarUrl"
        alt="user-avatar"
        class="w-8 h-8 border border-white rounded-full"
      />
      <CommentInput
        :userId="authStore.userInfo.id"
        :projectId="route.params.id"
        :addComment="addComment"
      />
    </div>
    <CommentChunk
      v-for="chunk in commentChuncks"
      :key="chunk.id"
      :commentId="chunk.id"
      :avatarURL="chunk.avatarURL"
      :comment="chunk.text"
      :nickName="chunk.nickName"
      :date="formatDate(chunk.createAt)"
      :userId="authStore.userInfo.id"
      :projectId="route.params.id"
      :children="chunk.children"
      :addReply="addReply"
    />
  </div>
</template>
