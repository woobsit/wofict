//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUniversity,
  faCog,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
//views
import AdminAdmission from "./view/admin/AdminAdmission";
import AdminDashboard from "./view/admin/AdminDashboard";
import AdminAdmins from "./view/admin/AdminAdmins";
import AdminSettings from "./view/admin/AdminSettings";

const adminRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <FontAwesomeIcon icon={faDashboard} />,
    route: "/admin/dashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Admission",
    key: "admission",
    icon: <FontAwesomeIcon icon={faUniversity} />,
    route: "/admin/admission",
    component: <AdminAdmission />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    icon: <FontAwesomeIcon icon={faCog} />,
    route: "/admin/settings",
    component: <AdminSettings />,
  },
  {
    type: "collapse",
    name: "Admins",
    key: "admins",
    icon: <FontAwesomeIcon icon={faUserGear} />,
    route: "/admin/admins",
    component: <AdminAdmins />,
  },
];
export default adminRoutes;
