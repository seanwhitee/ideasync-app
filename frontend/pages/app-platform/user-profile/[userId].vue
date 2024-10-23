<script setup>
import ProfileForm from "~/components/form/profileForm.vue";
import useCustomFetch from "~/composable/useCustomFetch";
import { useProfileStore } from "~/composable/useProfileStore";
import { useAuthStore } from "~/store/auth";
import { useProjectStore } from "~/store/project";

const authStore = useAuthStore();
const projectStore = useProjectStore();
const router = useRouter();
const route = useRoute();
const isProfileEditable = ref(false);
const profile = computed(() => ({
  nickName: authStore.userInfo.nickName,
  profileDescription: authStore.userInfo.profileDescription,
}));

const toast = useToast();
const { userAcceptCount, userCommentCount } = useProfileStore(
  route.params.userId
);
const { fetch: updateUser, isLoading: updateLoading } = useCustomFetch(
  "/api/v1/users/updateUser"
);
const personalProjects = ref([]);

onMounted(async () => {
  personalProjects.value = await projectStore.getProjectByUserId(
    route.params.userId,
    false
  );
});
const updateProfile = async (data) => {
  const res = await updateUser(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    null,
    {
      ...authStore.userInfo,
      ...data,
    },
    "PATCH"
  );

  Object.assign(authStore.userInfo, res);
  toast.add({
    title: "更新成功",
    description: "個人檔案已更新",
  });
  isProfileEditable.value = false;
};
</script>
<template>
  <div class="w-full px-4 py-3 mx-auto md:w-11/12">
    <h3 class="mb-4 text-3xl font-bold text-white">個人檔案</h3>
    <div class="flex flex-col gap-4 md:flex-row">
      <UContainer
        class="flex flex-col w-full px-4 py-6 text-white rounded-md bg-zinc-900 md:w-1/2"
        ><span class="text-5xl font-bold">{{ userCommentCount ?? 0 }}</span
        ><span class="text-zinc-500">總留言數</span>
      </UContainer>
      <UContainer
        class="flex flex-col w-full px-4 py-6 text-white rounded-md bg-zinc-900 md:w-1/2"
        ><span class="text-5xl font-bold">{{ userAcceptCount ?? 0 }}</span
        ><span class="text-zinc-500">總錄取專案數</span>
      </UContainer>
    </div>
    <div class="flex flex-col justify-between w-full gap-6 pt-10 md:flex-row">
      <div class="flex flex-col w-full max-w-sm pt-10 font-light text-white">
        <NuxtImg
          :src="authStore.userInfo.avatarUrl"
          alt="user-img"
          class="mb-4 rounded-full"
        />
        <UBadge
          :label="mapRoleName(authStore.userInfo.roleName)"
          variant="soft"
          class="mb-2 w-fit"
          size="sm"
        />

        <!-- profile info -->
        <div v-if="!isProfileEditable" class="flex flex-col">
          <h2 class="text-3xl font-bold">{{ authStore.userInfo.nickName }}</h2>
          <p class="mb-6 text-sm text-white/50">
            {{ authStore.userInfo.email }}
          </p>
          <p class="mb-3">{{ authStore.userInfo.profileDescription }}</p>
          <UButton
            v-if="authStore.userInfo.id === route.params.userId"
            @click="isProfileEditable = true"
            color="white"
            class="flex justify-center px-3 py-2.5"
          >
            編輯個人檔案
          </UButton>
        </div>
        <ProfileForm
          v-else
          :defaultValues="profile"
          :isLoading="updateLoading"
          actionText="更新"
          @save="updateProfile"
        />
      </div>
      <div class="flex flex-col w-full max-w-sm gap-2">
        <h4 class="text-2xl">
          {{ personalProjects.length + " 則提案" }}
        </h4>
        <ProjectCard
          v-for="project in personalProjects"
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
  </div>
</template>
