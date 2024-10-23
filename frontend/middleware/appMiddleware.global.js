import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLogin, userInfo } = useAuthStore();

  if (
    to.path.startsWith("/app-platform") &&
    (!isLogin || !userInfo.roleVerified)
  ) {
    return abortNavigation();
  }
  if (
    to.path.startsWith("/app-platform/admin") &&
    userInfo.roleName !== "admin"
  ) {
    return abortNavigation();
  }
});
