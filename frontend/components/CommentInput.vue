<script setup>
import { ref } from "vue";
import { useComment } from "~/composable/useComment";

const props = defineProps({
  userId: String,
  projectId: String,
  addComment: Function,
});
const handleClick = async (userId, projectId, text) => {
  await props.addComment(userId, projectId, text);
  comment.value = "";
};
const { comment } = useComment();
const isInputFocused = ref(false);
</script>
<template>
  <div class="flex flex-col w-full mb-10">
    <input
      type="text"
      v-model="comment"
      placeholder="Add a comment..."
      @click="isInputFocused = true"
      class="mb-2 bg-black border-b outline-none duration-300 ease-linear border-b-white/50 focus:border-b-white font-extralight"
    />
    <div class="flex items-center justify-end gap-2" v-if="isInputFocused">
      <button
        class="px-4 py-2 text-black bg-white rounded-full hover:opacity-90 w-fit"
        @click="isInputFocused = false"
      >
        <p class="text-sm w-fit">取消</p>
      </button>
      <button
        class="px-4 py-2 text-black bg-white rounded-full hover:opacity-90 w-fit"
        :class="!comment ? 'bg-zinc-600' : ''"
        @click="handleClick(props.userId, props.projectId, comment)"
        :disabled="!comment"
      >
        <p class="text-sm w-fit">留言</p>
      </button>
    </div>
  </div>
</template>
