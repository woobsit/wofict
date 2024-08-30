//js-cookies
import Cookies from "js-cookie";

function getAuthAdminData() {
  const authAdminDataCookie = Cookies.get("auth_admin_data");

  if (authAdminDataCookie) {
    const authData = JSON.parse(authAdminDataCookie);

    return {
      token: authData.token,
      user: authData.user,
      websiteInfo: authData.website_info,
    };
  }
}

export default getAuthAdminData;
