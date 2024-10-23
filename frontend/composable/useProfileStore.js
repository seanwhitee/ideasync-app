import { useAuthStore } from "~/store/auth";
import useCustomFetch from "./useCustomFetch";

export const useProfileStore = (userId) => {
  const userCommentCount = ref(0);
  const userAcceptCount = ref(0);
  const authStore = useAuthStore();
  const { fetch: countComment } = useCustomFetch(
    "/api/v1/users/countUserComments"
  );
  const { fetch: countAccept } = useCustomFetch("/api/v1/users/countAccept");
  const { fetch: getUserDetail } = useCustomFetch("/api/v1/users/getDetail");
  onMounted(async () => {
    userCommentCount.value = await countUserComment(userId);
    userAcceptCount.value = await countUserAccept(userId);
    authStore.value = await getUser(userId);
  });

  const countUserComment = async (userId) => {
    const d = await countComment(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        userId: userId,
      },
      null,
      "GET"
    );
    return d;
  };

  const countUserAccept = async (userId) => {
    const d = await countAccept(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        userId: userId,
      },
      null,
      "GET"
    );
    return d;
  };

  const getUser = async (userId) => {
    const d = await getUserDetail(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        id: userId,
      },
      null,
      "GET"
    );
    return d;
  };
  return {
    userAcceptCount,
    userCommentCount,
    countUserAccept,
    countUserComment,
  };
};
