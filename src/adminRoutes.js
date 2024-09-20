//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUniversity,
  faCog,
  faUserGear,
  faFileText,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
//views
import AdminAdmission from "./view/admin/AdminAdmission";
import AdminDashboard from "./view/admin/AdminDashboard";
import AdminAdmins from "./view/admin/AdminAdmins";
import AdminSettings from "./view/admin/AdminSettings";
import AdminCredentialsList from "./view/admin/AdminCredentialsList";
import AdminGuarantorsList from "./view/admin/AdminGuarantorsList";

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
    key: "admin/admission",
    icon: <FontAwesomeIcon icon={faUniversity} />,
    route: "/admin/admission",
    component: <AdminAdmission />,
  },
  {
    type: "collapse",
    name: "Credentials",
    key: "admin/admission/credentials",
    icon: <FontAwesomeIcon icon={faFileText} />,
    route: "/admin/admission/credentials",
    component: <AdminCredentialsList />,
  },
  {
    type: "collapse",
    name: "Guarantors",
    key: "admin/admission/guarantors",
    icon: <FontAwesomeIcon icon={faUsers} />,
    route: "/admin/admission/guarantors",
    component: <AdminGuarantorsList />,
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
