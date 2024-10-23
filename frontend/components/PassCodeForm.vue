<script setup>
import { ref } from "vue";
import { set, z } from "zod";
import useCustomFetch from "~/composable/useCustomFetch";
const props = defineProps({
  userInfo: Object,
  passCode: Object,
  generatePassCode: Function,
  userRole: String,
});
const router = useRouter();
const { fetch } = useCustomFetch("/api/v1/users/saveUserData");
const submitMessage = ref("");
const schema = z.object({
  passCode: z.number().min(100000).max(999999),
});
const state = reactive({
  passCode: undefined,
});
const matcher = (userEnterPassCode, passCode) => {
  return userEnterPassCode === passCode;
};
const onSubmit = async (event) => {
  let successFlag = false;
  if (props.passCode.expiryTime < new Date().getTime()) {
    successFlag = false;
    submitMessage.value = "驗證碼已過期";
  }
  if (matcher(state.passCode, props.passCode.code)) {
    successFlag = true;
  } else {
    successFlag = false;
    submitMessage.value = "驗證碼錯誤";
  }

  if (successFlag) {
    const response = await fetch(
      {
        "Content-Type": "application/json",
      },
      null,
      JSON.stringify({
        userName: props.userInfo.username,
        password: props.userInfo.password,
        nickName: props.userInfo.nickName,
        profileDescription: props.userInfo.profileDescription,
        avatarUrl: props.userInfo.avatarURL,
        firstName: props.userInfo.firstName,
        lastName: props.userInfo.lastName,
        email: props.userInfo.email,
        roleVerified: props.userInfo.roleVerified,
        roleName: props.userRole,
        allowProjectCreate: props.userInfo.allowProjectCreate,
        allowProjectApply: props.userInfo.allowProjectApply,
      }),
      "POST"
    );
    switch (response) {
      case "User data saving failed":
        submitMessage.value = "註冊失敗";
        setTimeout(() => {
          submitMessage.value = "";
        }, 3000);
        break;
      default:
        submitMessage.value = "註冊成功";
        setTimeout(() => {
          router.push("/signin");
          submitMessage.value = "";
        }, 3000);
        break;
    }
  } else if (!successFlag) {
    setTimeout(() => {
      submitMessage.value = "";
    }, 3000);
  }
};
</script>
<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="驗證碼" name="passCode" class="w-full">
      <UInput v-model="state.passCode" class="rounded-md" type="number" />
    </UFormGroup>
    <div class="flex flex-col w-full font-thin text-white gap-y-3">
      <button
        @click="props.generatePassCode()"
        class="w-full px-4 py-2 mt-0 rounded-lg bg-violet-800 hover:bg-violet-800/90"
      >
        重新發送驗證碼
      </button>
      <button
        type="submit"
        class="w-full px-4 py-2 mt-0 rounded-lg bg-violet-800 hover:bg-violet-800/90"
      >
        <div class="flex items-center justify-center w-full">提交</div>
      </button>
    </div>
    <div class="flex items-center justify-center w-full">
      <p
        v-if="
          submitMessage === '驗證碼已過期' ||
          submitMessage === '驗證碼錯誤' ||
          submitMessage === '註冊失敗'
        "
        class="text-xs text-red-500 font-extralight"
      >
        {{ submitMessage }}
      </p>
      <p
        v-if="submitMessage === '註冊成功'"
        class="text-xs text-green-500 font-extralight"
      >
        {{ submitMessage }}
      </p>
    </div>
  </UForm>
</template>
