import React from "react";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
//import AdminSidebar from "../../components/molecule/admin/AdminSidebar";
import AdminMain from "../../components/molecule/admin/AdminMain";
import Footer from "../../components/molecule/Footer";

function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <div className="content">
        {/* <AdminSidebar /> */}
        <div className="content__content-bar">
          <AdminHeader />
          <AdminMain />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
