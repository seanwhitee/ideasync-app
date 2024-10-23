import { defineStore } from "pinia";
import { ref } from "vue";
import useCustomFetch from "~/composable/useCustomFetch";
import { useAuthStore } from "./auth";

// store for create project
export const useProjectStore = defineStore("project", () => {
  const hostId = ref("");
  const title = ref("");
  const description = ref("");
  const status = ref("");
  const isGraduationProject = ref(false);
  const school = ref("");
  const allowApplicantsNum = ref(1);
  const projectImages = ref([]);
  const tags = ref([]);
  const createAt = ref(new Date());
  const requireSkills = ref("");
  const applicants = ref([]);

  const isPublic = ref(true);

  const relatedProjects = ref([]);
  const authStore = useAuthStore();
  const { fetch: getProjectsByUser } = useCustomFetch(
    "/api/v1/project/getProjectsByUser"
  );
  const { fetch: getProjectApplied } = useCustomFetch(
    "/api/v1/applicant/getProjectAppliedByUser"
  );

  const { fetch: getRelated } = useCustomFetch(
    "/api/v1/project/getRelatedProjects"
  );

  const { fetch: getProjectDetail } = useCustomFetch(
    "/api/v1/project/getProjectById"
  );

  const { fetch: reject } = useCustomFetch("/api/v1/applicant/rejectApplicant");

  const { fetch: accept } = useCustomFetch("/api/v1/applicant/acceptApplicant");

  const { fetch: changeProjStatus } = useCustomFetch(
    "/api/v1/project/changeProjectStatus"
  );

  const reset = () => {
    hostId.value = "";
    title.value = "";
    description.value = "";
    status.value = "";
    isGraduationProject.value = false;
    school.value = "";
    requireSkills.value = "";
    allowApplicantsNum.value = 1;
    projectImages.value = [];
    tags.value = [];
    createAt.value = new Date();
    applicants.value = [];
    isPublic.value = true;
  };

  const getProjectByUserId = async (userId, includePrivate) => {
    const res = await getProjectsByUser(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        userId: userId,
        includePrivate: includePrivate,
      },
      null,
      "GET"
    );
    return res;
  };
  const getProjectAppliedByUser = async (userId) => {
    const res = await getProjectApplied(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        userId: userId,
      },
      null,
      "GET"
    );
    return res;
  };

  const getRelatedProjects = async (projectId) => {
    await getRelated(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        projectId: projectId,
      },
      null,
      "GET"
    ).then((res) => {
      relatedProjects.value = res;
    });
  };

  const getProjectById = async (userId, projectId, includePrivate) => {
    const res = await getProjectDetail(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        userId,
        projectId,
        includePrivate,
      },
      null,
      "GET"
    );
    return res;
  };

  const rejectApplicant = async (projectId, userId) => {
    const res = await reject(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        projectId: projectId,
        userId: userId,
      },
      null,
      "POST"
    );
    return res;
  };

  const acceptApplicant = async (projectId, userId) => {
    const res = await accept(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        projectId: projectId,
        userId: userId,
      },
      null,
      "POST"
    );
    return res;
  };

  const changeProjectStatus = async (projectId, status, nextOrPrevious) => {
    const res = await changeProjStatus(
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token.accessToken}`,
      },
      {
        projectId: projectId,
        status: status,
        nextOrPrevious: nextOrPrevious,
      },
      null,
      "POST"
    );
    return res;
  };

  /**
   * @param {string} tag
   */
  const addTag = (tag) => {
    // check if the tag already exists
    if (tags.value.includes(tag)) return;
    tags.value.push(tag);
  };

  const deleteTag = (tag) => {
    // search for tag name
    const index = tags.value.indexOf(tag);
    // if it exists, delete it
    if (index > -1) {
      tags.value.splice(index, 1);
    }
  };
  return {
    addTag,
    deleteTag,
    reset,
    changeProjectStatus,
    getRelatedProjects,
    getProjectByUserId,
    getProjectAppliedByUser,
    getProjectById,
    rejectApplicant,
    acceptApplicant,
    requireSkills,
    hostId,
    title,
    description,
    status,
    isGraduationProject,
    school,
    allowApplicantsNum,
    projectImages,
    tags,
    createAt,
    applicants,
    relatedProjects,
    isPublic,
  };
});
