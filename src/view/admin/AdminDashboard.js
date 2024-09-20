import React from "react";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
import AdminMain from "../../components/molecule/admin/AdminMain";
import Footer from "../../components/molecule/Footer";

function AdminDashboard() {
  return (
    <div className="content">
      <AdminHeader />
      <AdminMain />
      <Footer />
    </div>
  );
}

export default AdminDashboard;
