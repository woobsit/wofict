import React from "react";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
import AdminMain from "../../components/molecule/admin/AdminMain";
import Footer from "../../components/molecule/Footer";
//Molecule
import AdminSidebar from "./../../components/molecule/admin/adminsidebar/AdminSidebar";
//Routes
import adminRoutes from "./../../adminRoutes";

function AdminDashboard() {
  return (
    <>
      <div className="content">
        <AdminHeader />
        <AdminMain />
        <Footer />
      </div>
      <AdminSidebar routes={adminRoutes} />
    </>
  );
}

export default AdminDashboard;
