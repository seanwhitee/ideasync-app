<script setup>
import GradientFog from "~/components/GradientFog.vue";
import RegistrationForm from "~/components/RegistrationForm.vue";
import useCustomFetch from "~/composable/useCustomFetch";

const { fetch } = useCustomFetch("/api/v1/users/saveUserData");
const router = useRouter();
const submitMessage = ref("");
const userInfo = reactive({
  username: "",
  password: "",
  nickName: "",
  profileDescription: "",
  allowProjectApply: false,
  allowProjectCreate: false,
  roleVerified: false,
  email: "",
  avatarURL: "",
  firstName: "",
  lastName: "",
  roleName: "",
});
const updateUserInfo = async (newUserInfo) => {
  Object.assign(userInfo, newUserInfo);
  const response = await fetch(
    {
      "Content-Type": "application/json",
    },
    null,
    JSON.stringify({
      userName: userInfo.username,
      password: userInfo.password,
      nickName: userInfo.nickName,
      profileDescription: userInfo.profileDescription,
      avatarUrl: userInfo.avatarURL,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      roleVerified: userInfo.roleVerified,
      roleName: userInfo.roleName,
      allowProjectCreate: userInfo.allowProjectCreate,
      allowProjectApply: userInfo.allowProjectApply,
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
};
</script>
<template>
  <GradientFog />
  <div class="py-20 text-black md:py-32 lg:py-32 dark:text-white">
    <div
      class="flex flex-col items-start w-10/12 max-w-lg px-0 py-5 mx-auto bg-white md:px-10 md:w-1/2 lg:w-1/2 dark:bg-zinc-950 rounded-2xl md:py-20 lg:py-10"
    >
      <img
        src="/public/favicon.png"
        alt="favicon"
        class="w-20 mb-6 translate-x-4 shadow-xl rounded-3xl"
      />
      <h1
        class="flex justify-start w-full px-4 mb-8 text-lg font-semibold md:text-2xl lg:text-2xl"
      >
        <span>創建你的</span>
        <NuxtLink to="/" external
          >Idea<span class="text-violet-500">Sync</span>
        </NuxtLink>
        <span>帳號</span>
      </h1>

      <div class="w-full p-4">
        <RegistrationForm :updateUserInfo="updateUserInfo" />
        <div class="flex items-center justify-center w-full">
          <p
            v-if="submitMessage === '註冊失敗'"
            class="text-xs text-red-500 font-extralight"
          >
            {{ submitMessage }}
          </p>
          <p v-else class="text-xs text-green-500 font-extralight">
            {{ submitMessage }}
          </p>
        </div>
        <div
          class="flex justify-start w-full mt-4 text-xs pe-2 text-whit font-extralight"
        >
          有帳號嗎？<NuxtLink to="/signin" class="underline">登入</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
