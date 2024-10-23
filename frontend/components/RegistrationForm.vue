<script setup>
import { z } from "zod";
import { ref } from "vue";
import useCustomFetch from "~/composable/useCustomFetch";

const { fetch } = useCustomFetch("/api/v1/users/checkUserData");

const submitMessage = ref("");
// props annotation
const props = defineProps({
  updateUserInfo: Function,
});

const userRole = ref("creator");

const updateRole = (role) => {
  userRole.value = role;
};
const schema = z.object({
  email: z.string().email("請輸入有效的電子郵件地址"),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "使用者名稱只能包含字母和數字")
    .min(7, "使用者名稱必須大於6個字符"),
  password: z
    .string()
    .regex(/[a-z]/, "密碼必須包含至少一個小寫字母")
    .regex(/[A-Z]/, "密碼必須包含至少一個大寫字母")
    .regex(/[0-9]/, "密碼必須包含至少一位數字")
    .min(9, "密碼長度必須至少為 9 個字符")
    .refine((value) => /^[a-zA-Z0-9]+$/.test(value), {
      message: "密碼只能包含字母和數字",
    }),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string(),
  profileDescription: z.string().min(11, "專長描述必須大於10個字符"),
});

const state = reactive({
  email: undefined,
  username: undefined,
  password: undefined,
  firstName: undefined,
  lastName: undefined,
  nickName: undefined,
  profileDescription: undefined,
});

const getAvatar = computed(() => {
  const randNum = Math.round(Math.random() * 10);
  if (randNum % 2 == 0) {
    return "avatar1.png";
  } else {
    return "avatar2.png";
  }
});

async function onSubmit(event) {
  const result = {
    userName: state.username,
    password: state.password,
    nickName: state.nickName,
    profileDescription: state.profileDescription,
    avatarUrl: getAvatar.value,
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    userRole: { roleName: "" },
  };
  if (userRole.value === "creator") {
    // Prepare data for creator
    result.roleVerified = true;
    result.userRole = {
      roleName: userRole.value,
    };
    result.allowProjectCreate = true;
    result.allowProjectApply = true;
  } else if (userRole.value === "mentor") {
    // Prepare data for mentor
    result.roleVerified = false;
    result.userRole = {
      roleName: userRole.value,
    };
    result.allowProjectCreate = true;
    result.allowProjectApply = true;
  }
  await fetch(
    { "Content-Type": "application/json" },
    null,
    JSON.stringify(result),
    "POST"
  ).then(async (response) => {
    switch (response) {
      case "user already exist":
        submitMessage.value = "使用者已經存在";
        break;
      case "user registration failed, data is not valid":
        submitMessage.value = "使用者註冊失敗，資料無效";
        break;
      case "email already registered":
        submitMessage.value = "電子郵件已經註冊";
        break;
      case "user data is valid":
        await props.updateUserInfo({
          username: result.userName,
          password: result.password,
          nickName: result.nickName,
          profileDescription: result.profileDescription,
          allowProjectApply: result.allowProjectApply,
          allowProjectCreate: result.allowProjectCreate,
          roleVerified: result.roleVerified,
          email: result.email,
          avatarURL: result.avatarUrl,
          firstName: result.firstName,
          lastName: result.lastName,
          roleName: result.userRole.roleName,
        });
        break;
      default:
        break;
    }

    // reset submit message for 3 seconds
    setTimeout(() => {
      submitMessage.value = "";
    }, 3000);
  });
}
</script>
<template>
  <RoleSelector :updateRole="updateRole" />
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email" class="w-full">
      <UInput v-model="state.email" class="rounded-md" autocomplete="off" />
    </UFormGroup>
    <UFormGroup label="帳號" name="username" class="w-full">
      <UInput
        v-model="state.username"
        class="rounded-md"
        autocomplete="username"
      />
    </UFormGroup>
    <UFormGroup label="密碼" name="password" class="w-full">
      <UInput
        v-model="state.password"
        type="password"
        class="rounded-md"
        autocomplete="current-password"
      />
    </UFormGroup>
    <div class="flex justify-between w-full gap-1">
      <UFormGroup label="名" name="firstName" class="w-2/3">
        <UInput v-model="state.firstName" class="rounded-md" />
      </UFormGroup>
      <UFormGroup label="姓" name="lastName" class="w-1/3">
        <UInput v-model="state.lastName" class="rounded-md" />
      </UFormGroup>
    </div>
    <UFormGroup label="顯示名稱" name="nickName" class="w-full">
      <UInput class="rounded-md" v-model="state.nickName" />
    </UFormGroup>
    <UFormGroup label="專長描述" name="profileDescription" class="w-full">
      <UTextarea class="rounded-md" v-model="state.profileDescription" />
    </UFormGroup>
    <div class="w-full">
      <button
        type="submit"
        class="w-full px-4 py-2 mt-0 font-thin rounded-lg bg-violet-800 hover:bg-violet-800/90"
      >
        <div
          class="flex items-center justify-center w-full font-semibold text-white"
        >
          註冊/申請
        </div>
      </button>
    </div>

    <!--submit feeback-->
    <div
      v-if="submitMessage"
      class="flex items-center justify-center w-full py-3"
    >
      <p
        v-if="submitMessage === '註冊成功'"
        class="text-xs text-green-500 font-extralight"
      >
        {{ submitMessage }}
      </p>
      <p
        v-if="submitMessage === '使用者已經存在'"
        class="text-xs text-red-500 font-extralight"
      >
        {{ submitMessage }}
      </p>
      <p
        v-if="submitMessage === '電子郵件已經註冊'"
        class="text-xs text-red-500 font-extralight"
      >
        {{ submitMessage }}
      </p>
      <p
        v-if="submitMessage === '使用者註冊失敗，資料無效'"
        class="text-xs text-red-500 font-extralight"
      >
        {{ submitMessage }}
      </p>
    </div>
  </UForm>
</template>
