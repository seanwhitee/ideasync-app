<template>
  <UTable
    :columns="tableColumns"
    :rows="tableData"
    :loading="usersLoading"
    class="border border-zinc-500/50"
  >
    <template #loading-state>
      <div class="flex items-center justify-center h-32">
        <i class="loader --6" />
      </div>
    </template>
    <template #roleName-data="{ row }">
      <UDropdown
        :items="[
          [
            {
              label: '提案/創作者',
              click: async () => await update({ ...row, roleName: 'creator' }),
            },
            {
              label: '指導者',
              click: async () => await update({ ...row, roleName: 'mentor' }),
            },
            {
              label: '系統管理員',
              click: async () => await update({ ...row, roleName: 'admin' }),
            },
          ],
        ]"
      >
        <AppTag :tag-name="mapRoleName(row.roleName)" color="violet" />
      </UDropdown>
    </template>
    <template #fullName-data="{ row }">
      <p :class="row.roleVerified ? 'text-green-800' : 'text-red-800'">
        {{ row.fullName }}
      </p>
    </template>
    <template #allowProjectCreate-data="{ row }">
      <UDropdown
        :items="[
          [
            {
              label: 'true',
              click: async () =>
                await update({ ...row, allowProjectCreate: true }),
            },
            {
              label: 'false',
              click: async () =>
                await update({ ...row, allowProjectCreate: false }),
            },
          ],
        ]"
      >
        <UButton
          :color="row.allowProjectCreate ? 'green' : 'red'"
          :label="row.allowProjectCreate ? 'true' : 'false'"
        />
      </UDropdown>
    </template>
    <template #allowProjectApply-data="{ row }">
      <UDropdown
        :items="[
          [
            {
              label: 'true',
              click: async () =>
                await update({ ...row, allowProjectApply: true }),
            },
            {
              label: 'false',
              click: async () =>
                await update({ ...row, allowProjectApply: false }),
            },
          ],
        ]"
      >
        <UButton
          :color="row.allowProjectApply ? 'green' : 'red'"
          :label="row.allowProjectApply ? 'true' : 'false'"
        />
      </UDropdown>
    </template>
    <template #roleVerified-data="{ row }">
      <UDropdown
        :items="[
          [
            {
              label: 'true',
              click: async () => await update({ ...row, roleVerified: true }),
            },
            {
              label: 'false',
              click: async () => await update({ ...row, roleVerified: false }),
            },
          ],
        ]"
      >
        <div class="pe-3">
          <UButton
            :color="row.roleVerified ? 'green' : 'red'"
            :label="row.roleVerified ? 'true' : 'false'"
          />
        </div>
      </UDropdown>
    </template>
  </UTable>
</template>
<script setup>
import useCustomFetch from "~/composable/useCustomFetch";
import { useAuthStore } from "~/store/auth";
const authStore = useAuthStore();
const { fetch: getUsers, isLoading: usersLoading } = useCustomFetch(
  "/api/v1/users/getAllUsers"
);
const userList = ref([]);
const { fetch: updateRole } = useCustomFetch("/api/v1/users/updateUser");
const toast = useToast();
onMounted(async () => {
  userList.value = await getUsers(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    null,
    null,
    "GET"
  );
  userList.value = userList.value.filter((u) => u.id !== authStore.userInfo.id);
});
const tableColumns = [
  {
    key: "roleName",
    label: "身份",
  },
  {
    key: "roleVerified",
    label: "身份認證",
  },
  {
    key: "fullName",
    label: "全名",
  },
  {
    key: "nickName",
    label: "暱稱",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "allowProjectCreate",
    label: "可創建",
  },
  {
    key: "allowProjectApply",
    label: "可申請",
  },
  {
    key: "profileDescription",
    label: "專長",
  },
];
const update = async (data) => {
  await updateRole(
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token.accessToken}`,
    },
    null,
    data,
    "PATCH"
  ).then((d) => {
    userList.value = userList.value.map((u) => {
      return u.id === d.id
        ? {
            ...u,
            roleVerified: d.roleVerified,
            allowProjectApply: d.allowProjectApply,
            allowProjectCreate: d.allowProjectCreate,
            roleName: d.roleName,
          }
        : u;
    });
    toast.add({
      title: "成功",
      description: "使用者狀態已更新",
    });
  });
};
const tableData = computed(() => {
  const t = userList.value.map((u) => ({
    fullName: u.firstName + " " + u.lastName,
    ...u,
  }));
  return t;
});
</script>
