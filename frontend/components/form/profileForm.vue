<template>
  <UForm
    :schema="schema"
    :state="formData"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="暱稱" name="nickName">
      <UInput v-model="formData.nickName" />
    </UFormGroup>

    <UFormGroup label="專長描述" name="profileDescription">
      <UTextarea v-model="formData.profileDescription" />
    </UFormGroup>

    <UButton
      :disabled="isLoading"
      color="black"
      class="w-full px-3 py-2.5 flex justify-center"
      type="submit"
    >
      <p v-if="!isLoading">{{ actionText }}</p>
      <AppLoader v-else color="text-black" />
    </UButton>
  </UForm>
</template>
<script setup>
import { z } from "zod";

const schema = z.object({
  nickName: z.string().trim().min(1, "暱稱必須大於1個字符"),
  profileDescription: z.string().min(11, "專長描述必須大於10個字符"),
});
const props = defineProps({
  defaultValues: Object,
  actionText: String,
  isLoading: Boolean,
});
const emit = defineEmits(["save"]);
const formData = reactive({
  nickName: undefined,
  profileDescription: undefined,
});
onMounted(() => {
  Object.assign(formData, props.defaultValues);
});
async function onSubmit(event) {
  emit("save", event.data);
}
</script>
