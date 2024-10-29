<template>
  <div>
    <UModal v-model="isOpen">
      <div class="p-10">
        <h3 class="mb-10 text-xl">確認刪除</h3>
        <div class="flex w-full">
          <UButton @click="$emit('deleteProject')" label="確認刪除" />
        </div>
      </div>
    </UModal>
  </div>
</template>
<script setup>
const isOpen = defineModel({ default: false });
const emit = defineEmits(["deleteProject"]);
</script>
