<script setup>
import { useProjectPoolStore } from "~/store/projectPool";
import { useAuthStore } from "~/store/auth";
import useCustomFetch from "~/composable/useCustomFetch";
const projectPoolStore = useProjectPoolStore();
const authStore = useAuthStore();
const toast = useToast();
const { fetch: delFromArchive } = useCustomFetch(
  "/api/v1/archive/deleteArchive"
);
const { fetch: addArchive } = useCustomFetch("/api/v1/archive/addArchive");
const props = defineProps({
  project: Object,
});
const addToArchive = async () => {
  const response = await addArchive(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    {
      projectId: props.project.id,
      userId: authStore.userInfo.id,
    },
    null,
    "POST"
  );

  switch (response) {
    case "Archive added successfully":
      toast.add({
        title: "收納成功",
      });
      projectPoolStore.archives.push(props.project);
      break;

    default:
      break;
  }
};
const deleteFromArchive = async () => {
  const response = await delFromArchive(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    {
      projectId: props.project.id,
      userId: authStore.userInfo.id,
    },
    null,
    "DELETE"
  );

  switch (response) {
    case "Archive deleted successfully":
      toast.add({
        title: "已移出收納",
      });
      projectPoolStore.archives = projectPoolStore.archives.filter(
        (archive) => archive.id !== props.project.id
      );
      break;
    default:
      break;
  }
};
const checkIfArchiveProjectExist = (id) => {
  return (
    projectPoolStore.archives.filter((archive) => archive.id === id).length > 0
  );
};
</script>
<template>
  <Icon
    name="material-symbols:bookmark-remove-sharp"
    class="w-6 h-6"
    @click="deleteFromArchive"
    v-if="checkIfArchiveProjectExist(props.project.id)"
  />
  <Icon
    name="material-symbols:bookmark-add-outline-sharp"
    class="w-6 h-6"
    @click="addToArchive"
    v-if="!checkIfArchiveProjectExist(props.project.id)"
  />
</template>
