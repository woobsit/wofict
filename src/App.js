import React from "react";
//React Router package
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { setupInterceptors } from "./api/interceptors";
//views
import Home from "./view/Home";
import LandingPage from "./view/LandingPage";
import Register from "./view/Register";
import VerifyEmail from "./view/VerifyEmail";
import ForgetPassword from "./view/ForgetPassword";
// import Admission from "./view/Admission";
import EnterNewPassword from "./view/EnterNewPassword";
import AdminLogin from "./view/admin/AdminLogin";
//import AdminDashboard from "./view/admin/AdminDashboard";
import AdminForgetPassword from "./view/admin/AdminForgetPassword";
import AdminEnterNewPassword from "./view/admin/AdminEnterNewPassword";
import AdminCredentialsSearch from "./view/admin/AdminCredentialsSearch";
import AdminCredentialsAllInfo from "./view/admin/AdminCredentialsAllInfo";
import AdminGuarantorsAllInfo from "./view/admin/AdminGuarantorsAllInfo";
import AdminAllRegisteredUserAllInfo from "./view/admin/AdminAllRegisteredUserAllInfo";
//React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//scss style
import "./App.scss";
//Routes
import adminRoutes from "./adminRoutes";
import routes from "./routes";
//Authenticated routes
import IsStudentOrAdminRoute from "./middlewares/IsStudentOrAdminRoute";
import CanAccessAuthenticated from "./middlewares/CanAccessAuthenticated";
//Molecule
import AdminSidebar from "./components/molecule/admin/adminsidebar/AdminSidebar";
import Sidebar from "./components/molecule/Sidebar";
//api
import getAuthAdminData from "./api/handleAuthAdminCookies";
import getAuthUserData from "./api/handleAuthUserCookies";

function App() {
  setupInterceptors();

  const location = useLocation();

  //pages background
  const getBackgroundClass = (pathname) => {
    const background = "landing-page-background";
    switch (pathname) {
      case "/":
        return background;
      case "/forget-password":
        return background;
      case "/register":
        return background;
      default:
        return "home-background";
    }
  };
  const backgroundClass = getBackgroundClass(location.pathname);

  //Fetch admin routes and student users
  const getAdminRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.children) {
        return route.children.map((child) => (
          <Route
            exact
            path={child.route}
            element={child.component}
            key={child.key}
          />
        ));
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });
  const getStudentRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getStudentRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  return (
    <div className={`${backgroundClass}`}>
      <div className="main-container">
        {getAuthAdminData() && <AdminSidebar routes={adminRoutes} />}
        {getAuthUserData() &&
        getAuthUserData().user.admission_status == "Admitted" ? (
          <Sidebar routes={routes} />
        ) : (
          ""
        )}
        <Routes>
          <Route element={<CanAccessAuthenticated />}>
            <Route path="/" element={<LandingPage />} key="landing-page" />
            <Route path="/register" element={<Register />} key="register" />
            <Route path="/home" element={<Home />} key="home" />
            <Route
              path="/verify-email/:verify"
              element={<VerifyEmail />}
              key="verify-email"
            />
            <Route
              path="/forget-password"
              element={<ForgetPassword />}
              key="forget-password"
            />
            <Route
              path="/enter-new-password/:id"
              element={<EnterNewPassword />}
              key="enter-new-password"
            />
            <Route
              path="/admin/login"
              element={<AdminLogin />}
              key="admin-login"
            />
            <Route
              path="/admin/forget-password"
              element={<AdminForgetPassword />}
              key="admin/forget-password"
            />
            <Route
              path="/admin/enter-new-password/:id"
              element={<AdminEnterNewPassword />}
              key="admin/enter-new-password"
            />
            {/* Redirect /admin to /admin/dashboard */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Route>
          {/* User protected route */}
          <Route element={<IsStudentOrAdminRoute userType="student" />}>
            {getStudentRoutes(routes)}
          </Route>
          {/* Admin protected route */}
          <Route element={<IsStudentOrAdminRoute userType="admin" />}>
            {getAdminRoutes(adminRoutes)}
            {/* route for users with credentials by id  */}
            <Route
              path="/admin/user-info-by-credentials/:id"
              element={<AdminCredentialsAllInfo />}
              key="admin-user-info-by-credentials"
            />
            {/* search user with credentials by id */}
            <Route
              path="/admin/search-by-credentials/:id"
              element={<AdminCredentialsSearch />}
              key="admin-search-credentials"
            />
            {/* route for user with guarantors by id  */}
            <Route
              path="/admin/user-info-by-guarantors/:id"
              element={<AdminGuarantorsAllInfo />}
              key="admin-user-info-by-guarantors"
            />
            {/* route for a registered user */}
            <Route
              path="/admin/registered-user-info/:id"
              element={<AdminAllRegisteredUserAllInfo />}
              key="admin-registered-user-info"
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
