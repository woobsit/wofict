//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faCog,
  faUser,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";
//views
import Profile from "./view/Profile";
import Dashboard from "./view/Dashboard";
import Settings from "./view/Settings";
import Admission from "./view/Admission";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <FontAwesomeIcon icon={faDashboard} />,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Admission",
    key: "admission",
    icon: <FontAwesomeIcon icon={faUniversity} />,
    route: "/admission",
    component: <Admission />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <FontAwesomeIcon icon={faUser} />,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    icon: <FontAwesomeIcon icon={faCog} />,
    route: "/settings",
    component: <Settings />,
  },
];
export default routes;
