<script setup>
import { formatDate } from "~/utils/formatDate";
const props = defineProps({
  commentId: String,
  avatarURL: String,
  comment: String,
  nickName: String,
  date: String,
  children: Array,
  userId: String,
  projectId: String,
  addReply: Function,
});
const replyShow = ref(false);
const isReplyInputFocus = ref(false);
</script>
<template>
  <div class="flex items-start w-full gap-2 mb-4">
    <NuxtImg
      :src="props.avatarURL"
      class="w-8 h-8 border border-white rounded-full"
    />
    <div class="flex flex-col w-full">
      <p class="flex items-center gap-2">
        <span>{{ props.nickName }}</span>
        <span class="text-xs font-light opacity-50">{{ props.date }}</span>
      </p>
      <p class="text-sm font-light">{{ props.comment }}</p>
      <ReplyInput
        v-if="isReplyInputFocus"
        v-model="isReplyInputFocus"
        :userId="props.userId"
        :projectId="props.projectId"
        :parentId="props.commentId"
        :addReply="props.addReply"
      />
      <div class="flex items-center -translate-x-4">
        <HideAndShowToggler
          v-if="props.children.length > 0"
          @click="replyShow = !replyShow"
          :label="props.children.length + ' ' + 'replies'"
        />
        <button
          @click="isReplyInputFocus = true"
          class="px-4 py-2 text-sm font-medium text-white rounded-full hover:bg-zinc-800 w-fit"
        >
          Reply
        </button>
      </div>
      <ChildComment
        v-if="replyShow"
        v-for="child in props.children"
        :key="child.id"
        :avatarURL="child.avatarURL"
        :comment="child.text"
        :nickName="child.nickName"
        :date="formatDate(child.createAt)"
        class="pb-2"
      />
    </div>
  </div>
</template>
