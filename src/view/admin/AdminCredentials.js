import React from "react";
//React bootstrap
import Table from "react-bootstrap/Table";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
import Footer from "../../components/molecule/Footer";

function AdminCredentials() {
  return (
    <div className="content">
      <AdminHeader />
      <Table striped="columns">
        <thead>
          <tr>
            <th>#</th>
            <th>Firstname</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Credentials</th>
            <th>Credentials status</th>
            <th>Approve</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
      <Footer />
    </div>
  );
}

export default AdminCredentials;
