<script setup>
const props = defineProps({
  updateRole: Function,
});
const role = ref("creator");
const handleRoleButtonClick = (role) => {
  props.updateRole(role);
  if (role === "creator") {
    return "學生";
  } else if (role === "mentor") {
    return "指導者";
  }
};
</script>
<template>
  <!--select type input to determine if user status is creator or mentor-->
  <div class="flex mb-5 content-evenly">
    <p class="content-center text-sm font-extrali.ght">身份：</p>
    <div class="dropdown dropdown-hover dropdown-bottom">
      <div tabindex="0" class="m-1 btn glass hover:bg-inherit">
        {{handleRoleButtonClick(role)}}
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 glass"
      >
        <li @click="role = 'creator'" class="hover:bg-zinc-800/50 rounded-box"><a>學生</a></li>
        <li @click="role = 'mentor'" class="hover:bg-zinc-800/50 rounded-box"><a>指導者</a></li>
      </ul>
    </div>
  </div>
</template>
