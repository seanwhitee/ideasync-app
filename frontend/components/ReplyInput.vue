<script setup>
import { useComment } from "~/composable/useComment";
import { useAuthStore } from "~/store/auth";

const props = defineProps({
  userId: String,
  projectId: String,
  parentId: String,
  addReply: Function,
});
const handleClick = async (parentId, userId, projectId, text) => {
  await props.addReply(parentId, userId, projectId, text);
  comment.value = "";
};
const authStore = useAuthStore();
const isReplyInputFocus = defineModel();

const { comment } = useComment();
</script>
<template>
  <div class="flex items-start w-full gap-2 pt-5" v-if="isReplyInputFocus">
    <NuxtImg
      :src="authStore.userInfo.avatarUrl"
      alt="user-avatar"
      class="w-6 h-6 border border-white rounded-full"
    />
    <div class="flex flex-col w-full">
      <input
        type="text"
        v-model="comment"
        placeholder="Add a reply..."
        class="mb-2 text-sm duration-300 ease-linear bg-black border-b outline-none border-b-white/50 font-extralight focus:border-b-white"
      />
      <div class="flex items-center justify-end gap-2">
        <button
          class="px-4 py-2 text-black bg-white rounded-full hover:opacity-90 w-fit"
          @click="isReplyInputFocus = false"
        >
          <p class="text-sm w-fit">取消</p>
        </button>
        <button
          class="px-4 py-2 text-black bg-white rounded-full hover:opacity-90 w-fit"
          :class="!comment ? 'bg-zinc-600' : ''"
          @click="
            handleClick(props.parentId, props.userId, props.projectId, comment)
          "
          :disabled="!comment"
        >
          <p class="text-sm w-fit">回覆</p>
        </button>
      </div>
    </div>
  </div>
</template>
