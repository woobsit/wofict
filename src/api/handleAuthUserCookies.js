//js-cookies
import Cookies from "js-cookie";

function getAuthUserData() {
  const authUserDataCookie = Cookies.get("auth_user_data");

  if (authUserDataCookie) {
    const authData = JSON.parse(authUserDataCookie);

    return {
      token: authData.token,
      user: authData.user,
      website_info: authData.website_info,
    };
  }
}

export default getAuthUserData;
