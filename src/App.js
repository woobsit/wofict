import React from "react";
//React Router package
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { setupInterceptors } from "./api/interceptors";
//views
import Home from "./view/Home";
import LandingPage from "./view/LandingPage";
import Register from "./view/Register";
import ForgetPassword from "./view/ForgetPassword";
// import Admission from "./view/Admission";
import EnterNewPassword from "./view/EnterNewPassword";
import AdminLogin from "./view/admin/AdminLogin";
//import AdminDashboard from "./view/admin/AdminDashboard";
import AdminForgetPassword from "./view/admin/AdminForgetPassword";
import AdminEnterNewPassword from "./view/admin/AdminEnterNewPassword";
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
//js-cookies
import Cookies from "js-cookie";

function App() {
  setupInterceptors();

  const location = useLocation();

  //pages background
  const getBackgroundClass = (pathname) => {
    switch (pathname) {
      case "/":
        return "landing-page-background";
      default:
        return "home-background";
    }
  };

  const backgroundClass = getBackgroundClass(location.pathname);

  const getAdminRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getAdminRoutes(route.collapse);
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
        {Cookies.get("auth_admin_token") && (
          <AdminSidebar routes={adminRoutes} />
        )}
        {Cookies.get("auth_user_token") && <Sidebar routes={routes} />}

        <Routes>
          <Route element={<CanAccessAuthenticated />}>
            <Route path="/" element={<LandingPage />} key="landing-page" />
            <Route path="/register" element={<Register />} key="register" />
            <Route path="/home" element={<Home />} key="home" />
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
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
