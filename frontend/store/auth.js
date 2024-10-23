import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const isLogin = ref(false);
    const userInfo = ref({});
    const initialToken = {
      accessToken: undefined,
    };
    const token = reactive({ ...initialToken });

    const roleName = computed(() => mapRoleName(userInfo.value.roleName));
    const reset = () => {
      isLogin.value = false;
      userInfo.value = {};
      Object.assign(token, initialToken);
      sessionStorage.clear();
    };
    return { isLogin, userInfo, roleName, token, reset };
  },

  {
    persist: {
      storage: sessionStorage,
      paths: ["isLogin", "userInfo", "token"],
    },
  }
);
