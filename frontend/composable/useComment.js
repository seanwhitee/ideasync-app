import { useAuthStore } from "~/store/auth";
import useCustomFetch from "./useCustomFetch";

export const useComment = () => {
  const commentChuncks = ref([]);
  const comment = ref("");
  const authStore = useAuthStore();
  const { fetch: add } = useCustomFetch("/api/v1/comment/addComment");
  const { fetch: replyComment } = useCustomFetch("/api/v1/comment/addReply");

  const addComment = async (userId, projectId, text) => {
    try {
      const commentChunk = await add(
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token.accessToken}`,
        },
        {
          userId: userId,
          projectId: projectId,
          text: text,
        },
        null,
        "POST"
      );
      if (commentChunk) {
        commentChuncks.value.push(commentChunk);
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const addReply = async (parentId, userId, projectId, text) => {
    try {
      const reply = await replyComment(
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token.accessToken}`,
        },
        {
          userId: userId,
          projectId: projectId,
          text: text,
          parentId: parentId,
        },
        null,
        "POST"
      );
      if (reply) {
        const commentChunk = commentChuncks.value.find((commentChunk) => {
          return commentChunk.id === parentId;
        });
        commentChunk.children.push(reply);
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return {
    commentChuncks,
    comment,
    addComment,
    addReply,
  };
};
