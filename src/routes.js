//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUniversity,
  faCog,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
//views
import Admission from "./view/Admission";
import Dashboard from "./view/admin/Dashboard";
import Admins from "./view/admin/Admins";
import Settings from "./view/admin/Settings";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <FontAwesomeIcon icon={faDashboard} />,
    route: "/admin/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Admission",
    key: "admission",
    icon: <FontAwesomeIcon icon={faUniversity} />,
    route: "/admin/admission",
    component: <Admission />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    icon: <FontAwesomeIcon icon={faCog} />,
    route: "/admin/settings",
    component: <Settings />,
  },
  {
    type: "collapse",
    name: "Admins",
    key: "admins",
    icon: <FontAwesomeIcon icon={faUserGear} />,
    route: "/admin/admins",
    component: <Admins />,
  },
];
export default routes;
