<script setup>
import { ref } from "vue";

const router = useRouter();
const props = defineProps({
  project: Object,
});

const hoverEffect = ref(false);

const description = computed(() => {
  let text = props.project.description;
  if (text.length > 40) {
    text = text.slice(0, 40) + "...";
    return text;
  }
  return text;
});

const getApplicantCount = computed(() => {
  return props.project.applicants.length;
});

const tags = computed(() => {
  let projectTags = [...props.project.tags];
  if (projectTags.length > 3) {
    return projectTags.slice(0, 3);
  }
  return projectTags;
});

const title = computed(() => {
  let text = props.project.title;
  if (text.length > 20) {
    text = text.slice(0, 20) + "...";
    return text;
  }
  return text;
});
</script>
<template>
  <div
    class="flex items-start justify-between w-full px-4 py-4 bg-zinc-900"
    @mouseover="hoverEffect = true"
    @mouseleave="hoverEffect = false"
  >
    <div class="flex flex-col justify-between w-10/12 h-full">
      <div class="flex flex-col">
        <NuxtLink
          :to="`/app-platform/project/${props.project.id}`"
          class="text-base font-bold text-white duration-200 ease-linear cursor-pointer md:text-2xl hover:bg-violet-500 w-fit"
          :class="
            hoverEffect
              ? 'border-b-4 border-violet-500 ease-linear duration-200'
              : 'border-0 ease-linear duration-300'
          "
        >
          {{ title }}
        </NuxtLink>

        <!--feature section contains allowApplicantsNum|applicantCount-->
        <div
          class="flex items-center gap-2 pt-1 mb-3 text-xs text-white md:text-sm"
        >
          <p>
            需求人數：{{ props.project.allowApplicantsNum }}
            <span class="z-0 opacity-50">｜</span>
          </p>
          <p>申請人數：{{ getApplicantCount }}</p>
        </div>
        <p
          class="py-1 text-xs font-thin text-white break-words pe-3 md:text-base"
        >
          {{ description }}
        </p>
      </div>

      <!--tags-->
      <div class="flex flex-wrap items-center w-full gap-2 py-1 pe-3">
        <AppTag :tagName="props.project.school" color="fuchsia" />
        <AppTag
          v-if="props.project.graduationProject"
          tagName="畢業專題"
          color="indigo"
        />
        <AppTag v-for="tag in tags" :key="tag" :tagName="tag" color="violet" />
      </div>
    </div>

    <div class="flex flex-col items-end px-2 py-2">
      <NuxtImg
        :src="props.project.images[0]"
        :alt="props.project.images[0]"
        class="hidden w-20 h-20 mb-2 md:flex md:h-28 md:w-28"
      />

      <ArchiveButton :project="props.project" />
    </div>
  </div>
</template>
