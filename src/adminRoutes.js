//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUniversity,
  faCog,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
//views
import AdminAllRegisteredUsersList from "./view/admin/AdminAllRegisteredUsersList";
import AdminDashboard from "./view/admin/AdminDashboard";
import AdminAdmins from "./view/admin/AdminAdmins";
import AdminSettings from "./view/admin/AdminSettings";
import AdminCredentialsList from "./view/admin/AdminCredentialsList";
import AdminGuarantorsList from "./view/admin/AdminGuarantorsList";
import AdminToAdmitUsers from "./view/admin/AdminToAdmitUsers";

const adminRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "admin/dashboard",
    icon: <FontAwesomeIcon icon={faDashboard} />,
    route: "/admin/dashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Admission",
    key: "admission",
    icon: <FontAwesomeIcon icon={faUniversity} />,
    route: "/admission",
    children: [
      {
        type: "collapse",
        name: "Registered Users",
        key: "all-users",
        route: "/all-users",
        component: <AdminAllRegisteredUsersList />,
      },
      {
        type: "collapse",
        name: "Users with Credentials",
        key: "admin/admission/credentials",
        route: "/admin/admission/credentials",
        component: <AdminCredentialsList />,
      },
      {
        type: "collapse",
        name: "Users with Guarantors",
        key: "admin/admission/guarantors",
        route: "/admin/admission/guarantors",
        component: <AdminGuarantorsList />,
      },
      {
        type: "collapse",
        name: "Admit Users",
        key: "admin/admission/to-admit-users",
        route: "/admin/admission/to-admit-users",
        component: <AdminToAdmitUsers />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Admins",
    key: "admin/admins",
    icon: <FontAwesomeIcon icon={faUserGear} />,
    route: "/admin/admins",
    component: <AdminAdmins />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "admin/settings",
    icon: <FontAwesomeIcon icon={faCog} />,
    route: "/admin/settings",
    component: <AdminSettings />,
  },
];
export default adminRoutes;
