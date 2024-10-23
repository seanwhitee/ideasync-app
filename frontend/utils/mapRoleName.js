export const mapRoleName = (role) => {
  switch (role) {
    case "admin":
      return "系統管理員";
    case "mentor":
      return "指導者";
    default:
      return "提案/申請者";
  }
};
