import { defineStore } from "pinia";
import useCustomFetch from "~/composable/useCustomFetch";
import { useAuthStore } from "./auth";

export const useSearchStore = defineStore("search", () => {
  const isSearching = ref(false);
  const searchString = ref("");
  const { fetch: searchProj } = useCustomFetch("/api/v1/project/search");
  const authStore = useAuthStore();

  const startSearch = async (searchString) => {
    if (!searchString) return;
    isSearching.value = true;
    try {
      await searchProj(
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token.accessToken}`,
        },
        {
          searchString: searchString,
        },
        null,
        "GET"
      ).then((res) => {
        search.value = [...res];
        isSearching.value = false;
      });
    } catch (error) {
      isSearching.value = false;
      console.error(error);
    }
  };

  // list of projects
  const search = ref([]);
  return {
    startSearch,
    searchString,
    isSearching,
    search,
  };
});
