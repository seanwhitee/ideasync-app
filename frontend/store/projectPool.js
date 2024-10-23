import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import useCustomFetch from "~/composable/useCustomFetch";

export const useProjectPoolStore = defineStore("projectPool", () => {
  const authStore = useAuthStore();

  const projects = ref([]);
  const archives = ref([]);
  const selectedGroup = ref("member_recruiting");
  const { fetch: fetchRecProj, isLoading: projectIsLoading } = useCustomFetch(
    "/api/v1/projectStatus/getRecommendProjectsByStatus"
  );
  const getProjects = async (status) => {
    await fetchRecProj(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        userId: authStore.userInfo.id,
        status: status,
      },
      null,
      "GET"
    ).then((data) => {
      projects.value = data;
    });
  };
  return {
    projects,
    archives,
    selectedGroup,
    projectIsLoading,
    getProjects,
  };
});
