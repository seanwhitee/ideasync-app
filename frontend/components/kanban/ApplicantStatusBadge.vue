<script setup>
const props = defineProps({
  applicantStatus: Number,
});

const mapApplicantStatus = (status) => {
  switch (status) {
    case 0:
      return "待審核";
    case 1:
      return "已接受";
    case -1:
      return "已拒絕";
    default:
      return "未知";
  }
};

const status = computed(() => mapApplicantStatus(props.applicantStatus));
const getColor = computed(() => {
  switch (props.applicantStatus) {
    case 0:
      return "violet";
    case 1:
      return "green";
    case -1:
      return "fuchsia";
    default:
      return "gray";
  }
});
</script>
<template>
  <AppTag :color="getColor" :tag-name="status" />
</template>
