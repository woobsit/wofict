import Admission from "./view/Admission";
import Dashboard from "./view/admin/Dashboard";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Admission",
    key: "admission",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin/admission",
    component: <Admission />,
  },
];
export default routes;
