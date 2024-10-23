import axios from "axios";
import "dotenv/config";

const main = async () => {
  try {
    const res = await axios.get(
      `${process.env.BASE_URL}/api/v1/authorization/generateToken`,
      {
        ContentType: "application/json",
      }
    );
    const token = res.data;
    console.log("token generated: ", res.data);

    const initResponse = await axios.post(
      `${process.env.BASE_URL}/api/v1/system/systemInit`,
      {
        userName: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        nickName: "admin paipai",
        profileDescription: "- React.js",
        allowProjectApply: true,
        allowProjectCreate: true,
        roleVerified: true,
        avatarUrl:
          "https://ideasync-bucket-1.s3.amazonaws.com/cartoon-profile.jpeg",
        email: process.env.ADMIN_EMAIL,
        firstName: "Hsiangche",
        lastName: "Pai",
        roleName: "admin",
      },
      {
        headers: {
          ContentType: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("initResponse: ", initResponse.data);
  } catch (error) {
    console.log("error: ", error);
  }
};

main();
