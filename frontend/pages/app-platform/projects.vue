<script setup>
import useCustomFetch from "~/composable/useCustomFetch";
import { useAuthStore } from "~/store/auth";
import { useProjectPoolStore } from "~/store/projectPool";
import { useSearchStore } from "~/store/search";
const authStore = useAuthStore();
const searchStore = useSearchStore();
const projectPoolStore = useProjectPoolStore();

const router = useRouter();

projectPoolStore.selectedGroup = "member_recruiting";

const openSearch = ref(false);
const { fetch: fetchArc, isLoading: isArcLoading } = useCustomFetch(
  "/api/v1/archive/getArchives"
);

onMounted(async () => {
  await fetchProjects("member_recruiting");
  projectPoolStore.archives = await fetchArc(
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
});

async function fetchProjects(status) {
  projectPoolStore.getProjects(status);
}

const handleGroupChange = async (status) => {
  await fetchProjects(status);
};
</script>
<template>
  <UModal v-model="openSearch">
    <div class="p-4 bg-black">
      <AppSearchbar class="mb-2" />
      <div
        class="flex flex-col items-center justify-start w-full gap-2 h-[300px] overflow-y-scroll"
      >
        <ProjectCard
          v-for="project in searchStore.search"
          v-if="searchStore.search.length > 0"
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
        <div v-if="searchStore.search.length == 0 && !searchStore.isSearching">
          <p class="flex items-center justify-center gap-2 py-10 text-zinc-500">
            <span>Press</span>
            <UKbd>Enter</UKbd>
            <span>to search</span>
          </p>
        </div>
        <AppLoader v-if="searchStore.isSearching" />
      </div>
    </div>
  </UModal>
  <div class="flex justify-center w-full">
    <div
      class="fixed flex flex-col items-center w-11/12 md:w-[43rem] lg::w-[57rem] mx-auto z-[1]"
    >
      <div
        class="flex justify-between w-full px-4 py-2 mb-4 text-sm text-white border border-zinc-800 md:text-lg"
      >
        <button
          class="flex items-center justify-center w-1/2 px-4 py-2 duration-200 ease-linear"
          :class="{
            'bg-zinc-800':
              projectPoolStore.selectedGroup === 'member_recruiting',
          }"
          @click="
            (projectPoolStore.selectedGroup = 'member_recruiting'),
              handleGroupChange('member_recruiting')
          "
        >
          <p>學生招募</p>
        </button>
        <button
          class="flex items-center justify-center w-1/2 px-4 py-2 duration-200 ease-linear"
          :class="{
            'bg-zinc-800':
              projectPoolStore.selectedGroup === 'mentor_recruiting',
          }"
          @click="
            (projectPoolStore.selectedGroup = 'mentor_recruiting'),
              handleGroupChange('mentor_recruiting')
          "
        >
          <p>指導者招募</p>
        </button>
      </div>
      <button
        @click="openSearch = true"
        class="flex items-center justify-start w-full px-4 py-3 border cursor-pointer border-zinc-800"
      >
        <p class="flex items-center text-zinc-500">search...</p>
      </button>
    </div>
    <div
      v-if="!projectPoolStore.projectIsLoading"
      class="flex flex-col items-center justify-start gap-2 w-11/12 md:w-[43rem] lg::w-[57rem] mt-40"
    >
      <ProjectPost
        v-for="project in projectPoolStore.projects"
        :key="project.id"
        :project="project"
      />
    </div>
    <div
      v-if="projectPoolStore.projectIsLoading"
      class="flex flex-col items-center justify-start w-full mt-40"
    >
      <AppLoader />
    </div>
  </div>
</template>
