export const mapProjectStatus = (status) => {
  switch (status) {
    case "member_recruiting":
      return "成員招募";
    case "mentor_recruiting":
      return "指導者招募";

    default:
      return "完成招募";
  }
};
